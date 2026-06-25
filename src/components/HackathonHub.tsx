import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Award, 
  Cpu, 
  Layers, 
  BookOpen, 
  TrendingUp, 
  Play, 
  ShieldCheck, 
  Compass, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Lightbulb,
  FileText,
  Workflow
} from "lucide-react";

export default function HackathonHub() {
  const [activeSubTab, setActiveSubTab] = useState<"architecture" | "pitch" | "criteria" | "script">("architecture");

  return (
    <div id="hackathon-portal" className="max-w-7xl mx-auto px-6 py-8 space-y-8 text-left">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-purple-950/20 to-gray-950 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.15),transparent_45%)] pointer-events-none"></div>
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/50 border border-cyan-800/40 rounded-full text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 animate-pulse" />
            <span>Official Hackathon Presentation & Judge Suite</span>
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
            CivicLens: Multi-Agent Urban Defense Hub
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Welcome, Hackathon Judges. This interactive hub provides immediate access to our system architecture, live code structures, step-by-step presentation script, and direct criteria alignment to streamline your evaluation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
          <div className="px-4 py-2.5 bg-gray-950/80 border border-gray-850 rounded-xl text-center min-w-[100px]">
            <span className="text-[9px] font-mono text-gray-500 uppercase block">JUDGING STAGE</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">FINALS MVP</span>
          </div>
          <div className="px-4 py-2.5 bg-gray-950/80 border border-gray-850 rounded-xl text-center min-w-[100px]">
            <span className="text-[9px] font-mono text-gray-500 uppercase block">CORE MODEL</span>
            <span className="text-xs font-bold text-purple-400 font-mono">Gemini 3.5 Flash</span>
          </div>
        </div>
      </div>

      {/* PORTAL NAVIGATION */}
      <div className="flex border-b border-gray-900 overflow-x-auto gap-1 scrollbar-thin">
        {[
          { id: "architecture", label: "Agent Architecture", icon: Layers },
          { id: "criteria", label: "Judging Criteria Alignment", icon: ShieldCheck },
          { id: "pitch", label: "Pitch Deck Outline", icon: FileText },
          { id: "script", label: "3-Min Live Demo Script", icon: Play }
        ].map((subTab) => {
          const Icon = subTab.icon;
          const isActive = activeSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`pb-3.5 px-4 font-bold text-xs font-sans tracking-wide transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                isActive
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{subTab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB CONTENTS */}
      <div className="space-y-6">
        
        {/* TAB 1: ARCHITECTURE DIAGRAM */}
        {activeSubTab === "architecture" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Block Diagram */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <h3 className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-cyan-400" />
                    <span>Multi-Agent System & Data Flow Topology</span>
                  </h3>
                  <span className="text-[9px] font-mono text-gray-500">100% SECURE PRIVATE PROXY</span>
                </div>

                {/* THE DIAGRAM GRAPHICS */}
                <div className="bg-gray-950/80 rounded-xl p-5 border border-gray-900 space-y-6 font-mono text-[11px] relative">
                  
                  {/* Step 1: Citizen Input */}
                  <div className="flex items-center gap-3 bg-gray-900/60 p-3 rounded-lg border border-gray-850 relative">
                    <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-800/40 flex items-center justify-center font-bold text-cyan-400 text-xs shrink-0">
                      01
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-200">CITIZEN INPUT STAGE</div>
                      <div className="text-[10px] text-gray-500 truncate">Image upload (Base64) + Multiline Hazard Description</div>
                    </div>
                    <span className="absolute right-3 top-3.5 text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-900">
                      CLIENT-SIDE
                    </span>
                  </div>

                  <div className="h-4 flex justify-center">
                    <div className="w-0.5 h-full bg-gradient-to-b from-cyan-500 to-purple-500"></div>
                  </div>

                  {/* Step 2: Server Secure Endpoint */}
                  <div className="flex items-center gap-3 bg-gray-900/60 p-3 rounded-lg border border-gray-850 relative">
                    <div className="w-8 h-8 rounded bg-purple-950 border border-purple-800/40 flex items-center justify-center font-bold text-purple-400 text-xs shrink-0">
                      02
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-200">EXPRESS PROXY GATEWAY</div>
                      <div className="text-[10px] text-gray-500">Exposes /api/analyze-vision, encapsulates secrets & rate guards</div>
                    </div>
                    <span className="absolute right-3 top-3.5 text-[8px] bg-purple-950 text-purple-400 px-1.5 py-0.5 rounded border border-purple-900">
                      SERVER-SIDE
                    </span>
                  </div>

                  <div className="h-4 flex justify-center">
                    <div className="w-0.5 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                  </div>

                  {/* Step 3: Neural Model Core */}
                  <div className="p-4 bg-purple-950/10 border border-purple-900/30 rounded-xl relative space-y-3.5">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-5 h-5 text-purple-400 animate-spin-slow shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-gray-100">GOOGLE GEMINI 3.5 FLASH COGNITIVE CORE</div>
                        <div className="text-[10px] text-gray-400">Structured Response Schema + Strict Multi-Agent Prompt Orchestration</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10px]">
                      <div className="p-2 bg-gray-950/95 border border-purple-900/20 rounded">
                        <span className="text-cyan-400 font-bold block mb-0.5">AGENT 1: VISION SCAN</span>
                        <p className="text-gray-500 text-[9px] leading-snug">Inspects structural fractures, confirms hazard viability, flags non-civic noise.</p>
                      </div>
                      <div className="p-2 bg-gray-950/95 border border-purple-900/20 rounded">
                        <span className="text-purple-400 font-bold block mb-0.5">AGENT 2: ROUTING</span>
                        <p className="text-gray-500 text-[9px] leading-snug">Calculates optimal municipal department routing, SLA benchmarks, and dispatcher hotlines.</p>
                      </div>
                      <div className="p-2 bg-gray-950/95 border border-purple-900/20 rounded">
                        <span className="text-pink-400 font-bold block mb-0.5">AGENT 3: PREDICTION</span>
                        <p className="text-gray-500 text-[9px] leading-snug">Generates mathematical escalation probabilities and localized impact models.</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-4 flex justify-center">
                    <div className="w-0.5 h-full bg-gradient-to-b from-pink-500 to-emerald-500"></div>
                  </div>

                  {/* Step 4: Output Synthesis */}
                  <div className="flex items-center gap-3 bg-gray-900/60 p-3 rounded-lg border border-gray-850 relative">
                    <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-800/40 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
                      03
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-200">PERSISTENT CACHE & BROADCAST</div>
                      <div className="text-[10px] text-gray-500">Writes verified incidents to local db.json. Syncs on the Map, Feed, and predictions hub.</div>
                    </div>
                    <span className="absolute right-3 top-3.5 text-[8px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900">
                      PERSISTENCE
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* Technical Highlights sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-purple-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>Technical System Highlights</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1 bg-gray-950/40 p-3 rounded-xl border border-gray-900">
                    <span className="font-mono text-cyan-400 font-bold block uppercase text-[10px]">1. Structured Output Verification</span>
                    <p className="text-gray-400 leading-relaxed">
                      Our system utilizes Gemini&apos;s strict JSON Schema configuration enforcing a uniform output structure. In addition, an independent server-side validation layer audits data typings prior to persistence.
                    </p>
                  </div>

                  <div className="space-y-1 bg-gray-950/40 p-3 rounded-xl border border-gray-900">
                    <span className="font-mono text-purple-400 font-bold block uppercase text-[10px]">2. Triple-Fault Tolerance Pipeline</span>
                    <p className="text-gray-400 leading-relaxed">
                      If the Google AI Studio endpoint is throttled, rate-limited, or encounters bad network frames, CivicLens automatically engages exponential backoff retries, falling back to a rule-based diagnostic parser if needed.
                    </p>
                  </div>

                  <div className="space-y-1 bg-gray-950/40 p-3 rounded-xl border border-gray-900">
                    <span className="font-mono text-pink-400 font-bold block uppercase text-[10px]">3. Geopromixity Cluster Consolidation</span>
                    <p className="text-gray-400 leading-relaxed">
                      Prevents municipal backlog congestion by running geodesic distance comparisons on coordinates to identify report clusters (within 1.5km), allowing instant community merge.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: HACKATHON CRITERIA ALIGNMENT */}
        {activeSubTab === "criteria" && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-gray-850 space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-sans font-extrabold text-lg text-white">
                  How CivicLens Satisfies Hackathon Judging Benchmarks
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="space-y-2.5 p-4 bg-gray-950/30 border border-gray-900 rounded-xl text-left">
                  <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-900 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-200">1. AI Innovation & Depth</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Rather than building a basic chatbot playground, CivicLens integrates Gemini as an **autonomous backend pipeline**. It orchestrates image ingestion, categorical routing, precision confidence ranking, and safety forecasts seamlessly without user prompting.
                  </p>
                </div>

                <div className="space-y-2.5 p-4 bg-gray-950/30 border border-gray-900 rounded-xl text-left">
                  <div className="w-8 h-8 rounded bg-purple-950 border border-purple-900 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-200">2. UI Craftsmanship & UX</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Adheres to a strict Swiss-Modern aesthetic. Implements glassmorphic overlays, responsive visual indicators, animated counters, interactive canvas maps, and comprehensive empty/loading/error state diagrams.
                  </p>
                </div>

                <div className="space-y-2.5 p-4 bg-gray-950/30 border border-gray-900 rounded-xl text-left">
                  <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-900 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-200">3. Real-World Utility & Impact</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Solves actual municipal workflow bottlenecks. Promotes community self-governance via upvoting, spatial duplicate report merging, and automated AI dispatch sheets matching active 311 guidelines.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PITCH DECK OUTLINE */}
        {activeSubTab === "pitch" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
            
            <div className="md:col-span-8 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-gray-850 space-y-6">
                <div className="border-b border-gray-900 pb-3 flex items-center justify-between">
                  <h3 className="font-sans font-extrabold text-lg text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <span>CivicLens Pitch Deck Framework</span>
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500">10 slide blueprint</span>
                </div>

                <div className="space-y-4">
                  {[
                    { slide: "Slide 1: Title", subtitle: "CivicLens - From Citizen Report to Municipal Resolution with AI", desc: "A clean minimalist title slide introducing the visual identity." },
                    { slide: "Slide 2: The Core Problem", subtitle: "Unstructured complaints create severe municipal processing backlog", desc: "Traditional 311 portals fail because photos lack cataloging, duplicate reports flood routers, and prioritization requires manual dispatcher inspection." },
                    { slide: "Slide 3: The Solution", subtitle: "AI-Mediated Urban Defense Infrastructure", desc: "An intelligent platform that uses multimodal vision to instantly profile hazards, establish priority cordons, forecast risks, and direct emergency dispatches." },
                    { slide: "Slide 4: Core Technology", subtitle: "Gemini 3.5 Flash & Multi-Agent Pipelines", desc: "Highlighting how we pipe uploads through specialized vision and classification models to generate a clean structured dispatch file." },
                    { slide: "Slide 5: Key Feature 1 - Intelligent Profiler", subtitle: "Live Multimodal Safety Assessment", desc: "Showcases vision diagnostics, severity categorization, and structural threat scoring." },
                    { slide: "Slide 6: Key Feature 2 - Spatial Proximity Clustered Merges", subtitle: "Halting backlog bloat before it enters routers", desc: "Visualizes the geofenced clustering that alerts citizens of existing nearby issues, letting them merge upvotes." },
                    { slide: "Slide 7: Key Feature 3 - Interactive Hazard Radar", subtitle: "Dynamic localized maps tracking grid vulnerabilities", desc: "Visualizing civic hotspots, severity filters, and real-time incident nodes." },
                    { slide: "Slide 8: Local Timeline & Area Cordon Records", subtitle: "AI Historical Maintenance Analytics", desc: "Aggregating soil density audits, pipeline inspections, and historical repairs near coordinates." },
                    { slide: "Slide 9: Target Market & Scaling Model", subtitle: "B2G SaaS Model for Modern Municipalities", desc: "SaaS licensing structure integrated directly into existing local governments, utility providers, and public safety teams." },
                    { slide: "Slide 10: The Team & Vision", subtitle: "Empowering cities with reactive, automated infrastructure", desc: "Closing with a bold message on proactive civic safety and smart urban ecosystems." }
                  ].map((sl, idx) => (
                    <div key={idx} className="p-3.5 bg-gray-950/60 border border-gray-900 rounded-xl space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-cyan-400 font-mono">0{idx + 1}</span>
                        <span className="text-gray-200">{sl.slide}</span>
                      </div>
                      <div className="text-xs text-purple-400 font-medium pl-6">{sl.subtitle}</div>
                      <p className="text-[11px] text-gray-400 leading-relaxed pl-6">{sl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-6">
              <div className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  <span>Presenter Pitch Tips</span>
                </h4>
                <ul className="space-y-3.5 text-xs text-gray-400 leading-relaxed list-disc pl-4 font-sans">
                  <li><strong>Start with a Hook:</strong> Mention how simple sinkholes can escalate into multimillion-dollar road structural failures if water line breaches aren&apos;t contained within 24 hours.</li>
                  <li><strong>Focus on Backlog reduction:</strong> Stress that CivicLens eliminates manual sorting labor for municipal dispatches, reducing intake overhead by up to 85%.</li>
                  <li><strong>Emphasize the Duplicate Consolidation:</strong> Explain that multiple upvotes combined onto 1 clustered ticket help councils allocate funding to high-priority zones much faster.</li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Presentation Script */}
        {activeSubTab === "script" && (
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 space-y-6 text-left">
            <div className="border-b border-gray-900 pb-3 flex items-center justify-between">
              <h3 className="font-sans font-extrabold text-lg text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <span>3-Minute Live Interactive Demo Script</span>
              </h3>
              <span className="text-[10px] font-mono text-gray-500">PRO LEVEL PRESENTATION TIMELINE</span>
            </div>

            <div className="space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-cyan-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>0:00 - 0:45 | INTRO & PROBLEM</span>
                </div>
                <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400">WHAT TO SHOW: <span className="text-gray-200">The Landing Page with Quick Stats</span></div>
                  <p className="text-xs text-gray-300 italic leading-relaxed font-sans">
                    &quot;Good afternoon judges. Over 60% of citizen-reported safety hazards get stuck in bureaucratic routing backlogs, sometimes taking weeks to reach the correct dispatch crew. Today, we present CivicLens — an AI-powered urban defense platform that converts standard citizen reports into actionable, auto-routed municipal emergency dispatches in seconds.&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-purple-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>0:45 - 1:45 | LOGGING & REAL-TIME MULTIMODAL ANALYSIS</span>
                </div>
                <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400">WHAT TO SHOW: <span className="text-gray-200">Report page and apply the &apos;Sinkhole&apos; Preset</span></div>
                  <p className="text-xs text-gray-300 italic leading-relaxed font-sans">
                    &quot;Let&apos;s log an emergency. By choosing our Sinkhole preset, we upload an image of a major asphalt cave-in. When we click &apos;Initiate Diagnostics&apos;, our Google Gemini 3.5 Flash vision pipeline kicks off. Instantly, the AI identifies the exact failure category, assigns a critical severity index, and details a localized risk assessment outlining undermining dangers.&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-pink-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>1:45 - 2:30 | DYNAMIC FEED, DUPES CLUSTERING, MAP VIEW</span>
                </div>
                <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400">WHAT TO SHOW: <span className="text-gray-200">The Citizen Feed & Interactive Radar Map</span></div>
                  <p className="text-xs text-gray-300 italic leading-relaxed font-sans">
                    &quot;Once confirmed, the issue populates our Interactive Radar Map. In the Detail View, you see our geoproximity duplicate scanning feature in action. It detected other reports within 1.5 kilometers of this issue, and allows citizens to immediately merge their votes to prevent backlog clutter. Down below, CivicLens shows a dynamically loaded smart dispatch matrix and local area records timeline.&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2:30 - 3:00 | WRAP-UP & BENCHMARKS</span>
                </div>
                <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400">WHAT TO SHOW: <span className="text-gray-200">Stats Cards on top of the dashboard</span></div>
                  <p className="text-xs text-gray-300 italic leading-relaxed font-sans">
                    &quot;CivicLens is robust, secure, completely fault-tolerant, and scales-to-zero in production. We are empowering cities to respond to crises with computational precision. Thank you, and we welcome any questions.&quot;
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
