import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { analyzeVisionAgent, analyzeProjectSubmission } from "./src/services/gemini";
import {
  generatePredictionAgent,
  detectDuplicates,
  analyzeTrends,
  generateSimulationAnalysis
} from "./src/services/predictionEngine";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with limit for base64 images
app.use(express.json({ limit: "20mb" }));

// DB File Path
const DB_FILE = path.join(process.cwd(), "src", "db.json");

// Pre-seeded high fidelity mock data
const INITIAL_ISSUES = [
  {
    id: "seed-1",
    title: "Severe Road Asphalt Erosion & Water Main Burst",
    description: "Water is gushing out of a deep asphalt fracture on Elm Street. It's washing away the gravel sub-base of the road and flooding the sidewalks. Massive sinkhole forming.",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
    status: "in_progress",
    category: "Water & Sewer",
    address: "742 Elm Street, Ward 4",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36h ago
    upvotes: 42,
    verifiedByCount: 18,
    timeline: [
      { status: "reported", date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), note: "Issue logged by citizen with photo attachment." },
      { status: "under_review", date: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(), note: "CivicLens AI Vision Agent classified the severity as CRITICAL and designated Department of Water & Sanitation." },
      { status: "scheduled", date: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), note: "Main line isolation crew dispatched. Repair scheduled." },
      { status: "in_progress", date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), note: "Crews on site. Shutoff valve active. Excavating road bed to replace damaged 12-inch conduit." }
    ],
    analysis: {
      vision: {
        category: "Water Infrastructure Failure",
        severity: "Critical",
        confidence: 96,
        riskAssessment: "High volume water runoff is eroding the road subgrade rapidly. Deep asphalt collapse poses major tire-impact/vehicle hazard. Adjacent basement flooding highly probable within hours.",
        summary: "Multimodal analysis shows a fractured municipal main line discharging pressurized water directly through the roadway pavement. Subgrade sand and gravel are actively washing down current."
      },
      resolution: {
        responsibleAuthority: "Department of Water and Sanitation & Roadway Maintenance",
        recommendedAction: "Execute emergency valve isolation. Set up barricades on Elm St between 3rd & 5th. Coordinate with Power utility to verify underground lines prior to deep excavating.",
        priority: "Immediate",
        estimatedResolutionTime: "12-18 Hours"
      },
      prediction: {
        escalationProbability: 92,
        impactForecast: "If un-isolated, total road structural failure will occur, forming a 4-meter wide sinkhole. Flooding will short circuit electrical conduits in the adjacent distribution vault, causing a localized blackout for 120 residential homes.",
        suggestedPreventiveAction: "Pre-emptively divert all traffic. Sandbag the pedestrian pathways at 740 and 744 Elm Street immediately."
      }
    }
  },
  {
    id: "seed-2",
    title: "Large Concrete Pothole with Exposed Rebar",
    description: "Deep pothole in the left commuter lane of the expressway. Exposed rusted metal rebar is sticking straight up and has already punctured at least two car tires this morning. Extremely dangerous at night.",
    imageUrl: "/concrete_spall.jpg",
    status: "scheduled",
    category: "Road Infrastructure",
    address: "I-90 Expressway Westbound, Mile Marker 14.2",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18h ago
    upvotes: 27,
    verifiedByCount: 9,
    timeline: [
      { status: "reported", date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), note: "Reported by motorist via high-speed transit dashcam snapshot." },
      { status: "under_review", date: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), note: "Vision Agent flagged exposed steel rebar. Categorized as HIGH severity." },
      { status: "scheduled", date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), note: "Expressway Highway Patrol notified. Asphalt patching team scheduled to apply cold-pour emergency compound tonight at 11 PM." }
    ],
    analysis: {
      vision: {
        category: "Expressway Surface Degradation",
        severity: "High",
        confidence: 91,
        riskAssessment: "Metal reinforcing rods are bent upwards. Driving over this at 60mph guarantees tire blowouts and potential loss of vehicle control. Visible degradation suggests concrete delamination.",
        summary: "Expressway wearing course completely eroded down to the base slab. Rusted structural rebar exposed, creating sharp projectiles directly in the path of commuter traffic."
      },
      resolution: {
        responsibleAuthority: "State Department of Transportation (DOT)",
        recommendedAction: "Deploy Highway Safety Vehicle to close the left lane. Cut protruding rebar flush, clear loose debris, and apply rapid-cure elastomeric concrete patch.",
        priority: "High",
        estimatedResolutionTime: "24-36 Hours"
      },
      prediction: {
        escalationProbability: 78,
        impactForecast: "With oncoming rain tomorrow, water ingress into the surrounding concrete fractures will accelerate freeze-thaw sub-slab cavitation, widening the pothole by 40% and increasing tire blowout incidence exponentially.",
        suggestedPreventiveAction: "Place reflective cones 100 meters upstream. Force immediate lane-merge instructions on electronic expressway signage."
      }
    }
  },
  {
    id: "seed-3",
    title: "Illegal Toxic Waste & Battery Dumping",
    description: "About 15 heavy car batteries and chemical containers dumped near the creek path. Some batteries appear cracked and are leaking dark acid directly onto the soil and towards the water.",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    status: "reported",
    category: "Waste & Sanitation",
    address: "Oak Creek Trail, North trailhead parking lot",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    upvotes: 19,
    verifiedByCount: 4,
    timeline: [
      { status: "reported", date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), note: "Logged by local trail-runner. Toxic waste warning flags activated." }
    ],
    analysis: {
      vision: {
        category: "Hazardous Materials Dumping",
        severity: "High",
        confidence: 89,
        riskAssessment: "Lead-acid cells contain sulfuric acid and heavy metals. Direct soil leaching poses immediate contamination risk to the local Oak Creek ecosystem located only 20 feet away.",
        summary: "Visual evidence of illegal dumping of lead-acid automotive batteries and chemical drums. Corrosion is present, and chemical discharge rings are visible in the surrounding dirt."
      },
      resolution: {
        responsibleAuthority: "Environmental Protection Agency (EPA) & Municipal Hazmat response",
        recommendedAction: "Deploy hazardous waste neutralization team. Excavate contaminated topsoil. Check creek pH levels immediately upstream and downstream of the dump site.",
        priority: "High",
        estimatedResolutionTime: "1-2 Days"
      },
      prediction: {
        escalationProbability: 80,
        impactForecast: "Lead and sulfuric acid will enter the aquifer, raising local water acidity levels. Toxic heavy metals will bioaccumulate in Oak Creek trout, leading to park-wide fishing bans and local wildlife mortality.",
        suggestedPreventiveAction: "Rope off the trail path. Cover the batteries with acid-neutralizing dry lime powder and a waterproof tarp to prevent rain-driven run-off."
      }
    }
  }
];

