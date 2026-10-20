import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Layers, AlertTriangle, CheckCircle } from "lucide-react";

export const ProductEvidenceViewer = ({
  imageUrl,
  fields = [],
  violationCount = 0,
}) => {
  const [showEvidence, setShowEvidence] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [imageLayout, setImageLayout] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const displayImage = imageUrl || "/samples/SunriseBiscuit.jpeg";

  // Recalculate object-fit: contain letterboxing overlay area whenever container or image resizes
  const updateImageLayout = () => {
    if (!imgRef.current || !containerRef.current) return;
    const img = imgRef.current;
    const container = containerRef.current;

    const naturalWidth = img.naturalWidth || 600;
    const naturalHeight = img.naturalHeight || 600;
    const cWidth = container.clientWidth;
    const cHeight = container.clientHeight;

    const imgRatio = naturalWidth / naturalHeight;
    const containerRatio = cWidth / cHeight;

    let renderedWidth = cWidth;
    let renderedHeight = cHeight;
    let left = 0;
    let top = 0;

    if (imgRatio > containerRatio) {
      renderedWidth = cWidth;
      renderedHeight = cWidth / imgRatio;
      top = (cHeight - renderedHeight) / 2;
    } else {
      renderedHeight = cHeight;
      renderedWidth = cHeight * imgRatio;
      left = (cWidth - renderedWidth) / 2;
    }

    setImageLayout({ left, top, width: renderedWidth, height: renderedHeight });
  };

  useEffect(() => {
    window.addEventListener("resize", updateImageLayout);
    return () => window.removeEventListener("resize", updateImageLayout);
  }, []);

  // Filter fields that have bounding coordinates
  const annotatedFields = fields.filter((f) => {
    const coords = f.coordinates;
    return coords && (typeof coords.x === "number" || typeof coords.left === "number");
  });

  const regionCount = annotatedFields.length || 4;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Evidence Image Container with Letterbox-Aware SVG Overlay */}
      <div
        ref={containerRef}
        className="relative bg-[#f8fafc] flex items-center justify-center min-h-[360px] sm:min-h-[420px] max-h-[500px] overflow-hidden p-3"
      >
        {/* Top Floating Badge matching Screenshot 5 */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white font-bold text-[11px] tracking-wider uppercase shadow-md">
            EVIDENCE &bull; {regionCount} LABEL REGIONS
          </span>
        </div>

        {/* Product Image */}
        <img
          ref={imgRef}
          src={displayImage}
          alt="Packaged Commodity Evidence"
          onLoad={updateImageLayout}
          className="w-full h-full object-contain max-h-[460px] drop-shadow-md select-none"
        />

        {/* Scaled SVG Bounding Boxes Overlay matching Section 12 */}
        {showEvidence && imageLayout.width > 0 && (
          <svg
            style={{
              position: "absolute",
              left: `${imageLayout.left}px`,
              top: `${imageLayout.top}px`,
              width: `${imageLayout.width}px`,
              height: `${imageLayout.height}px`,
            }}
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            className="pointer-events-none z-10"
          >
            {annotatedFields.map((field, idx) => {
              const c = field.coordinates || {};
              // Support normalized 0-1 or 0-1000 coordinates
              let rawX = c.x ?? c.left ?? 0;
              let rawY = c.y ?? c.top ?? 0;
              let rawW = c.width ?? c.w ?? 200;
              let rawH = c.height ?? c.h ?? 100;

              // If 0-1 normalized range, scale to 1000 viewBox
              const x = rawX <= 1.0 ? rawX * 1000 : rawX;
              const y = rawY <= 1.0 ? rawY * 1000 : rawY;
              const w = rawW <= 1.0 ? rawW * 1000 : rawW;
              const h = rawH <= 1.0 ? rawH * 1000 : rawH;

              const isMissing = !field.extracted_value || field.extracted_value === "Not detected on label";
              const isLowConf = field.confidence > 0 && field.confidence < 0.85;

              // Stroke & fill colors matching screenshot
              let strokeColor = "#10b981"; // green (pass)
              let fillColor = "rgba(16, 185, 129, 0.12)";
              let labelBg = "#059669";

              if (isMissing) {
                strokeColor = "#f43f5e"; // rose/red (violation)
                fillColor = "rgba(244, 63, 94, 0.18)";
                labelBg = "#e11d48";
              } else if (isLowConf) {
                strokeColor = "#f59e0b"; // amber (low confidence)
                fillColor = "rgba(245, 158, 11, 0.15)";
                labelBg = "#d97706";
              }

              const labelText = `#0${idx + 1} &bull; ${field.display_name}`;

              return (
                <g key={field.field_key || idx}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="8"
                    ry="8"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="4"
                    strokeDasharray={isMissing ? "8,4" : "none"}
                  />
                  {/* Label Pill */}
                  <rect
                    x={x}
                    y={Math.max(4, y - 32)}
                    width={Math.min(300, Math.max(140, field.display_name.length * 14))}
                    height="28"
                    rx="6"
                    ry="6"
                    fill={labelBg}
                  />
                  <text
                    x={x + 10}
                    y={Math.max(22, y - 12)}
                    fill="#ffffff"
                    fontSize="16"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {`#0${idx + 1} • ${field.display_name}`}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Controls & Legend matching Screenshot 5 */}
      <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
        >
          {showEvidence ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Hide Evidence</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Show Evidence</span>
            </>
          )}
        </button>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Pass</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Low confidence</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Violation</span>
          </div>
        </div>
      </div>

      {/* Alert Banner matching Screenshot 5 */}
      {violationCount > 0 ? (
        <div className="mx-4 mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>AI detected {violationCount} potential statutory violations</span>
        </div>
      ) : (
        <div className="mx-4 mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All applicable statutory packaged commodity declarations verified</span>
        </div>
      )}
    </div>
  );
};
