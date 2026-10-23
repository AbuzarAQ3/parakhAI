import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  MapPin,
  Phone,
  Building2,
  CheckCircle2,
  Trophy,
  Target,
  Award,
  KeyRound,
  Edit3,
  Info,
  X,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { api } from "../../services/api";

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Form states
  const [phoneInput, setPhoneInput] = useState("+91 98765 43210");
  const [badgeInput, setBadgeInput] = useState("UP-4471");
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    Promise.all([api.getInspectorProfile(), api.getHealth()])
      .then(([profData, healthData]) => {
        setProfile(profData);
        setHealth(healthData);
        if (profData?.phone) setPhoneInput(profData.phone);
        if (profData?.badge_number) setBadgeInput(profData.badge_number);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using default demo credentials:", err);
        setLoading(false);
      });
  }, []);

  const p = profile || {
    name: "Rajesh Kumar",
    designation: "Legal Metrology Inspector",
    department: "Dept. of Food & Consumer Protection, Uttar Pradesh",
    inspector_id: "LM/UP/2019/4471",
    badge_number: badgeInput,
    jurisdiction: "Kanpur Nagar, Uttar Pradesh",
    phone: phoneInput,
    duty_status: "ON_DUTY",
    stats: {
      total_inspections: 8,
      violations_flagged: 2,
      pending_review: 1,
    },
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setShowEditModal(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const assignedWards = [
    { ward: "Ward 18 — Mall Road Retail Corridor", zone: "Zone 4", type: "FMCG & Departmental Stores" },
    { ward: "Ward 12 — Govind Nagar Wholesale Mandi", zone: "Zone 4", type: "Grain & Packaged Food Distributors" },
    { ward: "Ward 24 — Civil Lines Commercial Hub", zone: "Zone 4", type: "Dairy & Supermarket Chains" },
    { ward: "Ward 31 — Kidwai Nagar Grocery Outlets", zone: "Zone 4", type: "Edible Oil & Packaged Spices" },
  ];

  const isLive = health?.status === "healthy" || health?.status === "ok";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-7">
      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-emerald-600" />
            Inspector credentials and security preferences updated successfully!
          </span>
          <button onClick={() => setSavedAlert(false)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Main Inspector Credentials Card matching Screenshot 3 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-blue-600/25">
              RK
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="text-xl font-extrabold text-slate-900">{p.name}</h3>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>On duty</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {p.designation}
              </p>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{p.department}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* 4 Inspector Attribute Boxes in 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* INSPECTOR ID */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <span className="font-mono text-slate-400 mr-1.5">#</span>
              INSPECTOR ID
            </span>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {p.inspector_id}
            </p>
          </div>

          {/* BADGE NO. */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              BADGE NO.
            </span>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {badgeInput}
            </p>
          </div>

          {/* JURISDICTION */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              JURISDICTION
            </span>
            <p className="text-sm font-bold text-slate-900">
              {p.jurisdiction}
            </p>
          </div>

          {/* FIELD PHONE */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              FIELD PHONE
            </span>
            <p className="text-sm font-bold text-slate-900">
              {phoneInput}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Summary Statistics Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-3xl font-extrabold text-slate-900 block">
            {p.stats?.total_inspections || 8}
          </span>
          <span className="text-xs font-semibold text-slate-500">Inspections</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-3xl font-extrabold text-slate-900 block">
            {p.stats?.violations_flagged || 2}
          </span>
          <span className="text-xs font-semibold text-slate-500">Violations flagged</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-3xl font-extrabold text-slate-900 block">
            {p.stats?.pending_review || 1}
          </span>
          <span className="text-xs font-semibold text-slate-500">Pending review</span>
        </div>
      </div>

      {/* Performance & Gamification Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900">
              Enforcement Performance &amp; Targets
            </h4>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 mr-1" />
            Top Performer &bull; Kanpur Zone
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center">
                <Target className="w-4 h-4 mr-1.5 text-blue-600" />
                Weekly Target: 10 Inspections
              </span>
              <span className="font-extrabold text-blue-600">8 / 10 (80%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[80%] transition-all duration-500"></div>
            </div>
            <p className="text-[11px] text-slate-500">2 more field audits to reach weekly 100% quota.</p>
          </div>

          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shrink-0">
              🏅
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Gold Verifier Badge</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Maintained 95%+ audit accuracy and zero pending escalations for 30 consecutive days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Jurisdictions & Wards List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Assigned Field Jurisdictions &bull; Kanpur Zone 4
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">4 Active Wards</span>
        </div>

        <div className="divide-y divide-slate-100">
          {assignedWards.map((w, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800">{w.ward}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{w.type}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                {w.zone}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Moved System Tech Info to a Clean Trigger at Bottom */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Info className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">
            Parakh AI Version 0.9.1-prototype &bull; Statutory LMPCR 2011 Engine
          </span>
        </div>
        <button
          onClick={() => setShowAboutModal(true)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
        >
          <span>System Diagnostics</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Edit Profile & Password Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Edit Credentials</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Phone Number</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Badge Number</label>
                <input
                  type="text"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Change Security PIN / Password</label>
                <input
                  type="password"
                  placeholder="Enter new 6-digit PIN"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Diagnostics Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">System Diagnostics</h3>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Service Layer</span>
                <span className="font-mono font-bold text-slate-800">
                  {isLive ? "Live • Django + DRF connected" : "Mock • Django + DRF ready"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500">AI / Vision Engine</span>
                <span className="font-mono font-bold text-slate-800">OCR + Vision AI (simulated / live)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Rule Engine Version</span>
                <span className="font-mono font-bold text-slate-800">LMPCR 2011 • ruleset v1.4</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500">App Build</span>
                <span className="font-mono font-bold text-slate-800">Parakh 0.9.1-prototype</span>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
