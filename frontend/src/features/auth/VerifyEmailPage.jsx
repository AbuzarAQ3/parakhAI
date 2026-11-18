import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authApi } from "../../lib/api";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export const VerifyEmailPage = () => {
  const { key } = useParams();

  // 'verifying' | 'success' | 'expired' | 'error' | 'invalid_key'
  const [state, setState] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  const verifyKey = async () => {
    if (!key || key.length < 5) {
      setState("invalid_key");
      return;
    }

    setState("verifying");
    setErrorMessage("");

    try {
      // POST /_allauth/app/v1/auth/email/verify with { key }
      // React Router has already URL-decoded colons ':'
      const response = await authApi.post("/auth/email/verify", { key });

      if (response.status === 200 || response.data?.status === 200) {
        setState("success");
      } else {
        setState("expired");
      }
    } catch (error) {
      const res = error.response;
      if (res && res.status === 400) {
        const errorItem = res.data?.errors?.[0];
        const code = errorItem?.code || "";
        const msg = errorItem?.message || "Verification key is invalid or has expired.";
        setErrorMessage(msg);
        setState("expired");
      } else {
        setErrorMessage(
          error.message || "Network error while connecting to verification gateway."
        );
        setState("error");
      }
    }
  };

  useEffect(() => {
    verifyKey();
  }, [key]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-slate-100 to-blue-50/30">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 text-center space-y-6">
          {/* State 1: Verifying */}
          {state === "verifying" && (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Verifying Email Link
                </h2>
                <p className="text-xs text-slate-500">
                  Validating cryptographic token with Legal Metrology auth server...
                </p>
              </div>
            </div>
          )}

          {/* State 2: Success */}
          {state === "success" && (
            <div className="space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Email Successfully Verified!
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your officer account has been validated and authorized for Legal Metrology field inspections.
                </p>
              </div>

              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 inline-flex items-center justify-center space-x-2"
              >
                <span>Continue to Officer Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* State 3: Expired / Invalid Key */}
          {(state === "expired" || state === "invalid_key") && (
            <div className="space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Verification Link Expired
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {errorMessage ||
                    "This verification link is invalid, has already been used, or has expired."}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  to="/signup"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <span>Register a New Officer Account</span>
                </Link>

                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <span>Return to Login</span>
                </Link>
              </div>
            </div>
          )}

          {/* State 4: Network / Server Error */}
          {state === "error" && (
            <div className="space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-sm mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Connection Error
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {errorMessage || "Unable to reach the authentication service. Please check your internet connection."}
                </p>
              </div>

              <button
                type="button"
                onClick={verifyKey}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Verification</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
