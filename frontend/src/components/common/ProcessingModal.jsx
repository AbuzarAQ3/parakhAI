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

const STAGES = [
  { id: 1, label: "Product capture", desc: "Validating resolution, frame alignment & image checksum", icon: Camera },
  { id: 2, label: "Image preprocessing", desc: "Pillow/OpenCV auto-contrast, grayscale & deskewing", icon: Layers },
  { id: 3, label: "OCR + Vision AI", desc: "Extracting English & Devanagari packaging text", icon: Cpu },
  { id: 4, label: "Structured label data", desc: "Parsing MRP, Net Qty, Dates, Address & Consumer Care", icon: FileSpreadsheet },
  { id: 5, label: "Legal Metrology rule engine", desc: "Evaluating PCR 2011 statutory mandates & units", icon: Scale },
  { id: 6, label: "Compliance decision", desc: "Computing statutory score, violations & audit trace", icon: CheckCircle },
];

export const ProcessingModal = ({ isOpen, isSimulated = true, currentStageIndex = 0 }) => {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setStage(1);
      return;
    }

    if (currentStageIndex > 0) {
      setStage(currentStageIndex);
      return;
    }

    const interval = setInterval(() => {
      setStage((prev) => (prev < STAGES.length ? prev + 1 : prev));
    }, 420);

    return () => clearInterval(interval);
  }, [isOpen, currentStageIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Processing Packaging Inspection
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Executing 6-Stage Legal Metrology Automated Pipeline
          </p>

          {isSimulated && (
            <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-[11px] font-medium">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo Mode — Deterministic Extraction &amp; Statutory PCR-2011 Rules</span>
            </div>
          )}
        </div>

        {/* 6-Stage Progress List */}
        <div className="space-y-3">
          {STAGES.map((s) => {
            const Icon = s.icon;
            const isFinished = stage > s.id;
            const isCurrent = stage === s.id;

            return (
              <div
                key={s.id}
                className={`flex items-start space-x-3.5 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-blue-50/80 border border-blue-200"
                    : isFinished
                    ? "bg-slate-50 opacity-95"
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
                  {isFinished ? <CheckCircle className="w-4 h-4" /> : s.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-bold ${
                        isCurrent
                          ? "text-blue-900"
                          : isFinished
                          ? "text-slate-800"
                          : "text-slate-500"
                      }`}
                    >
                      {s.label}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400">
                      {isFinished ? "Done" : isCurrent ? "Analyzing..." : "Waiting"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Rule Engine v1.4 &bull; PCR 2011</span>
          <span>Legal Metrology Inspector Assistant</span>
        </div>
      </div>
    </div>
  );
};
