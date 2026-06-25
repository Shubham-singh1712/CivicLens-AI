import React, { useState, useRef } from "react";
import { Tag, MapPin, Sparkles, Cpu, FileText } from "lucide-react";
import { CivicIssue } from "../types";
import ImageUploader from "./report/ImageUploader";
import LocationPicker from "./report/LocationPicker";
import AnalysisCard from "./report/AnalysisCard";
import LoadingState from "./report/LoadingState";
import ErrorCard from "./report/ErrorCard";
import { VisionAnalysisResult } from "../services/gemini";

interface ReportIssuePageProps {
  onSubmit: (issue: any) => Promise<CivicIssue>;
  setActiveTab: (tab: string) => void;
  setSelectedIssue: (issue: CivicIssue) => void;
}

const SAMPLE_PRESETS = [
  {
    title: "Major Asphalt Sinkhole near School",
    description: "Deep roadway collapse has formed a dangerous sinkhole right outside the Oakridge Elementary crosswalk. Gravel base is sliding down, and the pavement edge is crumbling.",
    address: "2440 Oakridge Lane, next to Elementary school gate",
    category: "Road Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1599740831144-530ba1129310?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Storm-Damaged Electrical Line Down",
    description: "Heavy oak branch fell onto power cables, snapping the line which is now resting across the pedestrian sidewalk. Sparks can be heard. Entire block has lost electricity.",
    address: "105 Country Club Road, intersection with Ridge Drive",
    category: "Power & Grid",
    imageUrl: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Severe Drainage Clog & Park Flooding",
    description: "Debris and tree logs have completely blocked the municipal storm drain, causing about 1.5 feet of dirty water to pool across the children's play park. Breeding insects visible.",
    address: "Riverfront Park, East Playground Sector",
    category: "Water & Sewer",
    imageUrl: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80"
  }
];

type FormStep = "form" | "analyzing" | "analyzed" | "error";

