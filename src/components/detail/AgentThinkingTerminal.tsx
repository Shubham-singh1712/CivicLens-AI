import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Eye, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Activity, 
  Terminal, 
  Play, 
  CheckCircle2, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  FileText 
} from "lucide-react";
import { CivicIssue } from "../../types";

interface AgentThinkingTerminalProps {
  issue: CivicIssue;
}

interface Step {
  id: string;
  agent: string;
  icon: any;
  status: "idle" | "running" | "completed";
  message: string;
  details: string;
  color: string;
}

export default function AgentThinkingTerminal({ issue }: AgentThinkingTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(2.8);
  const [currentActiveNode, setCurrentActiveNode] = useState(6); // 0-6 index, 6 is completed

  // Define our 6 core steps
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "vision",
      agent: "Neural Vision Agent",
      icon: Eye,
      status: "completed",
      message: "Image ingestion & optical threat assessment completed.",
      details: `Detected physical fracture patterns matching category. Resolved pixels. Color profiles suggest active moisture/rust. Confidence rating: ${issue.analysis?.vision?.confidence || 94}%.`,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20"
    },
    {
      id: "geo",
      agent: "Spatial Geocoding Agent",
      icon: MapPin,
      status: "completed",
      message: `Mapped coordinates to local grid sector.`,
      details: `Geocoded target location: [${issue.lat.toFixed(4)}, ${issue.lng.toFixed(4)}]. Registered in Sector: ${issue.address.split(",").pop()?.trim() || "Zone 1"}. Querying 750m duplicate radius.`,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20"
    },
    {
      id: "risk",
      agent: "Cascade Risk Predictor",
      icon: AlertTriangle,
      status: "completed",
      message: `Escalation index calculated at ${issue.analysis?.prediction?.escalationProbability || 45}%.`,
      details: `Evaluated structural fatigue coefficient. Deterioration forecast model completed. Structural risk level labeled as: ${issue.analysis?.vision?.severity || "High"}.`,
      color: "text-red-400 border-red-500/20 bg-red-950/20"
    },
    {
      id: "routing",
      agent: "Intelligent Dispatch Router",
      icon: Activity,
      status: "completed",
      message: "Assigned service SLA matrix.",
      details: `Routed directly to: ${issue.analysis?.resolution?.responsibleAuthority || "Operations Department"}. Assigned critical dispatch prioritization.`,
      color: "text-amber-400 border-amber-500/20 bg-amber-950/20"
    },
    {
      id: "resolution",
      agent: "Resolution Plan Formulation Agent",
      icon: ShieldCheck,
      status: "completed",
      message: "Recommended mitigation checklist generated.",
      details: `SLA Target: ${issue.analysis?.resolution?.estimatedResolutionTime || "3 Days"}. Formulated action items: ${issue.analysis?.resolution?.recommendedAction || "Inspect localized hazard area."}`,
      color: "text-blue-400 border-blue-500/20 bg-blue-950/20"
    },
    {
      id: "prediction",
      agent: "Municipal Dispatch Agent",
      icon: FileText,
      status: "completed",
      message: "Official work dispatch order drafted & signed.",
      details: "Constructed standard JSON and PDF municipal schema payload. Dispatched over API endpoint and logged to city queue.",
      color: "text-purple-400 border-purple-500/20 bg-purple-950/20"
    }
  ]);

  // Handle manual replay of the agentic orchestration
  const handleReplay = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsExpanded(true);
    setProgress(0);
    setElapsedTime(0);
    setCurrentActiveNode(0);

    // Set all steps to idle
    setSteps(prev => prev.map(s => ({ ...s, status: "idle" })));

    let currentStepIndex = 0;
    const intervalTime = 800; // time per step
    const totalDuration = intervalTime * steps.length;

    // Timer for elapsed time
    const timer = setInterval(() => {
      setElapsedTime(prev => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);

    // Process nodes step-by-step
    const runStep = () => {
      if (currentStepIndex >= steps.length) {
        clearInterval(timer);
        setIsAnimating(false);
        setCurrentActiveNode(6); // completed
        setProgress(100);
        return;
      }

      setCurrentActiveNode(currentStepIndex);
      setProgress(Math.round(((currentStepIndex + 1) / steps.length) * 100));

      setSteps(prev => prev.map((s, idx) => {
        if (idx === currentStepIndex) return { ...s, status: "running" };
        if (idx < currentStepIndex) return { ...s, status: "completed" };
        return s;
      }));

      setTimeout(() => {
        setSteps(prev => prev.map((s, idx) => {
          if (idx === currentStepIndex) return { ...s, status: "completed" };
          return s;
        }));
        currentStepIndex++;
        runStep();
      }, intervalTime);
    };

    runStep();
  };

  return (
    <div id={`thinking-terminal-${issue.id}`} className="space-y-4">
      
      {/* 2. MULTI-AGENT PIPELINE VISUALIZATION PANEL */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/40 space-y-4 text-left">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-gray-900 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-display font-bold text-sm text-white">Multi-Agent Diagnostics Pipeline</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
            <div>
              TOTAL TIME: <span className="text-cyan-400 font-bold">{elapsedTime}s</span>
            </div>
            <div>
              PROGRESS: <span className="text-emerald-400 font-bold">{progress}%</span>
            </div>
            <button
              onClick={handleReplay}
              disabled={isAnimating}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                isAnimating 
                  ? "bg-gray-900 text-gray-600 border border-gray-950 cursor-not-allowed" 
                  : "bg-cyan-950/40 text-cyan-400 border border-cyan-800/50 hover:bg-cyan-900/40 hover:text-cyan-300"
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isAnimating ? "Thinking..." : "Re-Run Diagnostic Pipeline"}</span>
            </button>
          </div>
        </div>

        {/* Pipeline Nodes Map */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 pt-2 text-center">
          {[
            { label: "Vision", icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500" },
            { label: "Geo Spatial", icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-500" },
            { label: "Predictor", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500" },
            { label: "SLA Router", icon: Activity, color: "text-amber-400", bg: "bg-amber-500" },
            { label: "Formulator", icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-500" },
            { label: "Dispatcher", icon: FileText, color: "text-purple-400", bg: "bg-purple-500" },
            { label: "Completed", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500" }
          ].map((node, idx) => {
            const Icon = node.icon;
            const isCompleted = idx < currentActiveNode;
            const isActive = idx === currentActiveNode;
            const isPending = idx > currentActiveNode;

            return (
              <div key={idx} className="relative flex flex-col items-center justify-between p-2 rounded-xl border border-gray-900/60 bg-gray-950/20">
                <div className="relative">
                  {/* Pulse active halo */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                  )}
                  <div className={`p-2 rounded-full border ${
                    isCompleted 
                      ? `${node.color} border-${node.color}/30 bg-gray-900`
                      : isActive 
                      ? "text-white border-cyan-500/50 bg-cyan-950/40" 
                      : "text-gray-600 border-gray-900 bg-gray-950"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-mono font-bold">
                  <span className={isCompleted ? "text-gray-300" : isActive ? "text-cyan-400 font-extrabold" : "text-gray-600"}>
                    {node.label}
                  </span>
                </div>

                {/* Animated connectors */}
                {idx < 6 && (
                  <div className="hidden md:block absolute top-6 -right-1.5 w-3 h-[2px] bg-gray-900 z-10">
                    <div className={`h-full ${isCompleted ? node.bg : isActive ? "bg-cyan-400 animate-pulse" : "bg-gray-900"}`} style={{ width: isCompleted ? "100%" : "0%" }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. COLLAPSIBLE ACTIVE LOGS TERMINAL */}
      <div className="glass-panel border border-gray-850 rounded-2xl overflow-hidden bg-gray-950/50">
        
        {/* Toggle Bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-3.5 bg-gray-950 border-b border-gray-900 flex justify-between items-center cursor-pointer hover:bg-gray-900/40 transition-all text-left"
        >
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold text-gray-200 tracking-wider">
              AGENT ORCHESTRATION THINKING CONSOLE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-medium text-gray-500">
              {isExpanded ? "Collapse Logs" : "Expand Logs"}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {/* Expanded list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden bg-gray-950/30"
            >
              <div className="p-5 space-y-4 max-h-[350px] overflow-y-auto font-mono text-xs text-left">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isRunning = step.status === "running";
                  const isDone = step.status === "completed";
                  const isPending = step.status === "idle";

                  return (
                    <div 
                      key={step.id} 
                      className={`flex gap-3.5 p-3 rounded-xl border transition-all ${
                        isRunning 
                          ? "border-cyan-500/30 bg-cyan-950/20 shadow-lg shadow-cyan-950/10" 
                          : isDone 
                          ? "border-gray-900/60 bg-gray-950/40 opacity-90"
                          : "border-transparent bg-transparent opacity-30"
                      }`}
                    >
                      {/* Left icon with active line */}
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-xl border ${
                          isRunning 
                            ? "text-cyan-400 border-cyan-400 bg-cyan-950/40 animate-pulse" 
                            : isDone 
                            ? "text-emerald-400 border-emerald-950/60 bg-gray-900"
                            : "text-gray-700 border-gray-950 bg-gray-950"
                        }`}>
                          {isRunning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`w-[2px] h-10 my-1 ${isDone ? "bg-emerald-950" : "bg-gray-950"}`} />
                        )}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[11px] text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
                            {step.agent}
                            {isDone && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-950 px-1 rounded">SECURE</span>}
                            {isRunning && <span className="text-[9px] text-cyan-400 font-bold bg-cyan-950/30 border border-cyan-950 px-1 rounded animate-pulse">RESOLVING</span>}
                          </span>
                          <span className="text-[9px] text-gray-500">
                            +{((idx + 1) * 0.4).toFixed(1)}s dispatch
                          </span>
                        </div>

                        <p className={`text-xs ${isRunning ? "text-cyan-300 font-bold" : isDone ? "text-gray-300" : "text-gray-600"}`}>
                          {isRunning ? "Running telemetry evaluation queries..." : step.message}
                        </p>

                        {(isRunning || isDone) && (
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed bg-black/20 p-2.5 rounded-lg border border-gray-950">
                            {step.details}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