// Helper to read database
function readDB(): any[] {
  try {
    let dataList: any[];
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      dataList = JSON.parse(data);
    } else {
      // Create initial DB
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_ISSUES, null, 2), "utf-8");
      dataList = INITIAL_ISSUES;
    }

    let updated = false;
    dataList = dataList.map((item: any) => {
      if (item.lat === undefined || item.lng === undefined) {
        if (item.id === "seed-1") {
          item.lat = 37.7749;
          item.lng = -122.4194;
        } else if (item.id === "seed-2") {
          item.lat = 37.7801;
          item.lng = -122.4095;
        } else if (item.id === "seed-3") {
          item.lat = 37.7650;
          item.lng = -122.4280;
        } else {
          const hash = item.id ? item.id.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) : Math.random();
          item.lat = 37.76 + (hash % 100) * 0.0003;
          item.lng = -122.43 + ((hash * 7) % 100) * 0.0003;
        }
        updated = true;
      }
      return item;
    });

    if (updated) {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataList, null, 2), "utf-8");
    }

    return dataList;
  } catch (error) {
    console.error("Error reading database file, returning in-memory:", error);
    return INITIAL_ISSUES;
  }
}

// Helper to write database
function writeDB(data: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
}

// Initialize database
let issues = readDB();

// Lazy Initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      console.log("Gemini API Client initialized successfully.");
    } else {
      console.warn("GEMINI_API_KEY is not configured or left as default. Running in simulation mode.");
    }
  }
  return aiClient;
}

