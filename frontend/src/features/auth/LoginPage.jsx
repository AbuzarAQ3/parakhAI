import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FormErrors, getFieldError, FieldErrorMessage } from "../../components/auth/FormErrors";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Shield,
  KeyRound,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, supervisorLogin, guestLogin, isLoading } = useAuth();

  // Tab: 'inspector' | 'supervisor' | 'demo'
  const [activeTab, setActiveTab] = useState("inspector");

  // Form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [supervisorPin, setSupervisorPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Check if redirected due to session expiration
  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get("expired") === "1";

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const result = await login(username, password);
      setSubmitting(false);

      if (result.kind === "success") {
        const destination = location.state?.from?.pathname || "/dashboard";
        navigate(destination, { replace: true });
      } else if (result.kind === "pending") {
        navigate("/verify-email/pending", {
          state: { email: username.includes("@") ? username : undefined },
        });
      } else if (result.kind === "error") {
        setErrors(
          result.errors && result.errors.length > 0
            ? result.errors
            : [
                {
                  message: "Incorrect username or password. Please verify your credentials and try again.",
                  code: "invalid_credentials",
                  param: "password",
                },
              ]
        );
      }
    } catch (err) {
      setSubmitting(false);
      setErrors([
        {
          message: "Incorrect username or password. Please verify your credentials and try again.",
          code: "invalid_credentials",
          param: "password",
        },
      ]);
    }
  };

  const handleSupervisorSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const result = await supervisorLogin(username, password, supervisorPin);
      setSubmitting(false);

      if (result.kind === "success") {
        const destination = location.state?.from?.pathname || "/dashboard";
        navigate(destination, { replace: true });
      } else {
        setErrors(
          result.errors && result.errors.length > 0
            ? result.errors
            : [
                {
                  message: "Incorrect supervisor credentials or password. Please verify and try again.",
                  code: "supervisor_failed",
                  param: "password",
                },
              ]
        );
      }
    } catch (err) {
      setSubmitting(false);
      setErrors([
        {
          message: "Incorrect supervisor credentials or password. Please verify and try again.",
          code: "supervisor_failed",
          param: "password",
        },
      ]);
    }
  };

  const handleDemoSignIn = (role) => {
    const result = guestLogin(role);
    if (result.kind === "success") {
      navigate("/dashboard", { replace: true });
    }
  };

  const usernameError = getFieldError(errors, "username");
  const passwordError = getFieldError(errors, "password");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 bg-parakh-bg text-parakh-text">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-parakh-primary text-white shadow-xl ring-4 ring-parakh-primary/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-parakh-text sm:text-3xl">
            Parakh AI
          </h2>
          <p className="text-xs font-medium text-parakh-muted max-w-xs mx-auto">
            Legal Metrology Inspection &amp; Statutory Label Compliance Enforcement Portal
          </p>
        </div>

        {/* Session Expired Notice */}
        {sessionExpired && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Your session has expired. Please log in again to continue.</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-parakh-card rounded-3xl shadow-sm border border-parakh-border p-6 sm:p-8 space-y-6">
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-parakh-bg border border-parakh-border rounded-2xl text-xs font-semibold text-parakh-muted">
            <button
              type="button"
              onClick={() => {
                setActiveTab("inspector");
                setErrors([]);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "inspector"
                  ? "bg-parakh-card text-parakh-primary shadow-xs font-bold border border-parakh-border"
                  : "hover:text-parakh-text"
              }`}
            >
              Field Inspector
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("supervisor");
                setErrors([]);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "supervisor"
                  ? "bg-parakh-card text-parakh-primary shadow-xs font-bold border border-parakh-border"
                  : "hover:text-parakh-text"
              }`}
            >
              Supervisor
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("demo");
                setErrors([]);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                activeTab === "demo"
                  ? "bg-parakh-card text-blue-700 shadow-xs font-bold border border-parakh-border"
                  : "hover:text-parakh-text text-parakh-primary"
              }`}
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>SIH Demo</span>
            </button>
          </div>

          {/* Form Banner Errors */}
          <FormErrors errors={errors} title="Authentication Error" />

          {/* Tab 1: Inspector Login */}
          {activeTab === "inspector" && (
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                  Inspector ID / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your inspector username"
                    aria-invalid={!!usernameError}
                    className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-parakh-bg border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      usernameError ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20" : "border-parakh-border focus:border-blue-500"
                    }`}
                  />
                </div>
                <FieldErrorMessage error={usernameError} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/account/password/reset"
                    className="text-[11px] text-parakh-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    aria-invalid={!!passwordError}
                    className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-parakh-bg border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      passwordError ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20" : "border-parakh-border focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-parakh-muted hover:text-parakh-text focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldErrorMessage error={passwordError} />
              </div>

              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-parakh-primary hover:bg-parakh-primaryHover focus:ring-4 focus:ring-parakh-primary/20 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Enforcement Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 2: Supervisor Login */}
          {activeTab === "supervisor" && (
            <form onSubmit={handleSupervisorSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <span className="font-bold">Supervisor Clearance:</span> Access zonal review consoles, Section 36 escalation orders, and analytics.
              </div>

              <div>
                <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                  Supervisor ID / Official Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter supervisor username or email"
                    aria-invalid={!!usernameError}
                    className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-parakh-bg border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      usernameError ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20" : "border-parakh-border focus:border-blue-500"
                    }`}
                  />
                </div>
                <FieldErrorMessage error={usernameError} />
              </div>

              <div>
                <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    aria-invalid={!!passwordError}
                    className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-parakh-bg border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                      passwordError ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20" : "border-parakh-border focus:border-blue-500"
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
              </div>

              <div>
                <label className="block text-xs font-bold text-parakh-text uppercase tracking-wider mb-1.5">
                  Zonal Passcode / PIN (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-parakh-muted">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    value={supervisorPin}
                    onChange={(e) => setSupervisorPin(e.target.value)}
                    placeholder="6-digit Zonal PIN (if issued)"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-parakh-bg border border-parakh-border rounded-xl text-parakh-text placeholder:text-parakh-muted focus:bg-parakh-card focus:outline-none focus:border-parakh-primary focus:ring-2 focus:ring-blue-600/20 tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-parakh-primary hover:bg-parakh-primaryHover focus:ring-4 focus:ring-parakh-primary/20 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as Zonal Supervisor</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 3: SIH Demo & Evaluation Mode */}
          {activeTab === "demo" && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-blue-800">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Smart India Hackathon (SIH) Evaluation Mode</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  Instant one-click evaluation access for SIH judges and jury members. Tests the full OCR pipeline, rule engine, and evidence viewer without needing pre-seeded database accounts.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Demo Zonal Supervisor */}
                <button
                  type="button"
                  onClick={() => handleDemoSignIn("supervisor")}
                  className="w-full p-3.5 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-left transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Demo Login as Zonal Supervisor</span>
                    </div>
                    <p className="text-[11px] text-parakh-muted">
                      Dr. Alok Verma • Badge: UP-LM-DIR-08 • Full Zonal Review &amp; Escalation Authority
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Demo Guest User / Field Inspector */}
                <button
                  type="button"
                  onClick={() => handleDemoSignIn("inspector")}
                  className="w-full p-3.5 rounded-2xl border border-parakh-border bg-parakh-bg hover:bg-parakh-cardHover text-left transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-parakh-text flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-parakh-primary" />
                      <span>Demo Login as Guest User (Field Inspector)</span>
                    </div>
                    <p className="text-[11px] text-parakh-muted">
                      Rajesh Kumar • Badge: UP-4471 • Kanpur Nagar Zone 4 Field Quota
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-parakh-primary group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* Quick SIH Access footer if on other tabs */}
          {activeTab !== "demo" && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab("demo")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>SIH Judge / Evaluator? Click here for 1-Click Demo Login</span>
              </button>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-parakh-border flex flex-col sm:flex-row items-center justify-between text-xs text-parakh-muted gap-2">
            <span>Don&apos;t have an enforcement account?</span>
            <Link
              to="/signup"
              className="font-bold text-parakh-primary hover:text-parakh-primaryHover inline-flex items-center space-x-1"
            >
              <span>Register new officer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Security & Statutory Disclaimer */}
        <div className="text-center text-[11px] text-parakh-muted space-y-1">
          <p>Government of Uttar Pradesh • Department of Consumer Affairs</p>
          <p>Protected under The Legal Metrology Act, 2009 &amp; PCR 2011</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
