import React from "react";
import { 
  Building2, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { CivicIssue } from "../../types";

interface SmartRoutingCardProps {
  issue: CivicIssue;
}

export default function SmartRoutingCard({ issue }: SmartRoutingCardProps) {
  const category = issue.category || "Road Infrastructure";

  // Compute smart routing data dynamically
  const routingData = React.useMemo(() => {
    switch (category) {
      case "Road Infrastructure":
        return {
          department: "Bureau of Street Services & Asphalt Operations",
          division: "Pavement & Roadway Restoration Div",
           hotline: "311 - Ext 14",
          priority: "High Priority Routing",
          sla: "24-48 Hours Emergency Response",
          details: "Road hazards and subgrade collapses are auto-routed directly to heavy construction division crews equipped with quick-setting polymer concrete mixes."
        };
      case "Water & Sewer":
        return {
          department: "Department of Water Resources & Sanitary Sewers",
          division: "Main Line Isolation & Pressure Safety",
          hotline: "311 - Ext 22",
          priority: "Immediate Safety Critical",
          sla: "12-18 Hours Action SLA",
          details: "Pressurized water main leaks and sidewalk undermining require prompt valve shutoffs and chemical soil stabilization, pre-empting sinkhole development."
        };
      case "Power & Grid":
      case "Electricity":
        return {
          department: "Municipal Power, Grid & Electrical Engineering",
          division: "High-Voltage Cordon & Infrastructure Safety",
          hotline: "311 - Ext 09",
          priority: "Immediate Safety Critical",
          sla: "4-12 Hours Cordon SLA",
          details: "Downed lines and live electrical transformers represent instant lethal hazards. Auto-triggers grid isolation signals to prevent severe safety exposure."
        };
      case "Waste & Sanitation":
      case "Sanitation":
        return {
          department: "Environmental Protection & Waste Management",
          division: "Hazmat Material Controls & Illegal Dumping Audit",
          hotline: "311 - Ext 35",
          priority: "Medium Routing",
          sla: "2-3 Days Removal SLA",
          details: "Hazardous fluids or battery disposal cases are assigned to environmental remediation units to safeguard local drainage basins."
        };
      case "Public Safety":
        return {
          department: "Department of Emergency Services & Public Safety",
          division: "Municipal Safe Streets & Barrier Enforcement",
          hotline: "911 (Emergency) or 311 - Ext 01",
          priority: "Immediate Safety Critical",
          sla: "Immediate / Under 2 Hours",
          details: "Structural building fatigue or active sidewalk debris requires public safety police blockades and emergency warning cones placement."
        };
      case "Traffic":
        return {
          department: "Transit Authority & Traffic Signal Systems",
          division: "Metropolitan Signal & Intelligent Highway Control",
          hotline: "311 - Ext 18",
          priority: "High Priority Routing",
          sla: "12-24 Hours",
          details: "Broken intersection signals or damaged road signs are routed to street electrical dispatchers to prevent multi-vehicle collisions."
        };
      default:
        return {
          department: "Bureau of Public Works & Community Maintenance",
          division: "General Municipal Support Division",
          hotline: "311 - Ext 10",
          priority: "Standard Priority",
          sla: "3-5 Business Days",
          details: "Uncategorized report logged. Reviewed by central municipal routing team to assign custom engineering personnel."
        };
    }
  }, [category]);

  return (
    <div id="smart-routing-card" className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-gray-900 pb-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>AI Smart Routing & Dispatch</span>
        </h4>
        <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded">
          INTELLIGENT SLA
        </span>
      </div>

      <div className="space-y-3.5">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">RECOMMENDED DEPARTMENT</span>
          <div className="text-sm font-extrabold text-gray-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{routingData.department}</span>
          </div>
          <div className="text-xs text-gray-400 font-mono pl-5">{routingData.division}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-gray-900/40 font-mono text-[11px]">
          <div>
            <span className="text-[9px] text-gray-500 block uppercase">DISPATCH HOTLINE</span>
            <div className="text-gray-200 font-bold flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-cyan-400" />
              <span>{routingData.hotline}</span>
            </div>
          </div>
          <div>
            <span className="text-[9px] text-gray-500 block uppercase">TARGET SLA RESPONSE</span>
            <div className="text-gray-200 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{routingData.sla}</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-950/60 border border-gray-900 rounded-xl space-y-2 text-xs">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block flex items-center gap-1 font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>Smart Dispatch Rule Matrix</span>
          </span>
          <p className="text-gray-400 leading-relaxed font-mono text-[11px]">
            {routingData.details}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 bg-gray-950/20 p-2.5 rounded border border-gray-900/40">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Signal Category Match Confidence:</span>
          </div>
          <span className="font-bold text-gray-200">
            {issue.analysis?.vision?.confidence || 95}%
          </span>
        </div>
      </div>
    </div>
  );
}
