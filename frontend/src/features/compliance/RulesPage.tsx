import React, { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { api } from "../../services/api";
import { ComplianceRule } from "../../types";

export const RulesPage: React.FC = () => {
  const [rules, setRules] = useState<ComplianceRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getComplianceRules()
      .then((data) => {
        setRules(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-1">
          <Scale className="w-3.5 h-3.5" />
          <span>Statutory Enforcement Framework</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Legal Metrology (Packaged Commodities) Rules, 2011
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Mandatory statutory declarations, legal citations, and violation penalty clauses under Legal Metrology Act, 2009
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-xs text-slate-500 font-semibold">
            Loading statutory compliance rules...
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.rule_id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    {rule.rule_id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                    {rule.title}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rule.severity === "CRITICAL"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {rule.severity}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {rule.requirement}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                <div className="flex items-start text-slate-500">
                  <strong className="text-slate-700 shrink-0 mr-1">Statute:</strong>
                  <span>{rule.legal_reference}</span>
                </div>
                <div className="flex items-start text-rose-700 font-medium">
                  <strong className="shrink-0 mr-1">Penalty:</strong>
                  <span>{rule.penalty_clause}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
