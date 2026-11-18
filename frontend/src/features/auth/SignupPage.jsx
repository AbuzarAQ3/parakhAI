import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FormErrors, getFieldError, FieldErrorMessage } from "../../components/auth/FormErrors";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import {
  ShieldCheck,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("inspector"); // 'inspector' | 'supervisor'
  const [designation, setDesignation] = useState("Legal Metrology Inspector");
  const [jurisdictionZone, setJurisdictionZone] = useState("Kanpur Nagar Zone 4");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Client-side password strength hint
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-rose-500 text-rose-600" };
    if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-500 text-amber-600" };
    if (score === 3) return { score: 75, label: "Good", color: "bg-blue-500 text-blue-600" };
    return { score: 100, label: "Strong", color: "bg-emerald-500 text-emerald-600" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (password !== confirmPassword) {
      setErrors([
        {
          param: "confirmPassword",
          code: "password_mismatch",
          message: "Passwords do not match. Please ensure both password entries are identical.",
        },
      ]);
      return;
    }

    setSubmitting(true);

    const result = await signup({
      username,
      email,
      password,
      role,
      designation: role === "supervisor" ? "Zonal Legal Metrology Controller" : designation,
    });

    setSubmitting(false);

    if (result.kind === "success") {
      navigate("/dashboard", { replace: true });
    } else if (result.kind === "pending") {
      navigate("/verify-email/pending", { state: { email } });
    } else if (result.kind === "error") {
      setErrors(result.errors || [{ message: "Registration failed.", code: "error" }]);
    }
  };

  const usernameError = getFieldError(errors, "username");
  const emailError = getFieldError(errors, "email");
  const passwordError = getFieldError(errors, "password");
  const confirmPasswordError = getFieldError(errors, "confirmPassword");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 bg-parakh-bg text-parakh-text">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-parakh-primary text-white shadow-xl ring-4 ring-parakh-primary/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-parakh-text sm:text-3xl">
            Officer Registration
          </h2>
          <p className="text-xs font-medium text-parakh-muted max-w-xs mx-auto">
            Create an enforcement profile for Parakh AI 
          </p>
        </div>

        {/* Card */}
        <div className="bg-parakh-card rounded-3xl shadow-2xl border border-parakh-border p-6 sm:p-8 space-y-6">
          <FormErrors errors={errors} title="Registration Error" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                Designated Enforcement Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole("inspector");
                    setDesignation("Legal Metrology Inspector");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === "inspector"
                      ? "border-parakh-primary bg-parakh-primary/15 ring-2 ring-parakh-primary/25 text-parakh-primary font-bold"
                      : "border-parakh-border bg-parakh-bg hover:border-parakh-muted text-parakh-text"
                  }`}
                >
                  <p className="text-xs font-bold flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-parakh-primary" />
                    <span>Field Inspector</span>
                  </p>
                  <p className="text-[10px] text-parakh-muted mt-0.5">
                    Field checks &amp; barcode OCR
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("supervisor");
                    setDesignation("Zonal Controller");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === "supervisor"
                      ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20 text-indigo-400 font-bold"
                      : "border-parakh-border bg-parakh-bg hover:border-parakh-muted text-parakh-text"
                  }`}
                >
                  <p className="text-xs font-bold flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span>Zonal Supervisor</span>
                  </p>
                  <p className="text-[10px] text-parakh-muted mt-0.5">
                    Review &amp; Section 36 orders
                  </p>
                </button>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                Official Username / Badge ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. rajesh_kumar"
                  aria-invalid={!!usernameError}
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-parakh-bg border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                    usernameError ? "border-rose-500 bg-rose-50" : "border-parakh-border focus:border-blue-500"
                  }`}
                />
              </div>
              <FieldErrorMessage error={usernameError} />
            </div>

            {/* Official Email */}
            <div>
              <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                Departmental Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@lm.up.gov.in"
                  aria-invalid={!!emailError}
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-parakh-bg border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                    emailError ? "border-rose-500 bg-rose-50" : "border-parakh-border focus:border-blue-500"
                  }`}
                />
              </div>
              <FieldErrorMessage error={emailError} />
            </div>

            {/* Jurisdiction Zone */}
            <div>
              <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                Assigned Jurisdiction
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={jurisdictionZone}
                  onChange={(e) => setJurisdictionZone(e.target.value)}
                  placeholder="e.g. Kanpur Nagar Zone 4"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-parakh-bg border border-parakh-border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                Enforcement Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
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
                  className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-parakh-bg border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                    passwordError ? "border-rose-500 bg-rose-50" : "border-parakh-border focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-parakh-muted hover:text-parakh-text cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldErrorMessage error={passwordError} />

              {/* Password strength bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color.split(" ")[0]}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Strength:</span>
                    <span className={`font-bold ${strength.color.split(" ")[1]}`}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                Confirm Enforcement Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  aria-invalid={!!confirmPasswordError}
                  className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-parakh-bg border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                    confirmPasswordError ? "border-rose-500 bg-rose-50/50" : "border-parakh-border focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-parakh-muted hover:text-parakh-text cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldErrorMessage error={confirmPasswordError} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-parakh-primary hover:bg-parakh-primaryHover focus:ring-4 focus:ring-parakh-primary/20 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Profile...</span>
                </>
              ) : (
                <>
                  <span>Create Officer Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-parakh-border flex items-center justify-between text-xs text-parakh-muted">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-bold text-parakh-primary hover:text-parakh-primaryHover inline-flex items-center space-x-1"
            >
              <span>Sign in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
