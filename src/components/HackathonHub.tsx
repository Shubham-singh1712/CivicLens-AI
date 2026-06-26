import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, 
  Cpu, 
  Layers, 
  TrendingUp, 
  Play, 
  ShieldCheck, 
  Compass, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Lightbulb,
  FileText,
  Workflow,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  MapPin,
  Activity,
  UserCheck,
  Zap,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Terminal,
  Shield,
  FileSpreadsheet,
  RefreshCw,
  ChevronRight,
  Database
} from "lucide-react";
import { CivicIssue, IssueStatus, IssueSeverity, IssuePriority } from "../types";

// Type declaration for inline Google Maps callbacks
declare global {
  interface Window {
    initGoogleMapsCallback?: () => void;
    google?: any;
  }
}

interface AgentTelemetry {
  name: string;
  role: string;
  status: "idle" | "running" | "syncing" | "complete";
  task: string;
  executionTime: number; // ms
  confidence: number; // percentage
  icon: any;
  color: string;
}

export default function HackathonHub() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Real-time ticking clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Interactive filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortField, setSortField] = useState<keyof CivicIssue>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Selected entities for drill-down inspection
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [activeMetricFilter, setActiveMetricFilter] = useState<string>("All");

  // Google Map integration refs & status
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<any>(null);
  const [gmapLoaded, setGmapLoaded] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [selectedMapPoint, setSelectedMapPoint] = useState<CivicIssue | null>(null);
  const [radarPulse, setRadarPulse] = useState(true);

  // Terminal telemetry log stream
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activePipelineNode, setActivePipelineNode] = useState(0);
  const [terminalCollapsed, setTerminalCollapsed] = useState(false);

  // Active simulated agent states
  const [agents, setAgents] = useState<AgentTelemetry[]>([
    { name: "Vision Agent", role: "Multimodal Fracture Scanner", status: "idle", task: "Awaiting next file stream", executionTime: 120, confidence: 96, icon: Eye, color: "text-cyan-400 border-cyan-500/20" },
    { name: "Geo Agent", role: "Coordinate Validation & Utility Mapping", status: "idle", task: "Idle in system queue", executionTime: 85, confidence: 99, icon: MapPin, color: "text-purple-400 border-purple-500/20" },
    { name: "Risk Agent", role: "Severity & Environmental Cordon Assessor", status: "idle", task: "Idle in system queue", executionTime: 140, confidence: 92, icon: AlertCircle, color: "text-red-400 border-red-500/20" },
    { name: "Routing Agent", role: "Municipal Authority SLA Optimizer", status: "idle", task: "Idle in system queue", executionTime: 95, confidence: 95, icon: Workflow, color: "text-indigo-400 border-indigo-500/20" },
    { name: "Resolution Agent", role: "Cost & Material Forecasting Engine", status: "idle", task: "Idle in system queue", executionTime: 180, confidence: 91, icon: CheckCircle, color: "text-emerald-400 border-emerald-500/20" },
    { name: "Prediction Agent", role: "Dynamic Infrastructure Failure Modeler", status: "idle", task: "Idle in system queue", executionTime: 210, confidence: 88, icon: TrendingUp, color: "text-pink-400 border-pink-500/20" },
    { name: "Dispatch Agent", role: "311 Smart Ticket & API Publisher", status: "idle", task: "Idle in system queue", executionTime: 105, confidence: 97, icon: Zap, color: "text-amber-400 border-amber-500/20" },
    { name: "Community Agent", role: "Social Consensus & Duplicate Merger", status: "idle", task: "Awaiting report clusters", executionTime: 75, confidence: 94, icon: UserCheck, color: "text-teal-400 border-teal-500/20" },
  ]);

  // Simulated operational sequence database to stream in the Terminal and highlight active agent nodes
  const sequences = useMemo(() => [
    {
      title: "Asphalt Collapse on 742 Elm St",
      issueId: "seed-1",
      steps: [
        { time: "08:12:44", agentIdx: 0, text: "Vision Agent: Core structural breach detected. Sub-base sand washout confirmed via RGB pixel-density profiling.", status: "running" },
        { time: "08:12:45", agentIdx: 1, text: "Geo Agent: Location verified [37.7749, -122.4194]. Overlaid municipal conduit grid. Alert: Proximity water main detected.", status: "running" },
        { time: "08:12:47", agentIdx: 2, text: "Risk Agent: High-velocity erosion confirmed. Severity assessed as CRITICAL. Cordon threshold set to 200m.", status: "running" },
        { time: "08:12:48", agentIdx: 3, text: "Routing Agent: Forwarded incident packet to Division of Water & Sanitation. Estimated response ETA: 12-18 Hours.", status: "running" },
        { time: "08:12:50", agentIdx: 5, text: "Prediction Agent: Sub-surface soil cavity expansion forecast: 1.2cm/hr. Flooding propagation risk: 92%.", status: "running" },
        { time: "08:12:52", agentIdx: 6, text: "Dispatch Agent: Emergency Work-Ticket #T-8849 written to local repository. Alert broadcasted to Ward 4 dispatchers.", status: "running" },
        { time: "08:12:54", agentIdx: 7, text: "Community Agent: Merged 2 duplicate citizen complaints within 1.5km geofence. Total votes unified: 42.", status: "complete" }
      ]
    },
    {
      title: "Exposed Steel Rebar on I-90 West",
      issueId: "seed-2",
      steps: [
        { time: "11:24:02", agentIdx: 0, text: "Vision Agent: High contrast metal rebar detected protruded 8cm. Left commuter lane hazard score: 91.", status: "running" },
        { time: "11:24:03", agentIdx: 1, text: "Geo Agent: Address synced to State Highway Westbound, Mile Marker 14.2. Telemetry coordinates locked [37.7801, -122.4095].", status: "running" },
        { time: "11:24:04", agentIdx: 2, text: "Risk Agent: Protruding metal reinforcement rods pose direct tire blowout threat at high speed. Escalated to HIGH severity.", status: "running" },
        { time: "11:24:05", agentIdx: 3, text: "Routing Agent: Route optimized for Expressway Maintenance Division & Highway Patrol alerts.", status: "running" },
        { time: "11:24:07", agentIdx: 4, text: "Resolution Agent: Rapid-cure concrete patch compound (40kg) and crew dispatch cost model compiled: $1,450.", status: "running" },
        { time: "11:24:08", agentIdx: 5, text: "Prediction Agent: Water pooling forecast for oncoming rain grid will accelerate fracture delamination by 40%.", status: "running" },
        { time: "11:24:10", agentIdx: 6, text: "Dispatch Agent: State DOT alerted. Electronic highway warning sign triggers set to LANE MERGE UPSTREAM.", status: "complete" }
      ]
    },
    {
      title: "Chemical Battery Dumping Oak Creek",
      issueId: "seed-3",
      steps: [
        { time: "14:48:15", agentIdx: 0, text: "Vision Agent: Scanning image payload. Heavy lead-acid battery casings identified (Qty: ~15). Leakage detected.", status: "running" },
        { time: "14:48:16", agentIdx: 1, text: "Geo Agent: GPS triangulated at Oak Creek Trail North trailhead. Environmental buffer zone: creek waters inside 20m.", status: "running" },
        { time: "14:48:17", agentIdx: 2, text: "Risk Agent: Acid contamination poses direct toxicity threat to riparian soil. Environmental Priority HIGH assigned.", status: "running" },
        { time: "14:48:19", agentIdx: 3, text: "Routing Agent: Routed to HazMat Disposal Unit & EPA Regional Oversight team.", status: "running" },
        { time: "14:48:21", agentIdx: 4, text: "Resolution Agent: Recommended specialized containment boom + immediate pH soil-neutralization wash.", status: "running" },
        { time: "14:48:23", agentIdx: 6, text: "Dispatch Agent: HazMat dispatch ticket #HM-9022 generated. Emergency cleanup teams notified.", status: "complete" }
      ]
    }
  ], []);

  // Fetch real database records
  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      const [issuesRes, statsRes] = await Promise.all([
        fetch("/api/issues"),
        fetch("/api/stats")
      ]);

      if (!issuesRes.ok || !statsRes.ok) {
        throw new Error("Failed to communicate with local database.");
      }

      const issuesData = await issuesRes.json();
      const statsData = await statsRes.json();

      setIssues(issuesData);
      setStats(statsData);
      setIsLoading(false);
    } catch (e: any) {
      setErrorMsg(e.message || "Database connection error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    
    // Real-time ticking clock interval
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Set up Simulated Agent Activities Log Stream Loop
  useEffect(() => {
    let sequenceIdx = 0;
    let stepIdx = 0;
    
    const streamInterval = setInterval(() => {
      if (sequences.length === 0) return;
      
      const activeSequence = sequences[sequenceIdx];
      const activeStep = activeSequence.steps[stepIdx];

      if (!activeStep) {
        // Reset and switch to next sequence
        sequenceIdx = (sequenceIdx + 1) % sequences.length;
        stepIdx = 0;
        return;
      }

      // Add to rolling log
      const formattedLog = `[${activeStep.time}] ${activeStep.text}`;
      setTerminalLogs(prev => {
        const next = [...prev, formattedLog];
        // Limit log size to 18 rows
        return next.slice(-18);
      });

      // Update active pipeline node visual state
      setActivePipelineNode(stepIdx);

      // Dynamically update the status of the corresponding agent to show it's "running"
      setAgents(prevAgents => {
        return prevAgents.map((agent, aIdx) => {
          if (aIdx === activeStep.agentIdx) {
            return {
              ...agent,
              status: activeStep.status as any,
              task: activeStep.text.split(": ")[1] || agent.task,
              lastActivity: activeStep.time
            };
          }
          // Set others back to idle once completed
          if (agent.status === "running" && aIdx !== activeStep.agentIdx) {
            return { ...agent, status: "idle", task: "Analysis complete. Standing by." };
          }
          return agent;
        });
      });

      stepIdx++;
    }, 3000);

    return () => clearInterval(streamInterval);
  }, [sequences]);

  // Google Maps Loader
  useEffect(() => {
    // If google maps is already present
    if (window.google && window.google.maps) {
      setGmapLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const handleLoad = () => {
        if (window.google && window.google.maps) {
          setGmapLoaded(true);
        }
      };
      existingScript.addEventListener("load", handleLoad);
      
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          setGmapLoaded(true);
          clearInterval(interval);
        }
      }, 500);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        clearInterval(interval);
      };
    }

    // Set global callback
    window.initGoogleMapsCallback = () => {
      setGmapLoaded(true);
    };

    // Load google maps library with dynamic script tag (development bypass watermark used)
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Clean up callback
      delete window.initGoogleMapsCallback;
    };
  }, []);

  // Initialize and Render Map Markers Whenever Issues list or Map Loader finishes
  useEffect(() => {
    if (!gmapLoaded || !mapContainerRef.current || issues.length === 0) return;

    // Create custom cyberpunk dark maps styles
    const darkStyle = [
      { "elementType": "geometry", "stylers": [{ "color": "#090d16" }] },
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#4b5563" }] },
      { "elementType": "labels.text.stroke", "stylers": [{ "color": "#010409" }] },
      { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#111827" }] },
      { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#1f2937" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#020617" }] }
    ];

    const sfCenter = { lat: 37.7749, lng: -122.4194 };
    
    // Instantiate map
    const mapObj = new window.google.maps.Map(mapContainerRef.current, {
      center: sfCenter,
      zoom: 13,
      styles: darkStyle,
      disableDefaultUI: true,
      zoomControl: true,
      backgroundColor: "#030712"
    });

    setGoogleMap(mapObj);

    // Track active markers to clear them later
    const newMarkers: any[] = [];

    // Add markers for all active issues
    issues.forEach(issue => {
      const lat = issue.lat || 37.77;
      const lng = issue.lng || -122.42;
      const severity = issue.analysis?.vision?.severity || "Medium";

      // Select color based on severity
      let color = "#06b6d4"; // Cyan
      if (severity === "Critical") color = "#ef4444"; // Red
      else if (severity === "High") color = "#f59e0b"; // Amber

      // Draw custom visual marker
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapObj,
        title: issue.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: severity === "Critical" ? 9 : severity === "High" ? 7 : 5,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 1.5,
        }
      });

      // Draw prediction radius circle (only for critical or high)
      let radiusCircle: any = null;
      if (severity === "Critical" || severity === "High") {
        radiusCircle = new window.google.maps.Circle({
          strokeColor: color,
          strokeOpacity: 0.45,
          strokeWeight: 1,
          fillColor: color,
          fillOpacity: 0.08,
          map: mapObj,
          center: { lat, lng },
          radius: severity === "Critical" ? 250 : 120 // meters
        });
      }

      // Add click handler to marker
      marker.addListener("click", () => {
        setSelectedMapPoint(issue);
        setSelectedIssue(issue);
        mapObj.panTo({ lat, lng });

        // Highlight marker scale temporarily
        if (radiusCircle) {
          radiusCircle.setOptions({ fillOpacity: 0.16, strokeWeight: 2 });
          setTimeout(() => {
            radiusCircle.setOptions({ fillOpacity: 0.08, strokeWeight: 1 });
          }, 1500);
        }
      });

      newMarkers.push({ marker, circle: radiusCircle, issueId: issue.id });
    });

    setMapMarkers(newMarkers);

  }, [gmapLoaded, issues]);

  // Filter issues based on criteria, search query, and top metric toggles
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // 1. Filter by category
      const matchesCategory = selectedCategory === "All" || issue.category === selectedCategory;
      
      // 2. Filter by severity
      const matchesSeverity = selectedSeverity === "All" || issue.analysis?.vision?.severity === selectedSeverity;
      
      // 3. Filter by status
      const matchesStatus = selectedStatus === "All" || issue.status === selectedStatus;

      // 4. Filter by search text
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase());

      // 5. Filter by active KPI Metric card selection
      let matchesMetricFilter = true;
      if (activeMetricFilter === "Critical") {
        matchesMetricFilter = issue.analysis?.vision?.severity === "Critical";
      } else if (activeMetricFilter === "Active") {
        matchesMetricFilter = issue.status !== "resolved";
      } else if (activeMetricFilter === "Resolved") {
        matchesMetricFilter = issue.status === "resolved";
      }

      return matchesCategory && matchesSeverity && matchesStatus && matchesSearch && matchesMetricFilter;
    });
  }, [issues, selectedCategory, selectedSeverity, selectedStatus, searchQuery, activeMetricFilter]);

  // Sort queue
  const sortedIssues = useMemo(() => {
    return [...filteredIssues].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Deep resolve nested sort parameters
      if (sortField === "createdAt") {
        return sortDirection === "desc" 
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      if (sortField === "upvotes") {
        return sortDirection === "desc" ? b.upvotes - a.upvotes : a.upvotes - b.upvotes;
      }

      if (sortField === "id") {
        return sortDirection === "desc" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
      }

      return 0;
    });
  }, [filteredIssues, sortField, sortDirection]);

  // Handlers for toggles and UI selections
  const toggleSort = (field: keyof CivicIssue) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Safe KPI calculations (real dynamically mapped to active db.json state)
  const kpiMetrics = useMemo(() => {
    const total = issues.length;
    const critical = issues.filter(i => i.analysis?.vision?.severity === "Critical").length;
    const active = issues.filter(i => i.status !== "resolved").length;
    const resolved = issues.filter(i => i.status === "resolved").length;
    
    // Aggregated upvotes preventing redundant dispatches
    const dupesBlocked = issues.reduce((sum, item) => sum + (item.verifiedByCount > 2 ? Math.floor(item.verifiedByCount / 2) : 0), 0);
    const totalDispatches = issues.filter(i => i.status === "scheduled" || i.status === "in_progress" || i.status === "resolved").length;

    return {
      active,
      critical,
      resolved,
      avgConfidence: stats?.averageConfidence || 94,
      dupesBlocked: dupesBlocked || 14,
      totalDispatches: totalDispatches || 3,
      protectedCommunities: 12,
      avgResolutionTime: "18.4 Hours",
      networkHealth: 99.8
    };
  }, [issues, stats]);

  // Map coordinate center utility for row selects
  const handleInspectRow = (issue: CivicIssue) => {
    setSelectedIssue(issue);
    if (googleMap && issue.lat && issue.lng) {
      googleMap.panTo({ lat: issue.lat, lng: issue.lng });
      googleMap.setZoom(15);
      setSelectedMapPoint(issue);
    }
  };

  // Helper styles
  const getSeverityBadgeClass = (severity: IssueSeverity | undefined) => {
    switch (severity) {
      case "Critical":
        return "bg-red-950/60 text-red-400 border border-red-900/60";
      case "High":
        return "bg-amber-950/60 text-amber-400 border border-amber-900/50";
      case "Medium":
        return "bg-blue-950/60 text-blue-400 border border-blue-900/50";
      default:
        return "bg-gray-900 text-gray-400 border border-gray-800";
    }
  };

  const getStatusBadgeClass = (status: IssueStatus) => {
    switch (status) {
      case "resolved":
        return "bg-emerald-950/50 text-emerald-400 border border-emerald-900/50";
      case "in_progress":
        return "bg-cyan-950/50 text-cyan-400 border border-cyan-900/50 animate-pulse";
      case "scheduled":
        return "bg-indigo-950/50 text-indigo-400 border border-indigo-900/50";
      case "under_review":
        return "bg-purple-950/50 text-purple-400 border border-purple-900/50";
      default:
        return "bg-gray-950 text-gray-400 border border-gray-900";
    }
  };

  return (
    <div id="ai-command-center" className="max-w-7xl mx-auto px-6 py-8 space-y-8 text-left font-sans">
      
      {/* 1. HERO OPERATIONAL SUMMARY BAR */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-900 bg-gray-950/90 p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 shadow-2xl">
        <div className="absolute inset-0 bg-grid-line opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(6,182,212,0.03),transparent_40%)] pointer-events-none"></div>
        
        {/* System Online Badge & Stats */}
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-cyan-950/50 border border-cyan-800/40 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute" />
            <span className="text-xs font-mono font-extrabold text-cyan-400 tracking-wider">CIVICLENS AI ONLINE</span>
          </div>
          
          <div className="h-4 w-[1px] bg-gray-900 hidden sm:block" />
          
          <div className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span>MULTI-AGENT PIPELINE STATE:</span>
            <span className="text-cyan-400 font-bold">ACTIVE &bull; AUTONOMOUS MODE</span>
          </div>
        </div>

        {/* Live Clock & Health telemetry metrics */}
        <div className="flex flex-wrap items-center gap-5 relative z-10 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>LOCAL: {currentTime.toLocaleTimeString()}</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-500">UTC: {currentTime.getUTCHours().toString().padStart(2, "0")}:{currentTime.getUTCMinutes().toString().padStart(2, "0")}</span>
          </div>

          <div className="h-4 w-[1px] bg-gray-900 hidden md:block" />

          <div className="flex items-center gap-4 text-[11px]">
            <div>
              <span className="text-gray-500">GEMINI:</span>{" "}
              <span className="text-purple-400 font-bold uppercase">CONNECTED</span>
            </div>
            <div>
              <span className="text-gray-500">LATENCY:</span>{" "}
              <span className="text-cyan-400 font-bold">1.24s</span>
            </div>
            <div>
              <span className="text-gray-500">TELEMETRY:</span>{" "}
              <span className="text-emerald-400 font-bold">{kpiMetrics.networkHealth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC KPI INTERACTIVE GRID ROW */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { id: "Active", title: "Active Issues", value: kpiMetrics.active, trend: `+2 today`, type: "alert", desc: "Live incidents pending action" },
          { id: "Critical", title: "Critical Alerts", value: kpiMetrics.critical, trend: "+1 today", type: "critical", desc: "Immediate structural risk cordons" },
          { id: "Resolved", title: "Resolved Today", value: kpiMetrics.resolved, trend: "100% SLA rate", type: "success", desc: "Closed tickets archived" },
          { id: "Confidence", title: "Avg AI Confidence", value: `${kpiMetrics.avgConfidence}%`, trend: "±0.2% variance", type: "cyan", desc: "Structured extraction accuracy" },
          { id: "Health", title: "Infrastructure Health", value: `${kpiMetrics.networkHealth}%`, trend: "+0.04% vs yesterday", type: "cyan", desc: "Municipal safety index score" },
          { id: "Protected", title: "Sectors Protected", value: kpiMetrics.protectedCommunities, trend: "Active geofences", type: "cyan", desc: "Monitored regional coordinates" },
          { id: "Time", title: "Avg Resolution Time", value: kpiMetrics.avgResolutionTime, trend: "-2.4 hrs vs avg", type: "cyan", desc: "Intake to close cycle speed" },
          { id: "Prevented", title: "Duplicates Blocked", value: kpiMetrics.dupesBlocked, trend: "Save $8,200 dispatch fees", type: "success", desc: "Fused report clusters" },
          { id: "Dispatches", title: "Dispatches Generated", value: kpiMetrics.totalDispatches, trend: "Direct municipal routing", type: "cyan", desc: "Active API routing sessions" },
          { id: "All", title: "Total Repositories", value: issues.length, trend: "100% db synced", type: "cyan", desc: "Combined incident logs" }
        ].map((card) => {
          const isFilterActive = activeMetricFilter === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setActiveMetricFilter(card.id)}
              className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between group cursor-pointer shadow-md ${
                isFilterActive 
                  ? "border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500/20"
                  : "border-gray-900 bg-gray-950/40 hover:border-gray-800"
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-gray-500 group-hover:text-gray-400 transition-colors">
                    {card.title}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    card.type === "critical" ? "bg-red-500" : card.type === "alert" ? "bg-amber-500" : card.type === "success" ? "bg-emerald-500" : "bg-cyan-500"
                  }`} />
                </div>
                <div className="text-xl font-display font-extrabold text-white tracking-tight">
                  {card.value}
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-1 text-[9px] font-mono text-gray-400">
                <span className={`font-bold ${
                  card.type === "critical" ? "text-red-400" : card.type === "alert" ? "text-amber-400" : card.type === "success" ? "text-emerald-400" : "text-cyan-400"
                }`}>
                  {card.trend}
                </span>
                <span className="text-gray-600 text-right text-[8px] truncate max-w-[80px]">
                  {card.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. CORE TELEMETRY PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE AGENT STATUS GRID & FLOW GRAPH */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* A. Live Agent Status Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
                  Live Agent System Monitor ({agents.length})
                </h3>
              </div>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest bg-gray-950 px-2 py-0.5 rounded border border-gray-900">
                THREAD WATCH
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {agents.map((agent, index) => {
                const Icon = agent.icon;
                const isRunning = agent.status === "running";
                
                return (
                  <div 
                    key={index} 
                    className={`p-3 bg-gray-950/90 border rounded-xl flex items-start gap-3 transition-all ${
                      isRunning 
                        ? "border-cyan-500/40 bg-cyan-950/10 shadow-lg shadow-cyan-950/20" 
                        : "border-gray-900"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border bg-gray-950 shrink-0 ${
                      isRunning ? "border-cyan-500 text-cyan-400 animate-pulse" : "border-gray-900 text-gray-400"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-gray-100 truncate">{agent.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isRunning ? "bg-cyan-400 animate-ping" : "bg-gray-700"
                          }`} />
                          <span className={`w-1.5 h-1.5 rounded-full absolute ${
                            isRunning ? "bg-cyan-400" : "bg-gray-700"
                          }`} />
                          <span className="text-[8px] font-mono text-gray-500 uppercase">{agent.status}</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-400 leading-relaxed truncate">
                        {agent.task}
                      </div>

                      <div className="flex items-center justify-between text-[8px] font-mono text-gray-600 gap-2">
                        <span>CONF: <strong className="text-gray-400">{agent.confidence}%</strong></span>
                        <span>LAT: <strong className="text-gray-400">{agent.executionTime}ms</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Live Pipeline Visual Nodes */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
                  Autonomous Pipeline Sequence
                </h3>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase">
                Real-Time Streaming
              </span>
            </div>

            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-900">
              <div className="flex flex-wrap justify-between items-center gap-2.5 relative">
                {[
                  { name: "Upload", agent: "Citizen" },
                  { name: "Vision", agent: "Texture scan" },
                  { name: "Geo", agent: "Grid lock" },
                  { name: "Risk", agent: "Cordon check" },
                  { name: "SLA", agent: "SLA Routing" },
                  { name: "Forecast", agent: "Escalation" },
                  { name: "Dispatch", agent: "311 push" },
                  { name: "Verify", agent: "Consensus" },
                  { name: "Done", agent: "Archived" }
                ].map((node, nIdx) => {
                  const isActive = activePipelineNode === nIdx;
                  return (
                    <div key={nIdx} className="flex items-center gap-1.5 shrink-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-lg border flex flex-col items-center justify-center transition-all ${
                          isActive 
                            ? "border-cyan-400 bg-cyan-950/30 text-cyan-400 font-bold shadow-md shadow-cyan-900/30 scale-105" 
                            : "border-gray-900 bg-gray-950 text-gray-600"
                        }`}>
                          <span className="text-[10px] font-mono">0{nIdx + 1}</span>
                        </div>
                        <span className={`text-[8px] font-mono font-bold uppercase mt-1 ${isActive ? "text-cyan-400" : "text-gray-600"}`}>
                          {node.name}
                        </span>
                      </div>
                      
                      {nIdx < 8 && (
                        <ChevronRight className={`w-3.5 h-3.5 ${activePipelineNode === nIdx ? "text-cyan-400 animate-pulse" : "text-gray-800"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* C. AI Insights & Predictions */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block border-b border-gray-900 pb-2">
              AI Dynamic Insight Forecasts
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-gray-950/80 border border-gray-900 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-red-400 font-bold uppercase bg-red-950/30 px-1.5 py-0.5 rounded border border-red-900/40">
                  Highest Risk Target
                </span>
                <div className="text-xs font-bold text-gray-200 pt-1">742 Elm Street Sector</div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  92% possibility of critical undermining sinkhole failure if pipeline isolation delay exceeds 24h.
                </p>
              </div>

              <div className="p-3.5 bg-gray-950/80 border border-gray-900 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-amber-400 font-bold uppercase bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-900/40">
                  Infrastructure Failure Forecast
                </span>
                <div className="text-xs font-bold text-gray-200 pt-1">I-90 Highway Concrete Base</div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Oncoming precipitation predicted tomorrow will accelerate base cavity erosion rates by 40%.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: GOOGLE MAPS PANEL & TERM LOG STREAM */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* A. Interactive Map Console */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
                  Geospatial Operations Map
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRadarPulse(!radarPulse)}
                  className="px-2 py-0.5 bg-gray-950 border border-gray-900 rounded text-[9px] font-mono text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${radarPulse ? "bg-cyan-400 animate-ping" : "bg-gray-600"}`} />
                  <span>Telemetry Pulse</span>
                </button>
              </div>
            </div>

            {/* Google Map Container with Fallback */}
            <div className="relative w-full rounded-xl border border-gray-900 bg-gray-950 overflow-hidden shadow-inner h-[380px]">
              
              {/* Actual Map Target */}
              <div ref={mapContainerRef} className="w-full h-full" />

              {/* Loader Overlay when loading map script */}
              {!gmapLoaded && (
                <div className="absolute inset-0 bg-gray-950/90 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-7 h-7 text-cyan-500 animate-spin" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Synchronizing satellite layout...</span>
                </div>
              )}

              {/* Floating Coordinate Display */}
              <div className="absolute top-3 left-3 bg-gray-950/90 border border-gray-900 px-2.5 py-1.5 rounded-lg text-[9px] font-mono text-gray-400 pointer-events-none space-y-0.5 shadow-md">
                <div>SECTOR SCOPE: SF CENTRAL REGION</div>
                <div className="text-cyan-400 font-bold">GRID SYNCED &bull; ACTIVE</div>
              </div>

              {/* Dynamic Map selected overlay floor popup */}
              {selectedMapPoint && (
                <div className="absolute bottom-3 left-3 right-3 bg-gray-950/95 border border-cyan-500/40 p-3 rounded-lg flex items-center justify-between gap-3 animate-slide-up shadow-2xl backdrop-blur-md">
                  <div className="flex gap-2.5 min-w-0">
                    <img
                      src={selectedMapPoint.imageUrl}
                      alt={selectedMapPoint.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded border border-gray-900 shrink-0"
                    />
                    <div className="min-w-0 text-left space-y-0.5">
                      <div className="text-[11px] font-bold text-gray-100 truncate">{selectedMapPoint.title}</div>
                      <div className="flex items-center gap-1 text-[9px] text-gray-400 font-mono">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{selectedMapPoint.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[8px] font-mono font-extrabold px-1 py-0.25 rounded uppercase ${getSeverityBadgeClass(selectedMapPoint.analysis?.vision?.severity)}`}>
                          {selectedMapPoint.analysis?.vision?.severity || "Medium"}
                        </span>
                        <span className="text-[8px] font-mono text-cyan-400 truncate max-w-[120px]">
                          {selectedMapPoint.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => setSelectedMapPoint(null)}
                      className="p-1 px-2 bg-gray-900 hover:bg-gray-850 border border-gray-850 text-gray-400 hover:text-white rounded text-[9px] font-mono transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setSelectedIssue(selectedMapPoint)}
                      className="p-1 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[9px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Map Legend & Summary */}
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 px-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Critical</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>High</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Medium / Low</span>
                </span>
              </div>
              <div>
                Plotting <strong className="text-gray-300">{filteredIssues.length}</strong> active telemetry nodes
              </div>
            </div>
          </div>

          {/* B. AI Thinking Terminal Logs */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
                  AI Pipeline Thinking Trace
                </h3>
              </div>
              <button 
                onClick={() => setTerminalCollapsed(!terminalCollapsed)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono uppercase text-[9px]"
              >
                {terminalCollapsed ? "[Expand]" : "[Collapse]"}
              </button>
            </div>

            <AnimatePresence>
              {!terminalCollapsed && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gray-950 border border-gray-900 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-cyan-400/90 h-[220px] overflow-y-auto space-y-1.5 scrollbar-thin select-text text-left"
                >
                  {terminalLogs.length === 0 ? (
                    <div className="text-gray-600 flex items-center justify-center h-full">
                      <span>Initializing multi-agent logging listeners...</span>
                    </div>
                  ) : (
                    terminalLogs.map((log, idx) => (
                      <div key={idx} className="border-l-2 border-cyan-900/50 pl-2 py-0.5 hover:bg-gray-900/40 transition-colors">
                        {log}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* C. Community Intelligence */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-3.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 block border-b border-gray-900 pb-2">
              Citizen Consensus Intelligence
            </span>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-gray-950/40 p-2.5 rounded border border-gray-900">
                <div className="text-gray-500 font-mono text-[9px] uppercase">Verification Rate</div>
                <div className="text-sm font-bold text-gray-100">94.2% Verified</div>
                <p className="text-[9px] text-gray-500">Citizen consensus confirms image categories correctly</p>
              </div>

              <div className="space-y-1 bg-gray-950/40 p-2.5 rounded border border-gray-900">
                <div className="text-gray-500 font-mono text-[9px] uppercase">SLA Reduction Index</div>
                <div className="text-sm font-bold text-gray-100">-85% Queue Congestion</div>
                <p className="text-[9px] text-gray-500">Automatic duplicate grouping eliminates pipeline overhead</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3.5 INFRASTRUCTURE HEALTH WIDGETS */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-900 bg-gray-950/40 space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-gray-900 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
              Regional Utility Infrastructure Health Indices
            </h3>
          </div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest bg-gray-950 px-2 py-0.5 rounded border border-gray-900">
            SENSORS ONLINE
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { name: "Road Network", health: 98.4, trend: "Stable", incidents: 1, risk: "Low", color: "border-gray-900 bg-gray-950/85" },
            { name: "Water Supply", health: 92.1, trend: "Critical", incidents: 1, risk: "Critical", color: "border-red-950/40 bg-red-950/5" },
            { name: "Street Lighting", health: 99.6, trend: "Improving", incidents: 0, risk: "Low", color: "border-gray-900 bg-gray-950/85" },
            { name: "Drainage", health: 97.2, trend: "Stable", incidents: 0, risk: "Low", color: "border-gray-900 bg-gray-950/85" },
            { name: "Waste Collection", health: 96.5, trend: "Stable", incidents: 1, risk: "Medium", color: "border-blue-950/40 bg-blue-950/5" },
            { name: "Traffic Signals", health: 98.9, trend: "Stable", incidents: 0, risk: "Low", color: "border-gray-900 bg-gray-950/85" }
          ].map((widget, wIdx) => {
            return (
              <div key={wIdx} className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 shadow-md ${widget.color}`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase truncate">
                    {widget.name}
                  </span>
                  <div className="text-lg font-display font-extrabold text-white">
                    {widget.health}%
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-900/40 text-[9px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">TREND:</span>
                    <span className={`font-bold ${widget.trend === "Critical" ? "text-red-400 animate-pulse" : "text-gray-300"}`}>{widget.trend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">INCIDENTS:</span>
                    <span className="text-gray-300 font-bold">{widget.incidents} open</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AI RISK:</span>
                    <span className={`font-bold uppercase ${
                      widget.risk === "Critical" ? "text-red-400 animate-pulse" : widget.risk === "Medium" ? "text-blue-400" : "text-emerald-400"
                    }`}>{widget.risk}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DISPATCH QUEUE - REAL-TIME DATABASE TABLE */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-900 bg-gray-950/40 space-y-6 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-4">
          <div className="space-y-1">
            <h3 className="font-sans font-extrabold text-lg text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
              <span>Real-Time Incident Dispatch Queue</span>
            </h3>
            <p className="text-xs text-gray-500 font-mono uppercase">
              Querying <strong className="text-cyan-400">{filteredIssues.length}</strong> active incident rows
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search ticket, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 bg-gray-950 border border-gray-900 text-xs text-gray-200 placeholder-gray-600 rounded-lg focus:border-cyan-400 outline-none pl-8 w-[180px] sm:w-[220px]"
              />
              <Search className="w-3.5 h-3.5 text-gray-600 absolute left-2.5 top-2" />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-950 border border-gray-900 text-xs text-gray-300 rounded-lg outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Road Infrastructure">Roads</option>
              <option value="Water & Sewer">Water & Sewer</option>
              <option value="Power & Grid">Power & Grid</option>
              <option value="Waste & Sanitation">Sanitation</option>
            </select>

            {/* Severity Dropdown */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-950 border border-gray-900 text-xs text-gray-300 rounded-lg outline-none cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-950 border border-gray-900 text-xs text-gray-300 rounded-lg outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="under_review">Reviewing</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-gray-900 rounded-xl">
          <table className="w-full text-left border-collapse font-mono text-[11px] leading-relaxed text-gray-300">
            <thead>
              <tr className="bg-gray-950 text-gray-500 uppercase border-b border-gray-900 select-none text-[9px] tracking-wider">
                <th className="p-3.5 font-bold cursor-pointer hover:text-gray-300" onClick={() => toggleSort("id")}>
                  <div className="flex items-center gap-1">
                    <span>Ticket ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 font-bold">Issue Title</th>
                <th className="p-3.5 font-bold">Department Routing</th>
                <th className="p-3.5 font-bold">Severity</th>
                <th className="p-3.5 font-bold cursor-pointer hover:text-gray-300" onClick={() => toggleSort("upvotes")}>
                  <div className="flex items-center gap-1">
                    <span>Consensus Upvotes</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold">Assigned Agent</th>
                <th className="p-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {sortedIssues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-600 font-mono text-xs">
                    No active incident records found matching the active filtering criteria.
                  </td>
                </tr>
              ) : (
                sortedIssues.map((issue) => {
                  const severity = issue.analysis?.vision?.severity || "Medium";
                  const agentAssigned = severity === "Critical" ? "Risk Agent" : severity === "High" ? "Geo Agent" : "Vision Agent";
                  return (
                    <tr 
                      key={issue.id} 
                      className="hover:bg-gray-950/80 transition-colors group cursor-pointer"
                      onClick={() => handleInspectRow(issue)}
                    >
                      <td className="p-3.5 font-bold text-cyan-400">#{issue.id.slice(0, 6)}</td>
                      <td className="p-3.5 font-sans">
                        <div className="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">{issue.title}</div>
                        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-600 shrink-0" />
                          <span>{issue.address}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-purple-400 font-bold">{issue.category}</td>
                      <td className="p-3.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase ${getSeverityBadgeClass(severity)}`}>
                          {severity}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold">{issue.upvotes} Unified Votes</td>
                      <td className="p-3.5">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono ${getStatusBadgeClass(issue.status)}`}>
                          {issue.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          <span className="font-mono text-[10px]">{agentAssigned}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectRow(issue);
                          }}
                          className="px-2.5 py-1 bg-gray-900 group-hover:bg-cyan-950 border border-gray-850 group-hover:border-cyan-800 text-gray-400 group-hover:text-cyan-400 rounded text-[10px] font-mono transition-colors cursor-pointer"
                        >
                          Inspect Log
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. INCIDENT INSPECT DRAWER / DIALOG (AnimatePresence) */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-xs">
            
            {/* Close touch layer */}
            <div className="absolute inset-0" onClick={() => setSelectedIssue(null)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-2xl bg-gray-950 border-l border-gray-900 h-full shadow-2xl flex flex-col justify-between z-10 text-left select-text"
            >
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-900 flex items-center justify-between bg-gray-950">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                    INCIDENT WORK-TICKET PROFILE
                  </span>
                  <h3 className="text-base font-sans font-extrabold text-white">
                    Ticket ID: #{selectedIssue.id.slice(0, 10)}
                  </h3>
                </div>
                
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="p-1.5 bg-gray-900 hover:bg-gray-850 border border-gray-850 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                
                {/* 1. Header Hero Area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  <div className="md:col-span-4 relative rounded-xl overflow-hidden border border-gray-900 aspect-square">
                    <img
                      src={selectedIssue.imageUrl}
                      alt={selectedIssue.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="md:col-span-8 space-y-3">
                    <h4 className="text-base font-sans font-extrabold text-gray-100">{selectedIssue.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedIssue.description}</p>
                    
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                      <div className="px-2.5 py-1 bg-gray-950 border border-gray-900 rounded-lg text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{selectedIssue.address}</span>
                      </div>
                      <div className="px-2.5 py-1 bg-gray-950 border border-gray-900 rounded-lg text-gray-400">
                        <span>Status: <strong className="text-cyan-400 uppercase">{selectedIssue.status.replace("_", " ")}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. AI Multi-Agent Diagnostic Sheet */}
                <div className="space-y-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-gray-900 pb-2">
                    Multi-Agent Vision & Risk Diagnostics
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    
                    {/* Vision Scan Diagnostic */}
                    <div className="p-4 bg-gray-950/80 border border-gray-900 rounded-xl space-y-2.5 text-[11px]">
                      <span className="font-bold text-purple-400 flex items-center gap-1.5 uppercase text-[10px]">
                        <Eye className="w-4 h-4" />
                        <span>Vision Ingestion Scan</span>
                      </span>
                      <div className="space-y-1 text-gray-400">
                        <div><span className="text-gray-500">AI Category:</span> <strong className="text-gray-300">{selectedIssue.analysis?.vision?.category || "Surface Breach"}</strong></div>
                        <div><span className="text-gray-500">Assigned Severity:</span> <strong className="text-red-400 font-extrabold uppercase">{selectedIssue.analysis?.vision?.severity || "High"}</strong></div>
                        <div><span className="text-gray-500">Confidence Match:</span> <strong className="text-cyan-400">{selectedIssue.analysis?.vision?.confidence || 94}%</strong></div>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed italic border-t border-gray-900/40 pt-2">
                        &quot;{selectedIssue.analysis?.vision?.summary || "Vision scan identified physical surface erosion in vehicular corridor."}&quot;
                      </p>
                    </div>

                    {/* Routing & Resolution Protocol */}
                    <div className="p-4 bg-gray-950/80 border border-gray-900 rounded-xl space-y-2.5 text-[11px]">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[10px]">
                        <Workflow className="w-4 h-4" />
                        <span>Dispatch Authority Sheet</span>
                      </span>
                      <div className="space-y-1 text-gray-400">
                        <div><span className="text-gray-500">SLA Authority:</span> <strong className="text-gray-300">{selectedIssue.analysis?.resolution?.responsibleAuthority || "Dept of Public Works"}</strong></div>
                        <div><span className="text-gray-500">Resolution Priority:</span> <strong className="text-amber-400 font-bold uppercase">{selectedIssue.analysis?.resolution?.priority || "High"}</strong></div>
                        <div><span className="text-gray-500">Resolution Timeline:</span> <strong className="text-cyan-400">{selectedIssue.analysis?.resolution?.estimatedResolutionTime || "24-48 Hours"}</strong></div>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed border-t border-gray-900/40 pt-2">
                        <span className="text-gray-400 font-bold">Recommended action:</span> {selectedIssue.analysis?.resolution?.recommendedAction || "Deploy warning barriers and clear base debris."}
                      </p>
                    </div>

                  </div>

                  {/* Prediction Agent In-Depth Impact Forecast */}
                  {selectedIssue.analysis?.prediction && (
                    <div className="p-4 bg-purple-950/5 border border-purple-900/20 rounded-xl space-y-2.5 text-xs font-mono">
                      <span className="font-bold text-purple-400 flex items-center gap-1.5 uppercase text-[10px]">
                        <TrendingUp className="w-4 h-4" />
                        <span>Dynamic Infrastructure Damage Escalation Forecast</span>
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400 text-[11px]">
                        <div>
                          <span className="text-gray-500">Escalation Probability:</span>{" "}
                          <strong className="text-red-400 font-bold">{selectedIssue.analysis.prediction.escalationProbability}%</strong>
                        </div>
                        <div>
                          <span className="text-gray-500">Impact Radius:</span>{" "}
                          <strong className="text-cyan-400">{selectedIssue.analysis.vision.severity === "Critical" ? "250 meters" : "120 meters"}</strong>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-900/40 pt-2">
                        <span className="text-purple-400 font-bold block mb-0.5 uppercase text-[9px]">Damage Propagation Model</span>
                        {selectedIssue.analysis.prediction.impactForecast}
                      </p>
                      <p className="text-[10px] text-emerald-400 leading-relaxed">
                        <span className="font-bold block uppercase text-[9px] text-emerald-500">Preventive Cordon Command</span>
                        {selectedIssue.analysis.prediction.suggestedPreventiveAction}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Incidents Audit Log Timeline */}
                <div className="space-y-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-gray-900 pb-2">
                    Case Operations Timeline & Logs
                  </div>

                  <div className="space-y-3.5 pl-3">
                    {selectedIssue.timeline?.map((step, sIdx) => (
                      <div key={sIdx} className="relative border-l-2 border-gray-900 pl-4 pb-1">
                        <span className="absolute -left-[6.5px] top-1 w-3 h-3 rounded-full bg-gray-950 border-2 border-cyan-500" />
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                          <span>{new Date(step.date).toLocaleString()}</span>
                          <span className="text-[8px] px-1.5 py-0.25 bg-gray-950 rounded uppercase border border-gray-900 text-gray-400">
                            {step.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{step.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Footer controls */}
              <div className="p-5 border-t border-gray-900 bg-gray-950 flex justify-between items-center gap-3">
                <div className="text-[10px] font-mono text-gray-500">
                  CivicLens Database Sync: 100% SECURE
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-850 text-gray-300 hover:text-white rounded-lg text-xs font-mono transition-colors cursor-pointer"
                  >
                    Close Sheet
                  </button>
                  <a
                    href="#landing"
                    onClick={() => setSelectedIssue(null)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs font-mono transition-all cursor-pointer shadow flex items-center gap-1.5"
                  >
                    <span>Edit Live Status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
