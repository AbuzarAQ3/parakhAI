import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FormErrors, getFieldError, FieldErrorMessage } from "../../components/auth/FormErrors";
import { ShieldCheck, Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export const PasswordResetRequestPage = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    const result = await requestPasswordReset(email);
    setSubmitting(false);

    if (result.kind === "success") {
      setSubmitted(true);
    } else {
      setErrors(result.errors || [{ message: "Unable to process password reset request." }]);
    }
  };

  const emailError = getFieldError(errors, "email");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500">
            Enter your departmental email to receive a password reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <FormErrors errors={errors} title="Reset Request Failed" />

          {submitted ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Instructions Dispatched</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If an account exists for <strong className="text-slate-800">{email}</strong>, a password reset link has been sent to your inbox.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-1.5"
              >
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@lm.up.gov.in"
                    aria-invalid={!!emailError}
                    className={`block w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      emailError ? "border-rose-400 bg-rose-50/30" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                </div>
                <FieldErrorMessage error={emailError} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Instructions...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequestPage;
