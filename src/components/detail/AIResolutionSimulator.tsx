import React, { useState } from "react";
import { 
  Wrench, 
  Trash2, 
  DollarSign, 
  Users, 
  HelpCircle, 
  AlertOctagon, 
  Clock, 
  Activity, 
  CheckCircle, 
  ShieldAlert,
  Loader2 
} from "lucide-react";
import { CivicIssue } from "../../types";

interface AIResolutionSimulatorProps {
  issue: CivicIssue;
}

interface SimulationData {
  impactTimeline: { timeframe: string; event: string }[];
  costEstimate: string;
  riskEscalation: string;
  affectedPopulation: string;
  infrastructureConsequences: string;
  suggestedPreventiveMeasures: string;
  expertAnalysis: string;
}

export default function AIResolutionSimulator({ issue }: AIResolutionSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<"ignored" | "fastest" | "lowest_cost" | "infrastructure">("ignored");
  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationData | null>(null);

  const handleSimulate = async (scenario: "ignored" | "fastest" | "lowest_cost" | "infrastructure") => {
    setSelectedScenario(scenario);
    setLoading(true);
    setSimulationResult(null);

    try {
      const response = await fetch(`/api/issues/${issue.id}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioType: scenario })
      });

      if (!response.ok) {
        throw new Error("Simulation endpoint failed.");
      }

      const data = await response.json();
      setSimulationResult(data);
    } catch (err) {
      console.error("Failed to run AI Simulation:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on mount if first time
  React.useEffect(() => {
    handleSimulate("ignored");
  }, [issue.id]);

  return (
    <div id={`resolution-simulator-${issue.id}`} className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/40 text-left space-y-6">
      
      {/* Title block */}
      <div className="flex flex-wrap justify-between items-start gap-4 border-b border-gray-900 pb-4">
        <div>
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-400" />
            AI Resolution & Operations Simulator
          </h3>
          <p className="text-xs text-gray-400">Model risk profiles and resource costs across custom scenarios</p>
        </div>
      </div>

      {/* Scenario Selectors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { id: "ignored", label: "Decline Action", desc: "Calculate cascading structural damage if left deferred", icon: Trash2, color: "hover:border-red-500/50 hover:bg-red-950/10 text-red-400" },
          { id: "fastest", label: "Emergency SLA", desc: "Emergency crew dispatch & cold-mix steel plating", icon: Clock, color: "hover:border-cyan-500/50 hover:bg-cyan-950/10 text-cyan-400" },
          { id: "lowest_cost", label: "Optimized Shift", desc: "Batch material allocation inside standard shifts", icon: DollarSign, color: "hover:border-emerald-500/50 hover:bg-emerald-950/10 text-emerald-400" },
          { id: "infrastructure", label: "Utility Impact", desc: "Examine water, gas, power grid & telecom exposure", icon: Activity, color: "hover:border-purple-500/50 hover:bg-purple-950/10 text-purple-400" }
        ].map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = selectedScenario === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => handleSimulate(scenario.id as any)}
              disabled={loading}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer ${
                isSelected 
                  ? "bg-purple-950/40 border-purple-500/80 shadow-md shadow-purple-950/30" 
                  : "bg-gray-950/30 border-gray-900 " + scenario.color
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div className={`p-2 rounded-lg ${isSelected ? "bg-purple-900/40 text-purple-300" : "bg-black/40 text-gray-400"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[8px] font-mono font-black text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800/40">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                <span className="block font-bold text-xs text-white">
                  {scenario.label}
                </span>
                <span className="block text-[10px] text-gray-500 leading-tight">
                  {scenario.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading animation state */}
      {loading && (
        <div className="p-12 rounded-xl border border-gray-900 bg-black/20 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <div className="space-y-1">
            <span className="block font-bold text-sm text-white font-display">Calculating Simulation Metrics...</span>
            <span className="block text-xs text-gray-500 font-mono">Running Monte Carlo risk overlays via Gemini 3.5 Flash</span>
          </div>
        </div>
      )}

      {/* Render result output */}
      {simulationResult && !loading && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Bento Grid Splits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Cost & Risk Box */}
            <div className="p-4.5 rounded-xl border border-gray-900 bg-black/10 space-y-3">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                Resource & Risk Valuation
              </span>
              
              <div className="space-y-2.5">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400">COST ESTIMATE:</span>
                  <span className="font-display font-extrabold text-lg text-white">
                    {simulationResult.costEstimate}
                  </span>
                </div>
                <div className="border-t border-gray-900 pt-2.5">
                  <span className="block text-[10px] font-bold text-gray-400">RISK ESCALATION:</span>
                  <p className="text-xs text-red-300 leading-relaxed font-mono">
                    {simulationResult.riskEscalation}
                  </p>
                </div>
              </div>
            </div>

            {/* Affected Population & Infrastructure Consequences */}
            <div className="p-4.5 rounded-xl border border-gray-900 bg-black/10 space-y-3">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                Social & Network Consequences
              </span>
              
              <div className="space-y-2.5">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400">AFFECTED POPULATION:</span>
                  <p className="text-xs text-gray-200 leading-normal">
                    {simulationResult.affectedPopulation}
                  </p>
                </div>
                <div className="border-t border-gray-900 pt-2.5">
                  <span className="block text-[10px] font-bold text-gray-400">INFRASTRUCTURE IMPACT:</span>
                  <p className="text-xs text-gray-200 leading-normal">
                    {simulationResult.infrastructureConsequences}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Timeline Milestones Progression */}
          <div className="p-4.5 rounded-xl border border-gray-900 bg-black/20 space-y-4">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              Simulation Impact Timeline
            </span>

            <div className="space-y-3.5 relative pl-4 border-l border-gray-850">
              {simulationResult.impactTimeline.map((item, idx) => (
                <div key={idx} className="relative space-y-0.5">
                  <div className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-purple-500 bg-gray-950" />
                  <span className="block text-[10px] font-mono font-bold text-purple-400 uppercase">
                    {item.timeframe}
                  </span>
                  <p className="text-xs text-gray-300 leading-normal">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Preventive Measures */}
          <div className="p-4.5 rounded-xl border border-gray-900 bg-black/10 space-y-2">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              Suggested Preventive & Safety Measures
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              {simulationResult.suggestedPreventiveMeasures}
            </p>
          </div>

          {/* Expert Engineering Summary Callout */}
          <div className="p-4.5 rounded-xl border border-purple-900/30 bg-purple-950/20 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                AI Expert Engineering Advisory
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-mono">
              {simulationResult.expertAnalysis}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
