import React, { useState, useEffect } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  accentColorClass: string;
}

export default function StatsCard({ title, value, subtext, icon, accentColorClass }: StatsCardProps) {
  const [displayVal, setDisplayVal] = useState<number | string>(0);

  useEffect(() => {
    if (typeof value === "number") {
      let start = 0;
      const end = value;
      if (end === 0) {
        setDisplayVal(0);
        return;
      }
      const duration = 600; // ms
      const increment = end / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setDisplayVal(end);
          clearInterval(timer);
        } else {
          setDisplayVal(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setDisplayVal(value);
    }
  }, [value]);

  return (
    <div id={`stats-card-${title.toLowerCase().replace(/\s+/g, "-")}`} className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/30 flex items-start gap-4 hover:border-gray-700 transition-all hover:scale-[1.02] duration-300">
      <div className={`p-3 rounded-xl border shrink-0 ${accentColorClass}`}>
        {icon}
      </div>
      <div className="space-y-1 min-w-0">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-2xl font-extrabold text-white tracking-tight block">
          {displayVal}
        </span>
        <span className="text-[10px] text-gray-400 font-mono block truncate">
          {subtext}
        </span>
      </div>
    </div>
  );
}
