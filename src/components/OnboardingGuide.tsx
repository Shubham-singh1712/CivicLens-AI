import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  HelpCircle, 
  Sparkles, 
  Play, 
  ShieldAlert, 
  Layers 
} from "lucide-react";

interface OnboardingGuideProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TOUR_STEPS = [
  {
    title: "Welcome to CivicLens AI",
    badge: "CORE CAPABILITIES",
    icon: Sparkles,
    color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/30",
    desc: "Welcome to the future of urban safety. CivicLens is an enterprise multi-agent operations system powered by Google Gemini 3.5 Flash that automates civic hazard analysis, safety profiling, and emergency dispatches.",
    actionLabel: "Start Guided Tour",
    targetTab: "landing"
  },
  {
    title: "Analyze Live Hazard Incidents",
    badge: "MULTIMODAL CORE",
    icon: ShieldAlert,
    color: "text-purple-400 border-purple-500/20 bg-purple-950/30",
    desc: "Go to 'Report Issue'. Click on any of the pre-loaded presets (e.g. 'Sinkhole') to auto-fill high-res images and descriptions, then trigger the neural vision analysis pipeline.",
    actionLabel: "Try Logging a Report",
    targetTab: "report"
  },
  {
    title: "Cluster Duplicates & Map Hotspots",
    badge: "SPATIAL MERGING",
    icon: Award,
    color: "text-pink-400 border-pink-500/20 bg-pink-950/30",
    desc: "In the 'Citizen Feed', explore our custom high-contrast Radar Map. Select any incident to see how our geoproximity algorithms cluster nearby reports to eliminate backlog bloat.",
    actionLabel: "Explore the Citizen Feed",
    targetTab: "dashboard"
  },
  {
    title: "Access the AI Command Center",
    badge: "SYSTEM TOPOLOGY",
    icon: Layers,
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/30",
    desc: "Explore our real-time AI Command Center containing live system status, autonomous pipeline sequences, terminal thinking traces, and regional resource forecasts.",
    actionLabel: "Open the AI Command Center",
    targetTab: "hackathon"
  }
];

export default function OnboardingGuide({ activeTab, setActiveTab }: OnboardingGuideProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-launch on first visit
  useEffect(() => {
    const visited = localStorage.getItem("civiclens_visited");
    if (!visited) {
      setIsOpen(true);
      localStorage.setItem("civiclens_visited", "true");
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      setActiveTab(TOUR_STEPS[nextIdx].targetTab);
    } else {
      setIsOpen(false);
      setActiveTab("dashboard");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      setActiveTab(TOUR_STEPS[prevIdx].targetTab);
    }
  };

  const jumpToTab = () => {
    setActiveTab(TOUR_STEPS[currentStep].targetTab);
  };

  return (
    <>
      {/* PERSISTENT LAUNCHER FLOATING BUTTON */}
      {!isOpen && activeTab !== "hackathon" && (
        <button
          onClick={() => {
            setIsOpen(true);
            setCurrentStep(0);
            setActiveTab("landing");
          }}
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-semibold rounded-full shadow-2xl flex items-center gap-2 border border-cyan-400/30 cursor-pointer animate-bounce hover:scale-105 transition-all"
          id="onboarding-tour-launcher"
        >
          <HelpCircle className="w-4 h-4 text-white" />
          <span>Interactive System Tour</span>
        </button>
      )}

      {/* ONBOARDING DIALOG WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 pointer-events-auto">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-gray-950/95 border border-gray-850 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab("dashboard");
                }}
                className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-900 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Progress Indicator Dots */}
              <div className="flex items-center gap-1">
                {TOUR_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentStep ? "w-6 bg-cyan-400" : "w-1.5 bg-gray-800"
                    }`}
                  />
                ))}
              </div>

              {/* Icon & Badge */}
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl border ${TOUR_STEPS[currentStep].color} shrink-0`}>
                  {React.createElement(TOUR_STEPS[currentStep].icon, { className: "w-5 h-5" })}
                </div>
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                    {TOUR_STEPS[currentStep].badge}
                  </span>
                  <h4 className="font-display font-extrabold text-white text-base">
                    {TOUR_STEPS[currentStep].title}
                  </h4>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed text-left font-sans">
                {TOUR_STEPS[currentStep].desc}
              </p>

              {/* Form Action helper button */}
              {TOUR_STEPS[currentStep].targetTab !== activeTab && (
                <button
                  onClick={jumpToTab}
                  className="w-full py-2 bg-gray-900/60 hover:bg-gray-900 text-[11px] font-mono text-cyan-400 rounded-lg border border-cyan-500/10 hover:border-cyan-500/20 transition-all cursor-pointer"
                >
                  Jump to Section
                </button>
              )}

              {/* NAVIGATION CONTROLS */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-900">
                <button
                  disabled={currentStep === 0}
                  onClick={handlePrev}
                  className={`text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                    currentStep === 0 ? "text-gray-700 pointer-events-none" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-[1.02] transition-all"
                >
                  <span>{currentStep === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next Step"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
