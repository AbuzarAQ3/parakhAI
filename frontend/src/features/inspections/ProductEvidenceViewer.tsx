import React, { useState } from "react";
import { Eye, EyeOff, Layers, Sparkles } from "lucide-react";
import { ExtractedField, InspectionEvidence } from "../../types";

interface ProductEvidenceViewerProps {
  imageUrl: string;
  fields?: ExtractedField[];
  evidenceRecords?: InspectionEvidence[];
  isSample?: boolean;
}

export const ProductEvidenceViewer: React.FC<ProductEvidenceViewerProps> = ({
  imageUrl,
  fields = [],
  isSample = true,
}) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);

  // Fallback image if empty
  const displayImage =
    imageUrl || "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Header with annotation toggles */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-bold text-slate-900">
            Product Evidence &amp; Visual Ground Truth
          </h4>
          {isSample && (
            <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
              Sample Evidence
            </span>
          )}
        </div>

        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            showAnnotations
              ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          {showAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showAnnotations ? "Hide Annotations" : "Show Bounding Boxes"}</span>
        </button>
      </div>

      {/* Interactive Image Frame */}
      <div className="relative bg-slate-900 flex items-center justify-center min-h-[340px] max-h-[460px] overflow-hidden group">
        <img
          src={displayImage}
          alt="Packaged Commodity Principal Display Panel"
          className="w-full h-full object-contain max-h-[460px]"
        />

        {/* Bounding Box Overlays */}
        {showAnnotations && (
          <div className="absolute inset-0 pointer-events-none">
            {fields
              .filter((f) => f.coordinates && typeof f.coordinates.x === "number")
              .map((field) => {
                const { x = 0, y = 0, width = 100, height = 40 } = field.coordinates;
                // Convert pixel approximations assuming base 700x700 image space
                const left = `${(x / 700) * 100}%`;
                const top = `${(y / 700) * 100}%`;
                const w = `${(width / 700) * 100}%`;
                const h = `${(height / 700) * 100}%`;

                const isSelected = activeFieldKey === field.field_key;
                const isViolation = !field.extracted_value;

                return (
                  <div
                    key={field.field_key}
                    style={{ left, top, width: w, height: h }}
                    className={`absolute border-2 rounded-sm transition-all pointer-events-auto cursor-pointer ${
                      isSelected
                        ? "border-blue-400 bg-blue-500/25 ring-2 ring-blue-300"
                        : isViolation
                        ? "border-rose-500 bg-rose-500/20"
                        : "border-emerald-400 bg-emerald-500/15 hover:border-blue-300 hover:bg-blue-400/20"
                    }`}
                    onClick={() =>
                      setActiveFieldKey(isSelected ? null : field.field_key)
                    }
                    title={`${field.display_name}: ${field.extracted_value || "Missing"}`}
                  >
                    <span
                      className={`absolute -top-4 left-0 text-[10px] font-bold px-1 py-0.2 rounded shadow-xs whitespace-nowrap ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : isViolation
                          ? "bg-rose-600 text-white"
                          : "bg-slate-900/90 text-white"
                      }`}
                    >
                      {field.display_name.split(" ")[0]} ({Math.round(field.confidence * 100)}%)
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Field Selector Pill Bar */}
      {fields.length > 0 && (
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center mr-1">
            <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
            Detected Fields:
          </span>
          {fields.map((f) => (
            <button
              key={f.field_key}
              onClick={() =>
                setActiveFieldKey(activeFieldKey === f.field_key ? null : f.field_key)
              }
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                activeFieldKey === f.field_key
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {f.display_name.split(" ")[0]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
