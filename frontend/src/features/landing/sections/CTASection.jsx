// src/features/landing/sections/CTASection.jsx
import React from 'react';

const CTASection = () => {
  return (
    <section id="contact" className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-slate-900 rounded-lg p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">

            <div>
              <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-3">
                Get Started
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                Deploy Parakh AI in Your Department.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Available for state-level deployments, municipal corporations, and licensed inspection agencies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:justify-end gap-3">
              <button className="bg-white text-slate-900 px-6 py-3 rounded-md text-sm font-semibold hover:bg-slate-100 transition-colors">
                Request a Demo
              </button>
              <button className="bg-transparent text-white border border-slate-600 px-6 py-3 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors">
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;