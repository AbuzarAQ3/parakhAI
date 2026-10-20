import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Camera,
  Upload,
  Barcode,
  RotateCcw,
  Sparkles,
  MapPin,
  Check,
  AlertCircle,
  FileCheck,
  Layers,
} from "lucide-react";
import { api } from "../../services/api";
import { ProcessingModal } from "../../components/common/ProcessingModal";
import { compressImage, saveOfflineDraft, DEMO_LOCATION } from "../../utils/constants";

export const NewInspectionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") || "camera";

  const [mode, setMode] = useState(initialMode);
  const [useDemoLocation, setUseDemoLocation] = useState(true);
  const [userLocation, setUserLocation] = useState(DEMO_LOCATION);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedSample, setSelectedSample] = useState("bikano");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [resolutionInfo, setResolutionInfo] = useState("3824 × 4832 • AUTO-FOCUS • HDR");
  const [offlineQueued, setOfflineQueued] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Setup camera stream when in camera mode and no captured image yet
  useEffect(() => {
    if (mode === "camera" && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, capturedImage]);

  // Handle Geolocation permission when demo location is toggled off
  useEffect(() => {
    if (!useDemoLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({
              name: "Current GPS Location",
              jurisdiction: "Kanpur Nagar, Uttar Pradesh",
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              zone: "GPS Verified",
            });
          },
          (err) => {
            console.warn("GPS access denied, defaulting to jurisdiction center:", err.message);
            setUserLocation(DEMO_LOCATION);
          }
        );
      }
    } else {
      setUserLocation(DEMO_LOCATION);
    }
  }, [useDemoLocation]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not accessible in this context. Use Upload or Demo Sample.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            setResolutionInfo(
              `${videoRef.current.videoWidth || 1920} × ${videoRef.current.videoHeight || 1080} • AUTO-FOCUS • HDR`
            );
          }
        };
      }
    } catch (err) {
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Switch to Upload or Sample below."
          : `Camera unavailable (${err.message || "No device"}). You can use Upload or Demo Sample.`
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const rawData = canvas.toDataURL("image/jpeg", 0.92);
        // Apply Mandatory Enhancement 1: Client-side compression
        const compressed = await compressImage(rawData, 2000, 0.85);
        setCapturedImage(compressed.dataUrl || rawData);
        stopCamera();
      }
    } else {
      // If camera wasn't running (e.g. preview mode), use sample image
      const fallbackUrl =
        selectedSample === "bikano"
          ? "/samples/Aloo_Bhujia_Bikano.jpeg"
          : selectedSample === "amul"
          ? "/samples/AmulTazaTonedMilk.jpeg"
          : "/samples/SunriseBiscuit.jpeg";
      setCapturedImage(fallbackUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setUploadedFile(null);
    startCamera();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const compressed = await compressImage(file, 2000, 0.85);
      setCapturedImage(compressed.dataUrl);
    }
  };

  const handleStartInspection = async () => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("inspection_method", mode.toUpperCase());
      formData.append("sample_key", selectedSample);
      formData.append("location_name", userLocation.name);
      formData.append("latitude", userLocation.latitude);
      formData.append("longitude", userLocation.longitude);
      formData.append("location_source", useDemoLocation ? "DEMO" : "GPS");
      if (barcodeInput) formData.append("barcode_gtin", barcodeInput);

      if (uploadedFile) {
        formData.append("image", uploadedFile);
      }

      // Check offline capability
      if (!navigator.onLine) {
        await saveOfflineDraft({
          sample_key: selectedSample,
          location: userLocation,
          timestamp: new Date().toISOString(),
          image_url: capturedImage,
        });
        setOfflineQueued(true);
        setTimeout(() => {
          setIsProcessing(false);
          navigate("/history");
        }, 1500);
        return;
      }

      // Call Django analyze API
      const result = await api.analyzeInspection(formData);
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/inspections/${result.id}`);
      }, 1600);
    } catch (err) {
      console.warn("Backend analysis error, opening demo inspection result:", err);
      // Fallback navigation to first demo inspection
      setTimeout(() => {
        setIsProcessing(false);
        navigate("/history");
      }, 1800);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* 6-Stage Processing Modal */}
      <ProcessingModal isOpen={isProcessing} isSimulated={true} />

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center space-x-2 bg-slate-200/80 p-1 rounded-2xl max-w-sm mx-auto text-xs font-bold text-slate-600">
        <button
          onClick={() => {
            setMode("camera");
            setCapturedImage(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            mode === "camera" ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-900"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Camera</span>
        </button>
        <button
          onClick={() => {
            setMode("upload");
            setCapturedImage(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            mode === "upload" ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-900"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
        <button
          onClick={() => {
            setMode("barcode");
            setCapturedImage(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            mode === "barcode" ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-900"
          }`}
        >
          <Barcode className="w-4 h-4" />
          <span>Barcode</span>
        </button>
      </div>

      {/* Main Viewfinder Frame matching Screenshot 1 */}
      <div className="relative rounded-3xl overflow-hidden bg-[#2d3748] shadow-2xl border-4 border-slate-700/60 max-w-md mx-auto aspect-[3/4] flex flex-col justify-between p-4 group">
        {/* Top Badges */}
        <div className="flex items-center justify-between z-20">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>LIVE &bull; INSPECTION FEED</span>
          </div>

          <div className="text-[11px] font-semibold text-white/70 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            PCR 2011 &bull; ZONE 4
          </div>
        </div>

        {/* Viewfinder Center Content */}
        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden rounded-2xl">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured Commodity"
              className="w-full h-full object-contain"
            />
          ) : mode === "camera" && !cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            /* Fallback Sample Display matching Screenshot 1 */
            <div className="relative w-full h-full flex items-center justify-center bg-slate-800">
              <img
                src={
                  selectedSample === "bikano"
                    ? "/samples/Aloo_Bhujia_Bikano.jpeg"
                    : selectedSample === "amul"
                    ? "/samples/AmulTazaTonedMilk.jpeg"
                    : "/samples/SunriseBiscuit.jpeg"
                }
                alt="Reference Package"
                className="max-h-[360px] object-contain drop-shadow-2xl"
              />
            </div>
          )}

          {/* Camera Corner Guides ┌ ┐ └ ┘ */}
          <div className="absolute inset-4 pointer-events-none">
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-white rounded-tl-lg shadow-sm"></div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-white rounded-tr-lg shadow-sm"></div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-white rounded-bl-lg shadow-sm"></div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-white rounded-br-lg shadow-sm"></div>
          </div>

          {/* Center Dashed Inspection Area Box */}
          <div className="absolute inset-x-8 top-16 bottom-24 border-2 border-dashed border-white/80 rounded-xl pointer-events-none flex items-center justify-center shadow-inner">
            {/* Animated Laser Scanning Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-[bounce_2.5s_infinite]"></div>
          </div>

          {/* Guidance Instruction Overlay */}
          <div className="absolute bottom-8 inset-x-4 text-center pointer-events-none z-10">
            <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
              Position the mandatory declaration panel inside the frame
            </span>
          </div>
        </div>

        {/* Viewfinder Bottom Metadata Bar */}
        <div className="text-center z-20 text-[11px] font-mono tracking-wider text-white/70">
          {resolutionInfo}
        </div>
      </div>

      {/* Hidden Canvas & File Input */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Capture & Inspect Action Buttons matching Screenshot 1 */}
      <div className="flex flex-col items-center justify-center space-y-3">
        {!capturedImage ? (
          <>
            <button
              onClick={mode === "upload" ? () => fileInputRef.current?.click() : handleCapture}
              className="w-18 h-18 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 border-4 border-white transition-all group"
              aria-label="Capture & Inspect"
            >
              {mode === "upload" ? (
                <Upload className="w-8 h-8 group-hover:scale-110 transition-transform" />
              ) : (
                <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
              )}
            </button>
            <span className="text-sm font-bold text-slate-800">
              {mode === "upload" ? "Select Image File" : "Capture & Inspect"}
            </span>
          </>
        ) : (
          <div className="flex items-center space-x-3 w-full max-w-sm">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </button>
            <button
              onClick={handleStartInspection}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-500/25 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Analyze Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Location Mode Control (Mandatory Enhancement 3) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900">Enforcement Location</span>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={useDemoLocation}
              onChange={(e) => setUseDemoLocation(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Use Demo Location</span>
          </label>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium truncate">{userLocation.name}</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
            {useDemoLocation ? "DEMO &bull; KANPUR" : "GPS"}
          </span>
        </div>
      </div>

      {/* Sample Reference Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-2">
        <span className="text-xs font-bold text-slate-700 block">
          Quick Demo Reference Package:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setSelectedSample("bikano");
              setCapturedImage(null);
            }}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              selectedSample === "bikano"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Bikano Bhujia
          </button>
          <button
            onClick={() => {
              setSelectedSample("crunchy");
              setCapturedImage(null);
            }}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              selectedSample === "crunchy"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Glucose Biscuits
          </button>
          <button
            onClick={() => {
              setSelectedSample("amul");
              setCapturedImage(null);
            }}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              selectedSample === "amul"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Amul Taaza Milk
          </button>
        </div>
      </div>
    </div>
  );
};
