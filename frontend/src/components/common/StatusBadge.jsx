import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Clock, AlertCircle } from "lucide-react";

export const StatusBadge = ({ status = "COMPLIANT", className = "", size = "md" }) => {
  const normalized = (status || "").toUpperCase();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] font-semibold",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-bold",
  }[size] || "px-2.5 py-1 text-xs font-semibold";

  switch (normalized) {
    case "COMPLIANT":
    case "PASS":
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full tracking-wide uppercase ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Compliant</span>
        </span>
      );

    case "NON_COMPLIANT":
    case "FAIL":
    case "VIOLATION":
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full tracking-wide uppercase ${sizeClasses} ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Violation</span>
        </span>
      );

    case "PARTIAL_COMPLIANCE":
    case "WARNING":
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full tracking-wide uppercase ${sizeClasses} ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Warning</span>
        </span>
      );

    case "NEEDS_REVIEW":
    case "REVIEW":
    case "PENDING":
    case "PENDING_REVIEW":
      return (
        <span
          className={`inline-flex items-center space-x-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full tracking-wide uppercase ${sizeClasses} ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Pending Review</span>
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
