import React from "react";
import { Eye, ShieldAlert, Cpu, CheckCircle, TrendingUp, Sparkles, MapPin, ExternalLink } from "lucide-react";
import { VisionAnalysisResult } from "../../services/gemini";

interface AnalysisCardProps {
  analysis: VisionAnalysisResult;
  onProceed: () => void;
  onReset: () => void;
}

export default function AnalysisCard({ analysis, onProceed, onReset }: AnalysisCardProps) {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-950/60 text-red-400 border-red-900";
      case "High":
        return "bg-amber-950/60 text-amber-400 border-amber-900";
      case "Medium":
        return "bg-cyan-950/60 text-cyan-400 border-cyan-900";
      case "Low":
      default:
        return "bg-gray-950/60 text-gray-400 border-gray-800";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Immediate":
        return "bg-red-900 text-red-100";
      case "High":
        return "bg-amber-900 text-amber-100";
      case "Medium":
        return "bg-cyan-900 text-cyan-100";
      case "Low":
      default:
        return "bg-gray-800 text-gray-200";
    }
  };

  return (
    <div id="vision-analysis-results-card" className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-gray-900 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="font-display font-bold text-base text-white tracking-tight">
            Gemini Vision Diagnostic Assessment
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-400 border border-cyan-900 px-2.5 py-0.5 rounded-full">
          DIAGNOSTIC STAGE SECURED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Core Profile */}
        <div className="glass-panel p-5 rounded-xl border border-gray-850 bg-gray-950/20 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 border-b border-gray-900 pb-2">
            <Eye className="w-4 h-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">01. Visual Categorization</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase">Detected Issue Type</span>
              <p className="text-sm font-bold text-white mt-0.5">{analysis.issueType}</p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-gray-500 font-mono text-[10px] uppercase block">Analysis Confidence</span>
                <span className="text-sm font-extrabold text-cyan-400">{analysis.confidenceScore}%</span>
              </div>
              <div>
                <span className="text-gray-500 font-mono text-[10px] uppercase block">Severity Profile</span>
                <span className={`inline-block px-2.5 py-0.5 mt-0.5 font-mono text-[11px] rounded-full border ${getSeverityStyle(analysis.severity)}`}>
                  {analysis.severity.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase">Vision Summary</span>
              <p className="text-gray-300 mt-0.5 italic leading-relaxed">"{analysis.description}"</p>
            </div>
          </div>
        </div>

        {/* Safety & Action Card */}
        <div className="glass-panel p-5 rounded-xl border border-gray-850 bg-gray-950/20 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 border-b border-gray-900 pb-2">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">02. Safety Risk Assessment</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Urgency Dispatch</span>
              <span className={`inline-block px-2.5 py-0.5 mt-1 font-mono text-[11px] font-bold rounded-full ${getPriorityStyle(analysis.priority)}`}>
                {analysis.priority.toUpperCase()} PRIORITY
              </span>
            </div>

            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase block">Immediate Hazards</span>
              <p className="text-red-300/95 font-semibold mt-0.5 leading-relaxed bg-red-950/20 border border-red-950/60 p-2.5 rounded-lg">
                {analysis.safetyRisk}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Dispatch & Action Plan */}
      <div className="glass-panel p-5 rounded-xl border border-gray-800 bg-gray-950/10 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-900 pb-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Cpu className="w-4 h-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">03. Automated Municipal Coordination Recommendations</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-gray-950/40 rounded-lg border border-gray-900">
            <span className="text-gray-500 font-mono text-[9px] uppercase block">Recommended Department</span>
            <p className="text-gray-200 mt-1 font-bold">Bureau of {analysis.issueType}</p>
          </div>
          <div className="p-3 bg-gray-950/40 rounded-lg border border-gray-900">
            <span className="text-gray-500 font-mono text-[9px] uppercase block">Estimated Resolution Time</span>
            <p className="text-cyan-400 mt-1 font-bold">
              {analysis.priority === "Immediate" ? "4 - 12 Hours" : analysis.priority === "High" ? "24 - 48 Hours" : "3 - 5 Days"}
            </p>
          </div>
          <div className="p-3 bg-gray-950/40 rounded-lg border border-gray-900">
            <span className="text-gray-500 font-mono text-[9px] uppercase block">Recommended Cordon</span>
            <p className="text-gray-300 mt-1">Erect visual/protective caution tape & sign advisory notes.</p>
          </div>
        </div>
      </div>

      {/* Proceed controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-900/60">
        <p className="text-[11px] text-gray-500 font-mono max-w-md">
          Confirming these assessment metrics will publish this ticket instantly to the community safety feed and alert regional dispatch.
        </p>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 rounded-xl text-xs font-mono transition-all cursor-pointer text-center"
          >
            DISCARD & RETAKE
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-bold tracking-wider shadow-lg shadow-cyan-950/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>CONFIRM & SUBMIT ISSUE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
