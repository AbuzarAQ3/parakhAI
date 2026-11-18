import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Mail, CheckCircle2, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export const PendingVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pendingEmail, pendingFlows } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);

  // Email passed from signup/login navigation or stored in auth state
  const targetEmail = location.state?.email || pendingEmail || "your registered email address";

  const handleResend = () => {
    // // TODO: integrate with POST /_allauth/app/v1/auth/email/request when backend endpoint is ready
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendNotice(true);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-slate-100 to-blue-50/30">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 text-center space-y-6">
          {/* Animated Mail Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 shadow-sm mx-auto">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Verify Your Email Address
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We sent a verification link to{" "}
              <span className="font-bold text-slate-900 break-all">{targetEmail}</span>.
              Please click the link in your email to activate your account.
            </p>
          </div>

          {resendNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>A new activation link has been dispatched to your email.</span>
            </div>
          )}

          {/* Guidelines Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2 text-xs text-slate-500">
            <p className="font-bold text-slate-700">Didn&apos;t receive the email?</p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Check your spam or departmental quarantine folder.</li>
              <li>Wait 1–2 minutes for the delivery gateway to clear.</li>
              <li>Ensure the email address matches your official department ID.</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin text-blue-600" : ""}`} />
              <span>{resending ? "Dispatching..." : "Resend Verification Email"}</span>
            </button>

            <Link
              to="/login"
              className="inline-flex items-center justify-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerificationPage;