// Simulated fallback AI generation for demo/testing without keys
function getSimulatedAnalysis(title: string, description: string, categoryName: string, address: string): any {
  const categories = [
    "Road Infrastructure", "Water & Sewer", "Power & Grid", 
    "Waste & Sanitation", "Public Safety", "Park Maintenance"
  ];
  const detectedCategory = categories.find(c => 
    title.toLowerCase().includes(c.toLowerCase().split(' ')[0]) || 
    description.toLowerCase().includes(c.toLowerCase().split(' ')[0])
  ) || categoryName || "Road Infrastructure";

  const lowerDesc = description.toLowerCase();
  let severity: "Low" | "Medium" | "High" | "Critical" = "Medium";
  if (lowerDesc.includes("dangerous") || lowerDesc.includes("emergency") || lowerDesc.includes("injury") || lowerDesc.includes("burst") || lowerDesc.includes("flooding")) {
    severity = "Critical";
  } else if (lowerDesc.includes("hazard") || lowerDesc.includes("block") || lowerDesc.includes("exposed") || lowerDesc.includes("leak")) {
    severity = "High";
  } else if (lowerDesc.includes("minor") || lowerDesc.includes("cosmetic")) {
    severity = "Low";
  }

  const priorityMap = {
    "Critical": "Immediate",
    "High": "High",
    "Medium": "Medium",
    "Low": "Low"
  };
  const priority = priorityMap[severity];

  const estTimeMap = {
    "Immediate": "4-12 Hours",
    "High": "24-48 Hours",
    "Medium": "3-5 Days",
    "Low": "1-2 Weeks"
  };
  const estTime = estTimeMap[priority];

  const escalationProb = severity === "Critical" ? 90 : severity === "High" ? 75 : severity === "Medium" ? 45 : 15;

  return {
    title: title || `Reported ${detectedCategory} Issue`,
    category: detectedCategory,
    vision: {
      category: `${detectedCategory} Issue (Simulated)`,
      severity,
      confidence: Math.floor(Math.random() * 15) + 80,
      riskAssessment: `The issue shows structural/safety characteristics matching ${severity.toLowerCase()} severity. Citizen states: "${description}". Immediate inspection advised to check for subsurface degradation.`,
      summary: `AI analyzed the text report for ${detectedCategory} located at ${address || "unspecified location"}. Safety guidelines recommend dispatching first responders.`
    },
    resolution: {
      responsibleAuthority: `Municipal Bureau of ${detectedCategory}`,
      recommendedAction: `Inspect localized hazard area, secure perimeter, divert pedestrian traffic, and apply standard municipal patch repairs.`,
      priority,
      estimatedResolutionTime: estTime
    },
    prediction: {
      escalationProbability: escalationProb,
      impactForecast: `Failure to act within 48 hours will result in widening structural stress, rising public safety complaints, and potential minor property damage to nearby residential walkways.`,
      suggestedPreventiveAction: `Erect immediate barrier signage and publish safety advisory notes to neighborhood residents.`
    }
  };
}

// API Routes

// Get all issues
app.get("/api/issues", (req, res) => {
  res.json(issues);
});

