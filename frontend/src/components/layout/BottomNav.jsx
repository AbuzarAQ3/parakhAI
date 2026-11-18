import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Home,
  Scan,
  History,
  BookOpen,
  User,
  LogIn,
} from "lucide-react";

export const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const path = location.pathname;

  const navItems = [
    { to: "/", label: "Home", icon: Home, match: (p) => p === "/" },
    { to: "/history", label: "History", icon: History, match: (p) => p.startsWith("/history") },
    { to: "/inspect", label: "Scan", icon: Scan, primary: true, match: (p) => p.startsWith("/inspect") },
    { to: "/rules", label: "Rules", icon: BookOpen, match: (p) => p.startsWith("/rules") },
    isAuthenticated
      ? { to: "/profile", label: "Profile", icon: User, match: (p) => p.startsWith("/profile") }
      : { to: "/login", label: "Sign In", icon: LogIn, match: (p) => p.startsWith("/login") },
  ];

  // Hide on inspection detail and auth pages to avoid clutter
  if (
    path.startsWith("/inspections/") ||
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/verify-email") ||
    path.startsWith("/account/verify-email")
  ) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-parakh-card/95 backdrop-blur-lg border-t border-parakh-border sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(path);

          if (item.primary) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="bottom-nav-item flex flex-col items-center justify-center relative -mt-4"
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
                    isActive
                      ? "bg-parakh-primary shadow-parakh-primary/30"
                      : "bg-parakh-primary shadow-parakh-primary/25 active:bg-parakh-primaryHover"
                  }`}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className={`text-[10px] font-bold mt-0.5 ${
                    isActive ? "text-parakh-primary" : "text-parakh-muted"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`bottom-nav-item flex flex-col items-center justify-center flex-1 touch-target ${
                isActive ? "text-parakh-primary" : "text-parakh-muted active:text-parakh-text"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-parakh-primary" : "text-parakh-muted"}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] mt-0.5 ${
                  isActive ? "font-bold text-parakh-primary" : "font-medium text-parakh-muted"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-parakh-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
