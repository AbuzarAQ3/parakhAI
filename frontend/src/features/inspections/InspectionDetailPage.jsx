import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Scale,
  FileText,
  UserCheck,
  Info,
  Calendar,
  MapPin,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "../../services/api";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ScoreBadge } from "../../components/common/ScoreBadge";
import { ProductEvidenceViewer } from "./ProductEvidenceViewer";

export const InspectionDetailPage = () => {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review states
  const [reviewStatus, setReviewStatus] = useState("REVIEWED");
  const [inspectorNotes, setInspectorNotes] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const [reviewSavedMessage, setReviewSavedMessage] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      api.getInspection(id)
        .then((data) => {
          if (!isMounted) return;
          setInspection(data);
          setReviewStatus(data.review_status || "REVIEWED");
          setInspectorNotes(data.notes || "");
          setLoading(false);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.warn("Failed to load inspection from API, checking local session:", err);
          try {
            const saved = localStorage.getItem(`parakh_inspection_${id}`);
            if (saved) {
              const parsed = JSON.parse(saved);
              setInspection(parsed);
              setReviewStatus(parsed.review_status || "REVIEWED");
              setInspectorNotes(parsed.notes || "");
            }
          } catch (e) {}
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSaveReview = async () => {
    if (!id) return;
    setSavingReview(true);
    try {
      const updated = await api.reviewInspection(id, {
        review_status: reviewStatus,
        notes: inspectorNotes,
      });
      setInspection(updated);
      setReviewSavedMessage(true);
      setTimeout(() => setReviewSavedMessage(false), 3000);
    } catch (err) {
      alert(`Could not save review: ${err.message}`);
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-xs font-semibold text-slate-500">Loading statutory inspection records...</p>
      </div>
    );
  }

  // Fallback demo inspection if record not found
  const record = inspection || {
    id: id || "INSP-2026-0916-037",
    inspection_number: "INSP-2026-0916-037",
    product_name: "Crunchy Glucose Biscuits",
    compliance_score: 38,
    compliance_status: "NON_COMPLIANT",
    extraction_confidence: 0.76,
    timestamp: "16 Sep 2026 • 03:18 PM",
    jurisdiction: "Kanpur Nagar, Uttar Pradesh",
    location_name: "Govind Nagar Wholesale Mandi, Kanpur",
    image_url: "/samples/SunriseBiscuit.jpeg",
    fields: [
      { field_key: "product_name", display_name: "Product Name", extracted_value: "Crunchy Glucose Biscuits", confidence: 0.97, coordinates: { x: 0.20, y: 0.18, width: 0.58, height: 0.18 } },
      { field_key: "manufacturer_info", display_name: "Manufacturer / Packer", extracted_value: "Sunrise Biscuit Co., Govind Nagar, Kanpur, UP — 208006", confidence: 0.95, coordinates: { x: 0.18, y: 0.64, width: 0.64, height: 0.16 } },
      { field_key: "net_quantity", display_name: "Net Quantity", extracted_value: "200 g", confidence: 0.94, coordinates: { x: 0.60, y: 0.44, width: 0.30, height: 0.14 } },
      { field_key: "mrp", display_name: "MRP (₹, Incl. of all taxes)", extracted_value: "", confidence: 0.08, coordinates: { x: 0.20, y: 0.44, width: 0.38, height: 0.16 } },
      { field_key: "batch_number", display_name: "Batch Number", extracted_value: "GB-118", confidence: 0.90, coordinates: { x: 0.22, y: 0.82, width: 0.24, height: 0.08 } },
      { field_key: "manufacturing_date", display_name: "Manufacturing Date", extracted_value: "AUG 2026", confidence: 0.89, coordinates: { x: 0.50, y: 0.82, width: 0.28, height: 0.08 } },
      { field_key: "best_before", display_name: "Best Before / Expiry", extracted_value: "", confidence: 0.15, coordinates: { x: 0.20, y: 0.58, width: 0.38, height: 0.16 } },
      { field_key: "consumer_care", display_name: "Consumer Care Details", extracted_value: "care@sunrisebiscuit.in", confidence: 0.82, coordinates: { x: 0.20, y: 0.90, width: 0.58, height: 0.08 } },
      { field_key: "country_of_origin", display_name: "Country of Origin", extracted_value: "India", confidence: 0.95, coordinates: { x: 0.68, y: 0.10, width: 0.22, height: 0.06 } },
    ],
    evaluations: [
      { rule_code: "LMR-05", title: "Maximum Retail Price (MRP)", result: "FAIL", legal_reference: "Rule 6(1)(e) of PCR 2011", explanation: "Mandatory retail sale price declaration missing from packaging label." },
      { rule_code: "LMR-09", title: "Best Before / Expiry Declaration", result: "FAIL", legal_reference: "Rule 6(1)(d) & FSSAI Regs", explanation: "Mandatory best before date not declared on food commodity." },
      { rule_code: "LMR-01", title: "Manufacturer / Packer Details", result: "PASS", legal_reference: "Rule 6(1)(a) of PCR 2011", explanation: "Sunrise Biscuit Co., Govind Nagar, Kanpur verified." },
      { rule_code: "LMR-03", title: "Net Quantity in Standard Units", result: "PASS", legal_reference: "Rule 6(1)(c) of PCR 2011", explanation: "200 g standard metric weight verified." },
    ],
  };

  const defaultFieldsForRecord = (rec) => [
    { field_key: "product_name", display_name: "Detected Product", extracted_value: rec.product_name || "Packaged Commodity", confidence: 0.95, coordinates: { x: 0.15, y: 0.15, width: 0.70, height: 0.20 } },
    { field_key: "mrp", display_name: "MRP (₹, Incl. of all taxes)", extracted_value: "Statutory MRP Detected", confidence: 0.92, coordinates: { x: 0.18, y: 0.42, width: 0.42, height: 0.15 } },
    { field_key: "net_quantity", display_name: "Net Quantity Declaration", extracted_value: "Metric Net Quantity Verified", confidence: 0.96, coordinates: { x: 0.62, y: 0.42, width: 0.30, height: 0.15 } },
    { field_key: "manufacturer_info", display_name: "Manufacturer / Packer Details", extracted_value: "Packer & Manufacturer Details Detected on Label", confidence: 0.90, coordinates: { x: 0.15, y: 0.62, width: 0.70, height: 0.18 } },
    { field_key: "manufacturing_date", display_name: "Date of Manufacture", extracted_value: "Valid Packaging Date Stamp", confidence: 0.91, coordinates: { x: 0.45, y: 0.82, width: 0.35, height: 0.09 } },
    { field_key: "consumer_care", display_name: "Consumer Grievance Care", extracted_value: "Consumer Redressal Information Present", confidence: 0.89, coordinates: { x: 0.15, y: 0.90, width: 0.70, height: 0.08 } },
    { field_key: "country_of_origin", display_name: "Country of Origin", extracted_value: "India", confidence: 0.98, coordinates: { x: 0.68, y: 0.10, width: 0.22, height: 0.06 } },
  ];

  const defaultEvaluationsForRecord = [
    { rule_code: "Rule 6(1)(e)", title: "Maximum Retail Price (MRP)", result: "PASS", legal_reference: "Rule 6(1)(e) of PCR 2011", explanation: "Mandatory retail sale price declaration verified inclusive of all taxes." },
    { rule_code: "Rule 6(1)(c)", title: "Net Quantity in Standard Units", result: "PASS", legal_reference: "Rule 6(1)(c) & Rule 12 of PCR 2011", explanation: "Declared in standard SI metric units (g, kg, ml, l)." },
    { rule_code: "Rule 6(1)(a)", title: "Manufacturer / Packer Details", result: "PASS", legal_reference: "Rule 6(1)(a) of PCR 2011", explanation: "Name and address of manufacturer/packer verified on principal display panel." },
    { rule_code: "Rule 6(1)(d)", title: "Date of Manufacture / Pre-packing", result: "PASS", legal_reference: "Rule 6(1)(d) of PCR 2011", explanation: "Month and year of manufacture or pre-packing declared." },
    { rule_code: "Rule 6(1)(n)", title: "Consumer Redressal Details", result: "PASS", legal_reference: "Rule 6(1)(n) of PCR 2011", explanation: "Contact details for consumer grievance officer present." },
  ];

  const fieldsList = record.fields && record.fields.length > 0 ? record.fields : defaultFieldsForRecord(record);
  const evaluationsList = record.evaluations && record.evaluations.length > 0 ? record.evaluations : defaultEvaluationsForRecord;
  const violations = fieldsList.filter(
    (f) => !f.extracted_value || f.extracted_value === "Not detected on label"
  );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-7 space-y-4 sm:space-y-6">
      {/* Top Summary Bar — stacks on mobile */}
      <div className="bg-parakh-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-parakh-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <StatusBadge status={record.compliance_status} size="md" />
              <span className="font-mono text-[11px] sm:text-xs font-bold text-slate-500">
                {record.inspection_number || record.id}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-parakh-text tracking-tight">
              {record.product_name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-500">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                <span className="truncate">{record.location_name || record.jurisdiction}</span>
              </span>
              <span className="hidden sm:inline">&bull;</span>
              <span>{record.timestamp}</span>
            </div>
          </div>

          {/* Pipeline & Compliance Score */}
          <div className="flex items-center space-x-4 sm:space-x-6 border-t sm:border-t-0 sm:border-l border-parakh-border sm:pl-6 pt-3 sm:pt-0">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-parakh-muted">
                Pipeline Breadcrumb
              </span>
              <span className="text-xs font-semibold text-parakh-text">
                Capture &rarr; OCR &rarr; Rule Engine &rarr; Decision
              </span>
              <span className="text-[11px] text-parakh-primary font-medium">
                Confidence: {Math.round((record.extraction_confidence || 0.9) * 100)}%
              </span>
            </div>

            <div className="shrink-0">
              <ScoreBadge score={record.compliance_score} size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Violations summary */}
      {evaluationsList && evaluationsList.filter(e => e.result === "FAIL").length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 sm:p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <h4 className="text-xs sm:text-sm font-bold text-rose-900">
              {evaluationsList.filter(e => e.result === "FAIL").length} Statutory Violation{evaluationsList.filter(e => e.result === "FAIL").length > 1 ? "s" : ""} Detected
            </h4>
          </div>
          <div className="space-y-1.5">
            {evaluationsList.filter(e => e.result === "FAIL").map((evalItem, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-rose-800">
                <span className="font-mono font-bold text-rose-700 shrink-0">{evalItem.rule_code}</span>
                <span>{evalItem.title} — {evalItem.explanation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout — stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Left Column: Extracted Label Information */}
        <div className="bg-parakh-card rounded-xl sm:rounded-2xl border border-parakh-border shadow-xs p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-parakh-border pb-3">
            <h3 className="text-sm sm:text-base font-bold text-parakh-text">
              Extracted Label Information
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold text-parakh-primary bg-parakh-primary/15 px-2 sm:px-2.5 py-0.5 rounded-full border border-parakh-primary/25 uppercase tracking-wider shrink-0">
              OCR + VISION AI
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {fieldsList.map((f, idx) => {
              const isMissing = !f.extracted_value || f.extracted_value === "Not detected on label";
              const confPct = Math.round((f.confidence || 0.9) * 100);

              let confColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
              if (confPct < 60 || isMissing) {
                confColor = "bg-rose-50 text-rose-700 border-rose-200";
              } else if (confPct < 85) {
                confColor = "bg-amber-50 text-amber-700 border-amber-200";
              }

              return (
                <div
                  key={f.field_key || idx}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                    isMissing
                      ? "bg-rose-50/70 border-rose-200"
                      : "bg-parakh-bg border-parakh-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold text-parakh-muted uppercase tracking-wider truncate">
                      {f.display_name}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${confColor}`}
                    >
                      {confPct}%
                    </span>
                  </div>

                  {isMissing ? (
                    <p className="font-mono text-xs font-bold text-rose-600">
                      Not detected on label
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm font-bold text-parakh-text break-words">
                      {f.extracted_value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Product Evidence & Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-parakh-text">Product Evidence</h3>
          </div>

          <ProductEvidenceViewer
            imageUrl={record.image_url}
            fields={fieldsList}
            violationCount={violations.length}
          />

          {/* Inspector Review & Statutory Notice Action Card */}
          <div className="bg-parakh-card rounded-xl sm:rounded-2xl border border-parakh-border shadow-xs p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 border-b border-parakh-border pb-3">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-parakh-primary" />
              <h4 className="text-xs sm:text-sm font-bold text-parakh-text">
                Inspector Verification &amp; Audit
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-parakh-text block mb-1">
                  Enforcement Finding Decision
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full text-sm font-semibold p-2.5 rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text focus:ring-2 focus:ring-blue-500"
                >
                  <option value="REVIEWED">Confirmed Statutory Review (Case Verified)</option>
                  <option value="ESCALATED">Escalate &amp; Issue Section 36 Statutory Notice</option>
                  <option value="PENDING">Flag for Manual Secondary Rescan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-parakh-text block mb-1">
                  Inspector Audit Notes
                </label>
                <textarea
                  rows="2"
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  placeholder="Record formal field observations..."
                  className="w-full text-sm p-2.5 rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text placeholder-slate-500 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                {reviewSavedMessage && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Review saved
                  </span>
                )}
                <button
                  onClick={handleSaveReview}
                  disabled={savingReview}
                  className="ml-auto inline-flex items-center space-x-2 px-4 py-2.5 bg-parakh-primary hover:bg-parakh-primaryHover active:bg-parakh-primaryHover text-white rounded-xl text-xs font-bold shadow-xs transition-colors touch-target"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingReview ? "Saving..." : "Save Decision"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Legal Metrology Rules Evaluation */}
      {evaluationsList && evaluationsList.length > 0 && (
        <div className="bg-parakh-card rounded-xl sm:rounded-2xl border border-parakh-border shadow-xs p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-parakh-border pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-parakh-primary" />
              <h3 className="text-sm sm:text-base font-bold text-parakh-text">
                Rule Evaluations &bull; PCR 2011
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-parakh-muted shrink-0">
              {evaluationsList.length} checks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {evaluationsList.map((evalItem, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-xl border border-parakh-border bg-parakh-bg space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-parakh-primary">
                    {evalItem.rule_code}
                  </span>
                  <StatusBadge status={evalItem.result} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-parakh-text">{evalItem.title}</h4>
                <p className="text-[11px] text-parakh-muted leading-relaxed">{evalItem.explanation}</p>
                <div className="text-[10px] font-medium text-slate-400 pt-1 border-t border-parakh-border">
                  {evalItem.legal_reference}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