// Get stats
app.get("/api/stats", (req, res) => {
  const currentIssues = issues;
  const total = currentIssues.length;
  const resolved = currentIssues.filter(i => i.status === "resolved").length;
  const critical = currentIssues.filter(i => i.analysis?.vision?.severity === "Critical").length;
  
  let totalConfidence = 0;
  let hasConfidenceCount = 0;
  let totalVerified = 0;
  let totalPredictions = 0;
  const categoryDist: Record<string, number> = {};

  currentIssues.forEach(i => {
    const cat = i.category || "Other";
    categoryDist[cat] = (categoryDist[cat] || 0) + 1;
    totalVerified += (i.verifiedByCount || 0);
    if (i.analysis) {
      totalPredictions++;
    }
    if (i.analysis?.vision?.confidence) {
      totalConfidence += i.analysis.vision.confidence;
      hasConfidenceCount++;
    }
  });

  const avgConfidence = hasConfidenceCount > 0 ? Math.round(totalConfidence / hasConfidenceCount) : 92;

  res.json({
    totalIssues: total,
    resolvedIssues: resolved,
    averageConfidence: avgConfidence,
    criticalCount: critical,
    categoryDistribution: categoryDist,
    totalVerifiedCount: totalVerified,
    totalPredictionsGenerated: totalPredictions
  });
});

// Create dedicated direct API for Vision Agent
app.post("/api/analyze-vision", async (req, res) => {
  const { image, description, title } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  try {
    console.log("Analyzing with dedicated Vision Agent endpoint...");
    const result = await analyzeVisionAgent(image, description, title);
    return res.json(result);
  } catch (err: any) {
    console.error("Dedicated vision endpoint failed:", err);
    return res.status(500).json({ error: err?.message || "Failed to analyze civic issue with Vision Agent." });
  }
});

// Create new issue with Gemini Agentic pipeline
app.post("/api/issues", async (req, res) => {
  const { title, description, address, category, image, lat, lng } = req.body;

  if (!description || !address) {
    return res.status(400).json({ error: "Description and Address are required." });
  }

  const newId = "issue-" + Date.now();
  console.log(`Starting CivicLens AI Agentic analysis for new report: ${title || "Untitled"}`);

  const parsedLat = typeof lat === "number" ? lat : (37.76 + Math.random() * 0.03);
  const parsedLng = typeof lng === "number" ? lng : (-122.43 + Math.random() * 0.03);

  let finalAnalysis: any;

  try {
    // Utilize the core robust Vision Agent service
    const visionResult = await analyzeVisionAgent(image, description, title);

    const severity = visionResult.severity;
    const priority = visionResult.priority;
    const issueType = visionResult.issueType;

    const escalationProb = severity === "Critical" ? 90 : severity === "High" ? 75 : severity === "Medium" ? 45 : 15;
    
    const estTimeMap: Record<string, string> = {
      "Immediate": "4-12 Hours",
      "High": "24-48 Hours",
      "Medium": "3-5 Days",
      "Low": "1-2 Weeks"
    };
    const estTime = estTimeMap[priority] || "3-5 Days";

    // Build the complete multi-agent response structure
    finalAnalysis = {
      title: title || `Reported ${issueType} Issue`,
      category: issueType,
      vision: {
        category: `${issueType} Incident`,
        severity: severity,
        confidence: visionResult.confidenceScore,
        riskAssessment: visionResult.safetyRisk,
        summary: visionResult.description
      },
      resolution: {
        responsibleAuthority: `Municipal Bureau of ${issueType}`,
        recommendedAction: `Inspect localized hazard area, secure perimeter, and apply standard municipal patch repairs.`,
        priority: priority,
        estimatedResolutionTime: estTime
      },
      prediction: {
        escalationProbability: escalationProb,
        impactForecast: `Failure to act within 48 hours will result in widening stress, rising public safety complaints, and potential minor property damage.`,
        suggestedPreventiveAction: `Erect immediate barrier signage and publish safety advisory notes.`
      }
    };
  } catch (error) {
    console.error("Gemini Multi-Agent analysis failed, falling back to simulated analysis:", error);
    finalAnalysis = getSimulatedAnalysis(title, description, category, address);
  }

  // Create complete issue object
  const newIssue: any = {
    id: newId,
    title: finalAnalysis.title || title || "Reported Civic Hazard",
    description,
    imageUrl: image || "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80",
    status: "reported",
    category: finalAnalysis.category || category || "Road Infrastructure",
    address,
    createdAt: new Date().toISOString(),
    upvotes: 1,
    verifiedByCount: 1,
    isVerifiedByMe: true,
    isUpvotedByMe: true,
    lat: parsedLat,
    lng: parsedLng,
    timeline: [
      { status: "reported", date: new Date().toISOString(), note: "Report logged on CivicLens and published to community feed." },
      { status: "under_review", date: new Date().toISOString(), note: "CivicLens Vision, Resolution, and Prediction Agents dispatched and completed structured profiling." }
    ],
    analysis: {
      vision: finalAnalysis.vision,
      resolution: finalAnalysis.resolution,
      prediction: finalAnalysis.prediction
    }
  };

  try {
    const predResult = await generatePredictionAgent(newIssue, issues);
    newIssue.analysis.prediction = {
      ...newIssue.analysis.prediction,
      futureRisk: predResult.futureRisk,
      escalationProbability: predResult.escalationProbability,
      infrastructureRisk: predResult.infrastructureRisk,
      estimatedPopulationImpact: predResult.estimatedPopulationImpact,
      urgencyScore: predResult.urgencyScore,
      impactForecast: predResult.futureRisk, // fallback key compatibility
    };
  } catch (err) {
    console.error("AI automated prediction generation during creation failed:", err);
  }

  issues.unshift(newIssue);
  writeDB(issues);

  res.status(201).json(newIssue);
});

