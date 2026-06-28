import React, { useState } from "react";
import { Image, UploadCloud, Plus, Camera, Loader2, Check } from "lucide-react";
import { CivicIssue } from "../../types";
import { IssueImage } from "../common/IssueImage";

interface IssueGalleryProps {
  issue: CivicIssue;
  onAddImage: (imageUrl: string) => Promise<void>;
}

export default function IssueGallery({ issue, onAddImage }: IssueGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>(issue.imageUrl);
  const [uploadUrl, setUploadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const imagesList = [issue.imageUrl, ...(issue.additionalImages || [])];

  const handleAddImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim()) return;
    setErrorMsg("");
    setIsUploading(true);
    try {
      await onAddImage(uploadUrl.trim());
      setActiveImage(uploadUrl.trim());
      setUploadUrl("");
      setShowInput(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg("Failed to store auxiliary photographic attachment.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Preset attachments for fast verification
  const PRESET_ATTACHMENTS = [
    "/concrete_spall.jpg",
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80"
  ];

  const applyPresetImage = async (url: string) => {
    setIsUploading(true);
    try {
      await onAddImage(url);
      setActiveImage(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div id={`issue-gallery-${issue.id}`} className="space-y-4">
      {/* Featured Large View */}
      <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-950 h-80 sm:h-96 relative shadow-xl">
        <IssueImage 
          src={activeImage} 
          alt={issue.title} 
          title={issue.title}
          className="w-full h-full object-cover transition-all duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 bg-gray-950/90 backdrop-blur-md border border-gray-850 rounded-lg px-3 py-1.5 text-[10px] font-mono text-gray-300 flex items-center gap-1.5 shadow-lg">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>PHOTOGRAPHIC ATTACHMENT</span>
        </div>
      </div>

      {/* Thumbnails + Upload trigger */}
      <div className="flex flex-wrap items-center gap-2.5">
        {imagesList.map((imgUrl, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(imgUrl)}
            className={`w-16 h-16 rounded-xl overflow-hidden border transition-all cursor-pointer bg-gray-950 shrink-0 ${
              activeImage === imgUrl 
                ? "border-cyan-500 ring-2 ring-cyan-500/20 scale-95" 
                : "border-gray-850 hover:border-gray-700"
            }`}
          >
            <IssueImage src={imgUrl} alt={`Thumbnail ${index + 1}`} title={issue.title} className="w-full h-full object-cover" />
          </button>
        ))}

        {/* Toggle open upload input */}
        <button
          onClick={() => setShowInput(!showInput)}
          className="w-16 h-16 rounded-xl border border-dashed border-gray-800 hover:border-cyan-500/50 bg-gray-950/30 flex flex-col items-center justify-center text-gray-500 hover:text-cyan-400 transition-all cursor-pointer"
          title="Add photo evidence"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[8px] font-mono uppercase mt-1">Add Evidence</span>
        </button>
      </div>

      {/* Auxiliary Photographic Upload input box */}
      {showInput && (
        <form onSubmit={handleAddImageSubmit} className="glass-panel p-4 rounded-xl border border-gray-800 bg-gray-950/40 space-y-3">
          <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>PROVIDE SUPPLEMENTARY PHOTO PROOF (URL)</span>
            </span>
            <button 
              type="button" 
              onClick={() => setShowInput(false)}
              className="text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste supplementary photo URL (e.g. Unsplash link)..."
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              required
            />
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>ATTACH</span>
              )}
            </button>
          </div>

          {/* Quick Assist Preset Images */}
          <div className="space-y-1.5 pt-1 border-t border-gray-900/40">
            <span className="text-[8px] font-mono text-gray-600 uppercase block">Fast Verification Presets:</span>
            <div className="flex gap-2">
              {PRESET_ATTACHMENTS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isUploading}
                  onClick={() => applyPresetImage(url)}
                  className="px-2.5 py-1 bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-cyan-500/20 rounded text-[9px] font-mono text-gray-400 hover:text-cyan-400 transition-all cursor-pointer"
                >
                  Preset Evidence #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p className="text-[9px] font-mono text-red-400">{errorMsg}</p>
          )}
        </form>
      )}

      {success && (
        <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Photographic evidence successfully added to the municipal timeline store.</span>
        </div>
      )}
    </div>
  );
}
