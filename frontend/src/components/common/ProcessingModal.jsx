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
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen, currentStageIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-parakh-card rounded-2xl shadow-2xl border border-parakh-border max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-parakh-primary/10 text-parakh-primary mb-3 border border-parakh-primary/20 shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-parakh-text">
            Processing Packaging Inspection
          </h3>
          <p className="text-xs text-parakh-muted mt-1">
            Executing 6-Stage Legal Metrology Automated Pipeline
          </p>

          <div className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-[11px] font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Statutory PCR-2011 Legal Metrology Pipeline</span>
          </div>
        </div>

        {/* 6-Stage Progress List */}
        <div className="space-y-2.5">
          {STAGES.map((s) => {
            const Icon = s.icon;
            const isFinished = stage > s.id;
            const isCurrent = stage === s.id;

            return (
              <div
                key={s.id}
                className={`flex items-start space-x-3.5 p-2.5 rounded-xl transition-all duration-200 ${
                  isCurrent
                    ? "bg-blue-50 border border-blue-200"
                    : isFinished
                    ? "bg-slate-50 border border-parakh-border"
                    : "opacity-40 border border-transparent"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isFinished
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-parakh-primary text-white animate-pulse"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isFinished ? <CheckCircle className="w-4 h-4" /> : s.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-bold ${
                        isCurrent
                          ? "text-parakh-primary"
                          : isFinished
                          ? "text-parakh-text"
                          : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </p>
                    <span className="text-[10px] font-medium text-parakh-muted">
                      {isFinished ? "Verified" : isCurrent ? "Analyzing..." : "Pending"}
                    </span>
                  </div>
                  <p className="text-[11px] text-parakh-muted truncate mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-parakh-border flex items-center justify-between text-[11px] text-slate-400">
          <span>Rule Engine v1.4 &bull; PCR 2011</span>
          <span>Legal Metrology Inspector Assistant</span>
        </div>
      </div>
    </div>
  );
};