// Upvote an issue
app.post("/api/issues/:id/upvote", (req, res) => {
  const { id } = req.params;
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Issue not found." });

  const issue = issues[idx];
  if (issue.isUpvotedByMe) {
    issue.upvotes--;
    issue.isUpvotedByMe = false;
  } else {
    issue.upvotes++;
    issue.isUpvotedByMe = true;
  }

  issues[idx] = issue;
  writeDB(issues);
  res.json(issue);
});

// Verify an issue
app.post("/api/issues/:id/verify", (req, res) => {
  const { id } = req.params;
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Issue not found." });

  const issue = issues[idx];
  if (!issue.verificationHistory) {
    issue.verificationHistory = [];
  }

  if (issue.isVerifiedByMe) {
    issue.verifiedByCount--;
    issue.isVerifiedByMe = false;
    // Log verification removal
    issue.verificationHistory.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'dispute',
      user: 'Anonymous Citizen',
      timestamp: new Date().toISOString()
    });
  } else {
    issue.verifiedByCount++;
    issue.isVerifiedByMe = true;
    // If flagged as not accurate, turn that off
    if (issue.isNotAccurateByMe) {
      issue.notAccurateCount = Math.max(0, (issue.notAccurateCount || 0) - 1);
      issue.isNotAccurateByMe = false;
    }
    // Log verification addition
    issue.verificationHistory.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'confirm',
      user: 'Anonymous Citizen',
      timestamp: new Date().toISOString()
    });
  }

  issues[idx] = issue;
  writeDB(issues);
  res.json(issue);
});

// Flag issue as Not Accurate
app.post("/api/issues/:id/not-accurate", (req, res) => {
  const { id } = req.params;
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Issue not found." });

  const issue = issues[idx];
  if (!issue.notAccurateCount) {
    issue.notAccurateCount = 0;
  }
  if (!issue.verificationHistory) {
    issue.verificationHistory = [];
  }

  if (issue.isNotAccurateByMe) {
    issue.notAccurateCount = Math.max(0, issue.notAccurateCount - 1);
    issue.isNotAccurateByMe = false;
    // Log removal of dispute
    issue.verificationHistory.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'confirm',
      user: 'Anonymous Citizen',
      timestamp: new Date().toISOString()
    });
  } else {
    issue.notAccurateCount++;
    issue.isNotAccurateByMe = true;
    // If verified, turn that off
    if (issue.isVerifiedByMe) {
      issue.verifiedByCount = Math.max(0, issue.verifiedByCount - 1);
      issue.isVerifiedByMe = false;
    }
    // Log dispute
    issue.verificationHistory.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'dispute',
      user: 'Anonymous Citizen',
      timestamp: new Date().toISOString()
    });
  }

  issues[idx] = issue;
  writeDB(issues);
  res.json(issue);
});

