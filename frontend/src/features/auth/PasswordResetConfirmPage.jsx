import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FormErrors, getFieldError, FieldErrorMessage } from "../../components/auth/FormErrors";
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export const PasswordResetConfirmPage = () => {
  const { key } = useParams();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (password !== confirmPassword) {
      setErrors([{ param: "password", message: "Passwords do not match." }]);
      return;
    }

    setSubmitting(true);
    const result = await resetPassword(key, password);
    setSubmitting(false);

    if (result.kind === "success") {
      setSuccess(true);
    } else {
      setErrors(result.errors || [{ message: "Password reset link is invalid or has expired." }]);
    }
  };

  const passwordError = getFieldError(errors, "password");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Set New Password
          </h2>
          <p className="text-xs text-slate-500">
            Enter a strong new password for your officer account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <FormErrors errors={errors} title="Password Reset Failed" />

          {success ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Password Updated Successfully</h3>
                <p className="text-xs text-slate-600">
                  Your credentials have been updated. You can now log in with your new password.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-1.5"
              >
                <span>Continue to Officer Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    aria-invalid={!!passwordError}
                    className="block w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldErrorMessage error={passwordError} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Password Reset</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirmPage;
