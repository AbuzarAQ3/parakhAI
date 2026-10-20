import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronLeft,
  ShieldCheck,
  Scan,
  History,
  User,
  Home,
} from "lucide-react";
import { Drawer } from "./Drawer";
import { api } from "../../services/api";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inspector, setInspector] = useState(null);

  useEffect(() => {
    api.getInspectorProfile()
      .then(setInspector)
      .catch(() => {});
  }, []);

  const path = location.pathname;
  const isHome = path === "/";
  const isInspect = path.startsWith("/inspect");
  const isHistory = path.startsWith("/history");
  const isProfile = path.startsWith("/profile");
  const isDetail = path.startsWith("/inspections/");

  // Dynamic Page Header Title & Subtitle based on Route (matching screenshots)
  let title = "Parakh AI Inspector";
  let subtitle = "Legal Metrology Compliance";
  let showBack = false;

  if (isInspect) {
    title = "New Inspection";
    subtitle = "Product capture → AI analysis → rule engine";
    showBack = true;
  } else if (isDetail) {
    title = "Inspection Results";
    subtitle = "Packaging Compliance & Evidence Breakdown";
    showBack = true;
  } else if (isHistory) {
    title = "Inspection History";
    subtitle = "Geo-tagged field inspections • Kanpur Nagar";
  } else if (isProfile) {
    title = "Inspector Profile";
    subtitle = "Field user & system information";
  }

  return (
    <>
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        inspector={inspector}
      />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Back button OR Hamburger Icon + Titles */}
            <div className="flex items-center space-x-3.5">
              {showBack ? (
                <button
                  onClick={() => navigate(-1)}
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-xs transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Open navigation drawer"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                  {title}
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Right Section: Desktop Navigation Links & Avatar */}
            <div className="flex items-center space-x-6">
              <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
                <Link
                  to="/"
                  className={`transition-colors ${
                    isHome ? "text-blue-600 font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/inspect"
                  className={`transition-colors ${
                    isInspect ? "text-blue-600 font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Scan
                </Link>
                <Link
                  to="/history"
                  className={`transition-colors ${
                    isHistory ? "text-blue-600 font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  History
                </Link>
                <Link
                  to="/profile"
                  className={`transition-colors ${
                    isProfile ? "text-blue-600 font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Profile
                </Link>
              </nav>

              {/* Inspector Avatar Pill */}
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center font-bold text-xs border border-blue-200 shadow-xs transition-transform active:scale-95"
                title="Inspector Profile: Rajesh Kumar"
              >
                RK
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
