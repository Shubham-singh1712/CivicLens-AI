import { GoogleGenAI, Type } from "@google/genai";

export interface VisionAnalysisResult {
  issueType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidenceScore: number;
  safetyRisk: string;
  priority: "Low" | "Medium" | "High" | "Immediate";
  description: string;
}

// Global reference for client
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      console.log("Gemini API Client successfully initialized in service layer.");
    } else {
      console.warn("GEMINI_API_KEY is not defined or is placeholder. Using fallback engine.");
    }
  }
  return aiClient;
}

/**
 * Validates if the parsed object conforms to the expected VisionAnalysisResult structure.
 */
export function validateVisionResult(data: any): data is VisionAnalysisResult {
  if (!data || typeof data !== "object") return false;
  
  const validSeverities = ["Low", "Medium", "High", "Critical"];
  const validPriorities = ["Low", "Medium", "High", "Immediate"];

  if (typeof data.issueType !== "string" || data.issueType.trim() === "") return false;
  if (!validSeverities.includes(data.severity)) return false;
  if (typeof data.confidenceScore !== "number" || data.confidenceScore < 0 || data.confidenceScore > 100) return false;
  if (typeof data.safetyRisk !== "string" || data.safetyRisk.trim() === "") return false;
  if (!validPriorities.includes(data.priority)) return false;
  if (typeof data.description !== "string" || data.description.trim() === "") return false;

  return true;
}

/**
 * High-fidelity fallback generation if Gemini is offline, rate-limited, or fails validation.
 */
export function getLocalFallbackAnalysis(textDescription: string, title?: string): VisionAnalysisResult {
  const normalizedText = (textDescription + " " + (title || "")).toLowerCase();
  
  // Categorize
  let issueType = "Road Infrastructure";
  if (normalizedText.includes("water") || normalizedText.includes("sewer") || normalizedText.includes("leak") || normalizedText.includes("flood")) {
    issueType = "Water & Sewer";
  } else if (normalizedText.includes("power") || normalizedText.includes("wire") || normalizedText.includes("cable") || normalizedText.includes("outage") || normalizedText.includes("electricity")) {
    issueType = "Power & Grid";
  } else if (normalizedText.includes("garbage") || normalizedText.includes("dump") || normalizedText.includes("trash") || normalizedText.includes("waste")) {
    issueType = "Waste & Sanitation";
  } else if (normalizedText.includes("danger") || normalizedText.includes("hazard") || normalizedText.includes("fire") || normalizedText.includes("accident")) {
    issueType = "Public Safety";
  } else if (normalizedText.includes("park") || normalizedText.includes("tree") || normalizedText.includes("bench") || normalizedText.includes("playground")) {
    issueType = "Park Maintenance";
  }

  // Severity
  let severity: "Low" | "Medium" | "High" | "Critical" = "Medium";
  if (normalizedText.includes("critical") || normalizedText.includes("dangerous") || normalizedText.includes("spark") || normalizedText.includes("sinkhole") || normalizedText.includes("emergency")) {
    severity = "Critical";
  } else if (normalizedText.includes("severe") || normalizedText.includes("broken") || normalizedText.includes("damage") || normalizedText.includes("block")) {
    severity = "High";
  } else if (normalizedText.includes("minor") || normalizedText.includes("cosmetic") || normalizedText.includes("small")) {
    severity = "Low";
  }

  // Priority mapping
  let priority: "Low" | "Medium" | "High" | "Immediate" = "Medium";
  if (severity === "Critical") priority = "Immediate";
  else if (severity === "High") priority = "High";
  else if (severity === "Low") priority = "Low";

  // Safety risk forecast
  let safetyRisk = "Potential hazard for nearby foot traffic and vehicles if unmitigated.";
  if (severity === "Critical") {
    safetyRisk = "High probability of immediate injury or cascading utility failures. Restrict public access immediately.";
  } else if (severity === "High") {
    safetyRisk = "Obstruction or sharp materials present. May lead to vehicular tire blowouts or pedestrian slips.";
  }

  return {
    issueType,
    severity,
    confidenceScore: 85, // Standard fallback confidence
    safetyRisk,
    priority,
    description: `[Fallback Analysis] Classified as ${issueType}. Issue description indicates: "${textDescription}"`
  };
}

/**
 * Vision Agent orchestrator utilizing Gemini 2.5 Flash / 3.5 Flash vision.
 * Implements strict schema validation, retry loops (up to 3 times), and automated fallbacks.
 */
