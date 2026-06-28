import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, 
  Cpu, 
  Brain,
  Sparkles,
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
  Database,
  Download,
  Printer,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { CivicIssue, IssueStatus, IssueSeverity, IssuePriority } from "../types";
import { IssueImage } from "./common/IssueImage";

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
  health: number; // percentage
  latency: number; // ms
  lastCompletedTask: string;
}

interface LogEntry {
  timestamp: string;
  agentName: string;
  action: string;
  result: string;
  executionTime: string;
  confidence: string;
  type?: "warning" | "prediction" | "dispatch" | "info" | "success";
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
  const [hoveredMapPoint, setHoveredMapPoint] = useState<CivicIssue | null>(null);

  // Replay & Automation States (WOW Moment)
  const [isReplaying, setIsReplaying] = useState(false);

  // Terminal telemetry log stream
  const [terminalLogs, setTerminalLogs] = useState<LogEntry[]>([
    {
      timestamp: "07:05:12",
      agentName: "System",
      action: "Citizen report received",
      result: "Ingested 'sinkhole_elm.jpg' into triage pipeline",
      executionTime: "85ms",
      confidence: "100%",
      type: "success"
    },
    {
      timestamp: "07:05:13",
      agentName: "Vision Agent",
      action: "Asphalt fracture scanning",
      result: "Detected 12cm cleavage with active lateral erosion",
      executionTime: "420ms",
      confidence: "96%",
      type: "info"
    },
    {
      timestamp: "07:05:14",
      agentName: "Geo Agent",
      action: "Sub-surface utility overlay",
      result: "Verified cast iron water main within 2m proximity",
      executionTime: "115ms",
      confidence: "99%",
      type: "info"
    },
    {
      timestamp: "07:05:15",
      agentName: "Risk Agent",
      action: "Subsidence threat modeling",
      result: "Calculated risk score 94/100, established 200m safety zone",
      executionTime: "135ms",
      confidence: "92%",
      type: "warning"
    },
    {
      timestamp: "07:05:17",
      agentName: "Prediction Agent",
      action: "Soil cavity propagation model",
      result: "Rain cell entry will accelerate erosion rate by 40%",
      executionTime: "310ms",
      confidence: "88%",
      type: "prediction"
    },
    {
      timestamp: "07:05:19",
      agentName: "Dispatch Agent",
      action: "DPW work-ticket compilation",
      result: "Dynamic ticket #T-8849 pushed to service queue",
      executionTime: "190ms",
      confidence: "97%",
      type: "dispatch"
    },
    {
      timestamp: "07:05:20",
      agentName: "System",
      action: "Automated routing finalized",
      result: "SLA response locked: EMERGENCY (2-Hour window)",
      executionTime: "50ms",
      confidence: "100%",
      type: "success"
    }
  ]);
  const [terminalSearch, setTerminalSearch] = useState("");
  const [terminalAgentFilter, setTerminalAgentFilter] = useState<string>("All");
  const [activePipelineNode, setActivePipelineNode] = useState<number | null>(null);
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [hoveredStageIdx, setHoveredStageIdx] = useState<number | null>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Simulated active PDF Dispatch Modal state
  const [activePdfDispatch, setActivePdfDispatch] = useState<CivicIssue | null>(null);

  // Active simulated agent states (Color-coded precisely)
  const [agents, setAgents] = useState<AgentTelemetry[]>([
    { 
      name: "Vision Agent", 
      role: "Multimodal Feature & Damage Scanner", 
      status: "idle", 
      task: "Standing by for live stream Ingestion", 
      executionTime: 120, 
      confidence: 96, 
      icon: Eye, 
      color: "text-cyan-400 border-cyan-500/20 shadow-cyan-950/20", 
      health: 99.4, 
      latency: 45, 
      lastCompletedTask: "Analyzed structural surface fractures on Elm St" 
    },
    { 
      name: "Geo Agent", 
      role: "Utility Mapping & Geofence Validator", 
      status: "idle", 
      task: "Standing by for location telemetry", 
      executionTime: 85, 
      confidence: 99, 
      icon: MapPin, 
      color: "text-blue-400 border-blue-500/20 shadow-blue-950/20", 
      health: 100.0, 
      latency: 12, 
      lastCompletedTask: "Validated coordinate boundaries on I-90 West" 
    },
    { 
      name: "Risk Agent", 
      role: "Severity Assessor & Environmental Analyst", 
      status: "idle", 
      task: "Standing by for severity vectoring", 
      executionTime: 140, 
      confidence: 92, 
      icon: AlertCircle, 
      color: "text-red-400 border-red-500/20 shadow-red-950/20", 
      health: 98.7, 
      latency: 78, 
      lastCompletedTask: "Assessed critical undermining risk on Elm St" 
    },
    { 
      name: "Prediction Agent", 
      role: "Dynamic Structural Failure Modeler", 
      status: "idle", 
      task: "Standing by for historical trend data", 
      executionTime: 210, 
      confidence: 88, 
      icon: TrendingUp, 
      color: "text-purple-400 border-purple-500/20 shadow-purple-950/20", 
      health: 97.5, 
      latency: 135, 
      lastCompletedTask: "Modeled erosion acceleration due to rain forecast" 
    },
    { 
      name: "Dispatch Agent", 
      role: "311 Smart Ticket & API Publisher", 
      status: "idle", 
      task: "Standing by for work-ticket compiling", 
      executionTime: 105, 
      confidence: 97, 
      icon: Zap, 
      color: "text-emerald-400 border-emerald-500/20 shadow-emerald-950/20", 
      health: 99.9, 
      latency: 22, 
      lastCompletedTask: "Created emergency work-ticket #T-8849" 
    },
    { 
      name: "Community Agent", 
      role: "Social Consensus & Duplicate Merger", 
      status: "idle", 
      task: "Standing by for consensus verification", 
      executionTime: 75, 
      confidence: 94, 
      icon: UserCheck, 
      color: "text-amber-500 border-amber-500/20 shadow-amber-950/20", 
      health: 99.2, 
      latency: 18, 
      lastCompletedTask: "Merged 2 duplicate citizen complaints" 
    },
  ]);

  // Utility Infrastructure Health List Data (Replaced static cards)
  const infrastructureHealthList = [
    { name: "Road Network Structure", health: 91.4, status: "Warning", trend: "down", incidents: 3, risk: "Critical", history: [94, 93, 92, 91.4] },
    { name: "Water Conduit Mains", health: 96.8, status: "Active", trend: "stable", incidents: 1, risk: "Moderate", history: [96.8, 96.8, 96.8, 96.8] },
    { name: "Drainage Sump Flow", health: 88.2, status: "Critical", trend: "down", incidents: 5, risk: "High", history: [91, 90, 89, 88.2] },
    { name: "Power Grid Sub-Stations", health: 98.9, status: "Active", trend: "up", incidents: 0, risk: "Low", history: [98.2, 98.5, 98.7, 98.9] },
    { name: "Citizen Transit Corridors", health: 94.2, status: "Active", trend: "up", incidents: 2, risk: "Low", history: [93.1, 93.5, 94.0, 94.2] },
  ];



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

  // Set up Simulated Agent Activities Log Stream Loop (Paused when Replaying)
  useEffect(() => {
    if (isReplaying) return;

    let index = 0;
    
    const streamInterval = setInterval(() => {
      const agentsList = [
        { name: "Vision Agent", action: "Scanning camera feeds", result: "Analyzed structural surface delamination on I-90 West", executionTime: "120ms", confidence: "95%", type: "info" as const, agentIdx: 0 },
        { name: "Geo Agent", action: "Geofencing validation", result: "Calculated safe boundary intersections on ward 4", executionTime: "85ms", confidence: "99%", type: "info" as const, agentIdx: 1 },
        { name: "Risk Agent", action: "Structural impact study", result: "subsidence hazard score: minimal risk outside cordon", executionTime: "140ms", confidence: "91%", type: "warning" as const, agentIdx: 2 },
        { name: "Prediction Agent", action: "Dynamic erosion simulation", result: "Forecast stable cavity propagation under low humidity", executionTime: "220ms", confidence: "89%", type: "prediction" as const, agentIdx: 3 },
        { name: "Dispatch Agent", action: "Updating maintenance dispatch ledger", result: "API response OK from municipal maintenance broker", executionTime: "105ms", confidence: "97%", type: "dispatch" as const, agentIdx: 4 }
      ];

      const item = agentsList[index % agentsList.length];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      const nextLog: LogEntry = {
        timestamp: timeStr,
        agentName: item.name,
        action: item.action,
        result: item.result,
        executionTime: item.executionTime,
        confidence: item.confidence,
        type: item.type
      };

      setTerminalLogs(prev => {
        const next = [...prev, nextLog];
        return next.slice(-100); // Cap long logs
      });

      // Update corresponding agent status
      setAgents(prevAgents => {
        return prevAgents.map((agent, aIdx) => {
          if (aIdx === item.agentIdx) {
            return {
              ...agent,
              status: "running" as const,
              task: `${item.action}: ${item.result}`
            };
          }
          if (agent.status === "running") {
            return { ...agent, status: "idle" as const, task: "Standing by in system queue" };
          }
          return agent;
        });
      });

      // Passive pipeline sync (from 0 to 5)
      setActivePipelineNode(item.agentIdx + 1);

      index++;
    }, 4500);

    return () => clearInterval(streamInterval);
  }, [isReplaying]);

