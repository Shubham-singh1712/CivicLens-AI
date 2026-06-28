import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  MapPin, 
  Sparkles, 
  Filter, 
  Search, 
  Navigation, 
  Info, 
  Maximize2, 
  Crosshair, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Activity,
  Layers,
  ChevronRight
} from "lucide-react";
import { CivicIssue } from "../../types";
import { IssueImage } from "../common/IssueImage";

interface MapViewProps {
  issues: CivicIssue[];
  onSelectIssue: (issue: CivicIssue) => void;
}

export default function MapView({ issues, onSelectIssue }: MapViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredIssue, setHoveredIssue] = useState<CivicIssue | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<CivicIssue | null>(null);
  const [radarPulse, setRadarPulse] = useState(true);

  // SVG Container size
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ 
            width: Math.max(width, 300), 
            height: Math.max(height || 380, 380) 
          });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Projections: SF Area Bounds
  const bounds = useMemo(() => {
    return {
      minLat: 37.755,
      maxLat: 37.790,
      minLng: -122.445,
      maxLng: -122.395
    };
  }, []);

  const project = (lat: number, lng: number) => {
    const { minLat, maxLat, minLng, maxLng } = bounds;
    const x = ((lng - minLng) / (maxLng - minLng)) * dimensions.width;
    const y = dimensions.height - ((lat - minLat) / (maxLat - minLat)) * dimensions.height;
    return { x, y };
  };

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesCategory = selectedCategory === "All" || issue.category === selectedCategory;
      const severityStr = issue.analysis?.vision?.severity || "Medium";
      const matchesSeverity = selectedSeverity === "All" || severityStr === selectedSeverity;
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSeverity && matchesSearch;
    });
  }, [issues, selectedCategory, selectedSeverity, searchTerm]);

  // Compute local coordinates for streets to overlay on the SVG background for high-fidelity mapping feel
  const streetSegments = useMemo(() => {
    return [
      // Elm Street Route
      { name: "Elm Street Corridor", points: [ { lat: 37.770, lng: -122.430 }, { lat: 37.775, lng: -122.415 }, { lat: 37.780, lng: -122.400 } ] },
      // I-90 Expressway Westbound
      { name: "I-90 Expressway", points: [ { lat: 37.785, lng: -122.435 }, { lat: 37.780, lng: -122.410 }, { lat: 37.775, lng: -122.398 } ] },
      // Oak Creek Trail path
      { name: "Oak Creek Trail", points: [ { lat: 37.760, lng: -122.435 }, { lat: 37.765, lng: -122.425 }, { lat: 37.772, lng: -122.415 } ] },
      // Broadway Ave
      { name: "Broadway Sector", points: [ { lat: 37.790, lng: -122.425 }, { lat: 37.765, lng: -122.425 } ] }
    ];
  }, []);

  // Find Hotspots/Clusters
  const hotspots = useMemo(() => {
    // Basic spatial density clustering
    const clusters: { centerName: string; lat: number; lng: number; count: number; category: string }[] = [];
    filteredIssues.forEach(issue => {
      const lat = issue.lat || 37.77;
      const lng = issue.lng || -122.42;
      // See if near any existing cluster
      const existing = clusters.find(c => {
        const dLat = Math.abs(c.lat - lat);
        const dLng = Math.abs(c.lng - lng);
        return dLat < 0.008 && dLng < 0.008;
      });
      if (existing) {
        existing.count++;
      } else {
        clusters.push({
          centerName: issue.address.split(",")[0] || "Municipal Sector",
          lat,
          lng,
          count: 1,
          category: issue.category
        });
      }
    });
    return clusters.sort((a, b) => b.count - a.count).slice(0, 3);
  }, [filteredIssues]);

  // Handle GPS location permissions and center mapping
  const requestGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Device coordinates locked:", position.coords);
          // Highlight closest issue
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          let closest: CivicIssue | null = null;
          let minDist = Infinity;
          issues.forEach(issue => {
            if (issue.lat && issue.lng) {
              const d = Math.pow(issue.lat - userLat, 2) + Math.pow(issue.lng - userLng, 2);
              if (d < minDist) {
                minDist = d;
                closest = issue;
              }
            }
          });
          if (closest) {
            setSelectedPoint(closest);
          }
        },
        (error) => {
          console.warn("User declined or GPS timed out:", error.message);
        }
      );
    }
  };

  return (
    <div id="civic-map-view" className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      
      {/* MAP CONTROLS & SIDEBAR */}
      <div className="space-y-6">
        
        {/* Local Scope Search */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
            Map Controls & Filters
          </span>

          <div className="relative">
            <input
              type="text"
              placeholder="Search address or hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-950/60 border border-gray-900 text-xs text-gray-200 placeholder-gray-500 rounded-xl focus:border-cyan-400 transition-colors pl-9"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono text-gray-500 block mb-1">CATEGORY</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-950 border border-gray-900 text-xs text-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Road Infrastructure">Road Infrastructure</option>
                <option value="Water & Sewer">Water & Sewer</option>
                <option value="Power & Grid">Power & Grid</option>
                <option value="Waste & Sanitation">Waste & Sanitation</option>
                <option value="Public Safety">Public Safety</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-500 block mb-1">HAZARD SEVERITY</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-950 border border-gray-900 text-xs text-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <button
            onClick={requestGPS}
            className="w-full py-2.5 bg-cyan-950/50 hover:bg-cyan-900/40 border border-cyan-800/40 text-cyan-400 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Locate Nearest Incident</span>
          </button>
        </div>

        {/* CLUSTERED HOTSPOTS PANEL */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 block">
            High Density Hotspots ({hotspots.length})
          </span>

          <div className="space-y-3">
            {hotspots.map((spot, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-gray-950/40 border border-gray-900 rounded-xl flex items-center justify-between gap-3 hover:border-gray-850 transition-all"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-gray-200">{spot.centerName}</div>
                  <div className="text-[10px] font-mono text-gray-500">
                    Coords: {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 bg-red-950/40 border border-red-900/50 rounded text-[9px] font-mono text-red-400 font-extrabold uppercase block text-center mb-1">
                    {spot.count} {spot.count === 1 ? "Report" : "Cluster"}
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono block">{spot.category.split(" ")[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* INTERACTIVE VECTOR SCREEN MAP */}
      <div className="lg:col-span-2 space-y-4">
        <div 
          ref={containerRef}
          className="relative w-full rounded-2xl border border-gray-900 bg-gray-950 overflow-hidden select-none shadow-inner group"
          style={{ height: "460px" }}
        >
          {/* MAP BACKGROUND DECORATIVE GRID LINES */}
          <div className="absolute inset-0 bg-grid-line opacity-[0.06] pointer-events-none" />
          
          {/* FLOATING COORDINATE COMPASS */}
          <div className="absolute top-4 left-4 bg-gray-950/80 border border-gray-900 px-3 py-1.5 rounded-lg text-[9px] font-mono text-gray-400 pointer-events-none space-y-0.5 shadow-md">
            <div>RADAR SCOPE: SF REGIONAL GRID</div>
            <div className="text-cyan-400 font-bold">GRID SYNCED &bull; ACTIVE</div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setRadarPulse(!radarPulse)}
              className={`p-2 bg-gray-950/80 border border-gray-900 rounded-lg text-gray-400 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-md`}
            >
              <Activity className={`w-3.5 h-3.5 ${radarPulse ? "text-cyan-400 animate-pulse" : ""}`} />
              <span className="font-mono text-[9px] uppercase">Telemetry pulse</span>
            </button>
          </div>

          {/* SVG RENDERING FOR ROADS & DATA POINTS */}
          <svg 
            width="100%" 
            height="100%" 
            className="absolute inset-0"
          >
            {/* Compass radial concentric circles centered in map */}
            <circle cx="50%" cy="50%" r="80" fill="none" stroke="rgba(34, 211, 238, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="160" fill="none" stroke="rgba(34, 211, 238, 0.04)" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="240" fill="none" stroke="rgba(34, 211, 238, 0.02)" strokeWidth="1" strokeDasharray="2 2" />

            {/* Simulated streets vector grid paths */}
            {streetSegments.map((segment, index) => {
              const dPath = segment.points.map((p, pIdx) => {
                const { x, y } = project(p.lat, p.lng);
                return `${pIdx === 0 ? "M" : "L"} ${x} ${y}`;
              }).join(" ");

              return (
                <g key={index} className="opacity-40 hover:opacity-80 transition-opacity">
                  <path
                    d={dPath}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d={dPath}
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="1"
                    strokeDasharray="6 12"
                    className="animate-pulse"
                  />
                </g>
              );
            })}

            {/* Render interactive incident points */}
            {filteredIssues.map((issue) => {
              const lat = issue.lat || 37.77;
              const lng = issue.lng || -122.42;
              const { x, y } = project(lat, lng);
              
              const severity = issue.analysis?.vision?.severity || "Medium";
              const isHovered = hoveredIssue?.id === issue.id;
              const isSelected = selectedPoint?.id === issue.id;

              // Color coordinate based on severity
              let markerColor = "#06b6d4"; // Cyan default
              let glowColor = "rgba(6, 182, 212, 0.3)";
              if (severity === "Critical") {
                markerColor = "#ef4444"; // Red
                glowColor = "rgba(239, 68, 68, 0.4)";
              } else if (severity === "High") {
                markerColor = "#f59e0b"; // Amber
                glowColor = "rgba(245, 158, 11, 0.4)";
              }

              return (
                <g 
                  key={issue.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedPoint(issue)}
                  onMouseEnter={() => setHoveredIssue(issue)}
                  onMouseLeave={() => setHoveredIssue(null)}
                >
                  {/* Outer breathing/radar sweep circle */}
                  {radarPulse && (
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isHovered || isSelected ? 24 : 14} 
                      fill="none" 
                      stroke={markerColor} 
                      strokeWidth="1.5" 
                      className="animate-ping"
                      opacity="0.3"
                    />
                  )}

                  {/* Pulsing halo */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered || isSelected ? 12 : 8}
                    fill={glowColor}
                    className="transition-all"
                  />

                  {/* Core marker circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 1.5 : 1}
                    className="transition-all"
                  />

                  {/* Micro label above marker when hovered */}
                  {(isHovered || isSelected) && (
                    <g transform={`translate(${x}, ${y - 12})`}>
                      <rect
                        x="-50"
                        y="-22"
                        width="100"
                        height="16"
                        rx="4"
                        fill="#030712"
                        stroke={markerColor}
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="-11"
                        textAnchor="middle"
                        fill="#f3f4f6"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {issue.category.split(" ")[0]} ({severity})
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* DYNAMIC SELECTED INCIDENT CARD PANEL IN MAP FLOOR */}
          {selectedPoint && (
            <div className="absolute bottom-4 left-4 right-4 bg-gray-950/95 border border-cyan-900/60 p-4 rounded-xl flex items-center justify-between gap-4 animate-slide-up shadow-xl backdrop-blur-md">
              <div className="flex gap-3.5 min-w-0">
                <IssueImage
                  src={selectedPoint.imageUrl}
                  alt={selectedPoint.title}
                  title={selectedPoint.title}
                  className="w-14 h-14 object-cover rounded-lg border border-gray-900 shrink-0"
                />
                <div className="min-w-0 text-left space-y-1">
                  <div className="text-xs font-bold text-gray-100 line-clamp-1">{selectedPoint.title}</div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{selectedPoint.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase ${
                      selectedPoint.analysis?.vision?.severity === "Critical"
                        ? "bg-red-950/60 text-red-400 border border-red-900/50"
                        : selectedPoint.analysis?.vision?.severity === "High"
                        ? "bg-amber-950/60 text-amber-400 border border-amber-900/50"
                        : "bg-blue-950/60 text-blue-400 border border-blue-900/50"
                    }`}>
                      {selectedPoint.analysis?.vision?.severity || "Medium"}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase">
                      {selectedPoint.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-850 border border-gray-850 text-gray-400 hover:text-white rounded-lg text-[10px] font-mono transition-all cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={() => onSelectIssue(selectedPoint)}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <span>Analyze Case</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* NO FILTERED RESULTS NOTICE */}
          {filteredIssues.length === 0 && (
            <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6 text-gray-400 font-mono space-y-3">
              <AlertTriangle className="w-8 h-8 text-cyan-500 animate-pulse" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-white uppercase tracking-wider">No matching hazards in active sector</p>
                <p className="text-gray-500">Adjust the category, search term, or severity limits to sync.</p>
              </div>
            </div>
          )}
        </div>

        {/* MAP LEGEND / EXPLANATION FOOTER */}
        <div className="p-4 bg-gray-950/40 border border-gray-900 rounded-xl flex flex-wrap justify-between items-center gap-3 text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
            <span className="mr-4">Critical</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
            <span className="mr-4">High</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 block"></span>
            <span>Medium / Low</span>
          </div>

          <div>
            Showing <strong className="text-gray-200">{filteredIssues.length}</strong> of {issues.length} active logs
          </div>
        </div>
      </div>

    </div>
  );
}
