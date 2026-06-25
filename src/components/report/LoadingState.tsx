import React, { useEffect, useState } from "react";
import { Cpu, ShieldCheck, RefreshCw, Eye } from "lucide-react";

export default function LoadingState() {
  const [progress, setProgress] = useState(5);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Uploading Incident Media Payload...", duration: 1500 },
    { title: "Initializing Gemini 3.5 Flash Vision Matrix...", duration: 2200 },
    { title: "Extracting Visual Stressors & Surface Cracks...", duration: 2500 },
    { title: "Analyzing Escalation Risk and Cordon Radius...", duration: 2000 },
    { title: "Formulating Multi-Agent Dispatch Schema...", duration: 1500 }
  ];

  useEffect(() => {
    let active = true;
    let stepIndex = 0;

    const runSteps = async () => {
      while (active && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        const step = steps[stepIndex];
        
        // Staged progress incrementing
        const targetProgress = Math.min(95, Math.floor(((stepIndex + 1) / steps.length) * 100));
        const increment = (targetProgress - progress) / 20;
        
        for (let i = 0; i < 20; i++) {
          if (!active) return;
          setProgress(prev => Math.min(95, prev + increment));
          await new Promise(r => setTimeout(r, step.duration / 20));
        }

        stepIndex++;
      }
      if (active) {
        setProgress(100);
      }
    };

    runSteps();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div id="loading-state-card" className="glass-panel p-8 rounded-2xl border border-cyan-900/40 bg-cyan-950/5 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-900/60 animate-spin">
            <RefreshCw className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white">Active Neural Vision Diagnostic Pipeline</h4>
            <p className="text-[10px] text-gray-400 font-mono">CivicLens Vision Agent is analyzing the reported safety scene</p>
          </div>
        </div>
        <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-2.5 py-0.5 rounded font-mono font-bold animate-pulse">
          STAGE ACTIVE: {progress.toFixed(0)}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="space-y-2">
        <div className="w-full bg-gray-950 rounded-full h-2 overflow-hidden border border-gray-900">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full shadow-lg shadow-cyan-500/20"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="text-cyan-400 animate-pulse font-semibold">
            {steps[currentStep]?.title || "Assembling response..."}
          </span>
          <span className="text-gray-500">EST. TIME REMAINING ~6s</span>
        </div>
      </div>

      {/* Grid of Skeleton Loader Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Skeleton Card 1 */}
        <div className="border border-gray-900 bg-gray-950/20 rounded-xl p-5 space-y-4 animate-pulse">
          <div className="h-4 bg-gray-900 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-900 rounded w-3/4"></div>
            <div className="h-3 bg-gray-900 rounded w-1/2"></div>
            <div className="h-10 bg-gray-900/50 rounded w-full mt-2"></div>
          </div>
        </div>

        {/* Skeleton Card 2 */}
        <div className="border border-gray-900 bg-gray-950/20 rounded-xl p-5 space-y-4 animate-pulse">
          <div className="h-4 bg-gray-900 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-900 rounded w-2/3"></div>
            <div className="h-3 bg-gray-900 rounded w-5/6"></div>
            <div className="h-10 bg-gray-900/50 rounded w-full mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
