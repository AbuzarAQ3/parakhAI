import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

export const Drawer = ({ isOpen, onClose, inspector }) => {
  const location = useLocation();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("Normal");
  const [lastSyncedText, setLastSyncedText] = useState("10 mins ago");

  if (!isOpen) return null;

  const coreLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/inspect", label: "Scan & Inspect", icon: Scan },
    { to: "/history", label: "Inspection History", icon: History },
  ];

  const systemLinks = [
    { to: "/rules", label: "Compliance Rules (PCR 2011)", icon: BookOpen },
    { to: "/profile", label: "Inspector Profile", icon: User },
  ];

  const handleLogout = () => {
    if (window.confirm("Do you want to log out of Parakh AI Inspector?")) {
      window.location.href = "/";
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
        <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Parakh <span className="text-blue-600">AI</span>
                </span>
                <p className="text-[11px] text-slate-500">Legal Metrology Inspector</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation with Grouping: Core vs System */}
          <nav className="p-4 flex-1 space-y-4 overflow-y-auto">
            {/* Group 1: Core Field Inspection */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5 mb-1.5 block">
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
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100 my-2" />

            {/* Group 2: System & Statutory */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5 mb-1.5 block">
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
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100 my-2" />

            {/* Group 3: Preferences & Support */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5 mb-1.5 block">
                PREFERENCES &amp; HELP
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>App Settings</span>
                </button>
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Help &amp; Support</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Sync Status (Bottom Indicator above Profile) */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Last Synced: {lastSyncedText}</span>
            </span>
            <button
              onClick={() => setLastSyncedText("Just now")}
              className="text-blue-600 hover:text-blue-700 font-semibold p-1"
              title="Force Sync Now"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Inspector Information Card with Logout Button */}
          <div className="p-4 border-t border-slate-200 bg-slate-100/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  RK
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {inspector?.name || "Rajesh Kumar"}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                    On Duty &bull; UP-4471
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">App Preferences</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Language</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage("EN")}
                    className={`py-2 px-3 rounded-xl border font-semibold ${
                      language === "EN"
                        ? "bg-blue-50 border-blue-600 text-blue-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("HI")}
                    className={`py-2 px-3 rounded-xl border font-semibold ${
                      language === "HI"
                        ? "bg-blue-50 border-blue-600 text-blue-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    हिन्दी (Kanpur)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Theme</label>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-semibold text-slate-700 flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span>{darkMode ? "Dark Mode" : "Light Mode (Default)"}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Toggle</span>
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Font Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Small", "Normal", "Large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`py-1.5 rounded-lg border font-semibold text-[11px] ${
                        fontSize === size
                          ? "bg-blue-50 border-blue-600 text-blue-700"
                          : "border-slate-200 text-slate-600"
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
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Inspector Help &amp; FAQ</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">1. How to capture unreadable packages?</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ensure ambient lighting is even. Switch to Demo Location or manual GTIN barcode entry if camera is obstructed.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">2. Legal Notice under Section 36</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Use "Escalate &amp; Issue Section 36 Notice" on the Inspection Results page to log confirmed statutory infractions.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium text-[11px]">
                  Kanpur Legal Metrology IT Desk: +91 94150 12844
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700"
            >
              Close Help
            </button>
          </div>
        </div>
      )}
    </>
  );
};
