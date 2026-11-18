import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { ThemeToggle } from "../common/ThemeToggle";
import { AVAILABLE_THEMES, getActiveTheme, applyTheme } from "../../utils/theme";
import {
  X,
  ShieldCheck,
  Home,
  Scan,
  History,
  User,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  RefreshCw,
  Moon,
  Sun,
  Languages,
  Check,
  MessageSquare,
  Phone,
  FileQuestion,
  Shield,
} from "lucide-react";

export const Drawer = ({ isOpen, onClose, inspector }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme: currentTheme, setMode: handleThemeChange } = useTheme();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [fontSize, setFontSize] = useState("Normal");
  const [lastSyncedText, setLastSyncedText] = useState("10 mins ago");

  if (!isOpen) return null;

  const coreLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/history", label: "Inspection History", icon: History },
  ];

  const systemLinks = [
    { to: "/rules", label: "Compliance Rules (PCR 2011)", icon: BookOpen },
    { to: "/profile", label: "Inspector Profile", icon: User },
    { to: "/login", label: "Officer Login / Switch", icon: Shield },
  ];

  const handleLogout = async () => {
    if (window.confirm("Do you want to log out of Parakh AI Inspector?")) {
      onClose();
      await logout();
      navigate("/login");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        {/* Background Overlay */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={onClose}
        />

        {/* Slide-out Drawer Menu */}
        <div className="relative w-80 max-w-[85vw] bg-parakh-card text-parakh-text h-full shadow-2xl flex flex-col z-10 border-r border-parakh-border animate-in slide-in-from-left duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-parakh-border flex items-center justify-between bg-parakh-card">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-parakh-primary flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-parakh-text">
                  Parakh <span className="text-parakh-primary">AI</span>
                </span>
                <p className="text-[11px] text-parakh-muted">Legal Metrology Inspector</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <ThemeToggle className="w-8 h-8" />
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-parakh-muted hover:text-parakh-text hover:bg-parakh-cardHover transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation with Grouping: Core vs System */}
          <nav className="p-4 flex-1 space-y-4 overflow-y-auto">
            {/* Group 1: Core Field Inspection */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-parakh-muted px-3.5 mb-1.5 block">
                CORE ENFORCEMENT
              </span>
              <div className="space-y-1">
                {coreLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-parakh-primary text-white shadow-md"
                          : "text-parakh-text hover:bg-parakh-cardHover"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-parakh-muted"}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <hr className="border-parakh-border my-2" />

            {/* Group 2: System & Statutory */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-parakh-muted px-3.5 mb-1.5 block">
                SYSTEM &amp; STATUTORY
              </span>
              <div className="space-y-1">
                {systemLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-parakh-primary text-white shadow-md"
                          : "text-parakh-text hover:bg-parakh-cardHover"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-parakh-muted"}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <hr className="border-parakh-border my-2" />

            {/* Group 3: Preferences & Support */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-parakh-muted px-3.5 mb-1.5 block">
                PREFERENCES &amp; HELP
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-parakh-text hover:bg-parakh-cardHover transition-colors"
                >
                  <Settings className="w-4 h-4 text-parakh-muted" />
                  <span>App Settings</span>
                </button>
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-parakh-text hover:bg-parakh-cardHover transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-parakh-muted" />
                  <span>Help &amp; Support</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Sync Status (Bottom Indicator above Profile) */}
          <div className="px-4 py-2 border-t border-parakh-border bg-parakh-bg flex items-center justify-between text-xs text-parakh-muted">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Last Synced: {lastSyncedText}</span>
            </span>
            <button
              onClick={() => setLastSyncedText("Just now")}
              className="text-parakh-primary hover:text-parakh-primaryHover font-semibold p-1"
              title="Force Sync Now"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Inspector Information Card with Logout / Login Button */}
          <div className="p-4 border-t border-parakh-border bg-parakh-bg">
            {user ? (
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                    user?.role === "supervisor"
                      ? "bg-amber-600 text-white"
                      : "bg-parakh-primary text-white"
                  }`}>
                    {user?.name
                      ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                      : (user?.username || "OF").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-parakh-text truncate">
                      {user?.name || user?.username || "Officer"}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 shrink-0"></span>
                      {user?.role === "supervisor"
                        ? `Supervisor • ${user.badge_number || "UP-LM-HQ01"}`
                        : `On Duty • ${user?.badge_number || "UP-4471"}`}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Log Out"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-parakh-card text-parakh-muted flex items-center justify-center font-bold text-xs shrink-0 border border-parakh-border">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-parakh-text truncate">Guest / Not Signed In</p>
                    <p className="text-[10px] text-parakh-muted truncate">Officer clearance required</p>
                  </div>
                </div>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="px-3 py-1 bg-parakh-primary hover:bg-parakh-primaryHover text-white font-bold text-xs rounded-lg transition-colors shrink-0"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-parakh-card rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-parakh-border text-parakh-text">
            <div className="flex items-center justify-between pb-3 border-b border-parakh-border">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-parakh-primary" />
                <h3 className="font-bold text-base text-parakh-text">App Preferences</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 text-parakh-muted hover:text-parakh-text rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-parakh-text block mb-1">Language</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage("EN")}
                    className={`py-2 px-3 rounded-xl border font-semibold ${
                      language === "EN"
                        ? "bg-parakh-primary/20 border-parakh-primary text-parakh-primary font-bold"
                        : "border-parakh-border text-parakh-text bg-parakh-bg"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("HI")}
                    className={`py-2 px-3 rounded-xl border font-semibold ${
                      language === "HI"
                        ? "bg-parakh-primary/20 border-parakh-primary text-parakh-primary font-bold"
                        : "border-parakh-border text-parakh-text bg-parakh-bg"
                    }`}
                  >
                    हिन्दी (Kanpur)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-parakh-text block mb-1">Color Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleThemeChange("blue-grey-white")}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      currentTheme !== "dark"
                        ? "border-parakh-primary bg-parakh-primary/10 text-parakh-primary font-bold shadow-xs"
                        : "border-parakh-border bg-parakh-bg text-parakh-text hover:bg-parakh-cardHover"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-parakh-text" strokeWidth={1.8} fill="none" />
                      <span className="text-xs">Light</span>
                    </div>
                    {currentTheme !== "dark" && <Check className="w-3.5 h-3.5 text-parakh-primary shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      currentTheme === "dark"
                        ? "border-parakh-primary bg-parakh-primary/10 text-parakh-primary font-bold shadow-xs"
                        : "border-parakh-border bg-parakh-bg text-parakh-text hover:bg-parakh-cardHover"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Moon className="w-4 h-4 text-parakh-text" strokeWidth={1.8} fill="none" />
                      <span className="text-xs">Dark</span>
                    </div>
                    {currentTheme === "dark" && <Check className="w-3.5 h-3.5 text-parakh-primary shrink-0" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-parakh-text block mb-1">Font Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Small", "Normal", "Large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`py-1.5 rounded-lg border font-semibold text-[11px] ${
                        fontSize === size
                          ? "bg-parakh-primary/20 border-parakh-primary text-parakh-primary font-bold"
                          : "border-parakh-border text-parakh-text bg-parakh-bg"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2 bg-parakh-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-parakh-primaryHover"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-parakh-card rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-parakh-border text-parakh-text">
            <div className="flex items-center justify-between pb-3 border-b border-parakh-border">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-parakh-primary" />
                <h3 className="font-bold text-base text-parakh-text">Inspector Help &amp; FAQ</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 text-parakh-muted hover:text-parakh-text rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-parakh-text">
              <div className="p-2.5 rounded-xl bg-parakh-bg border border-parakh-border">
                <p className="font-bold text-parakh-text">1. How to capture unreadable packages?</p>
                <p className="text-[11px] text-parakh-muted mt-0.5">
                  Ensure ambient lighting is even. Switch to Demo Location or manual GTIN barcode entry if camera is obstructed.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-parakh-bg border border-parakh-border">
                <p className="font-bold text-parakh-text">2. Legal Notice under Section 36</p>
                <p className="text-[11px] text-parakh-muted mt-0.5">
                  Use "Escalate &amp; Issue Section 36 Notice" on the Inspection Results page to log confirmed statutory infractions.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-parakh-primary/10 border border-parakh-primary/25 text-parakh-text flex items-center space-x-2">
                <Phone className="w-4 h-4 text-parakh-primary shrink-0" />
                <span className="font-medium text-[11px]">
                  Kanpur Legal Metrology IT Desk: +91 94150 12844
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-parakh-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-parakh-primaryHover"
            >
              Close Help
            </button>
          </div>
        </div>
      )}
    </>
  );
};
