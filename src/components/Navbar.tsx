import React from "react";
import { motion } from "motion/react";
import { Shield, BarChart3, AlertTriangle, Award } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats?: {
    totalIssues: number;
    resolvedIssues: number;
    criticalCount: number;
  };
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const navItems = [
    { id: "landing", label: "Overview", icon: Shield },
    { id: "dashboard", label: "Citizen Feed", icon: BarChart3 },
    { id: "report", label: "Report Issue", icon: AlertTriangle },
    { id: "hackathon", label: "AI Command Center", icon: Award },
  ];

  return (
    <header 
      id="nav-header" 
      className="sticky top-0 z-50 w-full bg-gray-950/95 border-b border-gray-900 backdrop-blur-md px-6 h-18 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 h-full">
        
        {/* Left Side: Logo & Subtitle */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={() => setActiveTab("landing")} 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          id="nav-logo"
        >
          <div className="p-1.5 bg-gradient-to-tr from-cyan-500 via-cyan-400 to-purple-600 rounded-lg shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <h1 className="font-display font-extrabold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
              CivicLens <span className="text-[8px] md:text-[9px] bg-cyan-950/60 text-cyan-400 border border-cyan-900/60 px-1.5 py-0.25 rounded font-mono font-bold tracking-wide">AI AGENT</span>
            </h1>
            <p className="text-[8px] md:text-[9px] text-gray-500 font-mono tracking-wider uppercase mt-1">
              AI Civic Intelligence
            </p>
          </div>
        </motion.div>

        {/* Center: SaaS Navigation Menu */}
        <nav 
          id="nav-tabs" 
          className="hidden md:flex items-stretch h-full bg-gray-950/40 border border-gray-900/80 rounded-xl p-0.5"
        >
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === "dashboard" && activeTab === "detail");
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold font-sans tracking-wide transition-all duration-300 select-none cursor-pointer w-[140px] ${
                  isActive
                    ? "text-cyan-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {/* Soft background on hover / active */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-cyan-950/10 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${isActive ? "text-cyan-400" : "text-gray-500"}`} />
                <span>{tab.label}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-border"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-400 shadow-[0_1px_8px_rgba(34,211,238,0.6)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation fallback (scrollable bar) */}
        <nav 
          id="nav-tabs-mobile" 
          className="flex md:hidden items-center gap-1 overflow-x-auto scrollbar-none py-1 max-w-[200px] xs:max-w-[260px] sm:max-w-sm"
        >
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === "dashboard" && activeTab === "detail");
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-950/40 text-cyan-400 border border-cyan-900/50"
                    : "text-gray-400"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side: Small System Status Badge */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="nav-system-status" 
          className="flex items-center gap-2 md:gap-3 text-xs font-mono shrink-0"
        >
          {/* AI Online Status */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-900/60 border border-gray-850 rounded-lg shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider">AI Online</span>
            <span className="text-gray-800">|</span>
            <span className="text-[9px] md:text-[10px] text-cyan-400 font-extrabold uppercase">Gemini 3.5 Flash</span>
          </div>

          {/* Average response */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-gray-900/60 border border-gray-850 rounded-lg shadow-sm text-[10px]">
            <span className="text-gray-500 uppercase font-bold text-[9px]">Avg Response</span>
            <span className="text-gray-800">:</span>
            <span className="font-extrabold text-purple-400">2.1s</span>
          </div>
        </motion.div>

      </div>
    </header>
  );
}
