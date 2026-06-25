import React from "react";
import { AlertTriangle, RefreshCw, UploadCloud, FileImage } from "lucide-react";

interface ErrorCardProps {
  errorType: "vision_failed" | "upload_invalid" | "non_civic_issue" | "unknown";
  customMessage?: string;
  onRetry: () => void;
  onReset: () => void;
}

export default function ErrorCard({ errorType, customMessage, onRetry, onReset }: ErrorCardProps) {
  
  const getErrorContent = () => {
    switch (errorType) {
      case "non_civic_issue":
        return {
          title: "Non-Civic Content Detected",
          description: "Our Gemini Vision Agent analyzed the image but could not identify any standard public infrastructure anomalies, hazardous material spill, road damages, or utility failures. Please upload a clear photo displaying a valid community concern.",
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />
        };
      case "upload_invalid":
        return {
          title: "Invalid Media Format",
          description: "The uploaded media stream failed validation check or contains malformed data. Please ensure you are submitting a valid high-resolution JPG, PNG, or WEBP photo of the scene.",
          icon: <FileImage className="w-6 h-6 text-red-400" />
        };
      case "vision_failed":
        return {
          title: "Neural Diagnostic Timeout",
          description: "We encountered an issue communicating with the Gemini Vision service. This can occur during periods of high API demand or network limits. Our robust automatic retry cycle has exhausted, but you can retry the connection below.",
          icon: <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
        };
      case "unknown":
      default:
        return {
          title: "Diagnostic Pipeline Error",
          description: customMessage || "An unexpected error occurred while processing this civic safety ticket. Please review your internet connection and try submitting again.",
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />
        };
    }
  };

  const content = getErrorContent();

  return (
    <div id="error-card" className="glass-panel p-6 sm:p-8 rounded-2xl border border-red-950/60 bg-red-950/10 text-left max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3.5 border-b border-red-950/30 pb-4">
        <div className="p-2.5 bg-red-950/50 rounded-xl border border-red-900/40">
          {content.icon}
        </div>
        <div>
          <h4 className="font-display font-bold text-sm text-white">{content.title}</h4>
          <p className="text-[10px] text-gray-500 font-mono">PIPELINE AUDIT: ERROR STATUS CODE 500</p>
        </div>
      </div>

      <p className="text-xs text-gray-300 leading-relaxed font-sans bg-gray-950/40 p-4 rounded-xl border border-gray-900 shadow-inner">
        {content.description}
      </p>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-850 rounded-xl text-xs font-mono transition-all cursor-pointer"
        >
          UPLOAD ANOTHER IMAGE
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-red-400 border border-red-900 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RETRY PIPELINE ANALYSIS</span>
        </button>
      </div>
    </div>
  );
}
