import React from "react";
import { Scale } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-blue-600" />
          <span>
            <strong>Parakh AI</strong> — Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
          <span>&bull;</span>
          <span className="text-slate-400">SIH Platform Build v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
