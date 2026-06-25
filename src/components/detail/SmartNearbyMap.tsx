import React, { useState, useEffect } from "react";
import { 
  Layers, 
  MapPin, 
  Radio, 
  Navigation, 
  AlertTriangle, 
  Info 
} from "lucide-react";
import { CivicIssue } from "../../types";

interface SmartNearbyMapProps {
  issue: CivicIssue;
  allIssues: CivicIssue[];
}

export default function SmartNearbyMap({ issue, allIssues }: SmartNearbyMapProps) {
  // Layers Toggles
  const [showNearby, setShowNearby] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showRadius, setShowRadius] = useState(true);
  const [showSLARoute, setShowSLARoute] = useState(true);
  const [activeOverlayDetails, setActiveOverlayDetails] = useState<string | null>(null);

  // Find nearby issues in the dataset within some mock proximity
  const nearbyIssues = allIssues.filter(other => 
    other.id !== issue.id && 
    (other.category === issue.category || Math.abs(other.lat - issue.lat) < 0.01)
  ).slice(0, 3);

  // Suggested routing depot mock
  const closestDepot = {
    name: issue.analysis?.resolution?.responsibleAuthority || "Municipal Bureau",
    lat: issue.lat + 0.004,
    lng: issue.lng - 0.005,
    distance: "1.2 km"
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-gray-850 bg-gray-950/40 text-left space-y-4">
      
      {/* Title & Controls */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Tactical GIS & Risk Zone Overlay
          </h3>
          <p className="text-xs text-gray-400">Interactive spatial AI telemetry map</p>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-1.5 bg-black/40 p-1.5 rounded-xl border border-gray-900">
          <button
            onClick={() => setShowNearby(!showNearby)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
              showNearby 
                ? "bg-amber-950/40 text-amber-400 border border-amber-800/40" 
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <MapPin className="w-3 h-3" />
            Nearby
          </button>
          
          <button
            onClick={() => setShowRiskZones(!showRiskZones)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
              showRiskZones 
                ? "bg-red-950/40 text-red-400 border border-red-800/40" 
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            AI Risk Zones
          </button>
          
          <button
            onClick={() => setShowRadius(!showRadius)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
              showRadius 
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-800/40" 
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Radio className="w-3 h-3" />
            Radius
          </button>
          
          <button
            onClick={() => setShowSLARoute(!showSLARoute)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
              showSLARoute 
                ? "bg-blue-950/40 text-blue-400 border border-blue-800/40" 
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Navigation className="w-3 h-3" />
            Routing
          </button>
        </div>
      </div>

      {/* Map Stage */}
      <div className="relative h-[280px] rounded-xl overflow-hidden border border-gray-900 bg-gray-950/80 flex items-center justify-center select-none">
        
        {/* Abstract Radar Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-gray-700/30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full border border-gray-700/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-gray-700/5"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gray-900/40"></div>
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gray-900/40"></div>

        {/* 1. Affected Radius Circle */}
        {showRadius && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-dashed border-cyan-500/30 bg-cyan-950/[0.04] animate-pulse">
            <span className="absolute top-1 left-1 font-mono text-[8px] text-cyan-500/80 uppercase">
              500m Impact Radius
            </span>
          </div>
        )}

        {/* 2. AI Predicted Risk Polygons (Heat Map Zone) */}
        {showRiskZones && (
          <div 
            onClick={() => setActiveOverlayDetails(`AI Predicted Risk Zone: Shaded red polygon indicates estimated 35% probability of physical erosion spreading along the local drainage grid.`)}
            className="absolute top-[35%] left-[40%] w-[120px] h-[90px] bg-red-900/[0.12] border border-red-500/30 rounded-[35%_65%_40%_60%] blur-[2px] transition hover:bg-red-900/[0.22] cursor-pointer group flex items-center justify-center"
          >
            <span className="font-mono text-[8px] text-red-400 font-extrabold opacity-60 group-hover:opacity-100 transition">
              RISK EXPANSION ZONE
            </span>
          </div>
        )}

        {/* 3. SLA Dispatch Route Vector Line */}
        {showSLARoute && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Draw line from Center (1/2, 1/2) to Depot (top-left) */}
            <line 
              x1="50%" 
              y1="50%" 
              x2="25%" 
              y2="28%" 
              stroke="#60a5fa" 
              strokeWidth="2" 
              strokeDasharray="4,4"
              className="animate-[dash_10s_linear_infinite]"
            />
          </svg>
        )}

        {/* 4. Suggested Department / Depot Pin */}
        {showSLARoute && (
          <div 
            style={{ top: "28%", left: "25%" }}
            onClick={() => setActiveOverlayDetails(`Dispatcher Source: "${closestDepot.name}". SLA priority routing dispatched at distance: ${closestDepot.distance}.`)}
            className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-lg border border-blue-500/40 bg-blue-950 text-blue-400 hover:scale-105 transition cursor-pointer flex items-center gap-1 z-20"
          >
            <Navigation className="w-3 h-3 text-blue-400" />
            <span className="font-mono text-[8px] font-bold">DEPOT A (1.2km)</span>
          </div>
        )}

        {/* 5. Nearby Issue Markers */}
        {showNearby && nearbyIssues.map((other, idx) => {
          // Offsets for mock map scattering
          const offsets = [
            { top: "65%", left: "70%" },
            { top: "22%", left: "62%" },
            { top: "78%", left: "30%" }
          ];
          const pos = offsets[idx % offsets.length];

          return (
            <div 
              key={other.id}
              style={pos}
              onClick={() => setActiveOverlayDetails(`Nearby Conflict: "${other.title}" located at ${other.address}. Category match: ${other.category}. Consolidating these logs will save dispatch expenses.`)}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full border border-amber-500 bg-amber-950 hover:scale-110 transition cursor-pointer z-20 group"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 border border-amber-800/50 text-[9px] text-amber-300 rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none font-mono">
                {other.title.slice(0, 16)}...
              </div>
            </div>
          );
        })}

        {/* 6. Current Primary Incident Core Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-cyan-500/40 animate-ping"></span>
            <div className="p-2.5 rounded-full border border-cyan-400 bg-cyan-950 text-cyan-300 shadow-lg shadow-cyan-500/20">
              <MapPin className="w-4 h-4 fill-cyan-400" />
            </div>
          </div>
          <span className="mt-1.5 font-mono text-[8px] font-extrabold text-white bg-cyan-950/80 border border-cyan-800 px-1.5 py-0.5 rounded shadow">
            INCIDENT CORE
          </span>
        </div>

      </div>

      {/* Info Display / Details Inspector Box */}
      <div className="p-3.5 rounded-xl border border-gray-900 bg-black/30 min-h-[56px] flex items-start gap-2.5 transition-all">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-gray-400 leading-normal">
          {activeOverlayDetails ? (
            <div>
              <span className="font-bold text-gray-200">Map Inspector: </span>
              {activeOverlayDetails}
            </div>
          ) : (
            <span>
              Click on the active elements on the tactical map (markers, risk zones, routing depot pins) to inspect advanced GIS properties and consolidated duplicates.
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
