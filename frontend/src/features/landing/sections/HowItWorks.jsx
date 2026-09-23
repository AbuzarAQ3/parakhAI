// src/features/landing/sections/HowItWorks.jsx
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Capture Product',
      description: 'Photograph the product label or scan the barcode.',
    },
    {
      number: '02',
      title: 'AI Extracts Data',
      description: 'MRP, quantity, dates, and declarations are extracted.',
    },
    {
      number: '03',
      title: 'Cross-Verify',
      description: 'Data is validated against Legal Metrology standards.',
    },
    {
      number: '04',
      title: 'Generate Report',
      description: 'A signed inspection report is produced.',
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Workflow
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Four Steps to Compliance.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Streamlined for on-ground speed and audit-grade accuracy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-6">
              <p className="text-xs font-mono font-semibold text-teal-600 mb-3">
                {s.number}
              </p>
              <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;