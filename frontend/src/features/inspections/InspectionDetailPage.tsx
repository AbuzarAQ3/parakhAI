import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  Edit3,
  XCircle,
} from "lucide-react";
import { api } from "../../services/api";
import { Inspection } from "../../types";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ScoreBadge } from "../../components/common/ScoreBadge";
import { ProductEvidenceViewer } from "./ProductEvidenceViewer";

export const InspectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<string>("REVIEWED");
  const [inspectorNotes, setInspectorNotes] = useState<string>("");
  const [savingReview, setSavingReview] = useState(false);

  useEffect(() => {
    if (id) {
      loadInspection(id);
    }
  }, [id]);

  const loadInspection = (inspId: string) => {
    setLoading(true);
    api
      .getInspection(inspId)
      .then((res) => {
        setInspection(res);
        setReviewStatus(res.review_status);
        setInspectorNotes(res.notes || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleSaveReview = async () => {
    if (!id) return;
    setSavingReview(true);
    try {
      const updated = await api.reviewInspection(id, {
        review_status: reviewStatus,
        notes: inspectorNotes,
      });
      setInspection(updated);
      setShowReviewModal(false);
    } catch (err: any) {
      alert(`Failed to save review: ${err.message}`);
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Loading statutory inspection records...</p>
      </div>
    );
  }

  if (error || !inspection) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Inspection Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">{error || "Record could not be retrieved."}</p>
        <Link
          to="/history"
          className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inspection History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/history"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-blue-600">
                {inspection.inspection_number}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs font-semibold text-slate-500 uppercase">
                {inspection.inspection_method} Mode
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {inspection.product_name}
            </h1>
            {inspection.product_name_hindi && (
              <p className="text-sm font-medium text-slate-500">
                {inspection.product_name_hindi}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Inspector Review</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Card: Score & Statutory Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Circular Gauge */}
        <div className="flex flex-col items-center justify-center md:border-r border-slate-100 pr-0 md:pr-6">
          <ScoreBadge score={inspection.compliance_score} size="lg" />
          <div className="mt-3">
            <StatusBadge status={inspection.compliance_status} size="lg" />
          </div>
        </div>

        {/* Metadata Details */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Jurisdiction</span>
            <p className="font-bold text-slate-900 mt-0.5">{inspection.jurisdiction}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Location</span>
            <p className="font-bold text-slate-900 mt-0.5">{inspection.location_name}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Inspection Timestamp</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {new Date(inspection.timestamp).toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Category</span>
            <p className="font-bold text-slate-900 mt-0.5">{inspection.category}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Extraction Confidence</span>
            <p className="font-bold text-emerald-700 mt-0.5">
              {Math.round(inspection.extraction_confidence * 100)}% Average
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Review Status</span>
            <p className="font-bold text-slate-900 mt-0.5">{inspection.review_status}</p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Extracted Fields & Visual Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Extracted Label Declarations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Extracted Statutory Declarations (PCR 2011)
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {inspection.extracted_fields?.length || 0} Declarations Extracted
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {inspection.extracted_fields?.map((field) => {
                const isMissing = !field.extracted_value;
                return (
                  <div key={field.field_key} className="p-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-600">
                        {field.display_name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            field.confidence > 0.9
                              ? "bg-emerald-50 text-emerald-700"
                              : field.confidence > 0.6
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {Math.round(field.confidence * 100)}% Confidence
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {field.verification_status}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-sm ${
                        isMissing
                          ? "text-rose-600 font-semibold italic"
                          : "text-slate-900 font-medium"
                      }`}
                    >
                      {field.extracted_value || "Declaration absent / not detected"}
                    </p>
                    {field.extracted_value_hindi && (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {field.extracted_value_hindi}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inspector Notes Callout */}
          {inspection.notes && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700">
              <span className="font-bold text-blue-900 block mb-1">
                Inspector Case Notes &amp; Findings:
              </span>
              <p>{inspection.notes}</p>
            </div>
          )}
        </div>

        {/* Right: Visual Product Evidence with Bounding Boxes (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ProductEvidenceViewer
            imageUrl={inspection.image_url}
            fields={inspection.extracted_fields}
            evidenceRecords={inspection.evidence_records}
            isSample={inspection.is_simulated}
          />
        </div>
      </div>

      {/* Section E: Legal Metrology Compliance Rule Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Legal Metrology Compliance Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated deterministic verification against Legal Metrology (Packaged Commodities) Rules, 2011
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            PCR-2011-v2.4 Engine
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-6">Rule ID &amp; Requirement</th>
                <th className="p-3.5">Observed Declaration</th>
                <th className="p-3.5">Result</th>
                <th className="p-3.5">Legal Basis &amp; Explanation</th>
                <th className="p-3.5 pr-6 text-right">Review Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspection.rule_evaluations?.map((ev) => (
                <tr key={ev.rule_id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 pl-6 max-w-xs">
                    <span className="font-mono font-bold text-blue-700 block mb-0.5">
                      {ev.rule_id}
                    </span>
                    <span className="font-bold text-slate-900">{ev.title}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {ev.requirement}
                    </p>
                  </td>

                  <td className="p-3.5 font-medium text-slate-800 max-w-xs">
                    <span className="bg-slate-100 px-2 py-1 rounded inline-block font-mono text-[11px]">
                      {ev.observed_value || "None detected"}
                    </span>
                  </td>

                  <td className="p-3.5 shrink-0">
                    <StatusBadge status={ev.result} size="sm" />
                  </td>

                  <td className="p-3.5 text-slate-600 max-w-sm">
                    <p className="font-medium text-slate-800">{ev.explanation}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {ev.legal_reference}
                    </span>
                  </td>

                  <td className="p-3.5 pr-6 text-right">
                    {ev.inspector_review_required ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Requires Verification
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">
              Inspector Verification &amp; Review
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Record officer verification decision and legal observations for this package
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review Status
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="REVIEWED">REVIEWED (Officer Verified)</option>
                  <option value="ESCALATED">ESCALATED (Issue Statutory Notice)</option>
                  <option value="PENDING">PENDING (Awaiting Lab / Further Info)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Inspector Findings / Notes
                </label>
                <textarea
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  rows={4}
                  placeholder="Enter officer notes, physical packaging inspection observations, or notice references..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2.5">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReview}
                disabled={savingReview}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                {savingReview ? "Saving..." : "Save Review Decision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
