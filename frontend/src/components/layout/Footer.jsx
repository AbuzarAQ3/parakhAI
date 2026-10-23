import React from "react";
import { ShieldCheck } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-700">Parakh AI</span>
          <span>&bull;</span>
          <span>Legal Metrology (Packaged Commodities) Inspection Platform</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[11px] text-slate-400">Ruleset v1.4 &bull; LMPCR 2011</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
            Prototype v0.9.1
          </span>
        </div>
      </div>
    </footer>
  );
};
