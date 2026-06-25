import React, { useState } from "react";
import { 
  BarChart3, 
  CheckCircle, 
  Flame, 
  Sparkles, 
  Cpu, 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck,
  AlertOctagon,
  Compass
} from "lucide-react";
import { CivicIssue, DashboardMetrics } from "../types";
import StatsCard from "./dashboard/StatsCard";
import IssueCard from "./dashboard/IssueCard";
import SearchBar from "./dashboard/SearchBar";
import Filters from "./dashboard/Filters";
import AIPredictionHub from "./dashboard/AIPredictionHub";
import MapView from "./dashboard/MapView";

interface CommunityDashboardProps {
  issues: CivicIssue[];
  metrics: DashboardMetrics;
  onUpvote: (id: string) => Promise<void>;
  onVerify: (id: string) => Promise<void>;
  onNotAccurate: (id: string) => Promise<void>;
  onSelectIssue: (issue: CivicIssue) => void;
  setActiveTab: (tab: string) => void;
}

const CATEGORIES = [
  "Road Infrastructure",
  "Water & Sewer",
  "Power & Grid",
  "Waste & Sanitation",
  "Public Safety",
  "Park Maintenance"
];

export default function CommunityDashboard({
  issues,
  metrics,
  onUpvote,
  onVerify,
  onNotAccurate,
  onSelectIssue,
  setActiveTab
}: CommunityDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "priority" | "confirmed">("priority");
  const [subTab, setSubTab] = useState<"feed" | "map" | "predictions">("feed");

  // Filter issues based on criteria
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || issue.category === selectedCategory;

    const matchesSeverity =
      selectedSeverity === "All" ||
      issue.analysis?.vision?.severity === selectedSeverity;

    const matchesStatus =
      selectedStatus === "All" || issue.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  // Sorting weight calculator for AI priority
  const getPriorityWeight = (issue: CivicIssue) => {
    const severity = issue.analysis?.vision?.severity || "Medium";
    const confidence = issue.analysis?.vision?.confidence || 85;
    const severityWeights = { Critical: 400, High: 300, Medium: 200, Low: 100 };
    return (severityWeights[severity] || 200) + confidence / 10;
  };

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "confirmed") {
      const aConfirmations = a.verifiedByCount || 0;
      const bConfirmations = b.verifiedByCount || 0;
      return bConfirmations - aConfirmations;
    } else {
      // Default to AI Priority Score automatic sorting
      return getPriorityWeight(b) - getPriorityWeight(a);
    }
  });

  // Calculate dynamic stats from current database subset
  const totalVerifiedCount = metrics.totalVerifiedCount ?? issues.reduce((acc, i) => acc + (i.verifiedByCount || 0), 0);
  const totalPredictionsGenerated = metrics.totalPredictionsGenerated ?? issues.filter(i => i.analysis).length;

  return (
    <div id="community-dashboard" className="max-w-7xl mx-auto px-6 py-10 space-y-8 text-left relative">
      {/* Background glow effects */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-900 pb-6 relative">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/30 border border-cyan-900/40 rounded-full text-[10px] font-mono text-cyan-400">
            <Cpu className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>AI COMMAND CENTER</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">
            Community Safety & Incident Feed
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
            A continuous feed of verified infrastructure risks, environmental hazards, and utility issues. Dynamic neural diagnostics automatically compute threat indices and predict cascade escalations.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("report")}
          className="px-5 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider rounded-xl shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99] transition-all cursor-pointer shrink-0 self-start md:self-auto"
        >
          + NEW CITIZEN LOG
        </button>
      </div>

      {/* STATISTICS BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Incidents"
          value={metrics.totalIssues}
          subtext="Actively Monitored"
          icon={<BarChart3 className="w-5 h-5 text-cyan-400" />}
          accentColorClass="bg-cyan-950/40 text-cyan-400 border-cyan-900/30"
        />

        <StatsCard
          title="Critical Alerts"
          value={metrics.criticalCount}
          subtext="Immediate Attention"
          icon={<Flame className="w-5 h-5 text-red-400 animate-pulse" />}
          accentColorClass="bg-red-950/40 text-red-400 border-red-900/30"
        />

        <StatsCard
          title="Mitigated Cases"
          value={metrics.resolvedIssues}
          subtext={`${metrics.totalIssues > 0 ? Math.round((metrics.resolvedIssues / metrics.totalIssues) * 100) : 0}% Resolution Rate`}
          icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
          accentColorClass="bg-emerald-950/40 text-emerald-400 border-emerald-900/30"
        />

        <StatsCard
          title="Audits Verified"
          value={totalVerifiedCount}
          subtext="Citizen Attestations"
          icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
          accentColorClass="bg-blue-950/40 text-blue-400 border-blue-900/30"
        />

        <StatsCard
          title="AI Diagnostics"
          value={totalPredictionsGenerated}
          subtext="Cascade Forecasts Live"
          icon={<Cpu className="w-5 h-5 text-purple-400" />}
          accentColorClass="bg-purple-950/40 text-purple-400 border-purple-900/30"
        />
      </div>

      {/* SUB-TABS SELECTOR */}
      <div className="flex border-b border-gray-900 pb-px gap-6 font-mono text-xs">
        <button
          onClick={() => setSubTab("feed")}
          className={`pb-3.5 border-b-2 font-bold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === "feed"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active Incident Feed ({sortedIssues.length})</span>
        </button>

        <button
          onClick={() => setSubTab("map")}
          className={`pb-3.5 border-b-2 font-bold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === "map"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Interactive Radar Map ({issues.length})</span>
        </button>

        <button
          onClick={() => setSubTab("predictions")}
          className={`pb-3.5 border-b-2 font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
            subTab === "predictions"
              ? "border-purple-400 text-purple-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI Predictive Analytics Hub</span>
          <span className="absolute -top-1.5 -right-3 text-[8px] bg-purple-950 text-purple-400 px-1 py-0.5 rounded border border-purple-800/50">NEW</span>
        </button>
      </div>

      {subTab === "feed" ? (
        <>
          {/* INTERACTIVE CONTROLS (Search & Filters) */}
          <div className="space-y-4">
            <SearchBar query={searchTerm} setQuery={setSearchTerm} />
            
            <Filters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSeverity={selectedSeverity}
              setSelectedSeverity={setSelectedSeverity}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={CATEGORIES}
            />
          </div>

          {/* INCIDENT GRID */}
          {sortedIssues.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-850 rounded-2xl bg-gray-950/10 text-gray-400 font-mono space-y-4 max-w-2xl mx-auto">
              <AlertOctagon className="w-10 h-10 text-cyan-400 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">No active reports match the selected filters.</p>
                <p className="text-xs text-gray-500">Try loosening your search query, status settings, or category filters.</p>
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedSeverity("All");
                  setSelectedStatus("All");
                  setSortBy("priority");
                }}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-xs border border-gray-850 text-cyan-400 rounded-lg cursor-pointer transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onSelect={(selected) => {
                    onSelectIssue(selected);
                    setActiveTab("detail");
                  }}
                  onVerify={onVerify}
                  onNotAccurate={onNotAccurate}
                />
              ))}
            </div>
          )}
        </>
      ) : subTab === "map" ? (
        <MapView 
          issues={issues} 
          onSelectIssue={(selected) => {
            onSelectIssue(selected);
            setActiveTab("detail");
          }}
        />
      ) : (
        <AIPredictionHub issues={issues} />
      )}
    </div>
  );
}
