import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, ShieldCheck, Scale, Award, Info, FileClock } from "lucide-react";
import { CivicIssue } from "../../types";

interface VerificationPanelProps {
  issue: CivicIssue;
  onVerify: (id: string) => Promise<void>;
  onNotAccurate: (id: string) => Promise<void>;
}

export default function VerificationPanel({ issue, onVerify, onNotAccurate }: VerificationPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const pos = issue.verifiedByCount || 0;
  const neg = issue.notAccurateCount || 0;
  const total = pos + neg;

  // Calculators
  const verificationScore = pos - neg;
  const trustScore = Math.round(((pos + 1) / (pos + neg + 1)) * 100);
  const defaultConfidence = issue.analysis?.vision?.confidence || 85;
  const communityConfidence = total === 0 
    ? defaultConfidence 
    : Math.round((pos / total) * 100);

  const handlePositiveConfirm = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onVerify(issue.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNegativeConfirm = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onNotAccurate(issue.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id={`verification-panel-${issue.id}`} className="space-y-6 text-left">
      <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <h3 className="font-display font-bold text-lg text-white">
          Community Attestation & Consensus
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left side: Interactive Actions & Score Dial */}
        <div className="md:col-span-7 space-y-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            Review the incident, examine the photographic evidence, and verify its accuracy. Citizen-led attestation ensures transparency, prevents fraudulent reporting, and accelerates municipal resource deployment.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePositiveConfirm}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                issue.isVerifiedByMe
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800 shadow-inner"
                  : "bg-gray-950 hover:bg-gray-900 text-gray-400 border-gray-850 hover:border-gray-700"
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${issue.isVerifiedByMe ? "scale-110" : ""}`} />
              <span>CONFIRM ISSUE (+{pos})</span>
            </button>

            <button
              onClick={handleNegativeConfirm}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                issue.isNotAccurateByMe
                  ? "bg-red-950/60 text-red-400 border-red-800 shadow-inner"
                  : "bg-gray-950 hover:bg-gray-900 text-gray-400 border-gray-850 hover:border-gray-700"
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${issue.isNotAccurateByMe ? "scale-110" : ""}`} />
              <span>NOT ACCURATE ({neg})</span>
            </button>
          </div>

          {/* Dynamic Meter Bars */}
          <div className="bg-gray-950/30 p-4 border border-gray-900 rounded-xl space-y-4">
            
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-gray-500">Community Consensus Index</span>
                <span className={communityConfidence >= 75 ? "text-emerald-400" : communityConfidence >= 50 ? "text-amber-400" : "text-red-400"}>
                  {communityConfidence}% AGREEMENT RATE
                </span>
              </div>
              <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-900">
                <div 
                  className={`h-full transition-all duration-300 ${
                    communityConfidence >= 75 ? "bg-emerald-500" : communityConfidence >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${communityConfidence}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center font-mono">
              <div className="bg-gray-950/50 p-2.5 rounded-lg border border-gray-900/60">
                <span className="text-[8px] text-gray-500 uppercase block">Verification Score</span>
                <span className={`text-sm font-extrabold mt-0.5 block ${
                  verificationScore > 0 ? "text-emerald-400" : verificationScore < 0 ? "text-red-400" : "text-gray-400"
                }`}>
                  {verificationScore > 0 ? `+${verificationScore}` : verificationScore}
                </span>
              </div>

              <div className="bg-gray-950/50 p-2.5 rounded-lg border border-gray-900/60">
                <span className="text-[8px] text-gray-500 uppercase block">Trust Index</span>
                <span className="text-sm font-extrabold text-gray-100 mt-0.5 block">
                  {trustScore}%
                </span>
              </div>

              <div className="bg-gray-950/50 p-2.5 rounded-lg border border-gray-900/60">
                <span className="text-[8px] text-gray-500 uppercase block">Audit Status</span>
                <span className={`text-xs font-extrabold mt-1 block uppercase ${
                  total === 0 ? "text-gray-500" : communityConfidence >= 70 ? "text-emerald-400" : "text-amber-500"
                }`}>
                  {total === 0 ? "Pending" : communityConfidence >= 70 ? "VERIFIED" : "DISPUTED"}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right side: Verification History Log */}
        <div className="md:col-span-5 bg-gray-950/40 border border-gray-900 rounded-2xl p-4 space-y-3 shrink-0">
          <div className="flex items-center gap-1.5 text-gray-400 border-b border-gray-900 pb-2.5">
            <FileClock className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Audit Log History</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {!issue.verificationHistory || issue.verificationHistory.length === 0 ? (
              <div className="text-center py-6 text-gray-600 font-mono text-[10px] space-y-1">
                <Info className="w-5 h-5 mx-auto text-gray-700" />
                <p>No audits logged yet.</p>
                <p className="text-[8px] text-gray-700">Be the first to confirm or dispute!</p>
              </div>
            ) : (
              [...issue.verificationHistory].reverse().map((event) => (
                <div key={event.id} className="text-[10px] font-mono flex items-start gap-2 border-b border-gray-900/40 pb-2">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                    event.type === 'confirm' ? "bg-emerald-500" : "bg-red-500"
                  }`}></span>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-gray-300 leading-tight">
                      <strong>{event.user}</strong> {event.type === 'confirm' ? "confirmed" : "flagged inaccurate"} this incident.
                    </p>
                    <span className="text-[8px] text-gray-600 block">
                      {new Date(event.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
