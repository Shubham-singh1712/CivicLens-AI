import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, ShieldCheck, Scale, Award } from "lucide-react";
import { CivicIssue } from "../../types";

interface VerificationWidgetProps {
  issue: CivicIssue;
  onVerify: (id: string) => Promise<void>;
  onNotAccurate: (id: string) => Promise<void>;
}

export default function VerificationWidget({ issue, onVerify, onNotAccurate }: VerificationWidgetProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const pos = issue.verifiedByCount || 0;
  const neg = issue.notAccurateCount || 0;
  const total = pos + neg;

  // Calculators
  const verificationScore = pos - neg;
  
  // Trust Score: Laplacian smoothing to avoid 0s
  const trustScore = Math.round(((pos + 1) / (pos + neg + 1)) * 100);
  
  // Community Confidence %
  const defaultConfidence = issue.analysis?.vision?.confidence || 85;
  const communityConfidence = total === 0 
    ? defaultConfidence 
    : Math.round((pos / total) * 100);

  const handlePositiveConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleNegativeConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div id={`verification-widget-${issue.id}`} className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
          COMMUNITY AUDIT & VERIFICATION
        </span>
        <span className="text-[9px] font-mono bg-purple-950/40 text-purple-400 border border-purple-900 px-2 py-0.5 rounded">
          {total} AUDITS LOGGED
        </span>
      </div>

      {/* Verification Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handlePositiveConfirm}
          disabled={isProcessing}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
            issue.isVerifiedByMe
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800 shadow-inner"
              : "bg-gray-900/60 hover:bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${issue.isVerifiedByMe ? "scale-110" : ""}`} />
          <span>CONFIRM (+{pos})</span>
        </button>

        <button
          type="button"
          onClick={handleNegativeConfirm}
          disabled={isProcessing}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
            issue.isNotAccurateByMe
              ? "bg-red-950/60 text-red-400 border-red-800 shadow-inner"
              : "bg-gray-900/60 hover:bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700"
          }`}
        >
          <ThumbsDown className={`w-3.5 h-3.5 ${issue.isNotAccurateByMe ? "scale-110" : ""}`} />
          <span>INACCURATE ({neg})</span>
        </button>
      </div>

      {/* Metrics breakdown */}
      <div className="bg-gray-950/40 p-3 rounded-xl border border-gray-900 space-y-2.5 text-[10px] font-mono">
        {/* Verification Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-gray-400">
            <span>Community Consensus</span>
            <span className={communityConfidence >= 75 ? "text-emerald-400" : communityConfidence >= 50 ? "text-amber-400" : "text-red-400"}>
              {communityConfidence}% AGREEMENT
            </span>
          </div>
          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-850">
            <div 
              className={`h-full transition-all duration-300 ${
                communityConfidence >= 75 ? "bg-emerald-500" : communityConfidence >= 50 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${communityConfidence}%` }}
            ></div>
          </div>
        </div>

        {/* Diagnostic counters */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-900/60 text-center text-gray-500">
          <div>
            <span className="block text-[8px] uppercase text-gray-600">Net Score</span>
            <span className={`font-bold mt-0.5 block ${verificationScore > 0 ? "text-emerald-400" : verificationScore < 0 ? "text-red-400" : "text-gray-400"}`}>
              {verificationScore > 0 ? `+${verificationScore}` : verificationScore}
            </span>
          </div>
          <div>
            <span className="block text-[8px] uppercase text-gray-600">Trust Index</span>
            <span className="font-bold text-gray-200 mt-0.5 block">
              {trustScore}%
            </span>
          </div>
          <div>
            <span className="block text-[8px] uppercase text-gray-600">Status</span>
            <span className={`font-bold mt-0.5 block uppercase ${total === 0 ? "text-gray-500" : communityConfidence >= 70 ? "text-emerald-400" : "text-amber-500"}`}>
              {total === 0 ? "Pending" : communityConfidence >= 70 ? "Verified" : "Disputed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
