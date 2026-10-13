import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Scan,
  History,
  BookOpen,
  UserCheck,
  Building2,
  AlertCircle,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Dashboard", icon: Building2 },
    { to: "/inspect", label: "New Inspection", icon: Scan },
    { to: "/history", label: "History & Analytics", icon: History },
    { to: "/rules", label: "Rules & PCR 2011", icon: BookOpen },
    { to: "/profile", label: "Inspector Profile", icon: UserCheck },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  PARAKH <span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  SIH Prototype
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Legal Metrology Packaged Commodities Inspection Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Jurisdiction / Duty Status Pill */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>On Duty &bull; Kanpur Nagar (UP)</span>
            </div>

            <Link
              to="/inspect"
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">Scan Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-slate-100 bg-slate-50 px-2 py-1.5 flex justify-around">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium rounded ${
                isActive ? "text-blue-600 font-bold" : "text-slate-500"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>

      {/* Demo Simulation Disclosure Notice Bar */}
      <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 py-1 text-xs text-amber-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>SIH 2026 Evaluation Mode:</strong> Demonstrates real PCR-2011 rule evaluation. Camera capture, file upload, and sample presets are active with transparent deterministic OCR simulation.
          </span>
        </div>
      </div>
    </header>
  );
};
