import React, { useState, useEffect } from "react";
import { 
  Heart,
  MessageSquare,
  Share2,
  CheckCircle2,
  XCircle,
  Flame,
  MapPin,
  TrendingUp,
  UserCheck,
  Compass,
  Search,
  Sparkles,
  Cpu,
  Layers,
  Award,
  AlertOctagon,
  Calendar,
  Eye,
  Check,
  User,
  Map,
  Clock,
  ArrowRight
} from "lucide-react";
import { CivicIssue, DashboardMetrics } from "../types";
import MapView from "./dashboard/MapView";
import { IssueImage } from "./common/IssueImage";

interface CommunityDashboardProps {
  issues: CivicIssue[];
  metrics: DashboardMetrics;
  onUpvote: (id: string) => Promise<void>;
  onVerify: (id: string) => Promise<void>;
  onNotAccurate: (id: string) => Promise<void>;
  onSelectIssue: (issue: CivicIssue) => void;
  setActiveTab: (tab: string) => void;
}

export default function CommunityDashboard({
  issues,
  onUpvote,
  onVerify,
  onNotAccurate,
  onSelectIssue,
  setActiveTab
}: CommunityDashboardProps) {
  // Main Search and Navigation chips
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChip, setActiveChip] = useState<"All" | "Nearby" | "Critical" | "Recent" | "Verified">("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Real-time notification updates simulation
  const [liveAlerts, setLiveAlerts] = useState<string[]>([]);
  const [alertIndex, setAlertIndex] = useState(0);

  // Pagination for infinite scroll simulation
  const [visibleCount, setVisibleCount] = useState(4);
  const [isScrolling, setIsScrolling] = useState(false);

  // Copied share simulation state
  const [sharedId, setSharedId] = useState<string | null>(null);

  const simulatedAlerts = [
    "🚨 New Report: Road washout detected near Marina Boulevard.",
    "✅ Citizen Consensus: 12 neighbors verified chemical dumping in Oak Creek.",
    "⚡ City Action: Maintenance dispatch assigned to exposed rebar on highway.",
    "🌟 Leaderboard: Satoshi N. just verified their 50th civic report!",
    "🚨 New Report: Water pooling hazard reported near Golden Gate Park."
  ];

  // Rotate simulated community activity events
  useEffect(() => {
    const alertInterval = setInterval(() => {
      setLiveAlerts(prev => {
        const nextAlert = simulatedAlerts[alertIndex];
        setAlertIndex((alertIndex + 1) % simulatedAlerts.length);
        return [nextAlert, ...prev].slice(0, 3);
      });
    }, 9000);

    // Initial alert load
    setLiveAlerts([simulatedAlerts[0]]);

    return () => clearInterval(alertInterval);
  }, [alertIndex]);

  // Handle simulated share button
  const handleShare = (id: string) => {
    setSharedId(id);
    setTimeout(() => setSharedId(null), 2500);
  };

  // Mock Contributors leaderboard data
  const contributors = [
    { name: "Satoshi Nakamoto", reports: 84, score: 98.4, badge: "Grand Arbitrator" },
    { name: "Jane Doe", reports: 62, score: 96.2, badge: "Local Sentinel" },
    { name: "Marcus Aurelius", reports: 47, score: 99.0, badge: "Civic Stoic" },
    { name: "Elena Rostova", reports: 39, score: 95.5, badge: "Waze Oracle" }
  ];

  // Map Filter Options
  const categoriesList = [
    "All",
    "Road Infrastructure",
    "Water & Sewer",
    "Power & Grid",
    "Waste & Sanitation",
    "Public Safety",
    "Park Maintenance"
  ];

  // Filter the issues list based on search term, categories, and custom chips
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || issue.category === selectedCategory;

    // Filter Chips implementation
    let matchesChip = true;
    if (activeChip === "Critical") {
      matchesChip = issue.analysis?.vision?.severity === "Critical";
    } else if (activeChip === "Verified") {
      matchesChip = (issue.verifiedByCount || 0) >= 3;
    } else if (activeChip === "Nearby") {
      // Treat specific locations or higher weights as nearby simulation
      matchesChip = issue.address.includes("SF") || issue.address.includes("St") || issue.address.includes("Avenue");
    } else if (activeChip === "Recent") {
      matchesChip = new Date(issue.createdAt).getTime() > new Date("2026-06-20").getTime();
    }

    return matchesSearch && matchesCategory && matchesChip;
  });

  // Hot/Trending issues (Sorted by upvotes / verification consensus)
  const trendingIssues = [...issues]
    .sort((a, b) => ((b.verifiedByCount || 0) + b.upvotes) - ((a.verifiedByCount || 0) + a.upvotes))
    .slice(0, 3);

  // Recently resolved issues list
  const recentlyResolved = issues
    .filter(issue => issue.status === "resolved")
    .slice(0, 3);

  // Infinite Scroll mock load more
  const handleLoadMore = () => {
    setIsScrolling(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setIsScrolling(false);
    }, 800);
  };

  return (
    <div id="citizen-feed" className="max-w-7xl mx-auto px-6 py-8 space-y-10 text-left relative">
      
      {/* BACKGROUND DECORATIVE ORBS */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-950/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-950/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Real-time incoming citizen updates ticker */}
      {liveAlerts.length > 0 && (
        <div className="overflow-hidden bg-cyan-950/20 border border-cyan-900/30 rounded-xl px-4 py-2 text-xs font-mono text-cyan-400 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="font-bold">LIVE ACTIVITY FEED:</span>
            <span className="text-gray-300 truncate">{liveAlerts[0]}</span>
          </div>
          <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0 hidden sm:inline">Just now</span>
        </div>
      )}

      {/* HEADER HERO AREA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 bg-cyan-950/30 border border-cyan-900/40 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>NEIGHBORHOOD MONITOR</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight">
            What is happening in my city?
          </h2>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            Connect with your neighbors to log infrastructure risks, confirm emergency repairs, and monitor city-wide mitigation progress in real time.
          </p>
        </div>

        {/* LOG AN INCIDENT BUTTON */}
        <button
          onClick={() => setActiveTab("report")}
          className="px-5 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-sans text-xs font-bold tracking-wide rounded-xl shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98] transition-all cursor-pointer shrink-0 self-start md:self-auto"
        >
          Report a New Issue
        </button>
      </div>

      {/* INTERACTIVE COMPASS CHIPS & SEARCH INPUT */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-gray-950/40 p-3 rounded-xl border border-gray-900">
        
        {/* Search Bar Input */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search local reports, streets, hazards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-950 border border-gray-900 text-xs text-gray-200 placeholder-gray-600 rounded-lg focus:border-cyan-500 outline-none pl-8"
          />
          <Search className="w-3.5 h-3.5 text-gray-600 absolute left-2.5 top-2.5" />
        </div>

        {/* Categories selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase hidden lg:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-950 border border-gray-900 text-xs text-gray-300 rounded-lg outline-none cursor-pointer"
          >
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat === "All" ? "All Hazards" : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FILTER CHIPS ROW */}
      <div className="flex flex-wrap items-center gap-2.5">
        {[
          { id: "All", label: "All Incidents" },
          { id: "Nearby", label: "📍 Near Me (SF Central)" },
          { id: "Critical", label: "⚠️ High Priority Hazards" },
          { id: "Recent", label: "🕒 Reported Recently" },
          { id: "Verified", label: "✓ Citizen Confirmed" }
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setActiveChip(chip.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeChip === chip.id
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-800/50"
                : "bg-gray-950/40 text-gray-400 border border-gray-900 hover:border-gray-800 hover:text-gray-300"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* TWO-COLUMN BENTO GRID CONTENT FLOOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: LARGE DISCOVER INCIDENT TIMELINE */}
        <div className="lg:col-span-8 space-y-6">
          
          {filteredIssues.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-gray-900 bg-gray-950/10 rounded-2xl max-w-xl mx-auto space-y-4">
              <AlertOctagon className="w-10 h-10 text-cyan-500 mx-auto" />
              <p className="text-sm font-bold text-white">No local reports match your selection.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Be the first to report an issue in this category or check other filter options.
              </p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setActiveChip("All"); }}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-xs text-cyan-400 border border-gray-850 rounded-lg cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredIssues.slice(0, visibleCount).map((issue) => {
                const hasAIAnalysis = issue.analysis?.vision?.summary;
                const matchesConfirmed = (issue.verifiedByCount || 0) >= 3;
                const formattedDate = new Date(issue.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                });

                return (
                  <div 
                    key={issue.id}
                    id={`feed-card-${issue.id}`}
                    className="overflow-hidden rounded-2xl border border-gray-900 bg-gray-950/30 hover:border-gray-850 transition-all duration-300 shadow-xl relative"
                  >
                    {/* Top user post header row */}
                    <div className="p-4 bg-gray-950/50 border-b border-gray-900/60 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-900/40 text-cyan-400 font-bold font-mono">
                          {issue.title.charAt(0)}
                        </div>
                        <div className="text-left leading-tight">
                          <div className="font-bold text-gray-200">Local Resident Report</div>
                          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-600" />
                            <span>Logged {formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Map category tag */}
                      <span className="px-2.5 py-1 bg-gray-950 text-gray-400 font-mono text-[9px] rounded-lg border border-gray-900 uppercase">
                        {issue.category}
                      </span>
                    </div>

                    {/* Prominent High-Contrast Image container */}
                    <div className="relative h-72 w-full bg-gray-900 overflow-hidden">
                      <IssueImage 
                        src={issue.imageUrl}
                        alt={issue.title}
                        title={issue.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/30"></div>

                      {/* Overlaid address bar */}
                      <div className="absolute bottom-4 left-4 right-4 bg-gray-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-850 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-300 min-w-0">
                          <MapPin className="w-4 h-4 text-cyan-400 shrink-0 animate-bounce" />
                          <span className="truncate">{issue.address}</span>
                        </div>
                        <span className="text-[9px] text-gray-500 shrink-0 bg-gray-950 px-2 py-0.5 rounded uppercase font-bold">
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Detailed textual info */}
                    <div className="p-5 space-y-4">
                      
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-display font-extrabold text-white tracking-tight hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => onSelectIssue(issue)}>
                          {issue.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {issue.description}
                        </p>
                      </div>

                      {/* EXCLUSIVE REDUCED AI SUMMARY BADGE (NOT OVERLY LARGE COGNITIVE OVERHEAD) */}
                      {hasAIAnalysis && (
                        <div className="p-3 bg-cyan-950/10 border border-cyan-950 rounded-xl flex items-start gap-2.5 text-left">
                          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                              AI Diagnosis Assist
                            </span>
                            <p className="text-[10px] text-gray-300 italic">
                              "{issue.analysis?.vision?.summary}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* COMMUNITY NOTES SECTION ACCENT */}
                      {matchesConfirmed && (
                        <div className="p-2.5 bg-emerald-950/20 border border-emerald-950 rounded-xl flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>Community Note: Confirmed accurate by {issue.verifiedByCount} local residents in this geofence.</span>
                        </div>
                      )}

                      {/* PRIMARY COMMUNITY ACTION BOARD (Like/Confirm, Inaccurate, Comments, Share) */}
                      <div className="pt-3 border-t border-gray-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                        
                        {/* Vote/Confirm and Not Accurate buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onVerify(issue.id)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white rounded-lg font-semibold transition-all cursor-pointer shadow-md"
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            <span>Confirm ({issue.verifiedByCount || 0})</span>
                          </button>

                          <button
                            onClick={() => onNotAccurate(issue.id)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-850 hover:text-red-400 text-gray-400 rounded-lg transition-all cursor-pointer"
                            title="Report this report as duplicate or inaccurate"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Inaccurate</span>
                          </button>
                        </div>

                        {/* Interactive comment link and share log */}
                        <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px]">
                          <button 
                            onClick={() => { onSelectIssue(issue); setActiveTab("detail"); }}
                            className="flex items-center gap-1.5 hover:text-white transition-colors bg-gray-950 border border-gray-900 px-3 py-2 rounded-lg cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{issue.comments?.length || 0} Comments</span>
                          </button>

                          <button 
                            onClick={() => handleShare(issue.id)}
                            className="p-2 hover:text-white transition-colors bg-gray-950 border border-gray-900 rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">
                              {sharedId === issue.id ? "Copied!" : "Share"}
                            </span>
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}

              {/* INFINITE SCROLL TIMELINE LOADER BUTTON */}
              {visibleCount < filteredIssues.length && (
                <div className="pt-4 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isScrolling}
                    className="px-6 py-3 bg-gray-950 border border-gray-900 hover:border-gray-800 text-xs font-mono font-bold uppercase text-gray-400 hover:text-white rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    {isScrolling ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <span>Querying next database chunk...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Incidents</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: DISCOVER WIDGET FEED SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. Compact Nearby Reports Radar Map */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-3.5 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block border-b border-gray-900 pb-2">
              Nearby Reports Radar Map
            </span>
            
            <div className="relative h-44 rounded-xl border border-gray-900 overflow-hidden bg-gray-950">
              {/* Render Map preview */}
              <div className="absolute inset-0 bg-grid-line opacity-[0.05] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06),transparent_70%)] pointer-events-none animate-pulse"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <Compass className="w-8 h-8 text-cyan-500 animate-spin-slow" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-white">Interactive Map Synced</p>
                  <p className="text-[9px] text-gray-500">View real-time coordinates of nearby municipal issues.</p>
                </div>
                <button
                  onClick={() => onSelectIssue(issues[0])}
                  className="px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 rounded text-[9px] font-mono text-cyan-400 transition-colors cursor-pointer"
                >
                  Inspect Clustered Markers
                </button>
              </div>
            </div>
            
            <div className="text-[10px] text-gray-500 leading-relaxed font-mono">
              📍 Current viewport coordinates configured to SF Central Sector. Overlap covers 24 block radiuses.
            </div>
          </div>

          {/* B. Trending Incidents panel with fire rating */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1 border-b border-gray-900 pb-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending Incidents</span>
            </span>

            <div className="space-y-3">
              {trendingIssues.map((item, idx) => (
                <div 
                  key={item.id} 
                  onClick={() => onSelectIssue(item)}
                  className="flex gap-3 items-center group cursor-pointer hover:bg-gray-900/20 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-900"
                >
                  <IssueImage
                    src={item.imageUrl}
                    alt={item.title}
                    title={item.title}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-900 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-grow text-left">
                    <div className="text-xs font-bold text-gray-100 truncate group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">{item.address}</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-amber-500 mt-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      <span>{item.verifiedByCount + item.upvotes} Consensus Score</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. Recently Resolved Incidents widget */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 border-b border-gray-900 pb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Recently Resolved</span>
            </span>

            <div className="space-y-3">
              {recentlyResolved.length === 0 ? (
                <div className="text-center py-4 text-[10px] text-gray-500 font-mono">
                  SLA dispatch queue is currently clearing active cases.
                </div>
              ) : (
                recentlyResolved.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onSelectIssue(item)}
                    className="p-3 bg-gray-950/80 rounded-xl border border-gray-900 hover:border-gray-850 transition-colors cursor-pointer group space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-gray-200 truncate group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{item.address}</p>
                    <div className="text-[9px] font-mono text-emerald-400 font-semibold uppercase bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/40 inline-block">
                      Closed &bull; Archive Synced
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* D. Community Leaderboard */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/60 space-y-4 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1 border-b border-gray-900 pb-2">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>Community Leaders</span>
            </span>

            <div className="space-y-2.5">
              {contributors.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs bg-gray-950/40 p-2 rounded-lg border border-gray-900">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono text-gray-500 font-bold w-4">
                      #{idx + 1}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-purple-950/50 border border-purple-900/40 flex items-center justify-center text-[10px] font-bold text-purple-400">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-bold text-gray-200 truncate">{user.name}</div>
                      <div className="text-[9px] text-gray-500 truncate">{user.badge}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold text-white">{user.reports} logs</div>
                    <div className="text-[8px] font-mono text-cyan-400">{user.score}% accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
