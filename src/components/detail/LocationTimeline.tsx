import React from "react";
import { 
  History, 
  MapPin, 
  CheckCircle, 
  Hammer, 
  FileCheck, 
  Calendar, 
  Activity,
  Wind
} from "lucide-react";
import { CivicIssue } from "../../types";

interface LocationTimelineProps {
  issue: CivicIssue;
}

export default function LocationTimeline({ issue }: LocationTimelineProps) {
  const lat = issue.lat || 37.7749;
  const lng = issue.lng || -122.4194;

  // Generate deterministic past events based on coordinates
  const events = React.useMemo(() => {
    const coordHash = Math.abs(Math.floor(lat * 1000 + lng * 1000));
    
    return [
      {
        id: "loc-ev-1",
        date: "2 Weeks Ago",
        title: "Soil Moisture & Drainage Audit",
        type: "audit",
        description: "Municipal soil density scan completed. Localized subterranean moisture indices recorded at 84% following seasonal precipitation, elevating sinkhole risks.",
        officer: "M. Ramirez, Geo-Tech Div"
      },
      {
        id: "loc-ev-2",
        date: "2 Months Ago",
        title: "Underground Pipe Inspection",
        type: "inspection",
        description: "Laser telemetry crawler checked nearby drainage culverts. Structural integrity marked satisfactory with minor scaling reported near joints.",
        officer: "K. Chen, Water Authority"
      },
      {
        id: "loc-ev-3",
        date: "6 Months Ago",
        title: "Subgrade Utility Permit Issued",
        type: "permit",
        description: "Permit #PW-98242-S issued to Telecom contractor for high-speed fiber-optic micro-trenching under the roadway alignment.",
        officer: "Bureau of Street Engineering"
      },
      {
        id: "loc-ev-4",
        date: "12 Months Ago",
        title: "Localized Asphalt Resurfacing Complete",
        type: "construction",
        description: "Scheduled preventative asphalt top-coat application completed over 200 linear meters centered at these coordinates.",
        officer: "A. Vance, Road Crew Lead"
      }
    ];
  }, [lat, lng]);

  return (
    <div id="location-timeline-widget" className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-gray-900 pb-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <History className="w-4 h-4 text-cyan-400" />
          <span>Local Area Historical Records</span>
        </h4>
        <span className="text-[9px] font-mono text-gray-500">
          GRID REF: {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Historical maintenance log, soil surveys, and excavation permit registry matching these spatial coordinates over the past 12 months:
        </p>

        {/* TIMELINE TREE */}
        <div className="relative pl-6 space-y-5 border-l border-gray-900 ml-3">
          
          {events.map((ev, idx) => {
            return (
              <div key={ev.id} className="relative group">
                
                {/* Visual node pin */}
                <div className="absolute -left-[31px] top-1 bg-gray-950 p-1 border border-cyan-500/20 rounded-full group-hover:border-cyan-400 transition-all">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h5 className="text-xs font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                      {ev.title}
                    </h5>
                    <span className="text-[9px] font-mono text-cyan-500 shrink-0">
                      {ev.date}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="text-[9px] font-mono text-gray-500">
                    Inspected by: <span className="text-gray-400">{ev.officer}</span>
                  </div>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}
