import React, { useState } from "react";
import { Play, Cpu, ShieldAlert, ArrowLeft } from "lucide-react";
import { CivicIssue } from "../types";
import IssueHeader from "./detail/IssueHeader";
import IssueGallery from "./detail/IssueGallery";
import AIAnalysis from "./detail/AIAnalysis";
import ResolutionPlan from "./detail/ResolutionPlan";
import Timeline from "./detail/Timeline";
import VerificationPanel from "./detail/VerificationPanel";
import Comments from "./detail/Comments";
import SmartRoutingCard from "./detail/SmartRoutingCard";
import LocationTimeline from "./detail/LocationTimeline";
import NearbyIssues from "./detail/NearbyIssues";

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
}

export default function IssueDetailPage({
  issue,
  allIssues,
  onBack,
  onUpvote,
  onVerify,
  onNotAccurate,
  onUpdateStatus,
  onAddComment,
  onAddImage,
  onSelectIssue
}: IssueDetailPageProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (nextStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(issue.id, nextStatus);
    } catch (err) {
      console.error("Status update failure:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusIndex = ["reported", "under_review", "scheduled", "in_progress", "resolved"].indexOf(issue.status);

  return (
    <div id="issue-detail-page" className="max-w-7xl mx-auto px-6 py-10 space-y-10 relative text-left">
      {/* Background radial overlays */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER COMPONENT */}
      <IssueHeader issue={issue} onBack={onBack} />

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Media, Attestation, Testimonies, Related (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* GALLERY COMPONENT */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/20">
            <IssueGallery issue={issue} onAddImage={onAddImage} />
          </div>

          {/* VERIFICATION & CONSENSUS PANEL */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gray-950/20">
            <VerificationPanel 
              issue={issue} 
              onVerify={onVerify} 
              onNotAccurate={onNotAccurate} 
            />
          </div>

          {/* GEOPROXIMITY NEARBY HAZARDS COMPONENT */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/20">
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

          {/* COMMENTS & FEEDBACK LOG */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gray-950/20">
            <Comments issue={issue} onAddComment={onAddComment} />
          </div>

        </div>

        {/* RIGHT COLUMN: Diagnostic Analysis, Resolution Center, Timeline Track (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* AI ANALYSIS COMPONENT */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gray-950/20">
            <AIAnalysis issue={issue} allIssues={allIssues} />
          </div>

          {/* TIMELINE COMPONENT */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gray-950/20">
            <Timeline issue={issue} />
          </div>

          {/* RESOLUTION PLAN COMPONENT */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gray-950/20">
            <ResolutionPlan issue={issue} />
          </div>

          {/* AI SMART ROUTING CARD */}
          <SmartRoutingCard issue={issue} />

          {/* LOCAL AREA HISTORY TIMELINE */}
          <LocationTimeline issue={issue} />

          {/* MUNICIPAL SIMULATION PITCH TOOL */}
          <div className="glass-panel p-6 rounded-2xl border border-dashed border-cyan-800/60 bg-cyan-950/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-900/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-900">
                  <Play className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Municipality Control Room</h4>
                  <p className="text-[10px] text-gray-400 font-mono">Simulate municipal dispatch & repair lifecycle</p>
                </div>
              </div>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded font-mono font-bold">
                PITCH DEMO
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Demonstrate the live municipal resolution flow. Triggering dispatcher actions instantly updates the global database, appends to the verified timeline, and drops the <strong className="text-white">Escalation Probability to 0%</strong> when fully mitigated.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { status: "under_review", label: "Acknowledge Alert", active: currentStatusIndex < 1 },
                { status: "scheduled", label: "Finalize & Schedule", active: currentStatusIndex < 2 },
                { status: "in_progress", label: "Mobilize Site Crew", active: currentStatusIndex < 3 },
                { status: "resolved", label: "Mark Mitigated & Closed", active: currentStatusIndex < 4 }
              ].map((btn) => {
                const isClickable = btn.active && !isUpdating;
                return (
                  <button
                    key={btn.status}
                    onClick={() => isClickable && handleStatusChange(btn.status)}
                    disabled={!isClickable}
                    className={`px-3 py-2 rounded-lg font-mono text-[9px] border transition-all flex items-center gap-1.5 ${
                      isClickable
                        ? "bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border-cyan-800 cursor-pointer"
                        : "bg-gray-950 text-gray-600 border-gray-900 cursor-not-allowed"
                    }`}
                  >
                    <span>→ {btn.label.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
