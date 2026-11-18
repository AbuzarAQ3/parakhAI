import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ShieldCheck, Loader2 } from "lucide-react";

/**
 * ProtectedRoute Component
 * Restricts access to authenticated users.
 * Blocks rendering until session restoration resolves to avoid login screen flashes.
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { status, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm animate-pulse">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex items-center space-x-2 text-slate-700 font-semibold text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Verifying Departmental Session...</span>
          </div>
          <p className="text-xs text-slate-400">
            Checking Legal Metrology credentials &amp; security token
          </p>
        </div>
      </div>
    );
  }

 if (!isAuthenticated) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Officer Login Required</h2>
        <p className="text-xs text-slate-500">
          You must be signed in with an active enforcement account to conduct inspections or view historical records.
        </p>
        <Link
          to="/login"
          state={{ from: location }}
          className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
        >
          Sign In to Continue
        </Link>
      </div>
    </div>
  );
}

  // Optional role check (e.g. supervisor only route)
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-800">Access Restricted</h2>
          <p className="text-xs text-slate-500">
            This module requires <strong>{requiredRole}</strong> clearance. Your current role is <strong>{user?.role || "inspector"}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
