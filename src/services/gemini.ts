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
