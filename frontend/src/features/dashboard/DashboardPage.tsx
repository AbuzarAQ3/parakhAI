import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Scan,
  Upload,
  Barcode,
  History,
  ShieldCheck,
  AlertOctagon,
  Clock,
  ArrowRight,
  MapPin,
  Calendar,
} from "lucide-react";
import { api } from "../../services/api";
import { DashboardSummary } from "../../types";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ScoreBadge } from "../../components/common/ScoreBadge";

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboardSummary()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Inspector Greeting & Jurisdiction Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayStr}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {data?.inspector?.name || "Inspector Rajesh Kumar"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
            <span className="flex items-center text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {data?.jurisdiction?.name || "Kanpur Nagar, Uttar Pradesh"} ({data?.jurisdiction?.zone || "Zone 4"})
            </span>
            <span>&bull;</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
              ID: {data?.inspector?.inspector_id || "INSP-UP-KN-4421"}
            </span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-semibold flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              On Duty
            </span>
          </div>
        </div>

        <Link
          to="/inspect"
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
        >
          <Scan className="w-5 h-5" />
          <span>START NEW INSPECTION</span>
        </Link>
      </div>

      {/* Prominent Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* SCAN NOW Primary Card */}
        <Link
          to="/inspect?mode=camera"
          className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-md shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
              Live OCR
            </span>
          </div>
          <h3 className="text-lg font-bold">SCAN NOW</h3>
          <p className="text-xs text-blue-100 mt-1">
            Capture package display panel via device camera
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-white/90 group-hover:translate-x-1 transition-transform">
            <span>Open Camera</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        {/* Upload Image Shortcut */}
        <Link
          to="/inspect?mode=upload"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 text-blue-600 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-900">Upload Image</h3>
          <p className="text-xs text-slate-500 mt-1">
            Analyze packaged commodity photos or label crops
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>Select file</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        {/* Scan Barcode Shortcut */}
        <Link
          to="/inspect?mode=barcode"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 text-blue-600 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Barcode className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-900">Scan Barcode / GTIN</h3>
          <p className="text-xs text-slate-500 mt-1">
            Lookup registered commodity database &amp; verify MRP
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>GTIN lookup</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        {/* Recent Inspections Shortcut */}
        <Link
          to="/history"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-100 text-blue-600 rounded-xl group-hover:bg-blue-50 transition-colors">
              <History className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-900">Inspection History</h3>
          <p className="text-xs text-slate-500 mt-1">
            Review past inspections, notices &amp; field analytics
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>View archive</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>

      {/* KPI Summary Counters (Computed from Backend) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Inspections</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {loading ? "..." : data?.summary.total_inspections ?? 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Kanpur Nagar Jurisdiction</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Compliant Packages</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">
            {loading ? "..." : data?.summary.compliant_count ?? 0}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            {data?.summary.compliance_rate ?? 100}% compliance rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Violations Detected</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-700 mt-1">
            {loading ? "..." : data?.summary.violations_count ?? 0}
          </div>
          <span className="text-[11px] text-rose-600 mt-1 block font-medium">
            PCR 2011 Non-compliance
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700 mt-1">
            {loading ? "..." : data?.summary.pending_review_count ?? 0}
          </div>
          <span className="text-[11px] text-amber-600 mt-1 block font-medium">
            Awaiting Officer Action
          </span>
        </div>
      </div>

      {/* Recent Inspections Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Inspection Activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest field verifications and statutory evaluations
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Loading activity...</div>
          ) : !data?.recent_inspections?.length ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No inspections recorded yet. Click "Start New Inspection" to begin.
            </div>
          ) : (
            data.recent_inspections.map((insp) => (
              <Link
                key={insp.id}
                to={`/inspections/${insp.id}`}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {insp.image_url ? (
                      <img
                        src={insp.image_url}
                        alt={insp.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Scan className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {insp.inspection_number}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {insp.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {insp.product_name}
                    </h4>
                    {insp.product_name_hindi && (
                      <p className="text-xs text-slate-400 font-medium">
                        {insp.product_name_hindi}
                      </p>
                    )}
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        {insp.location_name}
                      </span>
                      <span>&bull;</span>
                      <span>{new Date(insp.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Status Badge */}
                <div className="flex flex-col items-end space-y-1.5 shrink-0">
                  <StatusBadge status={insp.compliance_status} size="sm" />
                  <ScoreBadge score={insp.compliance_score} size="sm" showLabel={false} />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
