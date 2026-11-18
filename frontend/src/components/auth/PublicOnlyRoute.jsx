import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader2 } from "lucide-react";

/**
 * PublicOnlyRoute Component
 * Prevents already authenticated users from visiting /login or /signup.
 * Redirects them back to the dashboard or their previous intended location.
 */
export const PublicOnlyRoute = ({ children }) => {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || "/";
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
