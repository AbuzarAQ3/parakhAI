import React from "react";
import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export const Footer = () => {
  const location = useLocation();
  const path = location.pathname;
  if (
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/verify-email") ||
    path.startsWith("/account/verify-email")
  ) {
    return null;
  }
  return (
    <footer className="hidden sm:block bg-parakh-card border-t border-parakh-border mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-parakh-muted">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-parakh-primary" />
          <span className="font-semibold text-parakh-text">Parakh AI</span>
          <span>&bull;</span>
          <span>Legal Metrology (Packaged Commodities) Inspection Platform</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[11px] text-slate-500">Ruleset v1.4 &bull; LMPCR 2011</span>
          <span className="px-2 py-0.5 rounded-full bg-parakh-bg text-parakh-muted border border-parakh-border text-[10px] font-semibold">
            Prototype v0.9.1
          </span>
        </div>
      </div>
    </footer>
  );
};
