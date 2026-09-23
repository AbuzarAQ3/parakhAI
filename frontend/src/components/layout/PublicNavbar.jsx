// src/components/layout/PublicNavbar.jsx
import React from 'react';
import { IconShield } from '../../icons/Icons';

const PublicNavbar = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white rounded-md">
            <IconShield className="w-5 h-5" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Parakh AI
            </span>

            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Legal Metrology Platform
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>

          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
            How it Works
          </a>

          <a href="#compliance" className="hover:text-slate-900 transition-colors">
            Compliance
          </a>

          <a href="#contact" className="hover:text-slate-900 transition-colors">
            Contact
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="hidden md:block text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 rounded-md transition-colors">
            Sign In
          </button>

          <button className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-md hover:bg-slate-800 transition-colors">
            Start Inspection
          </button>
        </div>

      </div>
    </header>
  );
};

export default PublicNavbar;