// Add a comment to an issue
app.post("/api/issues/:id/comments", (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;
  if (!text) return res.status(400).json({ error: "Comment text is required." });

  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Issue not found." });

  const issue = issues[idx];
  if (!issue.comments) {
    issue.comments = [];
  }

  const newComment = {
    id: Math.random().toString(36).substr(2, 9),
    author: author || "Citizen Reporter",
    text,
    createdAt: new Date().toISOString()
  };

  issue.comments.push(newComment);
  issues[idx] = issue;
  writeDB(issues);
  res.json(issue);
});

// Add an additional image to an issue gallery
app.post("/api/issues/:id/images", (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "Image URL is required." });

  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Issue not found." });

  const issue = issues[idx];
  if (!issue.additionalImages) {
    issue.additionalImages = [];
  }

  issue.additionalImages.push(imageUrl);
  issues[idx] = issue;
  writeDB(issues);
  res.json(issue);
});

// Update issue resolution stage (Simulating municipality work)
app.post("/api/issues/:id/resolve", (req, res) => {
  const { id } = req.params;
  const { nextStatus } = req.body; // e.g. under_review, scheduled, in_progress, resolved
  
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Issue not found." });

  const issue = issues[idx];
  const validStatusList = ["reported", "under_review", "scheduled", "in_progress", "resolved"];
  
  if (!validStatusList.includes(nextStatus)) {
    return res.status(400).json({ error: "Invalid status sequence." });
  }

  // Check if we are advancing or resetting
  issue.status = nextStatus;

  // Add event to timeline
  const notes = {
    reported: "Issue report reset to initial logging.",
    under_review: "Municipality operators have acknowledged the report. Verification protocols initiated.",
    scheduled: `Resolution plan finalized. Assigned to ${issue.analysis?.resolution?.responsibleAuthority || "Municipal Operations"}. Work scheduled.`,
    in_progress: "Dispatch crew has arrived on site. Repairs actively in progress.",
    resolved: "Work completed successfully. Site cleared, structural integrity restored, and final safety inspection approved."
  };

  issue.timeline.push({
    status: nextStatus,
    date: new Date().toISOString(),
    note: notes[nextStatus as keyof typeof notes] || "Status updated."
  });

  // If resolved, modify prediction dashboard to show successful mitigation
  if (nextStatus === "resolved" && issue.analysis?.prediction) {
    issue.analysis.prediction.escalationProbability = 0;
    issue.analysis.prediction.impactForecast = "Escalation mitigated successfully. No remaining safety hazard predicted.";
  }

  issues[idx] = issue;
  writeDB(issues);
  res.json(issue);
});

// POST Analyze Hackathon Submission
app.post("/api/hackathon/submit", async (req, res) => {
  try {
    const submission = req.body;
    if (!submission) {
      return res.status(400).json({ error: "Missing submission payload" });
    }
    const result = await analyzeProjectSubmission(submission);
    res.json(result);
  } catch (error: any) {
    console.error("Hackathon analysis endpoint failed:", error);
    res.status(500).json({ error: error?.message || "Internal submission analysis error." });
  }
});

// GET Trend Analysis
app.get("/api/trends", async (req, res) => {
  try {
    const trends = await analyzeTrends(issues);
    res.json(trends);
  } catch (error: any) {
    console.error("Failed to run trend analysis:", error);
    res.status(500).json({ error: error?.message || "Internal trend analysis error." });
  }
});

