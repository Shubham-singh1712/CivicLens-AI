import React from "react";
import { Filter, SlidersHorizontal, Tag, AlertTriangle, ShieldCheck } from "lucide-react";

interface FiltersProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (sev: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: "newest" | "priority" | "confirmed";
  setSortBy: (sort: "newest" | "priority" | "confirmed") => void;
  categories: string[];
}

export default function Filters({
  selectedCategory,
  setSelectedCategory,
  selectedSeverity,
  setSelectedSeverity,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  categories
}: FiltersProps) {
  return (
    <div id="dashboard-filters-panel" className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/20 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-900 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Filter & Sorting Matrices
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedCategory("All");
            setSelectedSeverity("All");
            setSelectedStatus("All");
            setSortBy("priority");
          }}
          className="text-[10px] font-mono text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          RESET ALL
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-500" />
            <span>Issue Category</span>
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-950 border border-gray-900 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>AI Severity</span>
          </label>
          <div className="relative">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-gray-950 border border-gray-900 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-500" />
            <span>Incident Status</span>
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-950 border border-gray-900 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="reported">New Alert</option>
              <option value="under_review">Under Review</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">Active Repair</option>
              <option value="resolved">Mitigated</option>
            </select>
          </div>
        </div>

        {/* Sorting option */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-500" />
            <span>Sort Strategy</span>
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-gray-950 border border-gray-900 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="priority">AI Priority Score (High → Low)</option>
              <option value="newest">Recent Reports (New → Old)</option>
              <option value="confirmed">Community Confirmed (High → Low)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
