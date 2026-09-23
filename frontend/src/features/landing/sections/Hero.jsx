// src/features/landing/sections/Hero.jsx
// src/features/landing/sections/Hero.jsx
import React from 'react';
import {
  IconCheck,
  IconRupee,
  IconScale,
  IconCalendar,
  IconDocument,
  IconShield,
  IconScan,
} from '../../../icons/Icons';

const Hero = () => {
  return (
    <section className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Headline + Subtext + CTA */}
          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-md mb-6">
              <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                AI-Powered Legal Metrology
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-slate-900 leading-[1.05] tracking-tight mb-6">
              Verify Before <br />
              You Buy.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Instantly verify MRP, net quantity, expiry dates, and mandatory declarations on any packaged commodity — using just a photo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-slate-900 text-white px-6 py-3.5 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <IconScan className="w-4 h-4" />
                Inspect a Product
              </button>
              <button className="bg-white text-slate-900 border border-slate-300 px-6 py-3.5 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors">
                View Documentation
              </button>
            </div>

          </div>

          {/* RIGHT: Inspection Report Card */}
          <div className="relative">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-md">
                    <IconScan className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Inspection Report
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      Choco Delight — 250g
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-200 rounded-md">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-subtle-pulse"></div>
                  <span className="text-xs font-semibold text-teal-700">Live</span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 mb-5">

                {/* MRP */}
                <div className="bg-white border border-slate-200 rounded-md p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-md text-slate-600">
                      <IconRupee className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">MRP</p>
                      <p className="text-sm font-semibold text-slate-900">₹120.00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 border border-teal-200 rounded">
                    <IconCheck className="w-3 h-3 text-teal-700" />
                    <span className="text-xs font-semibold text-teal-700">Verified</span>
                  </div>
                </div>

                {/* Net Quantity */}
                <div className="bg-white border border-slate-200 rounded-md p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-md text-slate-600">
                      <IconScale className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Net Quantity</p>
                      <p className="text-sm font-semibold text-slate-900">250 g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 border border-teal-200 rounded">
                    <IconCheck className="w-3 h-3 text-teal-700" />
                    <span className="text-xs font-semibold text-teal-700">Verified</span>
                  </div>
                </div>

                {/* Expiry */}
                <div className="bg-white border border-slate-200 rounded-md p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-md text-slate-600">
                      <IconCalendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Expiry Date</p>
                      <p className="text-sm font-semibold text-slate-900">10 / 11 / 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 border border-teal-200 rounded">
                    <IconCheck className="w-3 h-3 text-teal-700" />
                    <span className="text-xs font-semibold text-teal-700">Valid</span>
                  </div>
                </div>

                {/* Declarations */}
                <div className="bg-white border border-slate-200 rounded-md p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-md text-slate-600">
                      <IconDocument className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Declarations</p>
                      <p className="text-sm font-semibold text-slate-900">4 / 4 present</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 border border-teal-200 rounded">
                    <IconCheck className="w-3 h-3 text-teal-700" />
                    <span className="text-xs font-semibold text-teal-700">Complete</span>
                  </div>
                </div>

              </div>

              {/* Verdict */}
              <div className="bg-white border border-slate-200 rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 flex items-center justify-center rounded-md">
                    <IconShield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Verdict
                    </p>
                    <p className="text-base font-bold text-slate-900">Product Compliant</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">ID</p>
                  <p className="text-xs font-mono text-slate-700">PKR-2024-04812</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;