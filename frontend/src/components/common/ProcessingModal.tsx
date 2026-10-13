import React, { useEffect, useState } from "react";
import {
  Camera,
  Layers,
  Cpu,
  FileSpreadsheet,
  Scale,
  CheckCircle,
  Loader2,
  Info,
} from "lucide-react";

interface ProcessingModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  isSimulated?: boolean;
}

const STAGES = [
  { id: 1, label: "Product Capture", desc: "Validating resolution, frame alignment & image checksum", icon: Camera },
  { id: 2, label: "Image Preprocessing", desc: "Pillow/OpenCV auto-contrast, grayscale & deskewing", icon: Layers },
  { id: 3, label: "OCR + Vision AI", desc: "Extracting English & Devanagari packaging text", icon: Cpu },
  { id: 4, label: "Structured Label Data", desc: "Parsing MRP, Net Qty, Dates, Address & Consumer Care", icon: FileSpreadsheet },
  { id: 5, label: "Legal Metrology Rule Engine", desc: "Evaluating PCR 2011 statutory mandates & units", icon: Scale },
  { id: 6, label: "Compliance Decision", desc: "Computing statutory score, violations & audit trace", icon: CheckCircle },
];

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  isSimulated = true,
}) => {
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(1);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Processing Packaging Inspection
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Executing 6-Stage Legal Metrology Automated Pipeline
          </p>

          {isSimulated && (
            <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-xs font-medium">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>SIH Hackathon Deterministic Extraction &amp; Real PCR-2011 Rules</span>
            </div>
          )}
        </div>

        {/* 6-Stage Progress List */}
        <div className="space-y-3">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isFinished = currentStage > stage.id;
            const isCurrent = currentStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`flex items-start space-x-3.5 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-blue-50/80 border border-blue-200"
                    : isFinished
                    ? "bg-slate-50 opacity-90"
                    : "opacity-40"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isFinished
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isFinished ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent ? "text-blue-900 font-bold" : "text-slate-800"
                      }`}
                    >
                      {stage.id}. {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-xs text-blue-600 font-semibold flex items-center">
                        <Loader2 className="w-3 h-3 animate-spin mr-1" /> Analyzing...
                      </span>
                    )}
                    {isFinished && (
                      <span className="text-xs text-emerald-600 font-medium">Complete</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Stage {currentStage} of {STAGES.length}</span>
          <span className="font-semibold text-slate-700">
            {Math.round((currentStage / STAGES.length) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};
