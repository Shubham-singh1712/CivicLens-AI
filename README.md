# 🏛️ CivicLens: Multi-Agent Urban Defense Platform
> **Category:** Smart Infrastructure & Urban Safety
> **Built with:** React 18, Vite, Express, TypeScript, Google GenAI (Gemini 3.5 Flash)

---

## 🚀 Vision & Core Solution

Traditional municipal intake portals (like legacy 311 systems) act as simple, static folders for complaints. They suffer from severe bottlenecks:
- **High Triage Costs:** Thousands of photos require manual sorting, categorization, and department routing.
- **Backlog Noise:** Citizens submit hundreds of duplicate reports for identical street cave-ins or leaks.
- **Reactive Disaster Management:** Local authorities only respond *after* high-voltage lines snap or sinkholes consume cars, with no predictive risk assessments.

**CivicLens** is an intelligent, reactive, multi-agent urban defense platform that converts unstructured citizen photo uploads into highly structured, auto-routed municipal dispatches in seconds. Powered by the state-of-the-art **Google Gemini 3.5 Flash**, it automates:
1. **Multi-Agent Multimodal Vision Profiling:** Analyzing imagery to extract exact hazard categories and severity indices.
2. **Intelligent Dispatch Routing & SLA Benchmarks:** Matching incidents to localized city departments and dispatching hotline details based on historic 311 parameters.
3. **Cascading Failure Risk Forecasting:** Anticipating infrastructure collapse risks and formulating protective safety cordons before damages expand.
4. **Geopromixity Duplicate Consolidation:** Eliminating backlog congestion by comparing spatial coordinates and clustering overlapping reports.

---

## 🛠️ Multi-Agent Architecture Topology

```
             ┌────────────────────────┐
             │   Citizen Web App      │ (React 18 + Tailwind)
             └───────────┬────────────┘
                         │ 
                         │ Base64 Image + Text Ingestion
                         ▼
             ┌────────────────────────┐
             │ Express Proxy Server   │ (Host: 0.0.0.0, Port: 3000)
             └───────────┬────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│     Google Gemini 3.5 Flash Multi-Agent Core           │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 🔎 [Agent 1: Neural Vision Profiler]                   │
│    - Audits visual integrity & categorizes issue       │
│                                                        │
│ 🔀 [Agent 2: Intelligent Routing Router]               │
│    - Assigns Bureau Routing, SLA & dispatch hotlines  │
│                                                        │
│ 🔮 [Agent 3: Cascading Risk Forecaster]                │
│    - Predicts escalation probability & safety cordon   │
│                                                        │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼ Strict JSON Schema Validation
             ┌────────────────────────┐
             │ Persistent Datastore   │ (db.json Cache Layer)
             └───────────┬────────────┘
                         │
                         ▼ Reactive UI updates
┌────────────────────────────────────────────────────────┐
│       Interactive Citizen Feed & Radar Map             │
└────────────────────────────────────────────────────────┘
```

---

## 🌟 Primary Feature Highlights

1. **Multimodal Core Diagnostics:**
   Processes live high-resolution citizen uploads. Instantly profiles structural concrete delamination, pavement stress, downed wiring, and chemical dumping.
2. **Interactive Spatial Radar Map:**
   An immersive, high-contrast visualizer charting community incidents using geodesic coordinates. Features custom SVG cluster markers, status trackers, and detailed drawer modals.
3. **Geoproximity Duplicate Merges:**
   Calculates geodesic distances (in Kilometers) between reports. When a citizen attempts to log an issue near an existing active report (within 1.5km), CivicLens presents a duplication alert allowing the user to merge upvotes and expedite council funding.
4. **Smart Dispatch Matrix & Area Records:**
   Produces real-time municipal routing cards, dispatch codes, and a localized historical area timeline compiling soil surveys and previous repairs.
5. **Hackathon Presentation Portal (Judge Hub):**
   A dedicated view inside the live application that maps architectural flows, pitch deck outlines, presentation timelines, and criteria alignments directly to judges.

---

## ⚡ Google AI Studio Integration Details

CivicLens uses the modern `@google/genai` TypeScript SDK for advanced reasoning.

### Schema Enforcement
To guarantee data validation, we define a precise `Type.OBJECT` schema passed directly inside the Gemini configuration:
```ts
const response = await client.models.generateContent({
  model: "gemini-3.5-flash",
  contents,
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        issueType: { type: Type.STRING },
        severity: { type: Type.STRING },
        confidenceScore: { type: Type.INTEGER },
        safetyRisk: { type: Type.STRING },
        priority: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["issueType", "severity", "confidenceScore", "safetyRisk", "priority", "description"]
    }
  }
});
```

