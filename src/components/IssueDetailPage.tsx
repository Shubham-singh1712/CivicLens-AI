import React, { useState } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  User, 
  Compass, 
  CheckCircle2, 
  MessageSquare, 
  Camera, 
  Plus, 
  UploadCloud, 
  Heart, 
  XCircle, 
  ChevronRight, 
  Sparkles, 
  Activity,
  GitPullRequest
} from "lucide-react";
import { CivicIssue } from "../types";
import Comments from "./detail/Comments";
import NearbyIssues from "./detail/NearbyIssues";
import IssueGallery from "./detail/IssueGallery";

interface IssueDetailPageProps {
  issue: CivicIssue;
  allIssues: CivicIssue[];
  onBack: () => void;
  onUpvote: (id: string) => Promise<void>;
  onVerify: (id: string) => Promise<void>;
  onNotAccurate: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, nextStatus: string) => Promise<void>;
  onAddComment: (author: string, text: string) => Promise<void>;
  onAddImage: (imageUrl: string) => Promise<void>;
  onSelectIssue?: (issue: CivicIssue) => void;
  setActiveTab?: (tab: string) => void;
}

export default function IssueDetailPage({
  issue,
  allIssues,
  onBack,
  onVerify,
  onNotAccurate,
  onAddComment,
  onAddImage,
  onSelectIssue,
  setActiveTab
}: IssueDetailPageProps) {
  const [successMsg, setSuccessMsg] = useState("");

  const formattedDate = new Date(issue.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-950/50 text-red-400 border-red-900/60";
      case "High":
        return "bg-amber-950/50 text-amber-400 border-amber-900/60";
      case "Medium":
        return "bg-cyan-950/50 text-cyan-400 border-cyan-900/60";
      case "Low":
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "reported":
        return "New Report";
      case "under_review":
        return "Under Review";
      case "scheduled":
        return "Scheduled";
      case "in_progress":
        return "Active Work";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "text-red-400 bg-red-950/30 border-red-900/50";
      case "under_review":
        return "text-blue-400 bg-blue-950/30 border-blue-900/50";
      case "scheduled":
        return "text-purple-400 bg-purple-950/30 border-purple-900/50";
      case "in_progress":
        return "text-amber-400 bg-amber-950/30 border-amber-900/50";
      case "resolved":
        return "text-emerald-400 bg-emerald-950/30 border-emerald-900/50";
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-800";
    }
  };

  const hasAIAnalysis = issue.analysis?.vision?.confidence;
  const isCommunityVerified = (issue.verifiedByCount || 0) >= 3;

  // Authorities updates parsed from the issue timeline
  const authorityUpdates = issue.timeline.filter(
    e => ["scheduled", "in_progress", "resolved"].includes(e.status)
  );

  return (
    <div id="issue-detail-page" className="max-w-6xl mx-auto px-6 py-8 space-y-8 relative text-left">
      
      {/* BACKGROUND GRAPHIC GRADIENTS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-950/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-950/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* BACK NAVIGATION BAR */}
      <div className="flex items-center justify-between border-b border-gray-900 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO CITIZEN FEED</span>
        </button>

        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Report ID: #{issue.id.slice(0, 8).toUpperCase()}
        </span>
      </div>

      {/* HEADER SECTION */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-900/60 px-3 py-1 rounded-full uppercase">
            {issue.category}
          </span>
          
          <span className={`text-[10px] font-mono font-bold tracking-wider border px-3 py-1 rounded-full uppercase flex items-center gap-1.5 ${getSeverityStyle(issue.analysis?.vision?.severity || "Medium")}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{issue.analysis?.vision?.severity || "Medium"} Priority</span>
          </span>

          {hasAIAnalysis && (
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-900/50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>AI Verified ({issue.analysis?.vision?.confidence}% match)</span>
            </span>
          )}

          {isCommunityVerified && (
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Community Confirmed</span>
            </span>
          )}
        </div>

        <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
          {issue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] text-gray-400 pt-1">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span>Reporter: <strong className="text-gray-300">Anonymous Resident</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>Logged: <strong className="text-gray-300">{formattedDate}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>Location: <strong className="text-gray-300">{issue.address}</strong></span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN REDESIGNED CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Visual Media Gallery, Description, Comments (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cover Media & Gallery Component */}
          <div className="space-y-4">
            <IssueGallery issue={issue} onAddImage={onAddImage} />
          </div>

          {/* Description Block */}
          <div className="p-6 rounded-2xl border border-gray-900 bg-gray-950/30 space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              Incident Description
            </span>
            <p className="text-sm text-gray-200 leading-relaxed font-sans">
              {issue.description}
            </p>

            {/* Smart assistance badge if present */}
            {issue.analysis?.vision?.summary && (
              <div className="pt-3.5 border-t border-gray-900/50 flex gap-3 items-start text-xs text-gray-400">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">AI Generated Briefing Note:</span>
                  <p className="italic">"{issue.analysis.vision.summary}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Citizen Testimonies & Comments Box */}
          <div className="p-6 rounded-2xl border border-gray-900 bg-gray-950/30">
            <Comments issue={issue} onAddComment={onAddComment} />
          </div>

        </div>

        {/* RIGHT COLUMN: Quick verification actions, Timeline logs, Related proximity issues (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. Community Consensus Panel */}
          <div className="p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4">
            <div className="border-b border-gray-900 pb-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                Local Consensus & Vouching
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Confirm this hazard to alert dispatch authorities, or flag it as inaccurate to start a community note audit.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => onVerify(issue.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/5 transition-all cursor-pointer active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Vouch ({issue.verifiedByCount || 0})</span>
              </button>

              <button
                onClick={() => onNotAccurate(issue.id)}
                className="px-4 py-3 bg-gray-900 hover:bg-gray-850 hover:text-red-400 border border-gray-850 text-gray-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                title="Flag as inaccurate"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[10px] font-mono text-gray-500 text-center">
              📍 Current status: <span className={`font-bold ${getStatusColor(issue.status)} px-2 py-0.5 rounded border ml-1 uppercase text-[9px]`}>{getStatusLabel(issue.status)}</span>
            </div>
          </div>

          {/* B. Authority updates from official timeline logs */}
          <div className="p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-3">
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block border-b border-gray-900 pb-2">
              Official Authority Updates
            </span>

            {authorityUpdates.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-500 font-mono">
                No dispatch updates issued yet. Awaiting initial queue scheduling.
              </div>
            ) : (
              <div className="space-y-3">
                {authorityUpdates.map((item, idx) => (
                  <div key={idx} className="p-3 bg-purple-950/10 border border-purple-900/20 rounded-xl space-y-1.5 text-left">
                    <div className="flex justify-between text-[9px] font-mono text-purple-400">
                      <span className="font-bold uppercase tracking-wider">{item.status.replace('_', ' ')}</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-normal">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* C. Vertical Resolution timeline */}
          <div className="p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-900 pb-2">
              Resolution Progress
            </span>

            <div className="space-y-4 pl-4 relative border-l border-gray-900">
              {issue.timeline.map((event, idx) => {
                const isLatest = idx === issue.timeline.length - 1;
                return (
                  <div key={idx} className="relative pl-5 space-y-1">
                    <div className={`absolute -left-[20px] top-1.5 w-2 h-2 rounded-full ${
                      isLatest ? "bg-cyan-400 ring-4 ring-cyan-950/60" : "bg-purple-600"
                    }`} />
                    
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className={`font-bold uppercase ${isLatest ? "text-cyan-400" : "text-gray-400"}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                      <span className="text-gray-600">
                        {new Date(event.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {event.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* D. Spatial Proximity Issues Panel */}
          <div className="p-5 rounded-2xl border border-gray-900 bg-gray-950/60">
            <NearbyIssues 
              currentIssue={issue} 
              allIssues={allIssues} 
              onSelectRelated={(related) => {
                if (onSelectIssue) {
                  onSelectIssue(related);
                }
              }}
            />
          </div>

        </div>

      </div>

      {/* BOTTOM ENTERPRISE BAR: Subtle path to AI Command Center */}
      {setActiveTab && (
        <div className="pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-0.5">
            <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>MUNICIPAL COOPERATION PORTAL</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Access the multi-agent neural pipelines, diagnostic systems, and real-time simulator sandboxes.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("hackathon")}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-850 hover:border-gray-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer shrink-0"
          >
            <span>Open in AI Command Center</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
