// src/components/layout/PublicFooter.jsx
import React from 'react';
import { IconShield } from '../../icons/Icons';

const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-8 mb-10">

          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white flex items-center justify-center rounded-md">
                <IconShield className="w-4 h-4 text-slate-900" />
              </div>

              <span className="text-base font-bold text-white">
                Parakh AI
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-md">
              AI-powered Legal Metrology platform for packaged commodity verification.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Platform
            </p>

            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>

              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How it Works
                </a>
              </li>

              <li>
                <a href="#compliance" className="hover:text-white transition-colors">
                  Compliance
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Company
            </p>

            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>

              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>

              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © {new Date().getFullYear()} Parakh AI. All rights reserved.
          </p>

          <p className="text-xs">
            Compliant with Legal Metrology (Packaged Commodities) Rules, 2011
          </p>
        </div>

      </div>
    </footer>
  );
};

export default PublicFooter;