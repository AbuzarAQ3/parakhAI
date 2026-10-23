import React, { useEffect, useState } from "react";
import { Scale, BookOpen, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

export const RulesPage = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComplianceRules()
      .then((data) => {
        setRules(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Rules loading error:", err);
        setLoading(false);
      });
  }, []);

  const defaultRules = [
    {
      rule_id: "LMR-01",
      rule_version: "PCR-2011-v2.4",
      title: "Manufacturer / Packer Details",
      requirement: "The name and complete address of the manufacturer or packer must be clearly declared on the label.",
      legal_reference: "Rule 6(1)(a) of Legal Metrology (Packaged Commodities) Rules, 2011",
      severity: "MANDATORY",
      penalty_clause: "Section 36(1) of Legal Metrology Act, 2009",
    },
    {
      rule_id: "LMR-02",
      rule_version: "PCR-2011-v2.4",
      title: "Generic / Common Name",
      requirement: "The common or generic names of the commodity contained in the package must be prominently declared.",
      legal_reference: "Rule 6(1)(b) of Legal Metrology (Packaged Commodities) Rules, 2011",
      severity: "MANDATORY",
      penalty_clause: "Section 36(1) of Legal Metrology Act, 2009",
    },
    {
      rule_id: "LMR-03",
      rule_version: "PCR-2011-v2.4",
      title: "Net Quantity in Standard Metric Units",
      requirement: "Net quantity in terms of standard units of weight or measure (g, kg, ml, l) must be declared without qualifying words.",
      legal_reference: "Rule 6(1)(c) & Rule 12 of Legal Metrology (Packaged Commodities) Rules, 2011",
      severity: "CRITICAL",
      penalty_clause: "Section 36(2) of Legal Metrology Act, 2009",
    },
    {
      rule_id: "LMR-04",
      rule_version: "PCR-2011-v2.4",
      title: "Date of Manufacture / Packing",
      requirement: "The month and year of manufacture or pre-packing must be stated in clear numerical or alphabetical format.",
      legal_reference: "Rule 6(1)(d) of Legal Metrology (Packaged Commodities) Rules, 2011",
      severity: "MANDATORY",
      penalty_clause: "Section 36(1) of Legal Metrology Act, 2009",
    },
    {
      rule_id: "LMR-05",
      rule_version: "PCR-2011-v2.4",
      title: "Maximum Retail Price (MRP)",
      requirement: "The retail sale price clearly stated as 'Maximum or Max. Retail Price ₹.... inclusive of all taxes' or 'MRP ₹.... incl. of all taxes'.",
      legal_reference: "Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011",
      severity: "CRITICAL",
      penalty_clause: "Section 36(1) of Legal Metrology Act, 2009 (Dual pricing / Overpricing penalty)",
    },
    {
      rule_id: "LMR-06",
      rule_version: "PCR-2011-v2.4",
      title: "Consumer Care & Grievance Contact",
      requirement: "Name, address, telephone number and e-mail of the grievance officer or consumer contact.",
      legal_reference: "Rule 6(1)(n) of Legal Metrology (Packaged Commodities) Rules, 2011",
      severity: "MANDATORY",
      penalty_clause: "Section 36(1) of Legal Metrology Act, 2009",
    },
    {
      rule_id: "LMR-07",
      rule_version: "PCR-2011-v2.4",
      title: "Country of Origin",
      requirement: "For imported or indigenous packages, the country of origin must be prominently stated.",
      legal_reference: "Rule 6(1)(j) of Legal Metrology (Packaged Commodities) Rules, 2011",
      severity: "MANDATORY",
      penalty_clause: "Section 36(1) of Legal Metrology Act, 2009",
    },
    {
      rule_id: "LMR-08",
      rule_version: "PCR-2011-v2.4",
      title: "Batch / Lot Identification",
      requirement: "A lot or batch number distinguishing the commodity package must be distinctly stamped.",
      legal_reference: "Rule 6(1)(g) of Legal Metrology (Packaged Commodities) Rules, 2011",
      severity: "MANDATORY",
      penalty_clause: "Section 36(1) of Legal Metrology Act, 2009",
    },
  ];

  const displayRules = rules.length > 0 ? rules : defaultRules;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Statutory Legal Metrology Rules
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rules, statutory provisions, and penalty clauses under Legal Metrology (Packaged Commodities) Rules, 2011
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Scale className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayRules.map((r) => (
          <div
            key={r.rule_id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {r.rule_id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    r.severity === "CRITICAL"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {r.severity}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.requirement}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">{r.legal_reference}</p>
              {r.penalty_clause && (
                <p className="text-rose-600 font-semibold">{r.penalty_clause}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
