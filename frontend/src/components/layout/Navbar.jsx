import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Menu,
  ChevronLeft,
  ChevronDown,
  History,
  User,
  Home,
  LogOut,
  LogIn,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { Drawer } from "./Drawer";
import { ThemeToggle } from "../common/ThemeToggle";
import { api } from "../../services/api";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inspector, setInspector] = useState(null);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const authMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.getInspectorProfile()
        .then(setInspector)
        .catch(() => {});
    } else {
      setInspector(null);
    }
  }, [isAuthenticated]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setAuthDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const path = location.pathname;
  const isAuthPath =
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/verify-email") ||
    path.startsWith("/account/verify-email");

  if (isAuthPath) return null;

  const isHome = path === "/";
  const isInspect = path.startsWith("/inspect");
  const isHistory = path.startsWith("/history");
  const isProfile = path.startsWith("/profile");
  const isDetail = path.startsWith("/inspections/");

  // Dynamic Page Header Title & Subtitle based on Route
  let title = isAuthenticated ? "Parakh AI Inspector" : "Parakh AI";
  let subtitle = isAuthenticated ? "Legal Metrology Compliance" : "AI-Powered Packaging Compliance Platform";
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

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : (user?.username || "OF").slice(0, 2).toUpperCase();

  return (
    <>
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        inspector={inspector}
      />

      <header className="bg-parakh-card/95 border-b border-parakh-border sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left Section: Back button OR Hamburger Icon + Titles */}
            <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
              {showBack ? (
                <button
                  onClick={() => navigate(-1)}
                  className="w-9 h-9 rounded-full border border-parakh-border bg-parakh-card hover:bg-parakh-cardHover flex items-center justify-center text-parakh-text shadow-xs transition-colors shrink-0 touch-target cursor-pointer"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="p-2 rounded-xl text-parakh-text hover:bg-parakh-cardHover transition-colors touch-target shrink-0 cursor-pointer"
                  aria-label="Open navigation drawer"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-parakh-text leading-tight truncate">
                  {title}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-parakh-muted font-medium truncate">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Right Section: Desktop Navigation Links & User Actions */}
            <div className="flex items-center space-x-6 shrink-0">
              <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/"
                      className={`transition-colors ${
                        isHome ? "text-parakh-primary font-bold" : "text-parakh-muted hover:text-parakh-text"
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/history"
                      className={`transition-colors ${
                        isHistory ? "text-parakh-primary font-bold" : "text-parakh-muted hover:text-parakh-text"
                      }`}
                    >
                      History
                    </Link>
                    <Link
                      to="/rules"
                      className={`transition-colors ${
                        path.startsWith("/rules") ? "text-parakh-primary font-bold" : "text-parakh-muted hover:text-parakh-text"
                      }`}
                    >
                      Rules
                    </Link>
                    <Link
                      to="/profile"
                      className={`transition-colors ${
                        isProfile ? "text-parakh-primary font-bold" : "text-parakh-muted hover:text-parakh-text"
                      }`}
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      className={`transition-colors ${
                        isHome ? "text-parakh-primary font-bold" : "text-parakh-muted hover:text-parakh-text"
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/rules"
                      className={`transition-colors ${
                        path.startsWith("/rules") ? "text-parakh-primary font-bold" : "text-parakh-muted hover:text-parakh-text"
                      }`}
                    >
                      Rules
                    </Link>
                  </>
                )}
              </nav>

              {/* Theme Switcher Button (Dark / Light Mode) */}
              <ThemeToggle className="w-9 h-9" />

              {/* User Dropdown for Authenticated Officers */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-xl hover:bg-parakh-bg transition-colors cursor-pointer"
                    aria-label="User account menu"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border shadow-xs transition-transform active:scale-95 shrink-0 ${
                        user?.role === "supervisor"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-blue-100 text-parakh-primary border-blue-200"
                      }`}
                    >
                      {userInitials}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-parakh-muted hidden sm:block" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-parakh-card rounded-2xl border border-parakh-border shadow-xl py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-parakh-border">
                        <p className="text-xs font-bold text-parakh-text truncate">
                          {user?.name || user?.username}
                        </p>
                        <p className="text-[10px] text-parakh-muted capitalize font-medium">
                          {user?.role || "Field Inspector"} • {user?.username}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-xs text-parakh-text hover:bg-parakh-bg transition-colors"
                        >
                          <User className="w-4 h-4 text-parakh-muted" />
                          <span>Officer Profile</span>
                        </Link>
                        <Link
                          to="/history"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-xs text-parakh-text hover:bg-parakh-bg transition-colors"
                        >
                          <History className="w-4 h-4 text-parakh-muted" />
                          <span>Inspection History</span>
                        </Link>
                        <Link
                          to="/rules"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-xs text-parakh-text hover:bg-parakh-bg transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-parakh-muted" />
                          <span>Statutory Rules</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-parakh-border">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate("/");
                          }}
                          className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unified Sign In / Sign Up Trigger Dropdown */
                <div className="relative" ref={authMenuRef}>
                  <button
                    type="button"
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-parakh-primary hover:bg-parakh-primaryHover text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    aria-label="Sign in or sign up"
                  >
                    <span>Sign In / Sign Up</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {authDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-parakh-card rounded-2xl border border-parakh-border shadow-xl py-2 z-50">
                      <Link
                        to="/login"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-parakh-text hover:bg-parakh-bg hover:text-parakh-primary transition-colors"
                      >
                        <LogIn className="w-4 h-4 text-parakh-primary shrink-0" />
                        <div>
                          <p className="font-bold">Officer Sign In</p>
                          <p className="text-[10px] text-parakh-muted">Existing inspectors &amp; supervisors</p>
                        </div>
                      </Link>
                      <div className="my-1 border-t border-parakh-border" />
                      <Link
                        to="/signup"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-parakh-text hover:bg-parakh-bg hover:text-parakh-primary transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <p className="font-bold">Register New Officer</p>
                          <p className="text-[10px] text-parakh-muted">Create departmental account</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
