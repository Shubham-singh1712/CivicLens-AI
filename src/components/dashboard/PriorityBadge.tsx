import React from "react";
import { ShieldAlert, AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { IssuePriority, IssueSeverity } from "../../types";

interface PriorityBadgeProps {
  priority: IssuePriority | IssueSeverity;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getBadgeStyle = (lvl: string) => {
    switch (lvl) {
      case "Critical":
      case "Immediate":
        return {
          bg: "bg-red-950/60 text-red-400 border-red-900/60",
          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />,
          label: "IMMEDIATE"
        };
      case "High":
        return {
          bg: "bg-amber-950/60 text-amber-400 border-amber-900/60",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: "HIGH"
        };
      case "Medium":
        return {
          bg: "bg-cyan-950/60 text-cyan-400 border-cyan-900/60",
          icon: <Info className="w-3.5 h-3.5 text-cyan-400" />,
          label: "MEDIUM"
        };
      case "Low":
      default:
        return {
          bg: "bg-gray-950/60 text-gray-400 border-gray-800",
          icon: <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />,
          label: "LOW"
        };
    }
  };

  const badge = getBadgeStyle(priority);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wider ${badge.bg}`}>
      {badge.icon}
      <span>{badge.label}</span>
    </span>
  );
}
