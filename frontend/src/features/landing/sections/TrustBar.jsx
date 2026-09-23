// src/features/landing/sections/TrustBar.jsx
import React from 'react';

const TrustBar = () => {
  return (
    <section className="w-full bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Aligned with Indian Regulatory Standards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-semibold text-slate-400">
            <span>Legal Metrology</span>
            <span className="text-slate-300">·</span>
            <span>FSSAI</span>
            <span className="text-slate-300">·</span>
            <span>BIS</span>
            <span className="text-slate-300">·</span>
            <span>Consumer Affairs</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;