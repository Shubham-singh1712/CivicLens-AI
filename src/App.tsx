import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ReportIssuePage from "./components/ReportIssuePage";
import CommunityDashboard from "./components/CommunityDashboard";
import IssueDetailPage from "./components/IssueDetailPage";
import HackathonHub from "./components/HackathonHub";
import OnboardingGuide from "./components/OnboardingGuide";
import { CivicIssue, DashboardMetrics } from "./types";
import { ShieldAlert, AlertCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [stats, setStats] = useState<DashboardMetrics>({
    totalIssues: 0,
    resolvedIssues: 0,
    averageConfidence: 92,
    criticalCount: 0,
    categoryDistribution: {}
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [issuesRes, statsRes] = await Promise.all([
        fetch("/api/issues"),
        fetch("/api/stats")
      ]);

      if (!issuesRes.ok || !statsRes.ok) {
        throw new Error("Failed to load records from database.");
      }

      const issuesData = await issuesRes.json();
      const statsData = await statsRes.json();

      setIssues(issuesData);
      setStats(statsData);
      
      // Keep selectedIssue synced with latest database state if open
      if (selectedIssue) {
        const updatedSelected = issuesData.find((i: CivicIssue) => i.id === selectedIssue.id);
        if (updatedSelected) {
          setSelectedIssue(updatedSelected);
        }
      }
      
      setErrorMsg("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Unable to synchronize with CivicLens AI backend. Please verify server connectivity.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Upvoting
  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/upvote`, {
        method: "POST"
      });
      if (res.ok) {
        const updatedIssue = await res.json();
        // Update issues list state
        setIssues(prev => prev.map(item => item.id === id ? updatedIssue : item));
        // Sync detail view state if viewing
        if (selectedIssue && selectedIssue.id === id) {
          setSelectedIssue(updatedIssue);
        }
      }
    } catch (err) {
      console.error("Error toggling upvote:", err);
    }
  };

  // Handle Verification
  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/verify`, {
        method: "POST"
      });
      if (res.ok) {
        const updatedIssue = await res.json();
        setIssues(prev => prev.map(item => item.id === id ? updatedIssue : item));
        if (selectedIssue && selectedIssue.id === id) {
          setSelectedIssue(updatedIssue);
        }
      }
    } catch (err) {
      console.error("Error toggling verification:", err);
    }
  };

  // Handle Not Accurate
  const handleNotAccurate = async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/not-accurate`, {
        method: "POST"
      });
      if (res.ok) {
        const updatedIssue = await res.json();
        setIssues(prev => prev.map(item => item.id === id ? updatedIssue : item));
        if (selectedIssue && selectedIssue.id === id) {
          setSelectedIssue(updatedIssue);
        }
      }
    } catch (err) {
      console.error("Error toggling not-accurate:", err);
    }
  };

  // Handle Add Comment
  const handleAddComment = async (id: string, author: string, text: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text })
      });
      if (res.ok) {
        const updatedIssue = await res.json();
        setIssues(prev => prev.map(item => item.id === id ? updatedIssue : item));
        if (selectedIssue && selectedIssue.id === id) {
          setSelectedIssue(updatedIssue);
        }
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // Handle Add Additional Image
  const handleAddImage = async (id: string, imageUrl: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl })
      });
      if (res.ok) {
        const updatedIssue = await res.json();
        setIssues(prev => prev.map(item => item.id === id ? updatedIssue : item));
        if (selectedIssue && selectedIssue.id === id) {
          setSelectedIssue(updatedIssue);
        }
      }
    } catch (err) {
      console.error("Error adding image:", err);
    }
  };

  // Handle Status Update (Municipal Command)
  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextStatus })
      });
      if (res.ok) {
        const updatedIssue = await res.json();
        setIssues(prev => prev.map(item => item.id === id ? updatedIssue : item));
        setSelectedIssue(updatedIssue);
        
        // Refresh stats database
        const statsRes = await fetch("/api/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      }
    } catch (err) {
      console.error("Error advancing status timeline:", err);
    }
  };

  // Handle New Issue Submit (called by child form)
  const handleSubmitIssue = async (issuePayload: any): Promise<CivicIssue> => {
    const res = await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issuePayload)
    });

    if (!res.ok) {
      throw new Error("Failed to process report with Vision Agent.");
    }

    const createdIssue = await res.json();
    
    // Optimistic / Immediate State Update
    setIssues(prev => [createdIssue, ...prev]);
    
    // Refresh stats
    const statsRes = await fetch("/api/stats");
    if (statsRes.ok) {
      const statsData = await statsRes.json();
      setStats(statsData);
    }

    return createdIssue;
  };

  return (
    <div id="app-root" className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      
      {/* Global Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        stats={{
          totalIssues: stats.totalIssues,
          resolvedIssues: stats.resolvedIssues,
          criticalCount: stats.criticalCount
        }}
      />

      {/* Main Page Routing Wrapper */}
      <main id="app-main-content" className="flex-grow">
        {isLoading && issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 font-mono">
            <span className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></span>
            <span className="text-xs text-gray-500">SYNCHRONIZING CIVIC DATABASE...</span>
          </div>
        ) : errorMsg ? (
          <div className="max-w-md mx-auto my-16 p-6 border border-red-900 bg-red-950/30 rounded-2xl text-center space-y-4 font-mono text-xs">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-red-400 font-bold">COMMUNICATION OUTAGE</p>
            <p className="text-gray-400">{errorMsg}</p>
            <button 
              onClick={fetchData} 
              className="px-4 py-2 bg-gray-900 border border-red-900 hover:bg-gray-800 text-white rounded-lg transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {activeTab === "landing" && (
                <LandingPage 
                  setActiveTab={setActiveTab} 
                  recentIssues={issues}
                  setSelectedIssue={setSelectedIssue}
                />
              )}

              {activeTab === "dashboard" && (
                <CommunityDashboard 
                  issues={issues}
                  metrics={stats}
                  onUpvote={handleUpvote}
                  onVerify={handleVerify}
                  onNotAccurate={handleNotAccurate}
                  onSelectIssue={setSelectedIssue}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "report" && (
                <ReportIssuePage 
                  onSubmit={handleSubmitIssue}
                  setActiveTab={setActiveTab}
                  setSelectedIssue={setSelectedIssue}
                />
              )}

              {activeTab === "detail" && selectedIssue && (
                <IssueDetailPage 
                  issue={selectedIssue}
                  allIssues={issues}
                  onBack={() => setActiveTab("dashboard")}
                  onUpvote={handleUpvote}
                  onVerify={handleVerify}
                  onNotAccurate={handleNotAccurate}
                  onUpdateStatus={handleUpdateStatus}
                  onAddComment={(author, text) => handleAddComment(selectedIssue.id, author, text)}
                  onAddImage={(imageUrl) => handleAddImage(selectedIssue.id, imageUrl)}
                  onSelectIssue={setSelectedIssue}
                />
              )}

              {activeTab === "hackathon" && (
                <HackathonHub />
              )}
            </motion.div>
          </AnimatePresence>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer id="app-footer" className="glass-panel border-t border-gray-900 py-8 px-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>CivicLens AI © 2026. Decentralized Public Safety Infrastructure.</span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-600">Model: Gemini 3.5 Flash</span>
            <span className="text-gray-600">Region: Cloud Run API Gateway</span>
          </div>
        </div>
      </footer>

      {/* Interactive Hackathon Tour / Onboarding Guide */}
      <OnboardingGuide activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}