export async function analyzeVisionAgent(
  imageBufferBase64: string | undefined,
  description: string,
  title?: string,
  retries: number = 3
): Promise<VisionAnalysisResult> {
  const client = getGeminiClient();
  
  if (!client) {
    console.log("No valid Gemini client. Direct routing to high-fidelity fallback.");
    return getLocalFallbackAnalysis(description, title);
  }

  let attempt = 0;
  while (attempt < retries) {
    attempt++;
    try {
      console.log(`[Vision Agent] Analysis attempt ${attempt} of ${retries}...`);
      
      const contents: any[] = [];
      if (imageBufferBase64) {
        const base64Data = imageBufferBase64.replace(/^data:image\/\w+;base64,/, "");
        const mimeMatch = imageBufferBase64.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
        
        contents.push({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }

      contents.push({
        text: `You are the highly specialized CivicLens Vision Agent.
Your role is to inspect the uploaded image and user text description to produce a structured, high-fidelity safety and profiling report.

User Input Description: "${description}"
User Subject Line: "${title || "Not Provided"}"

You must return a structured JSON response containing the exact fields requested in the schema.`
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              issueType: { 
                type: Type.STRING, 
                description: "Must be exactly one of: Road Infrastructure, Water & Sewer, Power & Grid, Waste & Sanitation, Public Safety, Park Maintenance" 
              },
              severity: { 
                type: Type.STRING, 
                description: "Must be exactly one of: Low, Medium, High, Critical" 
              },
              confidenceScore: { 
                type: Type.INTEGER, 
                description: "An integer between 0 and 100 indicating confidence" 
              },
              safetyRisk: { 
                type: Type.STRING, 
                description: "Detailed description of direct safety hazards or immediate public threat." 
              },
              priority: { 
                type: Type.STRING, 
                description: "Recommended priority level: Low, Medium, High, Immediate" 
              },
              description: { 
                type: Type.STRING, 
                description: "A professional, structured, visual-heavy description summarizing the incident." 
              }
            },
            required: ["issueType", "severity", "confidenceScore", "safetyRisk", "priority", "description"]
          }
        }
      });

      if (!response.text) {
        throw new Error("Received empty text content from Gemini model.");
      }

      // Safe JSON parsing
      const jsonText = response.text.trim();
      const parsedData = JSON.parse(jsonText);

      // Perform validation check
      if (validateVisionResult(parsedData)) {
        console.log(`[Vision Agent] Attempt ${attempt} succeeded and passed schema validation!`);
        return parsedData;
      } else {
        throw new Error("Parsed JSON failed type and structure validation.");
      }

    } catch (error: any) {
      console.warn(`[Vision Agent] Attempt ${attempt} failed: ${error?.message || error}`);
      
      // Delay before next retry (exponential backoff)
      if (attempt < retries) {
        const backoffMs = Math.pow(2, attempt) * 500;
        console.log(`[Vision Agent] Retrying in ${backoffMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }

  // Out of retries - trigger automatic fallback
  console.warn(`[Vision Agent] All ${retries} attempts failed. Activating automatic local fallback engine.`);
  return getLocalFallbackAnalysis(description, title);
}

export interface ProjectSubmissionPayload {
  projectName: string;
  googleDocLink: string;
  problemStatement: string;
  solutionOverview: string;
  keyFeatures: string;
  technologiesUsed: string;
  googleTechUtilized: string[];
}

export interface ProjectAnalysisResult {
  score: number;
  clarity: string;
  completeness: string;
  googleTechIntegration: string;
  recommendations: string[];
  status: "Approved" | "Needs Improvement";
}

export async function analyzeProjectSubmission(
  submission: ProjectSubmissionPayload
): Promise<ProjectAnalysisResult> {
  const client = getGeminiClient();

  if (!client) {
    console.log("No valid Gemini client for Project Analysis. Direct routing to robust local assessor.");
    return getLocalProjectAnalysisFallback(submission);
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are the Official CivicLens Hackathon Jury Assessor.
Analyze the following hackathon project submission draft and provide a detailed review, score, and constructive feedback.

PROJECT NAME: "${submission.projectName || "Unnamed Project"}"
GOOGLE DOC LINK: "${submission.googleDocLink || "Not Provided"}"
PROBLEM STATEMENT: "${submission.problemStatement || "Not Provided"}"
SOLUTION OVERVIEW: "${submission.solutionOverview || "Not Provided"}"
KEY FEATURES: "${submission.keyFeatures || "Not Provided"}"
TECHNOLOGIES USED: "${submission.technologiesUsed || "Not Provided"}"
GOOGLE TECH UTILIZED: [${submission.googleTechUtilized?.join(", ") || ""}]

Evaluate the following criteria:
1. Google Doc Link: Is it present, and is it a valid docs.google.com link?
2. Problem Statement Selected: Does it align with a real civic issue?
3. Solution Overview: Is it clear, innovative, and detailed?
4. Key Features: Are the features impactful?
5. Technologies Used: Are they relevant?
6. Google Technologies: How well are they integrated (Gemini, Maps, etc.)?

Provide a score out of 100, brief constructive feedback for clarity, completeness, and googleTechIntegration, a status ("Approved" if score >= 75 and doc link is provided, else "Needs Improvement"), and 3-4 highly specific and actionable recommendations to improve the draft.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "A score between 0 and 100" },
            clarity: { type: Type.STRING, description: "Feedback on the solution overview and clarity." },
            completeness: { type: Type.STRING, description: "Feedback on whether all required details and a Google Doc link are present." },
            googleTechIntegration: { type: Type.STRING, description: "Feedback on the usage of Google developer tools." },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 3-4 specific, actionable recommendations."
            },
            status: { type: Type.STRING, description: "Must be exactly 'Approved' or 'Needs Improvement'" }
          },
          required: ["score", "clarity", "completeness", "googleTechIntegration", "recommendations", "status"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as ProjectAnalysisResult;
    }
  } catch (error) {
    console.error("Gemini Project Analysis failed, using robust fallback:", error);
  }

  return getLocalProjectAnalysisFallback(submission);
}

function getLocalProjectAnalysisFallback(submission: ProjectSubmissionPayload): ProjectAnalysisResult {
  const recommendations: string[] = [];
  let score = 50;

  const hasDoc = submission.googleDocLink && submission.googleDocLink.includes("docs.google.com");
  if (!submission.googleDocLink) {
    recommendations.push("Please provide a Google Doc link as required by the hackathon submission rules.");
  } else if (!hasDoc) {
    recommendations.push("The Google Doc link provided does not appear to be a valid docs.google.com link. Please double check the URL.");
  } else {
    score += 15;
  }

  if (!submission.projectName || submission.projectName.trim() === "Unnamed Project" || submission.projectName.trim() === "") {
    recommendations.push("Give your project a distinctive, high-impact name that reflects your civic solution.");
  } else {
    score += 5;
  }

  if (!submission.problemStatement || submission.problemStatement.length < 20) {
    recommendations.push("Elaborate on the Selected Problem Statement. Describe why this issue represents a critical bottleneck for municipal emergency response.");
  } else {
    score += 10;
  }

  if (!submission.solutionOverview || submission.solutionOverview.length < 40) {
    recommendations.push("Expand your Solution Overview to clearly describe the architecture, user journey, and the core innovation of your AI-driven approach.");
  } else {
    score += 10;
  }

  if (!submission.keyFeatures || submission.keyFeatures.length < 20) {
    recommendations.push("Detail at least three primary features that make your app stand out (e.g. real-time telemetry, automated dispatch, maps visualization).");
  } else {
    score += 5;
  }

  const hasGoogleTech = submission.googleTechUtilized && submission.googleTechUtilized.length > 0;
  if (!hasGoogleTech) {
    recommendations.push("Leverage more Google Technologies like Gemini 3.5 Flash or Google Maps Platform to align with the core requirements of the hackathon.");
  } else {
    score += 15;
  }

  if (recommendations.length === 0) {
    recommendations.push("Your draft is looking exceptionally polished! Ensure that the sharing permissions of your Google Doc are set to 'Anyone with link can view' before final submission.");
  }

  score = Math.min(100, Math.max(10, score));

  return {
    score,
    clarity: submission.solutionOverview && submission.solutionOverview.length > 40
      ? "The solution overview is well-defined and clearly outlines the civic value proposition."
      : "The solution overview is currently a bit concise. Consider elaborating on how the system coordinates emergency dispatches.",
    completeness: hasDoc
      ? "All mandatory fields, including a valid Google Doc link, are accounted for."
      : "Missing a valid Google Doc reference. Please supply the required link to your project document.",
    googleTechIntegration: hasGoogleTech
      ? "Google technologies are registered in your draft. Ensure they are explicitly referenced in your final document."
      : "No Google developer technologies selected. Please specify which ones you utilized in building your solution.",
    recommendations: recommendations.slice(0, 4),
    status: score >= 75 ? "Approved" : "Needs Improvement"
  };
}
