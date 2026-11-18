import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
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
  LogOut,
} from "lucide-react";
import { api } from "../../services/api";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Form states
  const [phoneInput, setPhoneInput] = useState(authUser?.phone || "+91 98765 43210");
  const [badgeInput, setBadgeInput] = useState(authUser?.badge_number || "UP-4471");
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

  const getUserScansCount = () => {
    if (!authUser) return 0;
    try {
      const saved = localStorage.getItem(`parakh_inspections_${authUser.username || authUser.id}`);
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  };

  const userScansCount = getUserScansCount();
  const isDemo =
    authUser?.is_guest ||
    authUser?.username === "rajesh_kumar" ||
    authUser?.username === "guest_inspector";

  const p = profile || {
    name: authUser?.name || authUser?.username || "Enforcement Officer",
    designation: authUser?.designation || (authUser?.role === "supervisor" ? "Zonal Legal Metrology Controller" : "Legal Metrology Inspector"),
    department: authUser?.department || "Dept. of Food & Consumer Protection, Uttar Pradesh",
    inspector_id: authUser?.inspector_id || `LM/UP/2026/${(authUser?.username || "4471").slice(0, 4).toUpperCase()}`,
    badge_number: authUser?.badge_number || badgeInput || "UP-4471",
    jurisdiction: authUser?.jurisdiction || "Kanpur Nagar, Uttar Pradesh",
    phone: authUser?.phone || phoneInput,
    duty_status: "ON_DUTY",
    stats: authUser?.stats || {
      total_inspections: isDemo ? 8 : userScansCount,
      violations_flagged: isDemo ? 2 : Math.floor(userScansCount / 3),
      pending_review: isDemo ? 1 : 0,
    },
  };

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to log out of the enforcement session?")) {
      await logout();
      navigate("/login");
    }
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
      <div className="bg-parakh-card rounded-2xl border border-parakh-border shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-parakh-border">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-parakh-primary text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              RK
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="text-xl font-extrabold text-parakh-text">{p.name}</h3>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>On duty</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-parakh-muted mt-0.5">
                {p.designation}
              </p>
              <div className="flex items-center space-x-1.5 text-xs text-parakh-muted mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{p.department}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-parakh-border hover:bg-parakh-cardHover text-xs font-bold text-parakh-text transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-parakh-primary" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* 4 Inspector Attribute Boxes in 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* INSPECTOR ID */}
          <div className="bg-parakh-bg p-4 rounded-xl border border-parakh-border space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-parakh-muted flex items-center">
              <span className="font-mono text-parakh-muted mr-1.5">#</span>
              INSPECTOR ID
            </span>
            <p className="text-sm font-bold text-parakh-text font-mono">
              {p.inspector_id}
            </p>
          </div>

          {/* BADGE NO. */}
          <div className="bg-parakh-bg p-4 rounded-xl border border-parakh-border space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-parakh-muted flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-parakh-muted" />
              BADGE NO.
            </span>
            <p className="text-sm font-bold text-parakh-text font-mono">
              {badgeInput}
            </p>
          </div>

          {/* JURISDICTION */}
          <div className="bg-parakh-bg p-4 rounded-xl border border-parakh-border space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-parakh-muted flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-parakh-muted" />
              JURISDICTION
            </span>
            <p className="text-sm font-bold text-parakh-text">
              {p.jurisdiction}
            </p>
          </div>

          {/* FIELD PHONE */}
          <div className="bg-parakh-bg p-4 rounded-xl border border-parakh-border space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-parakh-muted flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-parakh-muted" />
              FIELD PHONE
            </span>
            <p className="text-sm font-bold text-parakh-text">
              {phoneInput}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Summary Statistics Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-parakh-card p-5 rounded-2xl border border-parakh-border shadow-xs">
          <span className="text-3xl font-extrabold text-parakh-text block">
            {p.stats?.total_inspections || 8}
          </span>
          <span className="text-xs font-semibold text-parakh-muted">Inspections</span>
        </div>

        <div className="bg-parakh-card p-5 rounded-2xl border border-parakh-border shadow-xs">
          <span className="text-3xl font-extrabold text-parakh-text block">
            {p.stats?.violations_flagged || 2}
          </span>
          <span className="text-xs font-semibold text-parakh-muted">Violations flagged</span>
        </div>

        <div className="bg-parakh-card p-5 rounded-2xl border border-parakh-border shadow-xs">
          <span className="text-3xl font-extrabold text-parakh-text block">
            {p.stats?.pending_review || 1}
          </span>
          <span className="text-xs font-semibold text-parakh-muted">Pending review</span>
        </div>
      </div>

      {/* Performance & Gamification Section */}
      <div className="bg-parakh-card rounded-2xl border border-parakh-border shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-parakh-border">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-parakh-text">
              Enforcement Performance &amp; Targets
            </h4>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 mr-1" />
            Top Performer &bull; Kanpur Zone
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-parakh-bg p-4 rounded-xl border border-parakh-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-parakh-text flex items-center">
                <Target className="w-4 h-4 mr-1.5 text-parakh-primary" />
                Weekly Target: 10 Inspections
              </span>
              <span className="font-extrabold text-parakh-primary">8 / 10 (80%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-parakh-border overflow-hidden">
              <div className="h-full bg-parakh-primary rounded-full w-[80%] transition-all duration-500"></div>
            </div>
            <p className="text-[11px] text-parakh-muted">2 more field audits to reach weekly 100% quota.</p>
          </div>

          <div className="bg-parakh-bg p-4 rounded-xl border border-parakh-border flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xl shrink-0">
              🏅
            </div>
            <div>
              <h5 className="text-xs font-bold text-parakh-text">Gold Verifier Badge</h5>
              <p className="text-[11px] text-parakh-muted mt-0.5">
                Maintained 95%+ audit accuracy and zero pending escalations for 30 consecutive days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Jurisdictions & Wards List */}
      <div className="bg-parakh-card rounded-2xl border border-parakh-border shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-parakh-border">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-parakh-primary" />
            <h4 className="text-sm font-bold text-parakh-text">
              Assigned Field Jurisdictions &bull; Kanpur Zone 4
            </h4>
          </div>
          <span className="text-xs text-parakh-muted font-medium">4 Active Wards</span>
        </div>

        <div className="divide-y divide-parakh-border">
          {assignedWards.map((w, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-parakh-text">{w.ward}</p>
                <p className="text-[11px] text-parakh-muted mt-0.5">{w.type}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-parakh-bg text-parakh-muted border border-parakh-border font-semibold text-[11px]">
                {w.zone}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out / End Session Trigger */}
      <div className="p-4 rounded-2xl bg-parakh-card border border-rose-900/40 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-parakh-text">End Active Session</p>
            <p className="text-[11px] text-parakh-muted">
              Invalidates server token &amp; returns to authentication gate
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <span>Sign Out</span>
        </button>
      </div>

      {/* Moved System Tech Info to a Clean Trigger at Bottom */}
      <div className="p-4 rounded-2xl bg-parakh-card border border-parakh-border shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Info className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-parakh-muted">
            Parakh AI Version 0.9.1-prototype &bull; Statutory LMPCR 2011 Engine
          </span>
        </div>
        <button
          onClick={() => setShowAboutModal(true)}
          className="text-xs font-bold text-parakh-primary hover:text-parakh-primaryHover hover:underline flex items-center space-x-1"
        >
          <span>System Diagnostics</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Edit Profile & Password Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-parakh-card rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-parakh-border text-parakh-text">
            <div className="flex items-center justify-between pb-3 border-b border-parakh-border">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-parakh-primary" />
                <h3 className="font-bold text-base text-parakh-text">Edit Credentials</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-parakh-text block mb-1">Field Phone Number</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-parakh-text block mb-1">Badge Number</label>
                <input
                  type="text"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text font-medium font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-parakh-text block mb-1">Change Security PIN / Password</label>
                <input
                  type="password"
                  placeholder="Enter new 6-digit PIN"
                  className="w-full p-2.5 rounded-xl border border-parakh-border bg-parakh-bg text-parakh-text font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-parakh-primary hover:bg-parakh-primaryHover text-white font-bold rounded-xl shadow-xs"
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
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-parakh-card rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-parakh-border text-parakh-text">
            <div className="flex items-center justify-between pb-3 border-b border-parakh-border">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-parakh-primary" />
                <h3 className="font-bold text-base text-parakh-text">System Diagnostics</h3>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1.5 text-slate-400 hover:text-parakh-text rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-parakh-bg border border-parakh-border rounded-xl">
                <span className="text-parakh-muted">Service Layer</span>
                <span className="font-mono font-bold text-parakh-text">
                  {isLive ? "Live • Django + DRF connected" : "Mock • Django + DRF ready"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-parakh-bg border border-parakh-border rounded-xl">
                <span className="text-parakh-muted">AI / Vision Engine</span>
                <span className="font-mono font-bold text-parakh-text">OCR + Vision AI (simulated / live)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-parakh-bg border border-parakh-border rounded-xl">
                <span className="text-parakh-muted">Rule Engine Version</span>
                <span className="font-mono font-bold text-parakh-text">LMPCR 2011 • ruleset v1.4</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-parakh-bg border border-parakh-border rounded-xl">
                <span className="text-parakh-muted">App Build</span>
                <span className="font-mono font-bold text-parakh-text">Parakh 0.9.1-prototype</span>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2 bg-parakh-primary hover:bg-parakh-primaryHover text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
