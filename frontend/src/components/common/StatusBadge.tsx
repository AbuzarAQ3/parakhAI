import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import { ComplianceStatus, RuleResult } from "../../types";

interface StatusBadgeProps {
  status: ComplianceStatus | RuleResult | string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "md",
}) => {
  const normalized = status.toUpperCase();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-bold",
  }[size];

  switch (normalized) {
    case "COMPLIANT":
    case "PASS":
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full shadow-xs ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{normalized === "PASS" ? "PASS (Compliant)" : "Compliant"}</span>
        </span>
      );

    case "NON_COMPLIANT":
    case "FAIL":
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full shadow-xs ${sizeClasses} ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>{normalized === "FAIL" ? "FAIL (Violation)" : "Violation Detected"}</span>
        </span>
      );

    case "NEEDS_REVIEW":
    case "REVIEW":
    case "PENDING":
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full shadow-xs ${sizeClasses} ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>{normalized === "REVIEW" ? "REVIEW (Uncertain)" : "Needs Review"}</span>
        </span>
      );

    case "PARTIAL_COMPLIANCE":
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full shadow-xs ${sizeClasses} ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Partial Compliance</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full ${sizeClasses} ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
