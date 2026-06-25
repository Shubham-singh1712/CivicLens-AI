import React from "react";
import { Shield, BarChart3, AlertTriangle, CheckCircle, Flame, Award } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: {
    totalIssues: number;
    resolvedIssues: number;
    criticalCount: number;
  };
}

export default function Navbar({ activeTab, setActiveTab, stats }: NavbarProps) {
  return (
    <header id="nav-header" className="sticky top-0 z-50 w-full glass-panel border-b border-gray-800 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div 
          onClick={() => setActiveTab("landing")} 
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-logo"
        >
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              CivicLens <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full font-mono font-medium">AI AGENT</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-wider">FROM REPORTING TO RESOLUTION</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav id="nav-tabs" className="flex items-center gap-1.5 bg-gray-950/80 p-1 rounded-xl border border-gray-800">
          {[
            { id: "landing", label: "Overview", icon: Shield },
            { id: "dashboard", label: "Citizen Feed", icon: BarChart3 },
            { id: "report", label: "Report Issue", icon: AlertTriangle },
            { id: "hackathon", label: "Judge Portal", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === "dashboard" && activeTab === "detail");
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-950 to-purple-950 text-cyan-400 border border-cyan-800/50 shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Quick Statistics Hub */}
        <div id="nav-quick-stats" className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/30 border border-cyan-900/50 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-gray-400">Total Cases:</span>
            <span className="font-bold text-cyan-300">{stats.totalIssues}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-950/30 border border-purple-900/50 rounded-lg">
            <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-gray-400">Resolved:</span>
            <span className="font-bold text-purple-300">
              {stats.totalIssues > 0 ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100) : 0}%
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/30 border border-red-900/40 rounded-lg">
            <Flame className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span className="text-gray-400">Critical:</span>
            <span className="font-bold text-red-300">{stats.criticalCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
