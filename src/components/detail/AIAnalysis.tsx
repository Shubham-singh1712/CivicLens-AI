import React, { useState } from "react";
import { 
  Eye, 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Activity, 
  ShieldAlert,
  BarChart3,
  Users
} from "lucide-react";
import { CivicIssue } from "../../types";
import AgentThinkingTerminal from "./AgentThinkingTerminal";
import SmartNearbyMap from "./SmartNearbyMap";
import AIResolutionSimulator from "./AIResolutionSimulator";
import MunicipalDispatchTicket from "./MunicipalDispatchTicket";

interface AIAnalysisProps {
  issue: CivicIssue;
  allIssues?: CivicIssue[];
}

export default function AIAnalysis({ issue, allIssues = [] }: AIAnalysisProps) {
  const analysis = issue.analysis;
  
  if (!analysis) {
    return (
      <div id={`ai-analysis-${issue.id}`} className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gray-950/20 text-center space-y-3 animate-pulse">
        <Cpu className="w-8 h-8 text-gray-500 mx-auto animate-spin" />
        <div className="space-y-1">
          <p className="text-sm font-bold font-mono text-white">AI Diagnostics Pending</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            The neural diagnostic pipeline has not computed the threat indices for this report yet.
          </p>
        </div>
      </div>
    );
  }

  const confidence = analysis.vision.confidence;
  const escalationProbability = analysis.prediction?.escalationProbability ?? 45;
  const urgencyScore = analysis.prediction?.urgencyScore ?? 75;

  // Confidence Dash visual offsets for circular gauges
  const confidenceOffset = 251.2 - (251.2 * confidence) / 100;
  const urgencyOffset = 251.2 - (251.2 * urgencyScore) / 100;

  return (
    <div id={`ai-analysis-${issue.id}`} className="space-y-8">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
        <Cpu className="w-5 h-5 text-cyan-400" />
        <h3 className="font-display font-black text-lg text-white tracking-tight">
          Active Threat & Cascade Diagnostic
        </h3>
      </div>

      {/* 1. AI CONFIDENCE DASHBOARD (Circular SVG radial gauges) */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/30">
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-4 text-left">
          AI Confidence & Priority Dashboard
        </span>
        
        <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
          {/* Gauge 1: Vision Confidence */}
          <div className="flex items-center gap-4 text-left">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" className="stroke-gray-900 fill-none" strokeWidth="6" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="32" 
                  className="stroke-cyan-500 fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="6" 
                  strokeDasharray="201" 
                  strokeDashoffset={201 - (201 * confidence) / 100} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs font-black text-white">{confidence}%</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-wide">
                Vision Confidence
              </span>
              <p className="text-xs text-gray-300 leading-normal max-w-[180px] mt-0.5">
                Calculated certainty index of matching localized wear patterns and categorizations.
              </p>
            </div>
          </div>

          {/* Gauge 2: Severity Score */}
          <div className="flex items-center gap-4 text-left">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" className="stroke-gray-900 fill-none" strokeWidth="6" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="32" 
                  className="stroke-purple-500 fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="6" 
                  strokeDasharray="201" 
                  strokeDashoffset={201 - (201 * urgencyScore) / 100} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs font-black text-white">{urgencyScore}%</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-mono font-extrabold text-purple-400 uppercase tracking-wide">
                Urgency Coefficient
              </span>
              <p className="text-xs text-gray-300 leading-normal max-w-[180px] mt-0.5">
                Aggregated hazard risk metric factoring structural safety, community density & local reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY DIAGNOSTICS BENTO PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Multimodal Neural Inspection */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/30 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Eye className="w-4 h-4" />
              <span className="font-mono text-xs font-bold tracking-wider">01. COMPUTER VISION</span>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Neural Category Designation</span>
              <p className="font-bold text-gray-200 mt-0.5">{analysis.vision.category}</p>
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Diagnostics Summary</span>
              <p className="text-gray-300 leading-relaxed mt-0.5 italic bg-gray-950/40 p-3 rounded-lg border border-gray-900/50">
                "{analysis.vision.summary}"
              </p>
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Identified Hazard Risks</span>
              <p className="text-gray-400 leading-relaxed mt-0.5">{analysis.vision.riskAssessment}</p>
            </div>
          </div>
        </div>

        {/* Cascade Threat Predictor */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/30 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="font-mono text-xs font-bold tracking-wider">02. DYNAMIC CASCADE PREDICTOR</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Risk Index Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">48h Escalation Risk Index</span>
                <span className={`font-mono font-extrabold text-sm ${
                  escalationProbability >= 80 ? "text-red-400" : escalationProbability >= 50 ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {escalationProbability}% RISK
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-full bg-gray-950 rounded-full h-2.5 overflow-hidden border border-gray-900">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      escalationProbability >= 80 
                        ? "bg-gradient-to-r from-red-600 to-rose-500" 
                        : escalationProbability >= 50 
                        ? "bg-gradient-to-r from-amber-500 to-orange-400" 
                        : "bg-gradient-to-r from-emerald-500 to-green-400"
                    }`}
                    style={{ width: `${escalationProbability}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Cascade Impact Forecast</span>
              <p className="text-gray-300 leading-relaxed mt-0.5 bg-gray-950/40 p-3 rounded-lg border border-gray-900/50">
                {analysis.prediction?.impactForecast || "No escalation forecast computed."}
              </p>
            </div>

            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Suggested Preventive Cordon</span>
              <p className="text-gray-400 leading-relaxed mt-0.5">
                {analysis.prediction?.suggestedPreventiveAction || "No preventive actions computed."}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. AI RESOLUTION TIMELINE (Estimated resolution journey) */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/30 text-left space-y-4">
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
          AI Resolution Timeline & Roadmap
        </span>

        <div className="relative pt-2 pb-1">
          <div className="absolute top-[26px] left-[15px] right-[15px] h-[2px] bg-gray-900 z-0 hidden md:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {[
              { title: "Neural Profiling", est: "Instant Completed", desc: "Automated issue parsing, visual validation, and threat vector indexing." },
              { title: "Routing & Dispatch", est: "Within 4 Hours", desc: "Auto SLA routing to responsible municipal operations bureau." },
              { title: "Site Crew Mobilized", est: "24-48 Hours", desc: "Service crew dispatched to address structural elements & lay cordons." },
              { title: "SLA Re-Verification", est: "3-5 Days Plan", desc: "Site clearing, local verification, and final compliance sign-off." }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-3 md:block">
                <div className="flex flex-col items-center md:items-start shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono text-xs font-black ${
                    idx === 0 
                      ? "bg-cyan-950 text-cyan-400 border-cyan-800/60" 
                      : idx === 1 
                      ? "bg-purple-950 text-purple-400 border-purple-800/60"
                      : "bg-gray-950 text-gray-600 border-gray-900"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="w-[1px] h-full bg-gray-900 md:hidden mt-2"></div>
                </div>

                <div className="md:mt-3 text-left space-y-1">
                  <span className="block font-bold text-xs text-white leading-tight">
                    {step.title}
                  </span>
                  <span className="block text-[9px] font-mono text-gray-500 uppercase font-black">
                    {step.est}
                  </span>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SMART NEARBY MAP (GIS Tactical Map overlays) */}
      <SmartNearbyMap issue={issue} allIssues={allIssues} />

      {/* 5. MULTI-AGENT THINKING TERMINAL (Execution console) */}
      <AgentThinkingTerminal issue={issue} />

      {/* 6. AI RESOLUTION SIMULATOR (Operational sandbox) */}
      <AIResolutionSimulator issue={issue} />

      {/* 7. MUNICIPAL DISPATCH TICKET GENERATOR */}
      <MunicipalDispatchTicket issue={issue} />

      {/* 8. COMMUNITY INTELLIGENCE PANEL (Gemini / fallback area statistics) */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/30 text-left space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span className="font-display font-bold text-sm text-white">
            Community Intelligence Telemetry Panel
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-3.5 rounded-xl border border-gray-900 bg-black/20 space-y-1">
            <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase">
              Consensus Density
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-xl text-white">4.8x</span>
              <span className="text-[10px] font-mono text-gray-500">above avg</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              Higher neighborhood reports stream validates acute safety urgency index.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-900 bg-black/20 space-y-1">
            <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase">
              Cordon Alert Rating
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-xl text-amber-400">Class II</span>
              <span className="text-[10px] font-mono text-gray-500">Medium Danger</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              Safe bypass pathway cordons deployed to prevent direct motorist tire blowouts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-900 bg-black/20 space-y-1">
            <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase">
              Civic Sentiment Coefficient
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-xl text-emerald-400">92% Positive</span>
              <span className="text-[10px] font-mono text-gray-500">efficiency rate</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              Community feedback logs approve automated profiling and routing speeds.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
