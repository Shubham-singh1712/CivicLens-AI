import React from "react";
import { ArrowLeft, MapPin, Calendar, ShieldAlert } from "lucide-react";
import { CivicIssue } from "../../types";

interface IssueHeaderProps {
  issue: CivicIssue;
  onBack: () => void;
}

export default function IssueHeader({ issue, onBack }: IssueHeaderProps) {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-950/60 text-red-400 border-red-900/60";
      case "High":
        return "bg-amber-950/60 text-amber-400 border-amber-900/60";
      case "Medium":
        return "bg-cyan-950/60 text-cyan-400 border-cyan-900/60";
      case "Low":
      default:
        return "bg-gray-950/60 text-gray-400 border-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "reported":
        return "New Alert";
      case "under_review":
        return "Under Review";
      case "scheduled":
        return "Scheduled";
      case "in_progress":
        return "Active Repair";
      case "resolved":
        return "Mitigated";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "text-red-400 border-red-900/40 bg-red-950/20";
      case "under_review":
        return "text-blue-400 border-blue-900/40 bg-blue-950/20";
      case "scheduled":
        return "text-purple-400 border-purple-900/40 bg-purple-950/20";
      case "in_progress":
        return "text-amber-400 border-amber-900/40 bg-amber-950/20";
      case "resolved":
        return "text-emerald-400 border-emerald-900/40 bg-emerald-950/20";
      default:
        return "text-gray-400 border-gray-850 bg-gray-950/10";
    }
  };

  // Check if severity is dynamically elevated by verification count or disputes
  // Smart Feature: "If issue severity changes: Update badge automatically"
  // Let's do a smart calculation: if disputes are high, or if verification count is high (e.g. > 20), elevate or adapt
  const getCalculatedSeverity = (originalSev: string, votes: number, disputes: number) => {
    if (disputes > 5) return "Low"; // Disputed reports get downgraded
    if (votes > 15 && originalSev === "Medium") return "High";
    if (votes > 30 && originalSev === "High") return "Critical";
    return originalSev;
  };

  const currentSeverity = getCalculatedSeverity(
    issue.analysis?.vision?.severity || "Medium",
    issue.verifiedByCount || 0,
    issue.notAccurateCount || 0
  );

  return (
    <div id={`issue-header-${issue.id}`} className="space-y-4">
      {/* Back & Status row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO COMMUNITY FEED</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 font-mono">INCIDENT NO: {issue.id.toUpperCase()}</span>
          <span className={`text-[11px] font-mono border px-3 py-1 rounded-full ${getStatusColor(issue.status)}`}>
            {getStatusLabel(issue.status).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Title Metadata block */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-950/30 border border-cyan-900/40 px-3 py-1 rounded-full">
            {issue.category.toUpperCase()}
          </span>
          <span className={`text-[10px] font-mono font-bold tracking-wider border px-3 py-1 rounded-full flex items-center gap-1.5 ${getSeverityStyle(currentSeverity)}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SEVERITY: {currentSeverity.toUpperCase()}</span>
          </span>
          {currentSeverity !== (issue.analysis?.vision?.severity || "Medium") && (
            <span className="text-[9px] font-mono text-purple-400 bg-purple-950/30 border border-purple-900/40 px-2 py-0.5 rounded animate-pulse">
              DYNAMICALLY ADJUSTED BY COMMUNITY AUDITING
            </span>
          )}
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
          {issue.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px] text-gray-400 pt-1">
          <div className="flex items-center gap-2.5 bg-gray-950/40 p-3 rounded-xl border border-gray-900">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-gray-500 uppercase text-[8px] tracking-wider block">Incident Location</span>
              <span className="text-gray-200 mt-0.5 block font-semibold truncate">{issue.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-gray-950/40 p-3 rounded-xl border border-gray-900">
            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-gray-500 uppercase text-[8px] tracking-wider block">Reported Timestamp</span>
              <span className="text-gray-200 mt-0.5 block font-semibold">
                {new Date(issue.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
