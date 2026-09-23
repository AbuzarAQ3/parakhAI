// src/features/landing/sections/Features.jsx
import React from 'react';
import {
  IconRupee,
  IconScale,
  IconCalendar,
  IconDocument,
  IconShield,
  IconScan,
} from '../../../icons/Icons';

const Features = () => {
  const features = [
    {
      icon: <IconRupee className="w-5 h-5" />,
      title: 'MRP Verification',
      description: 'Cross-checks printed MRP against declared pricing.',
    },
    {
      icon: <IconScale className="w-5 h-5" />,
      title: 'Net Quantity Audit',
      description: 'Validates declared net weight or volume against norms.',
    },
    {
      icon: <IconCalendar className="w-5 h-5" />,
      title: 'Expiry Detection',
      description: 'OCR-based extraction of expiry and manufacturing dates.',
    },
    {
      icon: <IconDocument className="w-5 h-5" />,
      title: 'Declaration Check',
      description: 'Ensures all mandatory declarations are present.',
    },
    {
      icon: <IconShield className="w-5 h-5" />,
      title: 'Compliance Reports',
      description: 'Inspection-ready reports aligned with LM Rules, 2011.',
    },
    {
      icon: <IconScan className="w-5 h-5" />,
      title: 'Batch Inspection',
      description: 'Bulk-verify shelves or warehouses in a single pass.',
    },
  ];

  return (
    <section id="features" className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Everything an Inspector Needs.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Designed for field officers and compliance teams to conduct fast and accurate inspections.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-md text-white mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;