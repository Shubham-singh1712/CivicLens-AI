import React from "react";
import { ArrowRight, ShieldAlert, Sparkles, TrendingUp, Cpu, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import { CivicIssue } from "../types";
import { IssueImage } from "./common/IssueImage";

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  recentIssues: CivicIssue[];
  setSelectedIssue: (issue: CivicIssue) => void;
}

export default function LandingPage({ setActiveTab, recentIssues, setSelectedIssue }: LandingPageProps) {
  return (
    <div id="landing-page" className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 flex flex-col gap-20">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero text */}
          <div className="flex-1 flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-800/50 rounded-full text-xs text-cyan-400 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smarter Municipalities. Faster Resolution.</span>
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-white">
              Civic Reporting <br />
              <span className="text-gradient">Redefined by AI</span>
            </h2>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Traditional city portals just collect complaints. <strong className="text-white">CivicLens AI</strong> dispatches an autonomous agentic pipeline to understand hazardous sights, write structured complaints, allocate priority, and predict failure escalations before they happen.
            </p>

            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("report")}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
              >
                <span>Report Local Hazard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-gray-200 hover:text-white border border-gray-800 rounded-xl transition-all duration-300 w-full sm:w-auto"
              >
                <span>Explore Live Feed</span>
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-900 w-full font-mono">
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">94%</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Vision Acc.</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400 tracking-tight">&lt; 15m</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Mobilization</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 tracking-tight">100%</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Transparent</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Block */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-2xl relative">
              {/* Pulse scanline effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse shadow-glow"></div>
              
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-mono text-gray-400">ACTIVE AI DISPATCH MONITOR</span>
                </div>
                <span className="text-[10px] bg-red-950/50 text-red-400 border border-red-900/60 px-2 py-0.5 rounded font-mono">CRITICAL CRISIS</span>
              </div>

              {/* Sample analyzed issue snapshot */}
              <div className="space-y-4">
                <IssueImage 
                  src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80" 
                  alt="Civic Hazard Sample" 
                  title="Main Street Flooding Event"
                  className="w-full h-44 object-cover rounded-xl border border-gray-800"
                />
                
                <div>
                  <h4 className="font-display font-bold text-gray-200">Main Street Flooding Event</h4>
                  <p className="text-xs text-gray-400 mt-1">742 Elm Street, Ward 4</p>
                </div>

                {/* Micro-steps mapping agent pipeline */}
                <div className="grid grid-cols-1 gap-2.5 bg-gray-950/70 p-3.5 rounded-xl border border-gray-900 font-mono text-[11px]">
                  <div className="flex items-start gap-2 text-cyan-400">
                    <span className="text-xs font-bold">[1]</span>
                    <span><strong>Vision Agent:</strong> Verified Water main fracture, Severity: Critical, Confidence: 96%</span>
                  </div>
                  <div className="flex items-start gap-2 text-purple-400">
                    <span className="text-xs font-bold">[2]</span>
                    <span><strong>Resolution:</strong> Routed to Public Works. Estimated Repair: 12 Hours</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-400">
                    <span className="text-xs font-bold">[3]</span>
                    <span><strong>Prediction:</strong> Escalation Risk: 92% (Asphalt sinkhole collapse forecasted)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORE AI AGENT SHOWCASE */}
        <div className="flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              The Three Pillars of Civic Intelligence
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Three specialized Google Gemini neural nodes coordinate sequentially to transform a raw user photo into complete emergency coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Agent 1 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 text-left border border-gray-800 hover:border-cyan-500/30 transition-all duration-300">
              <div className="p-3 bg-cyan-950/50 border border-cyan-800/40 rounded-xl text-cyan-400 self-start">
                <Eye className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Node 01 — Multimodal</div>
                <h4 className="font-display font-bold text-lg text-white">Vision Agent</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Scans reported photos and videos instantly using Gemini. Pinpoints specific civic failure details, isolates material damage, and maps overall visual severity indicators.
              </p>
              <ul className="space-y-2 mt-auto pt-4 border-t border-gray-900 font-mono text-[11px] text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-cyan-400" /> Category Classification</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-cyan-400" /> Material Hazard Extraction</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-cyan-400" /> Severity Index Rating</li>
              </ul>
            </div>

            {/* Agent 2 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 text-left border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
              <div className="p-3 bg-purple-950/50 border border-purple-800/40 rounded-xl text-purple-400 self-start">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Node 02 — Logistics</div>
                <h4 className="font-display font-bold text-lg text-white">Resolution Agent</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Transforms unstructured citizen complaints into formal municipal work orders. Assigns priority matrix tags and identifies the exact public authority.
              </p>
              <ul className="space-y-2 mt-auto pt-4 border-t border-gray-900 font-mono text-[11px] text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Authority Mapping</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Priority Allocation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Timeline Calibration</li>
              </ul>
            </div>

            {/* Agent 3 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 text-left border border-gray-800 hover:border-emerald-500/30 transition-all duration-300">
              <div className="p-3 bg-emerald-950/50 border border-emerald-800/40 rounded-xl text-emerald-400 self-start">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Node 03 — Predictive</div>
                <h4 className="font-display font-bold text-lg text-white">Prediction Agent</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Calculates the physical risk cascade. Evaluates water erosion, electrical failures, and structural fatigue to warn operators of the financial and public cost of inaction.
              </p>
              <ul className="space-y-2 mt-auto pt-4 border-t border-gray-900 font-mono text-[11px] text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Escalation Probability</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cascade Consequence Mapping</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Preventative Advice</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RECENT INCIDENTS FEED ACCORDION / HIGHLIGHTS */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="font-display font-bold text-2xl text-white">Active Hazards Needing Attention</h3>
              <p className="text-xs text-gray-400 mt-1">Verified community issues being monitored in real time</p>
            </div>
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>View Community Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentIssues.slice(0, 3).map((issue) => (
              <div 
                key={issue.id}
                onClick={() => {
                  setSelectedIssue(issue);
                  setActiveTab("detail");
                }}
                className="glass-panel glass-panel-hover p-4 rounded-xl cursor-pointer flex flex-col gap-4 text-left border border-gray-800 group"
              >
                <div className="relative">
                  <IssueImage 
                    src={issue.imageUrl} 
                    alt={issue.title} 
                    title={issue.title}
                    className="w-full h-36 object-cover rounded-lg border border-gray-900 group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <span className={`absolute top-2 right-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    issue.analysis?.vision?.severity === "Critical"
                      ? "bg-red-950/80 text-red-400 border-red-900/60"
                      : issue.analysis?.vision?.severity === "High"
                      ? "bg-amber-950/80 text-amber-400 border-amber-900/60"
                      : "bg-cyan-950/80 text-cyan-400 border-cyan-900/60"
                  }`}>
                    {issue.analysis?.vision?.severity || "MEDIUM"}
                  </span>
                </div>

                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 border border-cyan-900/40 rounded-full">
                    {issue.category}
                  </span>
                  <h4 className="font-display font-bold text-sm text-gray-100 line-clamp-1 group-hover:text-cyan-300 transition-colors pt-1">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-900 font-mono text-[10px] text-gray-400">
                  <span className="truncate max-w-[150px]">{issue.address}</span>
                  <span className="text-cyan-400 bg-cyan-950/20 px-1.5 py-0.5 rounded border border-cyan-950 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {issue.analysis?.prediction?.escalationProbability || 75}% Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
