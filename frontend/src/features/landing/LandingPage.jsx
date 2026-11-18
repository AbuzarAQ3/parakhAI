import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Scale,
  FileCheck,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  Shield,
  Search,
  Scan,
  BookOpen,
  UserCheck,
  Lock,
  UserPlus,
} from "lucide-react";

export const LandingPage = () => {
  const [activeDemoTab, setActiveDemoTab] = useState("compliant");

  const compliantSample = {
    product: "Bikano Aloo Bhujia",
    category: "Snacks & Confectionery",
    score: 100,
    status: "COMPLIANT",
    image: "/samples/Aloo_Bhujia_Bikano.jpeg",
    checks: [
      { rule: "Rule 6(1)(e)", title: "MRP Declaration", status: "PASS", desc: "MRP Rs. 55.00 incl. of all taxes" },
      { rule: "Rule 6(1)(c)", title: "Net Quantity", status: "PASS", desc: "200 g standard metric weight verified" },
      { rule: "Rule 6(1)(a)", title: "Manufacturer Details", status: "PASS", desc: "Bikanervala Foods Pvt. Ltd., verified" },
      { rule: "Rule 6(1)(d)", title: "Mfg & Expiry Date", status: "PASS", desc: "Month and year of pre-packing declared" },
      { rule: "Rule 6(1)(n)", title: "Consumer Redressal", status: "PASS", desc: "Dedicated grievance care email & phone" },
    ],
  };

  const violationSample = {
    product: "Crunchy Glucose Biscuits",
    category: "Bakery & Biscuits",
    score: 38,
    status: "NON_COMPLIANT",
    image: "/samples/SunriseBiscuit.jpeg",
    checks: [
      { rule: "Rule 6(1)(e)", title: "MRP Declaration", status: "FAIL", desc: "Mandatory retail sale price missing" },
      { rule: "Rule 6(1)(d)", title: "Best Before Date", status: "FAIL", desc: "Expiry declaration absent from label" },
      { rule: "Rule 6(1)(c)", title: "Net Quantity", status: "PASS", desc: "200 g standard metric weight verified" },
      { rule: "Rule 6(1)(a)", title: "Manufacturer Details", status: "PASS", desc: "Sunrise Biscuit Co., Govind Nagar verified" },
    ],
  };

  const activeSample = activeDemoTab === "compliant" ? compliantSample : violationSample;

  return (
    <div className="bg-parakh-bg text-parakh-text font-sans selection:bg-parakh-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-parakh-border bg-gradient-to-b from-parakh-card/30 via-parakh-bg to-parakh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide shadow-xs animate-in fade-in">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>AI-POWERED LEGAL METROLOGY PLATFORM</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-parakh-text tracking-tight leading-[1.12]">
                Automated Statutory Label Inspection for{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent relative inline-block">
                  Packaged Commodities
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-parakh-muted leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Parakh AI assists Legal Metrology officers, consumer protection authorities, and FMCG brands in verifying mandatory packaging declarations under the <strong className="text-parakh-text">Legal Metrology (Packaged Commodities) Rules, 2011</strong>. Detect missing MRPs, invalid net quantity declarations, and statutory infractions in seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Officer Portal Sign In</span>
                </Link>

                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 bg-parakh-card hover:bg-parakh-cardHover text-parakh-text hover:text-blue-600 border border-parakh-border font-bold text-sm rounded-xl shadow-xs transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-parakh-muted" />
                  <span>Register Officer Account</span>
                </Link>

                <Link
                  to="/rules"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-3.5 text-parakh-muted hover:text-blue-600 font-bold text-sm transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Statutory Rules</span>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 border-t border-parakh-border grid grid-cols-3 gap-2 sm:gap-4 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-parakh-text block">PCR 2011</span>
                  <span className="text-[11px] sm:text-xs text-parakh-muted font-medium">Statutory Rules Engine</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-parakh-text block">Sec 36</span>
                  <span className="text-[11px] sm:text-xs text-parakh-muted font-medium">Legal Act 2009 Notice</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-parakh-text block">0-100%</span>
                  <span className="text-[11px] sm:text-xs text-parakh-muted font-medium">Deterministic Score</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Inspection Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-parakh-card rounded-2xl sm:rounded-3xl border border-parakh-border shadow-2xl p-4 sm:p-5 space-y-4">
                {/* Demo Tab Selector */}
                <div className="flex items-center justify-between pb-3 border-b border-parakh-border">
                  <div className="flex items-center space-x-1.5 bg-parakh-bg p-1 rounded-xl text-xs font-bold text-slate-400 border border-parakh-border">
                    <button
                      onClick={() => setActiveDemoTab("compliant")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        activeDemoTab === "compliant"
                          ? "bg-parakh-card text-emerald-400 border border-parakh-border shadow-xs"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Compliant (100%)
                    </button>
                    <button
                      onClick={() => setActiveDemoTab("violation")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        activeDemoTab === "violation"
                          ? "bg-parakh-card text-rose-400 border border-parakh-border shadow-xs"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Violation (38%)
                    </button>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">DEMO VERDICT</span>
                </div>

                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-parakh-bg border border-parakh-border overflow-hidden shrink-0">
                      <img
                        src={activeSample.image}
                        alt={activeSample.product}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-parakh-text">{activeSample.product}</h4>
                      <p className="text-[11px] text-parakh-muted">{activeSample.category}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        activeSample.status === "COMPLIANT"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {activeSample.score}% {activeSample.status === "COMPLIANT" ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>

                {/* Checklist of Evaluated Rules */}
                <div className="space-y-2 pt-1">
                  {activeSample.checks.map((chk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-parakh-bg border border-parakh-border flex items-start justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-400">{chk.rule}</span>
                          <span className="font-bold text-parakh-text">{chk.title}</span>
                        </div>
                        <p className="text-[11px] text-parakh-muted truncate mt-0.5">{chk.desc}</p>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                          chk.status === "PASS"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {chk.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card CTA */}
                <Link
                  to="/rules"
                  className="block w-full py-2.5 text-center bg-parakh-primary hover:bg-parakh-primaryHover text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Review Statutory Standards &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Alignment Strip */}
      <section className="py-6 bg-parakh-card border-b border-parakh-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-around gap-6 text-xs text-slate-400 font-semibold">
            <span className="flex items-center space-x-1.5">
              <Scale className="w-4 h-4 text-parakh-primary" />
              <span>Legal Metrology Act, 2009</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>LMPCR 2011 (As Amended)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Section 36 Statutory Notices</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Kanpur Nagar Enforcement Directorate</span>
            </span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-parakh-primary">
            WORKFLOW ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-parakh-text tracking-tight">
            How Parakh AI Enforces Compliance
          </h2>
          <p className="text-xs sm:text-sm text-parakh-muted font-normal">
            A deterministic 4-step pipeline turning package photographs into statutory audit logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-parakh-card p-6 rounded-2xl border border-parakh-border shadow-xs space-y-3 relative group hover:border-parakh-primary/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-parakh-primary/10 border border-parakh-primary/20 text-parakh-primary flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-extrabold text-base text-parakh-text">Capture Label</h3>
            <p className="text-xs text-parakh-muted leading-relaxed">
              Capture packaging via live camera viewfinder, upload high-res JPEG/PNG images, or enter barcode GTIN numbers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-parakh-card p-6 rounded-2xl border border-parakh-border shadow-xs space-y-3 relative group hover:border-blue-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-extrabold text-base text-parakh-text">Multilingual OCR</h3>
            <p className="text-xs text-parakh-muted leading-relaxed">
              Automated image deskewing and OCR text extraction across Latin and Devanagari (Hindi) declaration blocks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-parakh-card p-6 rounded-2xl border border-parakh-border shadow-xs space-y-3 relative group hover:border-blue-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-extrabold text-base text-parakh-text">Rule Engine Check</h3>
            <p className="text-xs text-parakh-muted leading-relaxed">
              Deterministic verification against LMPCR 2011 Rules: MRP, Net Quantity in metric units, batch numbers, and dates.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-parakh-card p-6 rounded-2xl border border-parakh-border shadow-xs space-y-3 relative group hover:border-blue-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
              4
            </div>
            <h3 className="font-extrabold text-base text-parakh-text">Audit &amp; Notice</h3>
            <p className="text-xs text-parakh-muted leading-relaxed">
              Generates 0-100% compliance score, highlights evidence bounding boxes, and enables Section 36 legal escalation.
            </p>
          </div>
        </div>
      </section>

      {/* Core Verification Capabilities */}
      <section className="py-14 sm:py-20 bg-parakh-card border-y border-parakh-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-parakh-primary">
              STATUTORY COMPLIANCE COVERAGE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-parakh-text tracking-tight">
              What Parakh AI Checks On Every Label
            </h2>
            <p className="text-xs sm:text-sm text-parakh-muted font-normal">
              Direct verification of mandatory clauses under Rule 6(1) of the Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Capability 1 */}
            <div className="p-6 rounded-2xl bg-parakh-bg border border-parakh-border space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-parakh-primary/10 text-parakh-primary flex items-center justify-center font-bold border border-parakh-primary/20">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-parakh-text">Maximum Retail Price (MRP)</h3>
              <p className="text-xs text-parakh-muted leading-relaxed">
                Rule 6(1)(e): Confirms retail sale price declared as "MRP Rs. ... incl. of all taxes" and flags overpricing infractions.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="p-6 rounded-2xl bg-parakh-bg border border-parakh-border space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-parakh-text">Net Quantity in Standard Units</h3>
              <p className="text-xs text-parakh-muted leading-relaxed">
                Rule 6(1)(c) &amp; Rule 12: Enforces declaration in standard metric units (g, kg, ml, l) without misleading non-standard symbols.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="p-6 rounded-2xl bg-parakh-bg border border-parakh-border space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-parakh-text">Manufacturing &amp; Expiry Dates</h3>
              <p className="text-xs text-parakh-muted leading-relaxed">
                Rule 6(1)(d): Validates month and year of manufacture, packing, or import, and checks best before / expiry declarations.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="p-6 rounded-2xl bg-parakh-bg border border-parakh-border space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-parakh-text">Manufacturer &amp; Packer Details</h3>
              <p className="text-xs text-parakh-muted leading-relaxed">
                Rule 6(1)(a): Confirms full name and complete premises address of the manufacturer, packer, or importer.
              </p>
            </div>

            {/* Capability 5 */}
            <div className="p-6 rounded-2xl bg-parakh-bg border border-parakh-border space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold border border-rose-500/20">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-parakh-text">Consumer Care &amp; Grievance</h3>
              <p className="text-xs text-parakh-muted leading-relaxed">
                Rule 6(1)(n): Verifies presence of consumer helpline telephone number, official contact email, and postal address.
              </p>
            </div>

            {/* Capability 6 */}
            <div className="p-6 rounded-2xl bg-parakh-bg border border-parakh-border space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-parakh-card text-parakh-muted flex items-center justify-center font-bold border border-parakh-border">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-parakh-text">Geo-Tagged Field Audit Trail</h3>
              <p className="text-xs text-parakh-muted leading-relaxed">
                Section 36: Automatically geo-tags every field inspection to jurisdictional wards (e.g. Kanpur Nagar) with exportable CSV logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 border border-blue-800/60 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-300">
              FIELD ENFORCEMENT READY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Conduct a Legal Metrology Inspection Now
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed font-medium">
              Test packaging compliance on preloaded commodity samples or launch the camera viewfinder to inspect a live package in your hands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all text-center"
            >
              Sign In to Enforcement Portal
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-extrabold text-sm rounded-xl transition-all text-center"
            >
              Register Officer Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
