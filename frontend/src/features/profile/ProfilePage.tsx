import React, { useEffect, useState } from "react";
import {
  UserCheck,
  Phone,
  MapPin,
  Cpu,
  AlertCircle,
} from "lucide-react";
import { api } from "../../services/api";
import { InspectorProfile } from "../../types";

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<InspectorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getInspectorProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading inspector credentials...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Inspector Credentials &amp; System Diagnostics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Authorized Enforcement Officer Profile and Platform Runtime Diagnostics
        </p>
      </div>

      {/* Inspector Identification Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/20">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  Active On Duty
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {profile?.designation}
              </p>
              <p className="text-xs text-slate-400">
                {profile?.department}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-1">
            <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              {profile?.inspector_id}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Badge: {profile?.badge_number}
            </span>
          </div>
        </div>

        {/* Contact & Jurisdiction Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Jurisdiction &amp; Enforcement Zone
            </span>
            <p className="font-bold text-slate-900">{profile?.jurisdiction}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Field Hotline &amp; Dispatch
            </span>
            <p className="font-bold text-slate-900">{profile?.phone}</p>
          </div>
        </div>

        {/* Inspection Stats */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Officer Inspection Record (Current Period)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-slate-400 text-[11px] font-semibold">Total Inspected</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {profile?.inspection_statistics?.total_inspections ?? 0}
              </div>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
              <span className="text-emerald-700 text-[11px] font-semibold">Compliant</span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                {profile?.inspection_statistics?.compliant ?? 0}
              </div>
            </div>
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-center">
              <span className="text-rose-700 text-[11px] font-semibold">Violations</span>
              <div className="text-xl font-black text-rose-700 mt-0.5">
                {profile?.inspection_statistics?.violations ?? 0}
              </div>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
              <span className="text-amber-700 text-[11px] font-semibold">Pending Review</span>
              <div className="text-xl font-black text-amber-700 mt-0.5">
                {profile?.inspection_statistics?.pending_review ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform & Engine Runtime Diagnostics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Platform &amp; AI Engine Diagnostics
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Backend Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">AI / OCR Provider Mode</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {profile?.system_diagnostics?.ai_ocr_processing_mode} (Deterministic SIH Simulation)
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Compliance Rule Engine Version</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {profile?.system_diagnostics?.rule_engine_version}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Database Engine</span>
            <p className="font-bold text-slate-900 mt-0.5 uppercase">
              {profile?.system_diagnostics?.database_engine}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Application Build</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {profile?.system_diagnostics?.app_version}
            </p>
          </div>
        </div>

        {/* Fictional Demo Notice */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5 mt-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Evaluation Mode Identity:</strong> Inspector Rajesh Kumar is a clearly labeled fictional demonstration identity configured for Smart India Hackathon evaluation.
          </div>
        </div>
      </div>
    </div>
  );
};