### Triple-Fault Tolerance
If the API client is throttled, experiences network latency, or returns poorly formatted JSON, our system triggers a **triple-fault recovery pipeline**:
1. **Exponential Backoff Retries:** Automatically schedules up to 3 retrieval loops.
2. **Server-Side Verification:** Parses and runs structure checks (`validateVisionResult`) on response schemas.
3. **Rule-Based Fallback Engine:** Instantly spins up a local parser if the network is fully offline to ensure zero application crashes.

---

## 🎯 Hackathon Judging Criteria Alignment

| Judging Criterion | CivicLens Implementation & Edge |
| :--- | :--- |
| **Technological Innovation** | Multi-agent reasoning utilizing a single unified schema-driven Gemini request. Independent verification layer + geoproximity algorithms. |
| **Design Craftsmanship** | Dark Mode Swiss-Modern design. Hand-coded glassmorphic cards, smooth page transitions (`AnimatePresence`), responsive maps, and animated stats counters. |
| **Real-World Impact** | Eliminates sorting overhead, clusters duplicates to avoid backlog congestion, and supplies immediate safety measures for citizens on-site. |
| **Execution Completeness** | Zero mock code, complete end-to-end flow with fully realized dashboard, interactive maps, and automated fallback services. |

---

## 🎤 3-Minute Presentation & Demo Script

### 🕒 0:00 - 0:45 | Intro & Problem Definition
- **Visuals:** Overview screen showcasing stats counters (Total Cases, Resolved Ratio, Critical Count).
- **Script:** *"Good afternoon judges. Legacy municipal portals fail because they act as simple folders for complaints, resulting in massive triaging backlogs. CivicLens is an intelligent urban defense system that turns citizen uploads into detailed, routed emergency dispatches in seconds."*

### 🕒 0:45 - 1:45 | Logging the Emergency (The Demo)
- **Visuals:** Click **Report Issue**, select the **Major Asphalt Sinkhole** Quick Preset. Click **Initiate AI Diagnostics**. Show the animated loading ticks.
- **Script:** *"Let's report a sinkhole. By choosing our preset, we upload a high-res photo. Our backend pipes this through Google Gemini 3.5 Flash. In under 3 seconds, CivicLens visualizes a complete diagnostic assessment, highlighting critical severity indices, undermined soils, and emergency barriers."*

### 🕒 1:45 - 2:30 | Proximity Duplicates & Radar Map
- **Visuals:** Click **Citizen Feed**, select **Interactive Radar Map**. Click on a coordinate pin near the reported issue.
- **Script:** *"Once confirmed, the issue registers on our Radar Map. In the detail drawer, you see our geoproximity scanner. It identified duplicate reports near Elm Street, allowing citizens to merge upvotes instead of creating duplicate tickets. CivicLens then attaches a localized area record timeline for inspectors."*

### 🕒 2:30 - 3:00 | System Architecture & Closing
- **Visuals:** Navigate to the **Judge Portal** tab. Show the Multi-Agent System Diagram.
- **Script:** *"CivicLens is robust, secure, and production-ready. We are equipping modern cities with computational urban defense. Thank you."*

---

## 📑 10-Slide Pitch Deck Outline

1. **Slide 1:** Title (CivicLens: Multi-Agent Urban Defense Platform)
2. **Slide 2:** The Backlog Crisis (Legacy 311 overhead and manual triage bottlenecks)
3. **Slide 3:** The Solution (Autonomous AI triage, proactive cordons, and duplicate merge logic)
4. **Slide 4:** Under the Hood (Gemini 3.5 Flash & schema-driven agent orchestrations)
5. **Slide 5:** Demo Stage 1 (Multimodal image inspection & concrete threat ratings)
6. **Slide 6:** Demo Stage 2 (Geoproximity cluster consolidations & upvote pooling)
7. **Slide 7:** Demo Stage 3 (Interactive spatial radar maps and heat-indexing)
8. **Slide 8:** Smart Routing Core (SLA allocation, municipal hotlines, and dispatch logs)
9. **Slide 9:** Business & SaaS Scaling (Municipal subscription licensing & B2G integrations)
10. **Slide 10:** Future Roadmaps (Autonomous drone surveying & real-time city sensory feeds)

---

## ⚙️ Local Development & Deployment Guide

### Prerequisites
- Node.js (v18 or higher)
- Google Gemini API Key

### Installation & Run
1. **Clone & Setup:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   *The server binds exclusively to `http://localhost:3000`.*

4. **Production Build & Compilation:**
   ```bash
   npm run build
   npm run start
   ```
   *Compiles client assets inside `dist/` and bundles the Express backend to CJS formats for seamless deployment.*
