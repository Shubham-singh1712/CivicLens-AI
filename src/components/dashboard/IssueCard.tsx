import React from "react";
import { MapPin, Calendar, ThumbsUp, CheckCircle, ShieldAlert, Cpu, Eye, ArrowRight } from "lucide-react";
import { CivicIssue } from "../../types";
import PriorityBadge from "./PriorityBadge";
import VerificationWidget from "./VerificationWidget";
import { IssueImage } from "../common/IssueImage";

interface IssueCardProps {
  key?: string;
  issue: CivicIssue;
  onSelect: (issue: CivicIssue) => void;
  onVerify: (id: string) => Promise<void>;
  onNotAccurate: (id: string) => Promise<void>;
}

export default function IssueCard({ issue, onSelect, onVerify, onNotAccurate }: IssueCardProps) {
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "reported":
        return "text-red-400 border-red-950 bg-red-950/20";
      case "under_review":
        return "text-blue-400 border-blue-950 bg-blue-950/20";
      case "scheduled":
        return "text-purple-400 border-purple-950 bg-purple-950/20";
      case "in_progress":
        return "text-amber-400 border-amber-950 bg-amber-950/20";
      case "resolved":
        return "text-emerald-400 border-emerald-950 bg-emerald-950/20";
      default:
        return "text-gray-400 border-gray-900 bg-gray-950/20";
    }
  };

  // Estimate a priority score out of 100 for high-tech look
  const getPriorityScore = (severity: string, confidence: number) => {
    let base = 50;
    if (severity === "Critical") base = 90;
    else if (severity === "High") base = 75;
    else if (severity === "Medium") base = 60;
    else base = 40;

    // Adjust slightly with confidence
    return Math.min(99, Math.round(base + (confidence / 20)));
  };

  const priorityScore = getPriorityScore(
    issue.analysis?.vision?.severity || "Medium",
    issue.analysis?.vision?.confidence || 85
  );

  return (
    <div 
      id={`issue-card-${issue.id}`}
      onClick={() => onSelect(issue)}
      className="glass-panel rounded-2xl border border-gray-850 bg-gray-950/20 overflow-hidden hover:border-gray-750 hover:bg-gray-950/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-cyan-950/5 text-left"
    >
      {/* Visual Header / Image container */}
      <div className="relative h-44 shrink-0 bg-gray-900 overflow-hidden">
        <IssueImage 
          src={issue.imageUrl} 
          alt={issue.title} 
          title={issue.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/40"></div>
        
        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 bg-gray-950/80 backdrop-blur border border-gray-850 rounded-lg text-[9px] font-mono text-cyan-400">
            {issue.category.toUpperCase()}
          </span>
          <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-mono font-bold tracking-wider ${getStatusBadgeClass(issue.status)}`}>
            {getStatusLabel(issue.status).toUpperCase()}
          </span>
        </div>

        {/* Priority Score circular visual overlay */}
        <div className="absolute bottom-3 left-3 bg-gray-950/90 backdrop-blur border border-gray-850 rounded-lg px-2.5 py-1 text-[10px] font-mono text-gray-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          <span>AI PRIORITY: {priorityScore}/100</span>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="p-5 flex-grow space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-gray-500">
              LOGGED: {new Date(issue.createdAt).toLocaleString(undefined, { dateStyle: 'short' })}
            </span>
            <PriorityBadge priority={issue.analysis?.vision?.severity || "Medium"} />
          </div>
          <h4 className="font-display font-extrabold text-base text-white tracking-tight leading-snug line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {issue.title}
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
            {issue.description}
          </p>
        </div>

        {/* Location Row */}
        <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] bg-gray-950/40 p-2.5 rounded-lg border border-gray-900">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{issue.address}</span>
        </div>

        {/* Neural Analysis quick highlight */}
        {issue.analysis?.vision && (
          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono pt-1.5 border-t border-gray-900/60">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Eye className="w-3.5 h-3.5 text-cyan-500" />
              <span>Conf: <strong className="text-white">{issue.analysis.vision.confidence}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Escalation: <strong className="text-white">{issue.analysis.prediction?.escalationProbability || 0}%</strong></span>
            </div>
          </div>
        )}

        {/* Community audit widget inside the card! */}
        <div className="pt-3 border-t border-gray-900/60">
          <VerificationWidget 
            issue={issue}
            onVerify={onVerify}
            onNotAccurate={onNotAccurate}
          />
        </div>
      </div>

      {/* Action footer */}
      <div className="px-5 py-3.5 bg-gray-950/40 border-t border-gray-900/60 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-white transition-colors">
        <span>VIEW DETAILS & FORECASTS</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400 group-hover:text-white" />
      </div>
    </div>
  );
}