// GET Duplicate Candidates for a specific issue
app.get("/api/issues/:id/duplicates", async (req, res) => {
  const { id } = req.params;
  const issue = issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: "Issue not found." });

  try {
    const dupRes = await detectDuplicates(issue, issues);
    res.json(dupRes);
  } catch (error: any) {
    console.error(`Failed to analyze duplicates for issue ${id}:`, error);
    res.status(500).json({ error: error?.message || "Internal duplicate analysis error." });
  }
});

// POST to manually regenerate Predictions for a specific issue
app.post("/api/issues/:id/predictions", async (req, res) => {
  const { id } = req.params;
  const idx = issues.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Issue not found." });

  const issue = issues[idx];
  try {
    const predResult = await generatePredictionAgent(issue, issues);
    
    // Enrich prediction
    issue.analysis.prediction = {
      ...issue.analysis.prediction,
      futureRisk: predResult.futureRisk,
      escalationProbability: predResult.escalationProbability,
      infrastructureRisk: predResult.infrastructureRisk,
      estimatedPopulationImpact: predResult.estimatedPopulationImpact,
      urgencyScore: predResult.urgencyScore,
      impactForecast: predResult.futureRisk, // legacy compatibility
    };

    issues[idx] = issue;
    writeDB(issues);
    res.json(issue);
  } catch (error: any) {
    console.error(`Failed to run prediction analysis for issue ${id}:`, error);
    res.status(500).json({ error: error?.message || "Internal prediction analysis error." });
  }
});

// POST to simulate an issue under specific scenario
app.post("/api/issues/:id/simulate", async (req, res) => {
  const { id } = req.params;
  const { scenarioType } = req.body;
  const issue = issues.find(i => i.id === id);
  
  if (!issue) {
    return res.status(404).json({ error: "Issue not found." });
  }

  if (!scenarioType) {
    return res.status(400).json({ error: "Scenario type is required." });
  }

  try {
    const simulationResult = await generateSimulationAnalysis(issue, scenarioType);
    res.json(simulationResult);
  } catch (error: any) {
    console.error(`Simulation API failed for issue ${id}:`, error);
    res.status(500).json({ error: error?.message || "Internal simulation error." });
  }
});

// POST Merge Issue A into Issue B
app.post("/api/issues/:id/merge", (req, res) => {
  const { id } = req.params; // Issue A (child to be merged)
  const { mergeIntoId } = req.body; // Issue B (parent to survive)

  const childIdx = issues.findIndex(i => i.id === id);
  const parentIdx = issues.findIndex(i => i.id === mergeIntoId);

  if (childIdx === -1 || parentIdx === -1) {
    return res.status(404).json({ error: "One or both issues not found for merge operation." });
  }

  const childIssue = issues[childIdx];
  const parentIssue = issues[parentIdx];

  // Advance child issue status to resolved with duplicate merge notes
  childIssue.status = "resolved";
  if (!childIssue.timeline) childIssue.timeline = [];
  childIssue.timeline.push({
    status: "resolved",
    date: new Date().toISOString(),
    note: `Report flagged as duplicate. Successfully merged into primary incident report "${parentIssue.title}" (ID: ${parentIssue.id}) to consolidate municipal resources.`
  });

  // Transfer votes/verifications to parent to boost urgency!
  parentIssue.upvotes = (parentIssue.upvotes || 0) + (childIssue.upvotes || 1);
  parentIssue.verifiedByCount = (parentIssue.verifiedByCount || 0) + (childIssue.verifiedByCount || 1);
  
  if (!parentIssue.timeline) parentIssue.timeline = [];
  parentIssue.timeline.push({
    status: parentIssue.status,
    date: new Date().toISOString(),
    note: `Community urgency aggregated. Consolidated duplicate report "${childIssue.title}" (ID: ${childIssue.id}) into this incident record.`
  });

  issues[childIdx] = childIssue;
  issues[parentIdx] = parentIssue;

  writeDB(issues);
  res.json({ success: true, childIssue, parentIssue });
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware loaded.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production assets active.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicLens AI server listening at http://localhost:${PORT}`);
  });
}

startServer();