  // Handle Terminal Console Auto-Scrolling
  useEffect(() => {
    if (autoScrollEnabled && terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalLogs, autoScrollEnabled, terminalExpanded]);

  // Google Maps Loader
  useEffect(() => {
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
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    window.initGoogleMapsCallback = () => {
      setGmapLoaded(true);
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      delete window.initGoogleMapsCallback;
    };
  }, []);

  // Initialize Map Markers
  useEffect(() => {
    if (!gmapLoaded || !mapContainerRef.current || issues.length === 0) return;

    const darkStyle = [
      { "elementType": "geometry", "stylers": [{ "color": "#060913" }] },
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#6b7280" }] },
      { "elementType": "labels.text.stroke", "stylers": [{ "color": "#02040a" }] },
      { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#0e1322" }] },
      { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#111827" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#020617" }] }
    ];

    const sfCenter = { lat: 37.7749, lng: -122.4194 };
    
    const mapObj = new window.google.maps.Map(mapContainerRef.current, {
      center: sfCenter,
      zoom: 13,
      styles: darkStyle,
      disableDefaultUI: true,
      zoomControl: true,
      backgroundColor: "#020617"
    });

    setGoogleMap(mapObj);

    const newMarkers: any[] = [];

    issues.forEach(issue => {
      const lat = issue.lat || 37.7749;
      const lng = issue.lng || -122.4194;
      const severity = issue.analysis?.vision?.severity || "Medium";

      let color = "#3b82f6"; // Blue
      if (severity === "Critical") color = "#ef4444"; // Red
      else if (severity === "High") color = "#f97316"; // Orange

      // Custom marker
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

      // Predicted impact zone
      let impactCircle: any = null;
      if (severity === "Critical" || severity === "High") {
        impactCircle = new window.google.maps.Circle({
          strokeColor: color,
          strokeOpacity: 0.35,
          strokeWeight: 1,
          fillColor: color,
          fillOpacity: 0.05,
          map: mapObj,
          center: { lat, lng },
          radius: severity === "Critical" ? 220 : 110
        });
      }

      // Hover events
      marker.addListener("mouseover", () => {
        setHoveredMapPoint(issue);
      });
      marker.addListener("mouseout", () => {
        setHoveredMapPoint(null);
      });

      // Click event
      marker.addListener("click", () => {
        setSelectedMapPoint(issue);
        setSelectedIssue(issue);
        mapObj.panTo({ lat, lng });
        mapObj.setZoom(15);

        if (impactCircle) {
          impactCircle.setOptions({ fillOpacity: 0.15, strokeWeight: 2 });
          setTimeout(() => {
            impactCircle.setOptions({ fillOpacity: 0.05, strokeWeight: 1 });
          }, 1500);
        }
      });

      newMarkers.push({ marker, circle: impactCircle, issueId: issue.id });
    });

    setMapMarkers(newMarkers);

    return () => {
      newMarkers.forEach(item => {
        item.marker.setMap(null);
        if (item.circle) item.circle.setMap(null);
      });
    };
  }, [gmapLoaded, issues]);

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesCategory = selectedCategory === "All" || issue.category === selectedCategory;
      const matchesSeverity = selectedSeverity === "All" || issue.analysis?.vision?.severity === selectedSeverity;
      const matchesStatus = selectedStatus === "All" || issue.status === selectedStatus;

      const matchesSearch = 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.address.toLowerCase().includes(searchQuery.toLowerCase());

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

  const toggleSort = (field: keyof CivicIssue) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Safe KPI calculations
  const kpiMetrics = useMemo(() => {
    const total = issues.length;
    const critical = issues.filter(i => i.analysis?.vision?.severity === "Critical").length;
    const resolved = issues.filter(i => i.status === "resolved").length;
    const active = total - resolved;

    let confidenceSum = 0;
    let countedConf = 0;
    issues.forEach(i => {
      if (i.analysis?.vision?.confidence) {
        confidenceSum += i.analysis.vision.confidence;
        countedConf++;
      }
    });

    const avgConfidence = countedConf > 0 ? Math.round(confidenceSum / countedConf) : 94;

    return {
      total,
      critical,
      resolved,
      active,
      avgConfidence,
      networkHealth: 94.6,
      protectedCommunities: 14,
      avgResolutionTime: "1.8 hrs",
      dupesBlocked: 112,
      totalDispatches: 418
    };
  }, [issues]);

  const getPrecisionTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  };

  // 14. CREATE ONE "WOW" MOMENT (Replay AI Decision)
  const handleReplay = () => {
    if (isReplaying) return;
    setIsReplaying(true);
    setTerminalLogs([]);
    setActivePipelineNode(0);

    // Reset agents to idle
    setAgents(prev => prev.map(a => ({ ...a, status: "idle", task: "Calibrating operational buffers..." })));

    const steps = [
      {
        node: 0,
        delay: 0,
        log: {
          timestamp: getPrecisionTime(),
          agentName: "System",
          action: "Citizen report received",
          result: "Ingested 'sinkhole_elm.jpg' into triage pipeline",
          executionTime: "85ms",
          confidence: "100%",
          type: "success" as const
        },
        action: () => {
          if (googleMap) {
            googleMap.panTo({ lat: 37.7749, lng: -122.4194 });
            googleMap.setZoom(14);
          }
        }
      },
      {
        node: 1,
        delay: 1500,
        log: {
          timestamp: getPrecisionTime(),
          agentName: "Vision Agent",
          action: "Asphalt fracture scanning",
          result: "Detected 12cm cleavage with active lateral erosion",
          executionTime: "420ms",
          confidence: "96%",
          type: "info" as const
        },
        action: () => {
          setAgents(prev => prev.map((a, i) => i === 0 ? { ...a, status: "running", task: "Analyzing structural surface fracture dimensions" } : a));
        }
      },
      {
        node: 2,
        delay: 3000,
        log: {
          timestamp: getPrecisionTime(),
          agentName: "Geo Agent",
          action: "Sub-surface utility overlay",
          result: "Verified cast iron water main within 2m proximity",
          executionTime: "115ms",
          confidence: "99%",
          type: "info" as const
        },
        action: () => {
          setAgents(prev => prev.map((a, i) => {
            if (i === 0) return { ...a, status: "complete", task: "Analysis complete. Logs pushed." };
            if (i === 1) return { ...a, status: "running", task: "Querying sub-surface water & gas utility grids" };
            return a;
          }));
        }
      },
      {
        node: 3,
        delay: 4500,
        log: {
          timestamp: getPrecisionTime(),
          agentName: "Risk Agent",
          action: "Subsidence threat modeling",
          result: "Calculated risk score 94/100, established 200m safety zone",
          executionTime: "135ms",
          confidence: "92%",
          type: "warning" as const
        },
        action: () => {
          setAgents(prev => prev.map((a, i) => {
            if (i === 1) return { ...a, status: "complete", task: "Mapping complete. GIS overlays locked." };
            if (i === 2) return { ...a, status: "running", task: "Evaluating safety index and generating cordon zones" };
            return a;
          }));
        }
      },
      {
        node: 4,
        delay: 6000,
        log: {
          timestamp: getPrecisionTime(),
          agentName: "Prediction Agent",
          action: "Soil cavity propagation model",
          result: "Rain cell entry will accelerate erosion rate by 40%",
          executionTime: "310ms",
          confidence: "88%",
          type: "prediction" as const
        },
        action: () => {
          setAgents(prev => prev.map((a, i) => {
            if (i === 2) return { ...a, status: "complete", task: "Safety cordon established. Severity escalated." };
            if (i === 3) return { ...a, status: "running", task: "Simulating structural soil propagation with weather grids" };
            return a;
          }));
        }
      },
      {
        node: 5,
        delay: 7500,
        log: {
          timestamp: getPrecisionTime(),
          agentName: "Dispatch Agent",
          action: "DPW work-ticket compilation",
          result: "Dynamic ticket #T-8849 pushed to service queue",
          executionTime: "190ms",
          confidence: "97%",
          type: "dispatch" as const
        },
        action: () => {
          setAgents(prev => prev.map((a, i) => {
            if (i === 3) return { ...a, status: "complete", task: "Structural failure simulation completed." };
            if (i === 4) return { ...a, status: "running", task: "Compiling municipal dispatch manifest & writing ticket" };
            return a;
          }));
        }
      },
      {
        node: 5,
        delay: 9000,
        log: {
          timestamp: getPrecisionTime(),
          agentName: "System",
          action: "Automated routing finalized",
          result: "SLA response locked: EMERGENCY (2-Hour window)",
          executionTime: "50ms",
          confidence: "100%",
          type: "success" as const
        },
        action: () => {
          setAgents(prev => prev.map((a, i) => {
            if (i === 4) return { ...a, status: "complete", task: "Work-ticket #T-8849 generated and broadcasted." };
            if (i === 5) return { ...a, status: "running", task: "Evaluating community upvote counts and merging duplicates" };
            return a;
          }));
          setTimeout(() => {
            setAgents(prev => prev.map(a => ({ ...a, status: "idle", task: "Standing by in system queue" })));
            setIsReplaying(false);
          }, 1500);
        }
      }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        setActivePipelineNode(step.node);
        setTerminalLogs(prev => [...prev, step.log]);
        step.action();
      }, step.delay);
    });
  };

  // Filtered logs inside terminal
  const filteredLogs = useMemo(() => {
    return terminalLogs.filter(log => {
      const searchLower = terminalSearch.toLowerCase();
      const matchesSearch = 
        log.agentName.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.result.toLowerCase().includes(searchLower);
        
      let matchesAgent = true;
      if (terminalAgentFilter !== "All") {
        matchesAgent = log.agentName.toLowerCase().includes(terminalAgentFilter.toLowerCase()) || 
                       terminalAgentFilter.toLowerCase().includes(log.agentName.toLowerCase());
      }
      return matchesSearch && matchesAgent;
    });
  }, [terminalLogs, terminalSearch, terminalAgentFilter]);

  // Copy logs handler
  const [copiedLogs, setCopiedLogs] = useState(false);
  const handleCopyLogs = () => {
    const formattedText = terminalLogs.map(log => 
      `[${log.timestamp}] [${log.agentName}] Action: ${log.action} | Result: ${log.result} (Time: ${log.executionTime}, Conf: ${log.confidence})`
    ).join("\n");
    navigator.clipboard.writeText(formattedText);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  // Inspect map marker handler
  const handleInspectOnMap = (issue: CivicIssue) => {
    setSelectedMapPoint(issue);
    setSelectedIssue(issue);
    if (googleMap) {
      googleMap.panTo({ lat: issue.lat || 37.7749, lng: issue.lng || -122.4194 });
      googleMap.setZoom(15);
    }
  };

  // Download simulation handler
  const handleSimulatePrint = (issue: CivicIssue) => {
    setActivePdfDispatch(issue);
  };

  const currentMissionIssue = useMemo(() => {
    if (isReplaying) {
      return {
        title: "Asphalt Collapse on 742 Elm St",
        address: "742 Elm St, Ward 4",
        imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop",
        status: "in_progress" as any,
        category: "Road & Structural",
        verifiedByCount: 42,
        analysis: {
          vision: {
            severity: "Critical" as any,
            confidence: 96,
            summary: "Severe structural failure under heavy load. A 12cm open asphalt cleavage identified with active lateral erosion."
          },
          resolution: {
            responsibleAuthority: "Department of Public Works",
            estimatedResolutionTime: "2 Hours (Emergency SLA)"
          },
          prediction: {
            escalationProbability: 92,
            impactForecast: "Lateral erosion expansion to 1.5m under oncoming rain."
          }
        }
      };
    }
    
    // If we have a selected issue, use that
    if (selectedIssue) {
      return selectedIssue;
    }
    
    // Otherwise fallback to first issue
    if (issues && issues.length > 0) {
      return issues[0];
    }
    
    // Ultimate fallback
    return {
      title: "Active Structural Triage Sync",
      address: "District Ward 4 Command Centre",
      imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop",
      status: "under_review" as any,
      category: "Infrastructure",
      verifiedByCount: 12,
      analysis: {
        vision: {
          severity: "High" as any,
          confidence: 94,
          summary: "Autonomous scanning of general precinct sensors. Tracking live structural safety telemetry."
        },
        resolution: {
          responsibleAuthority: "City Engineering Bureau",
          estimatedResolutionTime: "8 Hours (Standard SLA)"
        },
        prediction: {
          escalationProbability: 45,
          impactForecast: "Stable structural baseline."
        }
      }
    };
  }, [isReplaying, selectedIssue, issues]);

  return (
    <div id="ai-command-center" className="max-w-7xl mx-auto px-6 py-8 space-y-8 text-left font-sans selection:bg-cyan-500 selection:text-black">
      <div id="section-system-status" className="relative overflow-hidden rounded-2xl border border-gray-900 bg-gray-950/90 p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 shadow-2xl">
        <div className="absolute inset-0 bg-grid-line opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(6,182,212,0.03),transparent_40%)] pointer-events-none"></div>
        
        {/* System Online Badge & Status */}
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-cyan-950/50 border border-cyan-800/40 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute" />
            <span className="text-xs font-mono font-extrabold text-cyan-400 tracking-wider">CIVICLENS OPERATIONAL NODE</span>
          </div>
          
          <div className="h-4 w-[1px] bg-gray-900 hidden sm:block" />
          
          <div className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span>PIPELINE ENGINE:</span>
            <span className="text-cyan-400 font-bold">AUTONOMOUS DISPATCH ACTIVE</span>
          </div>
        </div>

        {/* Replay WOW Action & Clock */}
        <div className="flex flex-wrap items-center gap-4 relative z-10 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>SYS CLOCK: {currentTime.toLocaleTimeString()}</span>
          </div>

          <div className="h-4 w-[1px] bg-gray-900 hidden md:block" />

          {/* ▶ Replay AI Decision Button (WOW Moment) */}
          <button
            onClick={handleReplay}
            disabled={isReplaying}
            id="replay-ai-decision-btn"
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
              isReplaying 
                ? "bg-purple-950/40 border-purple-800/40 text-purple-400 animate-pulse cursor-not-allowed" 
                : "bg-cyan-650 hover:bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-95"
            }`}
          >
            <Play className={`w-3 h-3 ${isReplaying ? "animate-spin text-purple-400" : "fill-current text-white"}`} />
            <span>{isReplaying ? "REPLAYING WORKFLOW..." : "REPLAY AI DECISION"}</span>
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC KPI INTERACTIVE GRID ROW (Reduced to 4 Executive Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: "Active", title: "Active Incidents", value: kpiMetrics.active, trend: `+2 today`, type: "alert", desc: "Live citizen hazards requiring structural dispatch" },
          { id: "Critical", title: "Critical Alerts", value: kpiMetrics.critical, trend: "+1 today", type: "critical", desc: "Active emergency cordon zones" },
          { id: "Confidence", title: "Average AI Confidence", value: `${kpiMetrics.avgConfidence}%`, trend: "±0.2% variance", type: "cyan", desc: "Multimodal extraction confidence" },
          { id: "Time", title: "Average Response Time", value: kpiMetrics.avgResolutionTime, trend: "-2.4 hrs vs SLA", type: "cyan", desc: "Total pipeline duration" },
        ].map((card) => {
          const isFilterActive = activeMetricFilter === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setActiveMetricFilter(isFilterActive ? "All" : card.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group cursor-pointer shadow-md ${
                isFilterActive 
                  ? "border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500/30 shadow-cyan-950/20"
                  : "border-gray-900 bg-gray-950/40 hover:border-gray-800"
              }`}
            >
              <div className="space-y-1 w-full">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-gray-500 group-hover:text-gray-400 transition-colors">
                    {card.title}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    card.type === "critical" ? "bg-red-500 animate-pulse" : card.type === "alert" ? "bg-amber-500" : "bg-cyan-500"
                  }`} />
                </div>
                <div className="text-2xl font-display font-extrabold text-white tracking-tight">
                  {card.value}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono w-full pt-2 border-t border-gray-900/40">
                <span className="text-gray-500 truncate mr-2">{card.desc}</span>
                <span className={`font-bold shrink-0 ${card.type === "critical" ? "text-red-400" : "text-cyan-400"}`}>
                  {card.trend}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE AI AGENTS (Live Agent Status Panel) */}
      <div id="section-active-agents" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">Live Agent Monitoring Hub</h3>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">6 Dedicated Sub-Systems Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {agents.map((agent, idx) => {
            const isRunning = agent.status === "running";
            const isComplete = agent.status === "complete";
            const IconComponent = agent.icon;
            
            const agentToStageIndex = (name: string): number => {
              if (name.includes("Vision")) return 1;
              if (name.includes("Geo")) return 2;
              if (name.includes("Risk")) return 3;
              if (name.includes("Prediction")) return 4;
              if (name.includes("Dispatch")) return 5;
              return 0;
            };

            const targetStageIdx = agentToStageIndex(agent.name);
            const isHighlightedByHover = hoveredStageIdx === targetStageIdx;

            return (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredStageIdx(targetStageIdx)}
                onMouseLeave={() => setHoveredStageIdx(null)}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden bg-gray-950/40 ${
                  isRunning || isHighlightedByHover
                    ? "border-cyan-500/50 bg-cyan-950/10 shadow-lg shadow-cyan-950/20" 
                    : isComplete 
                      ? "border-emerald-900/40 bg-emerald-950/5" 
                      : "border-gray-900 hover:border-gray-850 hover:bg-gray-950/50"
                }`}
              >
                {/* Glowing status line for running agents */}
                {isRunning && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-400 animate-pulse shadow-glow" />
                )}

                <div className="space-y-2">
                  {/* Header: Icon, Name, Health Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg border bg-gray-900 ${agent.color}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {/* Pulse Status Indicator */}
                      <span className={`relative flex h-1.5 w-1.5 ${isRunning ? "animate-pulse" : ""}`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isRunning ? "bg-cyan-400" : isComplete ? "bg-emerald-400" : "bg-gray-600"
                        }`} />
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                          isRunning ? "bg-cyan-400" : isComplete ? "bg-emerald-500" : "bg-gray-700"
                        }`} />
                      </span>
                      <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${
                        isRunning ? "text-cyan-400" : isComplete ? "text-emerald-400" : "text-gray-500"
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="text-left">
                    <h4 className="font-extrabold text-white text-xs">{agent.name}</h4>
                    <p className="text-[9px] text-gray-500 leading-tight mt-0.5">{agent.role}</p>
                  </div>
                </div>

                {/* Sub-agent Performance Metrics (Latency, Health, Task) */}
                <div className="mt-4 pt-3 border-t border-gray-900/50 space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-gray-600">HEALTH / LATENCY</span>
                    <span className="text-gray-400 font-bold">{agent.health}% / {agent.latency}ms</span>
                  </div>
                  
                  {/* Task details (Micro animation on active) */}
                  <div className="bg-gray-900/40 p-1.5 rounded border border-gray-900/60 text-[8px] font-mono min-h-[38px] flex flex-col justify-between">
                    <span className="text-gray-600 uppercase block tracking-wider font-extrabold text-[7px]">CURRENT EXECUTION</span>
                    <p className={`text-left leading-relaxed mt-0.5 truncate-2 ${isRunning ? "text-cyan-400" : "text-gray-400"}`}>
                      {agent.task}
                    </p>
                  </div>

                  <div className="text-[7px] font-mono text-gray-600 block truncate text-left mt-1">
                    <span className="font-bold">PREV:</span> {agent.lastCompletedTask}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CURRENT PIPELINE & THINKING TRACE SPLIT */}
      <div id="ai-mission-panel" className="space-y-6">
        

        {/* AUTONOMOUS PIPELINE PANEL */}
        <div className="bg-gray-950/40 border border-gray-900 rounded-xl p-5 relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">Autonomous AI Pipeline Sequence</h3>
              </div>
              <p className="text-[10px] text-gray-500 font-sans leading-relaxed text-left">
                Click any pipeline stage to filter the console telemetry feed below. Hover a stage to inspect its municipal responsibility.
              </p>
            </div>
            
            {/* Legend / Status Indicators */}
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> <span className="text-gray-450">Completed</span></span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> <span className="text-gray-450">Active</span></span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-800" /> <span className="text-gray-450">Pending</span></span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-4 relative">
            {[
              { label: "Citizen Report", icon: FileText, desc: "Triage raw complaints and ingest citizen imagery.", duration: "85ms", confidence: 100 },
              { label: "Vision Agent", icon: Eye, desc: "Asphalt fracture depth and surface area analysis.", duration: "420ms", confidence: 96 },
              { label: "Geo Agent", icon: MapPin, desc: "Municipal conduit mapping and utility collision overlays.", duration: "115ms", confidence: 99 },
              { label: "Risk Analysis", icon: AlertTriangle, desc: "Safety cordon modeling and dynamic threat valuation.", duration: "135ms", confidence: 92 },
              { label: "Prediction", icon: TrendingUp, desc: "Cavity propagation forecasting with localized storm cells.", duration: "310ms", confidence: 88 },
              { label: "Municipal Dispatch", icon: Zap, desc: "DPW routing optimizer and SLA emergency routing.", duration: "190ms", confidence: 97 }
            ].map((node, index) => {
              const isNodeActive = activePipelineNode === index;
              const isNodeComplete = activePipelineNode !== null && activePipelineNode > index;
              const isNodeHovered = hoveredStageIdx === index;
              const IconComp = node.icon;
              
              // Map stage label to telemetry agent filter name
              const stageAgentFilters = ["System", "Vision Agent", "Geo Agent", "Risk Agent", "Prediction Agent", "Dispatch Agent"];

              return (
                <div 
                  key={index}
                  onClick={() => {
                    setTerminalAgentFilter(stageAgentFilters[index]);
                  }}
                  onMouseEnter={() => setHoveredStageIdx(index)}
                  onMouseLeave={() => setHoveredStageIdx(null)}
                  className={`flex-1 flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-300 relative cursor-pointer select-none ${
                    isNodeActive 
                      ? "border-cyan-500 bg-cyan-950/10 ring-1 ring-cyan-500/20 shadow-lg shadow-cyan-950/10 scale-[1.02]" 
                      : isNodeComplete 
                        ? "border-emerald-950/30 bg-emerald-950/5 hover:border-emerald-900/40"
                        : "border-gray-900/60 bg-gray-950/20 hover:border-gray-850 opacity-60 hover:opacity-100"
                  } ${isNodeHovered ? "border-cyan-500/40" : ""}`}
                >
                  {/* Circle badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors text-xs font-bold ${
                      isNodeActive 
                        ? "bg-cyan-950 text-cyan-400 border-cyan-400 animate-pulse" 
                        : isNodeComplete 
                          ? "bg-emerald-950 text-emerald-400 border-emerald-500" 
                          : "bg-gray-900 text-gray-500 border-gray-800"
                    }`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    
                    <div className="text-right font-mono text-[8px] text-gray-600 space-y-0.5">
                      <div className="uppercase tracking-widest">{node.duration}</div>
                      <div>Conf: {node.confidence}%</div>
                    </div>
                  </div>

                  {/* Node Description Text */}
                  <div className="mt-3.5 text-left space-y-1">
                    <h4 className={`text-xs font-bold leading-none ${isNodeActive ? "text-cyan-400" : isNodeComplete ? "text-emerald-450" : "text-gray-300"}`}>
                      {node.label}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-normal line-clamp-1">
                      {node.desc}
                    </p>
                  </div>

                  {/* Status pill at bottom */}
                  <div className="mt-3 pt-2 border-t border-gray-900/50 flex justify-between items-center text-[8px] font-mono">
                    <span className="text-gray-600 uppercase">SLA-STAGE 0{index + 1}</span>
                    <span className={`font-bold ${
                      isNodeComplete ? "text-emerald-400" : isNodeActive ? "text-cyan-400 animate-pulse" : "text-gray-650"
                    }`}>
                      {isNodeComplete ? "✓ DONE" : isNodeActive ? "● ACTIVE" : "PENDING"}
                    </span>
                  </div>

                  {/* Connector indicator for large screens */}
                  {index < 5 && (
                    <div className={`hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-[1px] z-20 pointer-events-none ${
                      isNodeComplete ? "bg-emerald-800/30" : "bg-gray-800"
                    }`} />
                  )}

                  {/* Tooltip Hover Overlay */}
                  {isNodeHovered && (
                    <div className="absolute inset-0 bg-gray-950/95 border border-cyan-500/20 p-3 rounded-xl flex flex-col justify-between z-30 pointer-events-none transition-opacity duration-200">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                          <IconComp className="w-3.5 h-3.5" />
                          <span>STAGE {index + 1} RESPONSIBILITY</span>
                        </div>
                        <p className="text-[10px] text-gray-300 font-sans leading-normal text-left">
                          {node.desc}
                        </p>
                      </div>
                      <div className="text-[8px] font-mono text-gray-500 text-left">
                        Performance SLA: <span className="text-white font-bold">{node.duration}</span> | Confidence Score: <span className="text-white font-bold">{node.confidence}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* INTEGRATED TWO-COLUMN MISSION & TELEMETRY CONTROL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Contextual Current AI Mission Panel */}
          <div id="section-mission-panel" className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 h-full">
            <div className="bg-gray-950/40 border border-gray-900 rounded-xl p-5 flex flex-col gap-4 shadow-xl h-full justify-between">
              <div className="flex items-center justify-between border-b border-gray-900/50 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">Current AI Mission</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${
                  currentMissionIssue.status === 'resolved' 
                    ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/20" 
                    : currentMissionIssue.status === 'in_progress'
                      ? "bg-cyan-950/50 text-cyan-400 border-cyan-500/20 animate-pulse"
                      : "bg-amber-950/50 text-amber-400 border-amber-500/20"
                }`}>
                  {currentMissionIssue.status.replace('_', ' ')}
                </span>
              </div>

              {/* Original Incident Image */}
              <div className="relative group overflow-hidden rounded-lg border border-gray-900 aspect-video bg-gray-950">
                <IssueImage 
                  src={currentMissionIssue.imageUrl} 
                  alt={currentMissionIssue.title}
                  title={currentMissionIssue.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                  <span className="bg-gray-950/80 backdrop-blur-sm border border-gray-850 text-[8px] font-mono text-gray-300 px-1.5 py-0.5 rounded">
                    {currentMissionIssue.category}
                  </span>
                </div>
              </div>

              {/* Title & Location Info */}
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-bold text-white tracking-tight leading-tight">{currentMissionIssue.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="truncate">{currentMissionIssue.address}</span>
                </div>
              </div>

              {/* Status and Confidence Badges */}
              <div className="grid grid-cols-2 gap-3 border-t border-b border-gray-900/50 py-3 text-left">
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-1">Severity Assessment</div>
                  <div className="flex items-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      currentMissionIssue.analysis?.vision?.severity === 'Critical'
                        ? "bg-red-950/50 text-red-400 border-red-900/30 animate-pulse"
                        : currentMissionIssue.analysis?.vision?.severity === 'High'
                          ? "bg-orange-950/50 text-orange-400 border-orange-900/30"
                          : currentMissionIssue.analysis?.vision?.severity === 'Medium'
                            ? "bg-yellow-950/50 text-yellow-400 border-yellow-900/30"
                            : "bg-blue-950/50 text-blue-400 border-blue-900/30"
                    }`}>
                      {currentMissionIssue.analysis?.vision?.severity || "High"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-1">AI Confidence</div>
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentMissionIssue.analysis?.vision?.confidence || 96}%</span>
                  </div>
                </div>
              </div>

              {/* AI Summary Block */}
              <div className="bg-gray-900/20 border border-gray-900/60 p-3 rounded-lg text-left">
                <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI Mission Intel Summary</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans line-clamp-3">
                  {currentMissionIssue.analysis?.vision?.summary || currentMissionIssue.description}
                </p>
              </div>

              {/* Assigned Department and SLA Completion */}
              <div className="grid grid-cols-2 gap-3 text-left text-[11px] border-b border-gray-900/50 pb-2">
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">Assigned Department</div>
                  <div className="text-gray-300 font-medium truncate">
                    {currentMissionIssue.analysis?.resolution?.responsibleAuthority || "Department of Public Works"}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">SLA Completion</div>
                  <div className="text-gray-300 font-medium">
                    {currentMissionIssue.analysis?.resolution?.estimatedResolutionTime || "2 Hours"}
                  </div>
                </div>
              </div>

              {/* Citizen Verification & Current Active Stage */}
              <div className="grid grid-cols-2 gap-3 text-left text-[11px] pb-1">
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">Citizen Verification</div>
                  <div className="text-gray-300 font-medium flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{currentMissionIssue.verifiedByCount || 42} Upvotes</span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">Processing Stage</div>
                  <div className="text-cyan-400 font-bold truncate">
                    {activePipelineNode === 0 ? "01: Intake Triaging" :
                     activePipelineNode === 1 ? "02: Damage Scanning" :
                     activePipelineNode === 2 ? "03: GIS Utility Overlay" :
                     activePipelineNode === 3 ? "04: Cordon Modeling" :
                     activePipelineNode === 4 ? "05: Soil Failure Model" :
                     activePipelineNode === 5 ? "06: Ticket Dispatch" : "System Standby"}
                  </div>
                </div>
              </div>

              {/* COMPACT VERTICAL AI MISSION TIMELINE */}
              <div className="border-t border-gray-900/50 pt-4 mt-2">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider text-left mb-3 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pipeline Mission Timeline</span>
                </div>

                <div className="relative pl-6 space-y-3.5 text-left">
                  {/* Vertical Track Line */}
                  <div className="absolute left-2 top-1.5 bottom-1.5 w-[1px] bg-gradient-to-b from-emerald-500 via-cyan-500 to-gray-800/80" />

                  {[
                    { label: "Report Received", key: 0 },
                    { label: "Vision Analysis", key: 1 },
                    { label: "Geo Alignment", key: 2 },
                    { label: "Risk Assessment", key: 3 },
                    { label: "Prediction Running", key: 4 },
                    { label: "Municipal Dispatch", key: 5 }
                  ].map((stage, sIdx) => {
                    const isCompleted = activePipelineNode !== null && activePipelineNode > sIdx;
                    const isActive = activePipelineNode === sIdx;
                    const isPending = activePipelineNode === null || activePipelineNode < sIdx;

                    let statusIcon = "⬜";
                    let statusColor = "text-gray-500";
                    let circleBg = "bg-gray-950 border-gray-800 text-gray-600";
                    
                    if (isCompleted) {
                      statusIcon = "✓";
                      statusColor = "text-emerald-400 font-semibold";
                      circleBg = "bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]";
                    } else if (isActive) {
                      statusIcon = "⏳";
                      statusColor = "text-cyan-400 font-bold animate-pulse";
                      circleBg = "bg-cyan-950 border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-pulse";
                    }

                    return (
                      <div key={stage.key} className="flex items-center gap-3 relative">
                        {/* Bullet circle badge */}
                        <div className={`absolute -left-[22px] w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-bold z-10 transition-all ${circleBg}`}>
                          {statusIcon === "✓" ? "✓" : statusIcon === "⏳" ? "•" : ""}
                        </div>

                        <div className="flex-1 flex items-center justify-between text-xs leading-none">
                          <span className={`${statusColor} flex items-center gap-1.5`}>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />}
                            {stage.label}
                          </span>
                          <span className="text-[9px] font-mono text-gray-600">
                            {isCompleted ? "DONE" : isActive ? "RUNNING" : "PENDING"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Thinking Trace Terminal */}
          <div id="section-thinking-trace" className="lg:col-span-7 xl:col-span-8 bg-gray-950/40 border border-gray-900 rounded-xl p-5 relative overflow-hidden shadow-xl flex flex-col gap-4">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">AI Engine Operations Console</h3>
                  <p className="text-[10px] text-gray-500">Live multi-agent decision telemetry matrix and system analysis channels.</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Agent Filter Selector */}
                <select
                  value={terminalAgentFilter}
                  onChange={(e) => setTerminalAgentFilter(e.target.value)}
                  className="bg-gray-950 border border-gray-900 hover:border-gray-800 px-3 py-1.5 rounded-lg text-xs font-mono text-gray-400 outline-none cursor-pointer"
                >
                  <option value="All">All Dispatch Entities</option>
                  <option value="System">System Controller</option>
                  <option value="Vision Agent">Vision Agent</option>
                  <option value="Geo Agent">Geo Agent</option>
                  <option value="Risk Agent">Risk Agent</option>
                  <option value="Prediction Agent">Prediction Agent</option>
                  <option value="Dispatch Agent">Dispatch Agent</option>
                  <option value="Community Agent">Community Agent</option>
                </select>

                {/* Copy logs */}
                <button
                  onClick={handleCopyLogs}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-750 rounded-lg text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedLogs ? "Copied!" : "Copy Logs"}</span>
                </button>
              </div>
            </div>

            {/* Actual Console */}
            <div className="flex-1 min-h-[350px] bg-black/95 border border-gray-950 rounded-xl font-mono p-4 flex flex-col overflow-hidden relative">
              <div className="absolute top-2 right-4 text-[8px] text-gray-800 tracking-wider">SECURE_CONSOLE_PORT_3000</div>

              {/* Filter Search inside terminal */}
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-950 mb-3 shrink-0">
                <Search className="w-3.5 h-3.5 text-gray-700" />
                <input
                  type="text"
                  placeholder="Search raw console buffers..."
                  value={terminalSearch}
                  onChange={(e) => setTerminalSearch(e.target.value)}
                  className="bg-transparent text-[11px] text-gray-300 w-full focus:outline-none placeholder-gray-800"
                />
                {terminalSearch && (
                  <button onClick={() => setTerminalSearch("")} className="text-gray-700 hover:text-gray-500">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Console Control Sub-row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono pb-2.5 border-b border-gray-950 mb-3 shrink-0">
                <div className="flex items-center gap-4">
                  {/* Auto-scroll toggle */}
                  <button 
                    onClick={() => setAutoScrollEnabled(prev => !prev)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all cursor-pointer ${
                      autoScrollEnabled 
                        ? "border-cyan-500/30 bg-cyan-950/20 text-cyan-400" 
                        : "border-gray-900 bg-gray-950/40 text-gray-500"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${autoScrollEnabled ? "bg-cyan-400 animate-pulse" : "bg-gray-600"}`} />
                    <span>Auto-Scroll: {autoScrollEnabled ? "ON" : "OFF"}</span>
                  </button>

                  <span className="text-gray-900">|</span>

                  <span className="text-gray-600">
                    Filtered Matrix: <span className="text-gray-400 font-bold">{filteredLogs.length} entries</span>
                  </span>
                </div>

                {/* Expand/Collapse toggle */}
                <button
                  onClick={() => setTerminalExpanded(prev => !prev)}
                  className="px-2 py-0.5 bg-gray-950 hover:bg-gray-900 border border-gray-900 rounded text-gray-450 hover:text-white transition-all cursor-pointer"
                >
                  {terminalExpanded ? "Collapse Logs (Show 8)" : `Expand Logs (Show ${filteredLogs.length})`}
                </button>
              </div>

              {/* Logs Area with custom colored lines and agent filter */}
              <div 
                ref={terminalContainerRef}
                className="flex-1 min-h-0 overflow-y-auto space-y-1.5 scrollbar-thin pr-2 scroll-smooth"
              >
                {filteredLogs.length === 0 ? (
                  <div className="text-gray-800 text-center py-16 italic text-xs">
                    -- Listening for active AI pipeline streams --
                  </div>
                ) : (
                  (() => {
                    const getAgentStyles = (name: string) => {
                      switch (name) {
                        case "Vision Agent":
                          return { dot: "bg-cyan-400", text: "text-cyan-400" };
                        case "Geo Agent":
                          return { dot: "bg-blue-400", text: "text-blue-400" };
                        case "Risk Agent":
                          return { dot: "bg-red-400", text: "text-red-400" };
                        case "Prediction Agent":
                          return { dot: "bg-purple-400", text: "text-purple-400" };
                        case "Dispatch Agent":
                          return { dot: "bg-emerald-400", text: "text-emerald-400" };
                        case "Community Agent":
                          return { dot: "bg-amber-500", text: "text-amber-500" };
                        case "System":
                        default:
                          return { dot: "bg-gray-450", text: "text-gray-400 font-semibold" };
                      }
                    };

                    const displayedLogs = terminalExpanded ? filteredLogs : filteredLogs.slice(-8);

                    return displayedLogs.map((log, lIdx) => {
                      const styles = getAgentStyles(log.agentName);
                      
                      return (
                        <div 
                          key={lIdx} 
                          className="flex flex-col md:grid md:grid-cols-12 gap-2 py-2 md:py-1.5 border-b border-gray-950/60 text-[11px] items-start md:items-center hover:bg-gray-950/30 transition-colors"
                        >
                          {/* Timestamp & Agent info on top for mobile, grid on desktop */}
                          <div className="flex items-center gap-2 md:col-span-3 w-full md:w-auto">
                            <span className="text-gray-700 font-mono select-none">{(lIdx + 1).toString().padStart(3, "0")}</span>
                            <span className="text-gray-500 font-mono">{log.timestamp}</span>
                            <span className="text-gray-800">|</span>
                            <div className="font-semibold font-mono flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                              <span className={styles.text}>{log.agentName}</span>
                            </div>
                          </div>
                          
                          <div className="md:col-span-3 text-gray-400 font-medium truncate w-full text-left">
                            <span className="text-[9px] text-gray-700 md:hidden mr-1">ACTION:</span>
                            {log.action}
                          </div>
                          
                          <div className="md:col-span-4 text-white truncate w-full text-left flex items-center gap-1.5">
                            <span className="text-[9px] text-gray-700 md:hidden mr-1">RESULT:</span>
                            
                            {/* Subtle badging */}
                            {log.type === "warning" && (
                              <span className="bg-red-950/50 border border-red-900/40 text-[9px] text-red-400 px-1 rounded font-mono font-bold shrink-0">
                                ⚠️ ALERT
                              </span>
                            )}
                            {log.type === "success" && (
                              <span className="bg-emerald-950/40 border border-emerald-900/40 text-[9px] text-emerald-400 px-1 rounded font-mono font-bold shrink-0">
                                ✓ SUCCESS
                            </span>
                            )}
                            {log.type === "prediction" && (
                              <span className="bg-purple-950/40 border border-purple-900/40 text-[9px] text-purple-400 px-1 rounded font-mono font-bold shrink-0">
                                🔮 FORECAST
                              </span>
                            )}
                            {log.type === "dispatch" && (
                              <span className="bg-cyan-950/40 border border-cyan-900/40 text-[9px] text-cyan-400 px-1 rounded font-mono font-bold shrink-0">
                                ⚡ DISPATCH
                              </span>
                            )}
                            
                            <span className="truncate">{log.result}</span>
                          </div>
                          
                          <div className="flex justify-between md:justify-end items-center md:col-span-2 w-full md:w-auto mt-1 md:mt-0 text-[10px]">
                            <div className="md:hidden text-gray-700 font-mono">Performance:</div>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-gray-500">{log.executionTime}</span>
                              <span className="text-gray-800 md:hidden">/</span>
                              <span className="text-cyan-500 font-semibold">{log.confidence}</span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. DISPATCH QUEUE (Table with Actions) */}
      <div id="section-dispatch-queue" className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">Incident Dispatch Queue</h3>
          </div>

          {/* Quick Actions / Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-950 border border-gray-900 px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 outline-none cursor-pointer hover:border-gray-800"
            >
              <option value="All">All Categories</option>
              <option value="Asphalt Collapse">Asphalt Collapse</option>
              <option value="Structural Fracture">Structural Fracture</option>
              <option value="Enviro Hazard">Enviro Hazard</option>
              <option value="Utility Outage">Utility Outage</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-gray-950 border border-gray-900 px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 outline-none cursor-pointer hover:border-gray-800"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>

            <div className="h-5 w-[1px] bg-gray-900" />

            <button
              onClick={() => toggleSort("createdAt")}
              className="px-2.5 py-1.5 bg-gray-950 hover:bg-gray-900 border border-gray-900 rounded-lg text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Intake Date</span>
              <ArrowUpDown className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Dispatch Queue Table Container */}
        <div className="bg-gray-950/40 border border-gray-900 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-gray-950 border-b border-gray-900/60 text-gray-500 text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Citizen Incident</th>
                  <th className="px-5 py-3.5">Severity / Priority</th>
                  <th className="px-5 py-3.5">Assigned Agency</th>
                  <th className="px-5 py-3.5">Assigned AI Agent</th>
                  <th className="px-5 py-3.5">Intake Date</th>
                  <th className="px-5 py-3.5">Confidence</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Emergency Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/40">
                {sortedIssues.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-gray-600 italic">
                      -- No active incidents matching filtration criteria --
                    </td>
                  </tr>
                ) : (
                  sortedIssues.map((issue) => {
                    const isCritical = issue.analysis?.vision?.severity === "Critical";
                    const isHigh = issue.analysis?.vision?.severity === "High";
                    const agentName = indexToAgent(issue);
                    
                    return (
                      <tr 
                        key={issue.id} 
                        className="hover:bg-gray-900/35 transition-colors group"
                      >
                        <td className="px-5 py-4 font-bold text-gray-500 whitespace-nowrap">
                          {issue.id.substring(0, 8)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <span className="text-white font-extrabold block text-sm group-hover:text-cyan-400 transition-colors">
                              {issue.title}
                            </span>
                            <span className="text-gray-500 block text-[10px] leading-none truncate max-w-xs">
                              {issue.address}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              isCritical ? "bg-red-500 animate-pulse" : isHigh ? "bg-orange-500" : "bg-cyan-500"
                            }`} />
                            <span className={`font-bold ${
                              isCritical ? "text-red-400" : isHigh ? "text-orange-400" : "text-cyan-400"
                            }`}>
                              {issue.analysis?.vision?.severity || "Medium"}
                            </span>
                            <span className="text-gray-600">/</span>
                            <span className="text-gray-500">{issue.analysis?.resolution?.priority || "Medium"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-300 font-medium">
                          {issue.analysis?.resolution?.responsibleAuthority || "Public Works"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-cyan-400 font-bold">
                          {agentName}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap font-bold text-gray-400">
                          {issue.analysis?.vision?.confidence ? `${issue.analysis.vision.confidence}%` : "94%"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            issue.status === "resolved" 
                              ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400" 
                              : "bg-amber-950/30 border-amber-900/50 text-amber-400 animate-pulse"
                          }`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Inspect */}
                            <button
                              onClick={() => handleInspectOnMap(issue)}
                              className="px-2 py-1 bg-gray-900 hover:bg-gray-850 text-[10px] text-gray-400 hover:text-cyan-400 border border-gray-800 rounded transition-all cursor-pointer flex items-center gap-1"
                              title="Inspect Incident Geofence"
                            >
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              <span>Inspect</span>
                            </button>

                            {/* View printable PDF manifest */}
                            <button
                              onClick={() => handleSimulatePrint(issue)}
                              className="px-2 py-1 bg-gray-900 hover:bg-gray-850 text-[10px] text-gray-400 hover:text-white border border-gray-800 rounded transition-all cursor-pointer flex items-center gap-1"
                              title="Generate Official Work Ticket"
                            >
                              <FileText className="w-3 h-3 text-cyan-500" />
                              <span>Dispatch PDF</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. GEOSPATIAL MAP & FORECASTS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 cols): Geospatial Operations Map */}
        <div id="section-geospatial-map" className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">Geospatial Operations Map</h3>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase">Interactive Satellite Cordon Map</span>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-gray-900 h-[350px] bg-gray-950">
            {/* Google Map Div */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Simulated Satellite Overlay Effect */}
            <div className="absolute inset-0 pointer-events-none border border-cyan-500/10 shadow-[inset_0_0_40px_rgba(6,182,212,0.06)]" />

            {/* Marker Hover Tooltip Overlay (Highly interactive!) */}
            <AnimatePresence>
              {hoveredMapPoint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 z-25 p-3.5 bg-gray-950/95 border border-cyan-500/40 rounded-xl shadow-2xl max-w-sm pointer-events-none"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded text-cyan-400 uppercase tracking-widest font-extrabold">
                        {hoveredMapPoint.category}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500">
                        CONFIDENCE: {hoveredMapPoint.analysis?.vision?.confidence}%
                      </span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-extrabold text-white text-xs leading-none">{hoveredMapPoint.title}</h4>
                      <p className="text-[9px] font-mono text-gray-500 block leading-normal mt-1">{hoveredMapPoint.address}</p>
                    </div>
                    <div className="text-[10px] text-gray-400 text-left border-t border-gray-900/60 pt-1.5 font-sans leading-relaxed">
                      {hoveredMapPoint.description.substring(0, 110)}...
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right (4 cols): AI Dynamic Forecasts */}
        <div id="section-ai-forecasts" className="lg:col-span-4 space-y-3 flex flex-col justify-between h-full min-h-[350px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">AI Dynamic Forecasts</h3>
            </div>
            <p className="text-[10px] text-gray-500 font-sans leading-relaxed text-left">
              Predictive simulations modeling escalation danger parameters.
            </p>
          </div>

          <div className="flex-1 mt-4 bg-gray-950/40 border border-gray-900 p-4 rounded-xl flex flex-col justify-between space-y-4">
            {/* Forecast 1 */}
            <div className="space-y-1 text-left border-l-2 border-cyan-500 pl-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-cyan-400 font-extrabold uppercase tracking-widest">Erosion Progression Rate</span>
                <span className="text-[10px] font-mono font-bold text-red-400">+1.4cm / HR</span>
              </div>
              <h4 className="text-white text-xs font-bold mt-0.5">Subsurface Soil Washout Danger</h4>
              <p className="text-[9px] text-gray-500 leading-normal font-sans">
                Erosion propagates under adjacent water conduit. Pipeline collapse risk factor calculated at 92%. Cordon expansion advised.
              </p>
            </div>

            {/* Forecast 2 */}
            <div className="space-y-1 text-left border-l-2 border-purple-500 pl-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-purple-400 font-extrabold uppercase tracking-widest">Weather Grid Overlay</span>
                <span className="text-[10px] font-mono font-bold text-gray-400">RAIN EXPECTED</span>
              </div>
              <h4 className="text-white text-xs font-bold mt-0.5">Atmospheric Hydro-Load Prediction</h4>
              <p className="text-[9px] text-gray-500 leading-normal font-sans">
                Saturated clay layers tomorrow morning will accelerate failure velocity by 40% due to runoff pooling vectors.
              </p>
            </div>

            {/* Forecast 3 */}
            <div className="space-y-1 text-left border-l-2 border-orange-500 pl-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-orange-400 font-extrabold uppercase tracking-widest">SLA Resolution Curve</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">-2.4 Hours</span>
              </div>
              <h4 className="text-white text-xs font-bold mt-0.5">Rapid Containment Velocity</h4>
              <p className="text-[9px] text-gray-500 leading-normal font-sans">
                Predictive routing to Division of Water & Sanitation reduces field validation cycles from 12 hours down to 1.8 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. REGIONAL INFRASTRUCTURE HEALTH (Horizontal Bars with Sparklines) */}
      <div id="section-infrastructure-health" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">Utility Infrastructure Health Indices</h3>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Live Municipal Grid Ingestion</span>
        </div>

        <div className="bg-gray-950/40 border border-gray-900 rounded-xl p-4 space-y-4">
          {infrastructureHealthList.map((grid, idx) => {
            const isAlert = grid.status === "Warning" || grid.status === "Critical";
            return (
              <div key={idx} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-2 border-b border-gray-900/40 last:border-0">
                
                {/* Name, Status, Health % */}
                <div className="md:w-1/4 text-left space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
                    <h4 className="font-extrabold text-white text-xs">{grid.name}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500">
                    <span className="uppercase">SLA Health Status:</span>
                    <span className={`font-bold uppercase ${grid.status === "Critical" ? "text-red-400" : grid.status === "Warning" ? "text-amber-400" : "text-emerald-400"}`}>
                      {grid.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar health gradient */}
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-500">HEALTH VALUE</span>
                    <span className={`font-bold ${isAlert ? "text-red-400" : "text-emerald-400"}`}>{grid.health}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden relative border border-gray-950">
                    <div 
                      style={{ width: `${grid.health}%` }}
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                        grid.health < 90 
                          ? "from-red-600 to-red-500" 
                          : grid.health < 95 
                            ? "from-amber-600 to-amber-500" 
                            : "from-cyan-600 to-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Sparkline History Trend line */}
                <div className="md:w-32 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[7px] font-mono text-gray-600 block uppercase tracking-widest mb-1">5-Day Stability Log</span>
                  <svg className="w-24 h-6 shrink-0 overflow-visible" strokeWidth={1.5}>
                    <polyline
                      fill="none"
                      stroke={isAlert ? "#ef4444" : "#10b981"}
                      points={grid.history.map((val, i) => `${(i / 3) * 88 + 4},${22 - (val - 80) * 1.1}`).join(" ")}
                    />
                    {grid.history.map((val, i) => (
                      <circle
                        key={i}
                        cx={(i / 3) * 88 + 4}
                        cy={22 - (val - 80) * 1.1}
                        r={2.2}
                        className={isAlert ? "fill-red-500" : "fill-emerald-500"}
                      />
                    ))}
                  </svg>
                </div>

                {/* Risk assessment and incidents */}
                <div className="md:w-44 text-right space-y-0.5 text-[10px] font-mono shrink-0">
                  <div className="flex justify-between md:justify-end gap-3 text-gray-500">
                    <span>INCIDENTS IN GRID:</span>
                    <span className="font-bold text-gray-300">{grid.incidents} OPEN</span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-3 text-gray-500">
                    <span>AI RISK RATING:</span>
                    <span className={`font-bold ${grid.risk === "Critical" ? "text-red-400" : grid.risk === "High" ? "text-orange-400" : "text-cyan-400"}`}>
                      {grid.risk.toUpperCase()}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 9. SYSTEM ANALYTICS & CONSENSUS INTELLIGENCE */}
      <div id="section-system-analytics" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-extrabold text-gray-200 text-sm tracking-tight uppercase">Citizen Consensus & System Analytics</h3>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Aggregate Municipal Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { title: "Protected Communities", value: kpiMetrics.protectedCommunities, sub: "Municipal Sectors Active", desc: "Monitored zones with virtual geofencing triggers" },
            { title: "Duplicates Blocked", value: kpiMetrics.dupesBlocked, sub: "Save $8,200 Dispatch Fees", desc: "Redundant citizen files combined in real-time" },
            { title: "Dispatches Generated", value: kpiMetrics.totalDispatches, sub: "Active API routing tunnels", desc: "Automated work orders written to local databases" },
            { title: "Resolved Incidents", value: kpiMetrics.resolved, sub: "100% SLA Fulfillment Rate", desc: "Verified hazard repairs archived in database ledger" },
            { title: "Cumulative Upvotes", value: "1,248", sub: "Citizen Validation Score", desc: "Social consensus upvotes registered on Radar Map" },
          ].map((statCard, sIdx) => (
            <div key={sIdx} className="p-4 rounded-xl border border-gray-900 bg-gray-950/40 text-left space-y-1.5 shadow-md">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-gray-500 block">
                {statCard.title}
              </span>
              <div className="text-xl font-display font-extrabold text-white tracking-tight leading-none">
                {statCard.value}
              </div>
              <span className="text-[9px] font-mono font-bold text-cyan-400 block tracking-wide">{statCard.sub}</span>
              <p className="text-[9px] text-gray-600 font-sans leading-normal pt-2 border-t border-gray-900/40">
                {statCard.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED PRINTABLE DISPATCH PDF modal simulation (High Fidelity) */}
      <AnimatePresence>
        {activePdfDispatch && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-gray-900 rounded-xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative border border-gray-300 print:border-0 print:shadow-none print:p-0"
            >
              {/* Top bar controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Manifest</span>
                </button>
                <button
                  onClick={() => setActivePdfDispatch(null)}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-950 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PDF Document Head */}
              <div className="border-b-4 border-gray-900 pb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">Official Protocol Manifest</span>
                    <h2 className="text-xl font-extrabold text-black tracking-tight uppercase">MUNICIPAL CIVIL EMERGENCY DISPATCH</h2>
                  </div>
                  <div className="text-right font-mono text-[10px] text-gray-500 leading-tight">
                    <div>TICKET ID: #{activePdfDispatch.id.substring(0, 8).toUpperCase()}</div>
                    <div>STATUS: DISPATCH_ACTIVE</div>
                    <div>DATE: {new Date(activePdfDispatch.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Image & Barcode area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3 text-left">
                  <h3 className="text-[11px] font-mono font-extrabold text-gray-500 uppercase tracking-widest">A. Photographic Evidence</h3>
                  <IssueImage
                    src={activePdfDispatch.imageUrl}
                    alt="Incident Evidence"
                    title={activePdfDispatch.title}
                    className="w-full h-44 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>
                <div className="space-y-4 text-left font-mono">
                  <h3 className="text-[11px] font-mono font-extrabold text-gray-500 uppercase tracking-widest">B. Autonomous System Verification</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-gray-200 py-1">
                      <span className="text-gray-500 font-bold">AI ASSESSOR:</span>
                      <span className="text-black font-extrabold">Gemini 3.5 Flash Core</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-1">
                      <span className="text-gray-500 font-bold">MULTIMODAL CONF:</span>
                      <span className="text-black font-extrabold">{activePdfDispatch.analysis?.vision?.confidence || 94}%</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-1">
                      <span className="text-gray-500 font-bold">SEVERITY RATING:</span>
                      <span className="text-red-600 font-extrabold uppercase">{activePdfDispatch.analysis?.vision?.severity || "Critical"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-1">
                      <span className="text-gray-500 font-bold">CORDON GEOMETRY:</span>
                      <span className="text-black font-extrabold">250-Meter Radial Geofence</span>
                    </div>
                  </div>

                  {/* Simulated barcode */}
                  <div className="pt-4 flex flex-col items-start justify-center">
                    <div className="h-10 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_6px)] w-48 border-b border-gray-300" />
                    <span className="text-[8px] font-mono tracking-[0.4em] text-gray-500 mt-1 uppercase">CL-{activePdfDispatch.id.substring(0, 8)}</span>
                  </div>
                </div>
              </div>

              {/* Analysis & Description block */}
              <div className="space-y-4 pt-4 border-t border-gray-200 text-left">
                <div className="space-y-1">
                  <h4 className="text-[11px] font-mono font-extrabold text-gray-500 uppercase tracking-widest">C. Incident Scope Overview</h4>
                  <p className="text-xs text-gray-950 font-bold leading-normal">{activePdfDispatch.title}</p>
                  <p className="text-[10px] font-mono text-gray-500 block leading-none">{activePdfDispatch.address}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">{activePdfDispatch.description}</p>
              </div>

              {/* Resolution Mandate Routing details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 text-left font-mono">
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">D. Target Routing Authority</span>
                  <div className="text-black font-extrabold uppercase mt-1">
                    {activePdfDispatch.analysis?.resolution?.responsibleAuthority || "Department of Public Works"}
                  </div>
                  <div className="text-gray-500 leading-normal text-[10px] mt-1">
                    ESTIMATED RESOLUTION SLA: {activePdfDispatch.analysis?.resolution?.estimatedResolutionTime || "2 Hours (Emergency SLA)"}
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">E. Recommended Protocol Action</span>
                  <p className="text-[10px] text-gray-700 leading-relaxed mt-1">
                    {activePdfDispatch.analysis?.resolution?.recommendedAction || "Cordon perimeter, trace adjacent water main stress, check lateral subsurface expansion voids."}
                  </p>
                </div>
              </div>

              {/* PDF Signatures bottom */}
              <div className="flex justify-between items-end pt-12 border-t border-gray-300 text-left font-mono text-[9px] text-gray-400">
                <div>
                  <div>DIGITAL STAMP AUTHORIZED</div>
                  <div className="text-gray-900 font-extrabold uppercase tracking-wide mt-1">CIVICLENS OPERATING OS</div>
                </div>
                <div className="border-t border-gray-400 w-44 text-center pt-2">
                  <span>MUNICIPAL DIRECTOR SIGNATURE</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple helper to associate incident ID to a specific agent
function indexToAgent(issue: CivicIssue): string {
  const c = issue.category.toLowerCase();
  if (c.includes("asphalt") || c.includes("pothole")) return "Risk Agent";
  if (c.includes("conduit") || c.includes("water") || c.includes("sewer")) return "Geo Agent";
  if (c.includes("enviro") || c.includes("leak") || c.includes("dumping")) return "Risk Agent";
  if (c.includes("utility") || c.includes("light") || c.includes("wire")) return "Dispatch Agent";
  return "Vision Agent";
}
