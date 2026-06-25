import React, { useState, useEffect } from "react";
import { 
  Compass, 
  MapPin, 
  GitMerge, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  RefreshCw 
} from "lucide-react";
import { CivicIssue } from "../../types";

interface NearbyIssuesProps {
  currentIssue: CivicIssue;
  allIssues: CivicIssue[];
  onSelectRelated: (issue: CivicIssue) => void;
}

export default function NearbyIssues({ currentIssue, allIssues, onSelectRelated }: NearbyIssuesProps) {
  const [loading, setLoading] = useState(false);
  const [mergeStatus, setMergeStatus] = useState<{ [key: string]: "idle" | "merging" | "success" | "error" }>({});

  const lat1 = currentIssue.lat || 37.7749;
  const lng1 = currentIssue.lng || -122.4194;

  // Geodesic distance approximation (in Kilometers)
  const getDistance = (lat2: number, lng2: number) => {
    const dLat = (lat2 - lat1) * 111.32;
    const dLon = (lng2 - lng1) * 111.32 * Math.cos((lat1 * Math.PI) / 180);
    return Math.sqrt(dLat * dLat + dLon * dLon);
  };

  // Filter issues within 5 km range
  const spatialIssues = React.useMemo(() => {
    return allIssues
      .filter(issue => issue.id !== currentIssue.id && issue.lat && issue.lng)
      .map(issue => {
        const distance = getDistance(issue.lat!, issue.lng!);
        return {
          ...issue,
          distance
        };
      })
      .filter(issue => issue.distance <= 5.0) // 5 km max radius
      .sort((a, b) => a.distance - b.distance);
  }, [allIssues, currentIssue.id, lat1, lng1]);

  // Cluster similar reports (overlapping category within 1.5 km)
  const duplicateClusters = React.useMemo(() => {
    return spatialIssues.filter(
      issue => issue.category === currentIssue.category && issue.distance <= 1.5 && issue.status !== "resolved"
    );
  }, [spatialIssues, currentIssue.category]);

  const handleMerge = async (parentId: string) => {
    setMergeStatus(prev => ({ ...prev, [parentId]: "merging" }));
    try {
      const res = await fetch(`/api/issues/${currentIssue.id}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mergeIntoId: parentId })
      });
      if (res.ok) {
        setMergeStatus(prev => ({ ...prev, [parentId]: "success" }));
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Merge failed");
      }
    } catch (err) {
      console.error(err);
      setMergeStatus(prev => ({ ...prev, [parentId]: "error" }));
    }
  };

  return (
    <div id="nearby-issues-panel" className="space-y-6 text-left">
      
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-gray-900 pb-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Spatial Proximity Scanning ({spatialIssues.length})</span>
        </h4>
        <span className="text-[9px] font-mono text-gray-500">
          SCANNING RADIUS: 5.0 KM
        </span>
      </div>

      {/* DUPLICATE CONSOLIDATION CARD */}
      {duplicateClusters.length > 0 && currentIssue.status !== "resolved" && (
        <div className="p-4 bg-purple-950/10 border border-purple-900/30 rounded-2xl space-y-4">
          <div className="flex items-start gap-3">
            <GitMerge className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1 text-xs">
              <span className="font-mono font-bold text-purple-400 block uppercase tracking-wider text-[10px]">
                PROXIMITY CLUSTER ALERT
              </span>
              <p className="text-gray-300 leading-relaxed">
                We detected <strong>{duplicateClusters.length}</strong> matching report(s) in active service within 1.5 kilometers of this hazard. Select 'Merge' to aggregate community upvotes and speed up municipal resolution times.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {duplicateClusters.map(item => {
              const statusState = mergeStatus[item.id] || "idle";
              return (
                <div key={item.id} className="p-3 bg-gray-950/60 border border-gray-900 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex gap-2.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-gray-900 shrink-0"
                    />
                    <div className="min-w-0 text-xs">
                      <div className="font-bold text-gray-200 truncate">{item.title}</div>
                      <div className="text-[10px] text-purple-400 font-mono">
                        {item.distance.toFixed(2)} km away &bull; {item.upvotes} upvotes
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMerge(item.id)}
                    disabled={statusState !== "idle"}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold shrink-0 transition-all cursor-pointer ${
                      statusState === "merging"
                        ? "bg-purple-950 text-purple-400 border border-purple-800 animate-pulse"
                        : statusState === "success"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-purple-900 hover:bg-purple-800 text-white border border-purple-700 shadow-sm"
                    }`}
                  >
                    Merge Report
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST OF ALL PROXIMITY ISSUES */}
      <div className="space-y-3">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
          Nearby Municipal Hazards
        </span>

        {spatialIssues.length === 0 ? (
          <p className="text-xs text-gray-500 font-mono py-6 text-center border border-dashed border-gray-900 rounded-xl">
            No active reports cataloged within 5 kilometers of these coordinates.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {spatialIssues.slice(0, 4).map((issue) => (
              <div
                key={issue.id}
                onClick={() => onSelectRelated(issue)}
                className="bg-gray-950/30 hover:bg-gray-950/60 border border-gray-900 hover:border-gray-850 p-3 rounded-xl flex gap-3 cursor-pointer transition-all group"
              >
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover rounded-lg border border-gray-900 shrink-0"
                />
                <div className="min-w-0 space-y-1 text-xs text-left flex-1">
                  <h4 className="font-bold text-gray-200 truncate group-hover:text-cyan-400 transition-colors">
                    {issue.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{issue.distance.toFixed(2)} km away</span>
                  </div>
                  <span className="inline-block px-1.5 py-0.5 bg-gray-900 border border-gray-850 rounded text-[8px] font-mono text-gray-400 uppercase">
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
