import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Camera,
  Upload,
  Barcode,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { api } from "../../services/api";
import { ProcessingModal } from "../../components/common/ProcessingModal";

type Mode = "camera" | "upload" | "sample" | "barcode";

export const NewInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as Mode) || "sample";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [selectedSample, setSelectedSample] = useState<string>("parle_g");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("Mall Road Retail Market, Kanpur");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Setup camera stream when in camera mode and no captured image yet
  useEffect(() => {
    if (mode === "camera" && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, capturedImage]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API (getUserMedia) not supported in this browser environment.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission was denied. Please allow camera access in your browser or switch to Upload / Demo mode."
          : `Camera initialization error: ${err.message || "Device camera not found."}`
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleOptions = [
    {
      id: "parle_g",
      title: "Parle-G Glucose Biscuits",
      category: "Packaged Food",
      status: "Compliant Preset",
      desc: "Full statutory compliance under Rule 6(1) of PCR 2011.",
      img: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "amul_milk",
      title: "Amul Taaza Toned Milk (500ml)",
      category: "Dairy Products",
      status: "Compliant Preset",
      desc: "Pasteurized pouch with metric volume and USP declarations.",
      img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "fortune_oil",
      title: "Fortune Kachi Ghani Mustard Oil",
      category: "Edible Oils",
      status: "Compliant Preset",
      desc: "1L pouch with dual weight/volume declaration.",
      img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "non_compliant_sample",
      title: "Super Crunch Peanuts (Violation Sample)",
      category: "Packaged Food",
      status: "Violation Trigger",
      desc: "Missing mandatory MRP & Consumer Care helpline under Rule 6(1)(e) & 6(1)(n).",
      img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const handleAnalyze = async () => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("location_name", locationName);
    formData.append("jurisdiction", "Kanpur Nagar, Uttar Pradesh");

    if (mode === "sample") {
      formData.append("sample_key", selectedSample);
      formData.append("inspection_method", "SAMPLE");
    } else if (mode === "camera") {
      formData.append("inspection_method", "CAMERA");
      if (capturedImage) {
        // Convert base64 dataUrl to blob
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        formData.append("image", blob, "camera_capture.jpg");
      }
    } else if (mode === "upload") {
      formData.append("inspection_method", "UPLOAD");
      if (uploadedFile) {
        formData.append("image", uploadedFile);
      }
    } else if (mode === "barcode") {
      formData.append("inspection_method", "BARCODE");
      formData.append("sample_key", "parle_g");
    }

    try {
      // Delay slightly for animated pipeline feedback
      const [inspection] = await Promise.all([
        api.analyzeInspection(formData),
        new Promise((resolve) => setTimeout(resolve, 2400)),
      ]);
      setIsProcessing(false);
      navigate(`/inspections/${inspection.id}`);
    } catch (err: any) {
      setIsProcessing(false);
      alert(`Inspection analysis error: ${err.message || "Failed to analyze package."}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <ProcessingModal isOpen={isProcessing} isSimulated={true} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          New Legal Metrology Inspection
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Perform automated statutory compliance verification on packaged commodity labels
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1">
        <button
          onClick={() => {
            setMode("sample");
            setCapturedImage(null);
          }}
          className={`flex-1 min-w-[120px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            mode === "sample"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Demo Samples (SIH)</span>
        </button>

        <button
          onClick={() => {
            setMode("camera");
            setCapturedImage(null);
          }}
          className={`flex-1 min-w-[120px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            mode === "camera"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera</span>
        </button>

        <button
          onClick={() => {
            setMode("upload");
            setCapturedImage(null);
          }}
          className={`flex-1 min-w-[120px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            mode === "upload"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>

        <button
          onClick={() => {
            setMode("barcode");
            setCapturedImage(null);
          }}
          className={`flex-1 min-w-[120px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            mode === "barcode"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Barcode className="w-4 h-4" />
          <span>Barcode / GTIN</span>
        </button>
      </div>

      {/* Main Inspection Capture Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Sample Demo Mode Selection */}
        {mode === "sample" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select Packaged Commodity Sample
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-configured legal metrology reference packages for rapid demonstration
                </p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">
                Reproducible SIH Evaluation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {sampleOptions.map((opt) => {
                const isSelected = selectedSample === opt.id;
                const isViolation = opt.id === "non_compliant_sample";
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedSample(opt.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start space-x-3 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <img
                      src={opt.img}
                      alt={opt.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {opt.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isViolation
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {opt.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Camera Mode */}
        {mode === "camera" && (
          <div className="space-y-4">
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              {cameraError ? (
                <div className="p-6 text-center max-w-md text-white">
                  <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                  <h4 className="text-base font-bold">Camera Access Required</h4>
                  <p className="text-xs text-slate-300 mt-1">{cameraError}</p>
                  <button
                    onClick={() => setMode("sample")}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Switch to Demo Mode
                  </button>
                </div>
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured Package"
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Framing Reticle Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-white/20 flex items-center justify-center">
                    <div className="w-4/5 h-4/5 border-2 border-dashed border-blue-400/80 rounded-xl flex flex-col justify-between p-3">
                      <div className="text-[11px] font-semibold text-blue-200 bg-slate-950/60 px-2 py-1 rounded w-fit">
                        Align Principal Display Panel inside frame
                      </div>
                      <div className="text-[10px] text-white/70 self-end bg-slate-950/60 px-2 py-0.5 rounded">
                        Ensure MRP, Net Qty &amp; Mfg details are well-lit
                      </div>
                    </div>
                  </div>
                </>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex justify-center space-x-3">
              {capturedImage ? (
                <button
                  onClick={handleRetake}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>
              ) : (
                <button
                  onClick={handleCapture}
                  disabled={!!cameraError}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center space-x-2 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>CAPTURE PACKAGE</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upload Image Mode */}
        {mode === "upload" && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            {capturedImage ? (
              <div className="relative rounded-2xl overflow-hidden max-h-80 bg-slate-100 flex items-center justify-center border border-slate-200">
                <img
                  src={capturedImage}
                  alt="Uploaded Package"
                  className="max-h-80 object-contain"
                />
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setUploadedFile(null);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Select package label image
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Supported formats: JPG, PNG, WEBP (Up to 10MB)
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs">
                  Browse Files
                </button>
              </div>
            )}
          </div>
        )}

        {/* Barcode Mode */}
        {mode === "barcode" && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900">
              Enter 13-digit EAN/GTIN barcode number printed on commodity packaging to verify statutory registry.
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                EAN-13 / GTIN Barcode
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="e.g. 8901719101014"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setBarcodeInput("8901719101014")}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Insert Sample
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Inspection Location Input */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Inspection Site / Shop Location
          </label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Jurisdiction: Kanpur Nagar, Uttar Pradesh (Zone 4)
          </p>
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isProcessing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/20 flex items-center space-x-2 transition-all"
          >
            <span>EVALUATE COMPLIANCE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
