import React, { useState, useEffect } from "react";
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Activity, 
  Sliders, 
  Info, 
  Crosshair, 
  Check 
} from "lucide-react";

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number, addressSuggestion?: string) => void;
  address: string;
  setAddress: (address: string) => void;
}

export default function LocationPicker({ lat, lng, onChange, address, setAddress }: LocationPickerProps) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual typing state inputs
  const [latInput, setLatInput] = useState(lat ? lat.toString() : "37.7749");
  const [lngInput, setLngInput] = useState(lng ? lng.toString() : "-122.4194");

  // Keep inputs synced
  useEffect(() => {
    if (lat && lng) {
      setLatInput(lat.toFixed(6));
      setLngInput(lng.toFixed(6));
    }
  }, [lat, lng]);

  const handleManualSubmit = () => {
    const parsedLat = parseFloat(latInput);
    const parsedLng = parseFloat(lngInput);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      onChange(parsedLat, parsedLng);
      setError(null);
    } else {
      setError("Please input valid decimal degree coordinates.");
    }
  };

  const captureGPS = () => {
    setGpsLoading(true);
    setGpsSuccess(false);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser software.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // Reverse-geocode mock generator for realistic address mapping
        const streetNumbers = [101, 244, 482, 742, 915, 1202];
        const streetNames = ["Elm Street", "Market Boulevard", "Pine Avenue", "Oak Creek Trail", "Mission Street", "Broadway Parkway"];
        const wardNum = Math.floor(Math.random() * 8) + 1;
        const randomAddress = `${streetNumbers[Math.floor(Math.random() * streetNumbers.length)]} ${streetNames[Math.floor(Math.random() * streetNames.length)]}, Ward ${wardNum}`;
        
        onChange(userLat, userLng, randomAddress);
        setGpsSuccess(true);
        setGpsLoading(false);
      },
      (err) => {
        console.warn("GPS lookup failed:", err.message);
        setError(`GPS Permission Denied or Timeout (${err.message}). Defaulting to downtown coordinate center.`);
        // Default to downtown SF coordinates
        onChange(37.7749, -122.4194, address || "742 Elm Street, Ward 4");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Drag-and-click mock coordinate picker grid (Canvas-like pad mapping relative values)
  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentX = (e.clientX - rect.left) / rect.width;
    const percentY = (e.clientY - rect.top) / rect.height;

    // Map percentage to San Francisco area coordinates bounding box:
    // Lat: 37.755 to 37.790
    // Lng: -122.445 to -122.395
    const pickedLat = 37.790 - percentY * (37.790 - 37.755);
    const pickedLng = -122.445 + percentX * (-122.395 - (-122.445));

    // Guess a local street mock address near these grid coordinates
    let mockAddr = address;
    if (pickedLat > 37.775) {
      mockAddr = `${Math.floor(pickedLat * 1000 % 500) + 100} North Broadway, Ward 2`;
    } else if (pickedLng < -122.42) {
      mockAddr = `${Math.floor(pickedLat * 1000 % 400) + 200} West Elm Street, Ward 4`;
    } else {
      mockAddr = `${Math.floor(pickedLng * -1000 % 600) + 50} Mission Street, Ward 1`;
    }

    onChange(pickedLat, pickedLng, mockAddr);
  };

  // Convert current lat/lng to percentage for grid indicator dot
  const dotCoords = React.useMemo(() => {
    const currentLat = lat || 37.7749;
    const currentLng = lng || -122.4194;

    const minLat = 37.755;
    const maxLat = 37.790;
    const minLng = -122.445;
    const maxLng = -122.395;

    const left = ((currentLng - minLng) / (maxLng - minLng)) * 100;
    const top = ((maxLat - currentLat) / (maxLat - minLat)) * 100;

    return {
      left: Math.max(0, Math.min(100, left)),
      top: Math.max(0, Math.min(100, top))
    };
  }, [lat, lng]);

  return (
    <div id="location-picker-widget" className="p-5 bg-gray-950/40 border border-gray-900 rounded-2xl space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-gray-900 pb-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Location Awareness & GPS Telemetry</span>
        </h4>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-mono text-emerald-400">GEOPROCESSOR ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left side: Interactive tactile map-pad and coords */}
        <div className="space-y-4">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Configure exact coordinates. Tap anywhere on the high-resolution grid coordinate pad to instantly drop a spatial marker, or grab precise satellite coordinates with one-click GPS.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={captureGPS}
              disabled={gpsLoading}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer flex-1 ${
                gpsSuccess
                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white shadow"
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
              <span>
                {gpsLoading ? "Acquiring GPS..." : gpsSuccess ? "GPS Coordinates Synced" : "Capture Live GPS"}
              </span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded-xl text-[10px] text-amber-400 font-mono leading-normal">
              ⚠️ {error}
            </div>
          )}

          {/* Manual numeric overrides */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">LATITUDE</label>
              <input
                type="text"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                onBlur={handleManualSubmit}
                className="w-full bg-gray-950 border border-gray-900 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:border-cyan-400 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">LONGITUDE</label>
              <input
                type="text"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                onBlur={handleManualSubmit}
                className="w-full bg-gray-950 border border-gray-900 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:border-cyan-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right side: Interactive coordinate grid pad */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
            Tactile Coordinate Grid Mapping
          </span>

          <div 
            onClick={handleGridClick}
            className="h-36 w-full rounded-xl bg-gray-950/90 border border-gray-900 relative cursor-crosshair overflow-hidden group shadow-inner"
          >
            {/* Compass background grids */}
            <div className="absolute inset-0 bg-grid-line opacity-[0.04]" />
            
            {/* Center crosshairs */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/10" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/10" />

            {/* Selected point marker */}
            <div 
              className="absolute w-5 h-5 -ml-2.5 -mt-2.5 flex items-center justify-center transition-all duration-300"
              style={{ left: `${dotCoords.left}%`, top: `${dotCoords.top}%` }}
            >
              <span className="absolute inset-0 bg-cyan-400/25 rounded-full animate-ping"></span>
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white shadow"></span>
              <MapPin className="w-5 h-5 text-cyan-400 absolute -top-5" />
            </div>

            {/* Active coordinates tracker */}
            <div className="absolute bottom-2 right-2 bg-gray-950/90 border border-gray-900 px-2 py-1 rounded text-[8px] font-mono text-gray-400 pointer-events-none">
              LAT: {lat ? lat.toFixed(4) : "37.7749"} &bull; LNG: {lng ? lng.toFixed(4) : "-122.4194"}
            </div>
          </div>

          <p className="text-[10px] text-gray-500 italic text-center">
            Tap anywhere inside the coordinate grid to pin precise local coordinates.
          </p>
        </div>

      </div>

    </div>
  );
}