export default function ReportIssuePage({ onSubmit, setActiveTab, setSelectedIssue }: ReportIssuePageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("Road Infrastructure");
  const [image, setImage] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  
  // Dynamic workflow states
  const [step, setStep] = useState<FormStep>("form");
  const [visionAnalysis, setVisionAnalysis] = useState<VisionAnalysisResult | null>(null);
  const [errorType, setErrorType] = useState<"vision_failed" | "upload_invalid" | "non_civic_issue" | "unknown">("unknown");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploaderError, setUploaderError] = useState("");

  const applyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setAddress(preset.address);
    setCategory(preset.category);
    setImage(preset.imageUrl);
    setUploaderError("");

    // Setup coordinates matched to the specific preset
    if (preset.title.includes("Sinkhole")) {
      setLat(37.7725);
      setLng(-122.4225);
    } else if (preset.title.includes("Electrical")) {
      setLat(37.7845);
      setLng(-122.4115);
    } else {
      setLat(37.7635);
      setLng(-122.4315);
    }
  };

  const handleLaunchAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg("Please provide a description of the issue.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please provide an approximate location or address.");
      return;
    }
    if (!image) {
      setUploaderError("An image of the incident is required to initiate the neural vision diagnostics pipeline.");
      return;
    }

    await triggerVisionAnalysis();
  };

  const triggerVisionAnalysis = async () => {
    setStep("analyzing");
    setErrorMsg("");

    try {
      // Call dedicated vision analysis endpoint
      const res = await fetch("/api/analyze-vision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image,
          description,
          title: title || undefined
        })
      });

      if (!res.ok) {
        throw new Error("Analysis request returned an error status.");
      }

      const result: VisionAnalysisResult = await res.json();

      // Check if this looks like a completely irrelevant image or parsing issue
      const lowercaseDesc = result.description.toLowerCase();
      const isNotCivic = lowercaseDesc.includes("not a civic") || lowercaseDesc.includes("no issue found") || lowercaseDesc.includes("invalid scene");
      
      if (isNotCivic) {
        setErrorType("non_civic_issue");
        setStep("error");
        return;
      }

      setVisionAnalysis(result);
      setStep("analyzed");
    } catch (err: any) {
      console.error("Vision diagnostic failed:", err);
      setErrorType("vision_failed");
      setStep("error");
    }
  };

  // User confirms analysis and publishes the issue to the main database
  const handleConfirmAndPublish = async () => {
    if (!visionAnalysis) return;
    
    setStep("analyzing");
    try {
      const finalIssue = await onSubmit({
        title: title || `Reported ${visionAnalysis.issueType} Issue`,
        description: description,
        address: address,
        category: visionAnalysis.issueType,
        image: image || undefined,
        lat: lat || undefined,
        lng: lng || undefined
      });

      setSelectedIssue(finalIssue);
      setActiveTab("detail");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorType("unknown");
      setErrorMsg("Failed to register the verified issue with the municipal datastore.");
      setStep("error");
    }
  };

  const handleReset = () => {
    setImage(null);
    setTitle("");
    setDescription("");
    setAddress("");
    setCategory("Road Infrastructure");
    setLat(null);
    setLng(null);
    setVisionAnalysis(null);
    setStep("form");
    setErrorMsg("");
    setUploaderError("");
  };

  return (
    <div id="report-issue-page" className="max-w-4xl mx-auto px-6 py-10 relative">
      <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {step === "analyzing" && (
        <div className="max-w-2xl mx-auto my-12">
          <LoadingState />
        </div>
      )}

      {step === "error" && (
        <div className="my-12">
          <ErrorCard 
            errorType={errorType}
            customMessage={errorMsg}
            onRetry={triggerVisionAnalysis}
            onReset={handleReset}
          />
        </div>
      )}

      {step === "analyzed" && visionAnalysis && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800 bg-gray-950/20 max-w-3xl mx-auto my-6 space-y-6">
          <AnalysisCard 
            analysis={visionAnalysis}
            onProceed={handleConfirmAndPublish}
            onReset={() => setStep("form")}
          />
        </div>
      )}

      {step === "form" && (
        <div className="space-y-8 text-left">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/30 border border-cyan-900/40 rounded-full text-[10px] font-mono text-cyan-400">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>LIVE GOOGLE GEMINI POWERED VISION PIPELINE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl text-white">Log a Civic Emergency</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Upload a photo of a safety hazard, infrastructure breakage, or utility failure. Our specialized Gemini Core immediately inspects, priority-ranks, and produces a complete safety cordon and preventative impact forecast.
            </p>
          </div>

          {/* Preset Buttons for Demo */}
          <div className="space-y-3 p-4 bg-gray-950/40 border border-gray-900 rounded-xl">
            <div className="text-xs font-mono text-gray-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>HACKATHON QUICK DEMO PRESETS:</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800/70 text-xs font-medium text-gray-300 rounded-lg border border-gray-800 hover:border-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{preset.title.split(' ')[1] || preset.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLaunchAnalysis} className="space-y-6">
            
            {/* Image Upload Area Component */}
            <ImageUploader 
              image={image}
              setImage={setImage}
              errorMsg={uploaderError}
              setErrorMsg={setUploaderError}
            />

            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title-input" className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Title / Subject (Optional)</label>
                <input
                  id="title-input"
                  type="text"
                  placeholder="e.g. Major water pooling near sidewalk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category-select" className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Default Category Estimate</label>
                <div className="relative">
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Road Infrastructure">Road Infrastructure</option>
                    <option value="Water & Sewer">Water & Sewer</option>
                    <option value="Power & Grid">Power & Grid</option>
                    <option value="Waste & Sanitation">Waste & Sanitation</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="Park Maintenance">Park Maintenance</option>
                  </select>
                  <Tag className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label htmlFor="address-input" className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Incident Location (Required)</label>
              <div className="relative">
                <input
                  id="address-input"
                  type="text"
                  placeholder="e.g. 524 Oak Street or intersection of 4th Ave and Pine"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
                <MapPin className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* GPS & Tactile Coordinate Picker */}
            <LocationPicker
              lat={lat}
              lng={lng}
              onChange={(newLat, newLng, addressSuggestion) => {
                setLat(newLat);
                setLng(newLng);
                if (addressSuggestion) {
                  setAddress(addressSuggestion);
                }
              }}
              address={address}
              setAddress={setAddress}
            />

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="desc-textarea" className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Detailed Description of Hazard (Required)</label>
              <textarea
                id="desc-textarea"
                rows={4}
                placeholder="Describe what happened, what hazards you see, if any damage has occurred, and the estimated size of the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                required
              ></textarea>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-400 font-mono">
                {errorMsg}
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider rounded-xl shadow-lg transition-all cursor-pointer active:scale-[0.99]"
            >
              <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
              <span>LAUNCH NEURAL VISION ANALYSIS</span>
            </button>

          </form>

        </div>
      )}
    </div>
  );
}
