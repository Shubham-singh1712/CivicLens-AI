import React from "react";
import { Hammer, Users, Clock, AlertOctagon, Wrench, Siren } from "lucide-react";
import { CivicIssue } from "../../types";

interface ResolutionPlanProps {
  issue: CivicIssue;
}

export default function ResolutionPlan({ issue }: ResolutionPlanProps) {
  const analysis = issue.analysis;

  if (!analysis) return null;

  const resolution = analysis.resolution;

  // Dynamically derive required resources based on category to satisfy: "Required Resources"
  const getRequiredResources = (category: string, severity: string) => {
    switch (category) {
      case "Water & Sewer":
      case "Water Infrastructure Failure":
        return [
          "Emergency main line bypass conduit",
          "High-flow industrial water evacuation pump",
          "Trench shoring protective steel boxes",
          "Underground utility hydro-excavator"
        ];
      case "Road Infrastructure":
      case "Roadway Pavement Failure":
        return [
          "3.5-ton hot asphalt milling machine",
          "Compactor vibrating rolling drum",
          "Class 2 safety concrete traffic barricades",
          "Rapid-set epoxy structural bonding cement"
        ];
      case "Power & Grid":
      case "Electrical Grid Failure":
        return [
          "High-voltage dielectric bucket utility truck",
          "Insulated hot-line fiber rods",
          "Temporary grid redirection transformer",
          "Ground fault protective testing array"
        ];
      case "Waste & Sanitation":
        return [
          "Hazardous biochemical absorbent blankets",
          "High-pressure hydraulic wash nozzle",
          "Heavy debris vacuum extraction tanker",
          "Sanitation chemical sanitizing fogger"
        ];
      case "Public Safety":
        return [
          "LED emergency directional message board",
          "Class-A high-visibility incident barriers",
          "Temporary tactical detour signage",
          "Municipal police security staging vehicle"
        ];
      default:
        return [
          "Specialized service technician response truck",
          "General utility maintenance tool locker",
          "Standard hazard cordoning safety cones",
          "High-visibility reflective worker safety apparel"
        ];
    }
  };

  const resources = getRequiredResources(issue.category, analysis.vision.severity);

  // Derive "Impact if Ignored" dynamically based on prediction or default it beautifully
  const impactIfIgnored = analysis.prediction?.impactForecast || "Prolonged degradation will lead to severe structural damage of adjacent civil assets, heightened liability risks, and active danger to local resident commute.";

  return (
    <div id={`resolution-plan-${issue.id}`} className="space-y-6 text-left">
      <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
        <Hammer className="w-5 h-5 text-purple-400" />
        <h3 className="font-display font-bold text-lg text-white">
          Resolution Center & Dispatch Strategy
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Department & Priority Card */}
        <div className="bg-gray-950/40 border border-gray-900 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Users className="w-4 h-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Responsible Authority</span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase block">Assigned Dispatch Department</span>
              <p className="font-bold text-white mt-0.5">{resolution.responsibleAuthority}</p>
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase block">Suggested Response Priority</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Siren className="w-4 h-4 text-purple-400" />
                <span className="font-mono font-bold text-purple-400 uppercase">
                  {resolution.priority || "HIGH"} PRIORITY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Schedule Card */}
        <div className="bg-gray-950/40 border border-gray-900 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Action Plan & Schedule</span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase block">Recommended Tactical Action</span>
              <p className="text-gray-300 mt-0.5 leading-relaxed">{resolution.recommendedAction}</p>
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-500 uppercase block">Estimated Resolution Window</span>
              <p className="font-mono font-bold text-cyan-400 mt-0.5 text-sm">{resolution.estimatedResolutionTime}</p>
            </div>
          </div>
        </div>

        {/* Required Resources Card */}
        <div className="bg-gray-950/40 border border-gray-900 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Wrench className="w-4 h-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Required Resources</span>
          </div>
          <div className="space-y-2 text-xs">
            <span className="text-[9px] font-mono text-gray-500 uppercase block">Equip & Crew Requisition</span>
            <ul className="space-y-1.5">
              {resources.map((resItem, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-gray-400 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>{resItem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Impact if Ignored warning footer */}
      <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-mono font-bold text-red-400 block uppercase tracking-wider text-[10px]">
            Critical Threat Cascade Forecast (If Ignored)
          </span>
          <p className="text-gray-300 leading-relaxed">
            {impactIfIgnored}
          </p>
        </div>
      </div>
    </div>
  );
}
