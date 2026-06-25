import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  Activity, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Clock, 
  Compass, 
  RefreshCw, 
  Layers, 
  ShieldAlert, 
  Flame, 
  CheckCircle2 
} from "lucide-react";
import { CivicIssue } from "../../types";

interface TrendData {
  mostCommonIssue: string;
  fastestGrowingProblem: string;
  highestRiskZone: string;
  weeklyTrend: string;
  monthlyTrend: string;
}

interface AIPredictionHubProps {
  issues: CivicIssue[];
}

export default function AIPredictionHub({ issues }: AIPredictionHubProps) {
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trends");
      if (!res.ok) throw new Error("Could not retrieve regional AI trend telemetry.");
      const data = await res.json();
      setTrends(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Trend analysis feed temporarily offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [issues.length]); // Refresh if issues list size changes

  // Compute stats for prediction summary
  const totalPredictions = issues.filter(i => i.analysis?.prediction).length;
  
  const highRiskIssues = issues.filter(i => 
    (i.analysis?.prediction?.escalationProbability || 0) >= 70 && i.status !== "resolved"
  );

  const avgEscalationProb = issues.length > 0 
    ? Math.round(issues.reduce((sum, i) => sum + (i.analysis?.prediction?.escalationProbability || 0), 0) / issues.length)
    : 0;

  const totalEstImpactCount = issues.reduce((acc, i) => {
    // Attempt to parse out number from "estimatedPopulationImpact" or "impactForecast"
    const text = i.analysis?.prediction?.estimatedPopulationImpact || i.analysis?.prediction?.impactForecast || "";
    const match = text.match(/(\d+[,.]?\d*)/);
    if (match) {
      const num = parseInt(match[1].replace(/[,.]/g, ""), 10);
      return acc + (isNaN(num) ? 0 : num);
    }
    return acc + 100; // default estimate
  }, 0);

  // Generate a mock Heatmap region distribution based on addresses in the active issues
  const regions = Array.from(new Set(issues.map(i => {
    const addr = i.address || "";
    const match = addr.match(/Ward\s+\d+|Sector\s+[A-Za-z0-9]+|I-\d+|Expressway|[A-Za-z]+\s+Street|[A-Za-z]+\s+Trail/i);
    return match ? match[0] : "Sector Alpha";
  })));

  const heatmapSummary = regions.map(region => {
    const regionIssues = issues.filter(i => (i.address || "").includes(region));
    const activeCount = regionIssues.filter(i => i.status !== "resolved").length;
    const resolvedCount = regionIssues.filter(i => i.status === "resolved").length;
    
    // Average urgency/escalation
    const avgRisk = regionIssues.length > 0
      ? Math.round(regionIssues.reduce((sum, i) => sum + (i.analysis?.prediction?.escalationProbability || 0), 0) / regionIssues.length)
      : 30;

    let threatLevel: "Critical" | "High" | "Medium" | "Low" = "Low";
    if (avgRisk >= 80) threatLevel = "Critical";
    else if (avgRisk >= 60) threatLevel = "High";
    else if (avgRisk >= 40) threatLevel = "Medium";

    return {
      region,
      activeCount,
      resolvedCount,
      avgRisk,
      threatLevel
    };
  }).sort((a, b) => b.avgRisk - a.avgRisk);

  return (
    <div id="ai-prediction-hub" className="space-y-8 animate-fade-in">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-900 pb-5">
        <div>
          <h3 className="text-xl font-display font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>AI Predictive Analytics Center</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Autonomous multi-agent forecasting, duplicate detection audits, and structural degradation hazard forecasts.
          </p>
        </div>

        <button
          onClick={fetchTrends}
          disabled={loading}
          className="px-3.5 py-2 bg-gray-900 hover:bg-gray-850 disabled:opacity-50 border border-gray-800 text-gray-300 hover:text-white rounded-lg flex items-center gap-2 text-xs font-mono transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Diagnostics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* METRIC PREDICTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gray-850 flex flex-col justify-between gap-4 text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Risk Exposure</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {avgEscalationProb}%
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Average Escalation Probability</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-850 flex flex-col justify-between gap-4 text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">Threat Watch</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {highRiskIssues.length}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Unmitigated Cascades (Risk &ge; 70%)</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-850 flex flex-col justify-between gap-4 text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Public Stress</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              ~{totalEstImpactCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Estimated Citizens Impacted</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-850 flex flex-col justify-between gap-4 text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">AI Diagnostics</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {totalPredictions}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Total Prediction Profiles Saved</p>
          </div>
        </div>
      </div>

      {/* TREND DETECTION CARDS (2 Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Trend metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 text-left space-y-6">
            <h4 className="font-display font-extrabold text-sm text-gray-200 tracking-wide flex items-center gap-2 uppercase font-mono">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Deductions & Trend Signals</span>
            </h4>

            {loading ? (
              <div className="space-y-4 py-8">
                <div className="h-4 bg-gray-900 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-900 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-900 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 bg-gray-950/40 border border-gray-900 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Most Common Incident Category</span>
                  <div className="text-xs font-bold text-gray-200">{trends?.mostCommonIssue || "Road Infrastructure (No analytical cases)"}</div>
                </div>

                <div className="p-4 bg-gray-950/40 border border-gray-900 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider block">Fastest Growing Problem</span>
                  <div className="text-xs font-bold text-gray-200">{trends?.fastestGrowingProblem || "Water & Sewer (No volume increase)"}</div>
                </div>

                <div className="p-4 bg-gray-950/40 border border-gray-900 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider block">Highest Threat Region / Sector</span>
                  <div className="text-xs font-bold text-gray-200">{trends?.highestRiskZone || "Elm Street Corridor, Ward 4"}</div>
                </div>

                <div className="p-4 bg-gray-950/40 border border-gray-900 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono text-purple-400 uppercase tracking-wider block">System Status</span>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>AI Engine Online</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-950/40 border border-gray-900 rounded-xl space-y-2 sm:col-span-2">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>7-Day Predictive Horizon Forecast</span>
                  </span>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {trends?.weeklyTrend || "Predictive horizon scanning is active. Expect high accuracy trends as more citizen entries are cataloged."}
                  </p>
                </div>

                <div className="p-4 bg-gray-950/40 border border-gray-900 rounded-xl space-y-2 sm:col-span-2">
                  <span className="text-[9px] font-mono text-purple-400 uppercase tracking-wider block flex items-center gap-1">
                    <Compass className="w-3 h-3" />
                    <span>30-Day Urban Infrastructure Strategic Advisory</span>
                  </span>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {trends?.monthlyTrend || "Monthly advice scans for structural, soil, and utility fatigue indicators inside community data feeds."}
                  </p>
                </div>

              </div>
            )}
          </div>

          {/* AI INSIGHTS & STRATEGIC HIGHLIGHTS */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 text-left space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <h4 className="font-display font-extrabold text-sm text-gray-200 uppercase tracking-wide font-mono">
                AI Strategic Intelligence Report
              </h4>
            </div>

            <div className="p-4 bg-purple-950/10 border border-purple-900/30 rounded-xl space-y-3">
              <p className="text-xs text-purple-300 leading-relaxed font-mono">
                [AGENT DETECTIONS OVERVIEW] Municipal infrastructure indices suggest a correlation between subsurface water mains fatigue and expanding roadway asphalt erosion. 
                Prompt coordination between the Bureau of Water and State Highway Patrol on overlapping reports is highly recommended to prevent localized sinkholes.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-900/30 font-mono text-[10px]">
                <span className="px-2 py-0.5 bg-purple-950/50 border border-purple-800/40 rounded text-purple-300">
                  ⚠️ COORDINATION ADVISORY
                </span>
                <span className="px-2 py-0.5 bg-cyan-950/50 border border-cyan-800/40 rounded text-cyan-300">
                  🔧 CROSS-UTILITY TASKING
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Heatmap Summary & Risk Distribution */}
        <div className="space-y-6 text-left">
          
          {/* Heatmap summary list */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-850 space-y-5">
            <h4 className="font-display font-extrabold text-sm text-gray-200 tracking-wide flex items-center gap-2 uppercase font-mono">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>Regional Risk Heatmap</span>
            </h4>

            <div className="space-y-3.5">
              {heatmapSummary.length === 0 ? (
                <p className="text-xs text-gray-500 font-mono py-8 text-center">No active regional reports found.</p>
              ) : (
                heatmapSummary.slice(0, 6).map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-950/60 border border-gray-900 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-gray-200 max-w-[150px] truncate">{item.region}</div>
                      <div className="text-[10px] font-mono text-gray-500">
                        {item.activeCount} active reports &bull; {item.resolvedCount} mitigated
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <span className="text-xs font-bold font-mono text-gray-300">{item.avgRisk}% Risk</span>
                      <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        item.threatLevel === "Critical" 
                          ? "bg-red-950/60 text-red-400 border border-red-900/50" 
                          : item.threatLevel === "High" 
                          ? "bg-amber-950/60 text-amber-400 border border-amber-900/50"
                          : "bg-blue-950/60 text-blue-400 border border-blue-900/50"
                      }`}>
                        {item.threatLevel}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Forecast prediction explanation */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-3">
            <h5 className="text-xs font-bold font-mono text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Deduplication Notice</span>
            </h5>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our AI duplicate auditor constantly monitors incoming citizen logs. If duplicate reports are registered nearby, they are surfaced in the detailed logs for consolidated resolution.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
