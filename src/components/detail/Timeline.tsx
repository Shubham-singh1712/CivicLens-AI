import React from "react";
import { Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { CivicIssue } from "../../types";

interface TimelineProps {
  issue: CivicIssue;
}

export default function Timeline({ issue }: TimelineProps) {
  const currentStatus = issue.status;

  // Visual stages corresponding to: Reported -> AI Analysis -> Community Verification -> Assigned Authority -> In Progress -> Resolved
  const STAGES = [
    { key: "reported", label: "Reported" },
    { key: "under_review", label: "AI Analysis" },
    { key: "verified", label: "Community Audit" },
    { key: "scheduled", label: "Assigned Authority" },
    { key: "in_progress", label: "In Progress" },
    { key: "resolved", label: "Resolved" }
  ];

  // Helper to find the current active visual index
  const getCurrentStageIndex = () => {
    if (currentStatus === "resolved") return 5;
    if (currentStatus === "in_progress") return 4;
    if (currentStatus === "scheduled") return 3;
    
    // Community Verification is "verified" if total verified count > 0, otherwise standard "under_review" handles it
    const hasVerification = (issue.verifiedByCount || 0) > 0;
    
    if (currentStatus === "under_review") {
      return hasVerification ? 2 : 1;
    }
    
    return 0; // Default to reported
  };

  const activeIndex = getCurrentStageIndex();

  return (
    <div id={`timeline-container-${issue.id}`} className="space-y-6 text-left">
      <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
        <Calendar className="w-5 h-5 text-cyan-400" />
        <h3 className="font-display font-bold text-lg text-white">
          Incident Timeline & Audit Logs
        </h3>
      </div>

      {/* Visual horizontal pipeline stages */}
      <div className="bg-gray-950/20 border border-gray-900 p-5 rounded-2xl">
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-4 block">
          AI-MANAGED LIFECYCLE TRACKER
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isFuture = idx > activeIndex;

            return (
              <div key={stage.key} className="space-y-2">
                <div className={`h-1 rounded-full transition-all duration-300 ${
                  isCurrent 
                    ? "bg-cyan-500 animate-pulse" 
                    : isCompleted 
                    ? "bg-purple-600" 
                    : "bg-gray-900"
                }`}></div>
                <div className="flex flex-col">
                  <span className={`font-mono text-[10px] font-bold ${
                    isCurrent ? "text-cyan-400" : isCompleted ? "text-purple-400" : "text-gray-600"
                  }`}>
                    STAGE 0{idx + 1}
                  </span>
                  <span className={`text-xs font-semibold ${
                    isCurrent ? "text-white" : isCompleted ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {stage.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical detailed logs list */}
      <div className="space-y-4 pl-4 relative border-l border-gray-800">
        {issue.timeline.map((event, idx) => {
          const isLatest = idx === issue.timeline.length - 1;
          return (
            <div key={idx} className="relative pl-6 space-y-1 group">
              {/* Timeline pin */}
              <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-gray-950 transition-colors ${
                isLatest ? "bg-cyan-400 ring-4 ring-cyan-950/50 scale-110 animate-pulse" : "bg-purple-600"
              }`}></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono">
                <span className={`font-extrabold tracking-wider uppercase ${
                  isLatest ? "text-cyan-400" : "text-purple-400"
                }`}>
                  {event.status.replace('_', ' ')}
                </span>
                <span className="text-gray-500">
                  {new Date(event.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                {event.note}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
