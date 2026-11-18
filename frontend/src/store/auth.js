/**
 * Modular Zustand Authentication Store
 * Strictly bound to Django Allauth Headless session authentication.
 * Includes dedicated on-demand SIH Demo Mode for Hackathon evaluation.
 */

import { create } from "zustand";
import { authApi } from "../lib/api";
import { getToken, setToken, clearToken } from "../lib/token";

/**
 * Normalizes backend Allauth and DRF error responses into descriptive, human-readable error messages.
 */
export const parseBackendAuthErrors = (res, defaultMsg = "Authentication failed.") => {
  if (!res) {
    return [{ message: defaultMsg, code: "error", param: "password" }];
  }

  // Handle 410 Gone (expired or dead session token on server)
  if (res.status === 410) {
    clearToken();
    return [
      {
        message: "Previous session expired. Please enter your credentials to sign in.",
        code: "session_expired",
        param: "password",
      },
    ];
  }

  const data = res.data || (typeof res === "object" && !res.status ? res : null);
  if (!data) {
    return [{ message: res.statusText || defaultMsg, code: "error", param: "password" }];
  }

  // 1. Allauth Headless Envelope: { errors: [{ message, code, param }] }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((err) => {
      let message = err.message || defaultMsg;
      let param = err.param || null;

      if (
        err.code === "account_not_found" ||
        err.code === "user_not_found" ||
        (err.message && err.message.toLowerCase().includes("account not found"))
      ) {
        message = "Account not found. Please register first.";
        param = "username";
      } else if (
        err.code === "incorrect_password" ||
        (err.message && err.message.toLowerCase().includes("incorrect password"))
      ) {
        message = "Incorrect password. Please try again.";
        param = "password";
      } else if (
        err.code === "username_password_mismatch" ||
        err.code === "invalid_credentials" ||
        (err.message && err.message.toLowerCase().includes("username and/or password"))
      ) {
        message = "Incorrect username or password. Please verify your credentials and try again.";
        param = "password";
      } else if (err.code === "username_taken") {
        message = "A user with that username already exists. Please choose a different username.";
        param = "username";
      } else if (err.code === "email_taken") {
        message = "An account is already registered with this email address. Please sign in instead.";
        param = "email";
      } else if (err.code === "password_too_common") {
        message = "This password is too common. Please enter a stronger, unique password.";
        param = "password";
      } else if (err.code === "password_too_short") {
        message = "Password is too short. It must contain at least 8 characters.";
        param = "password";
      } else if (err.code === "password_entirely_numeric") {
        message = "Password cannot be entirely numbers. Please include letters and special characters.";
        param = "password";
      }

      return {
        message,
        code: err.code || "error",
        param,
      };
    });
  }

  // 2. DRF detail error: { detail: "..." }
  if (data.detail) {
    const detailText = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
    const isCred =
      detailText.toLowerCase().includes("credential") ||
      detailText.toLowerCase().includes("password") ||
      detailText.toLowerCase().includes("no active account");
    return [
      {
        message: isCred
          ? "Incorrect username or password. Please verify your credentials and try again."
          : detailText,
        param: isCred ? "password" : null,
        code: "detail_error",
      },
    ];
  }

  // 3. Standard DRF Validation Error Envelope: { [fieldName]: ["..."], ... }
  if (typeof data === "object" && !Array.isArray(data)) {
    const extracted = [];
    for (const [key, val] of Object.entries(data)) {
      if (key === "status" || key === "meta") continue;
      const msgs = Array.isArray(val) ? val : [val];
      msgs.forEach((m) => {
        let text = typeof m === "string" ? m : m.message || JSON.stringify(m);
        let param = key === "non_field_errors" || key === "__all__" ? null : key;
        if (text.toLowerCase().includes("password") || text.toLowerCase().includes("credential")) {
          param = "password";
          if (text.toLowerCase().includes("unable to log in") || text.toLowerCase().includes("invalid")) {
            text = "Incorrect username or password. Please verify your credentials and try again.";
          }
        }
        extracted.push({
          message: text,
          param,
          code: "validation_error",
        });
      });
    }
    if (extracted.length > 0) return extracted;
  }

  return [{ message: defaultMsg, code: "error", param: "password" }];
};

export const useAuthStore = create((set, get) => ({
  user: null,
  token: getToken(),
  status: getToken() ? "loading" : "unauthenticated",
  pendingFlows: [],
  pendingEmail: null,
  authConfig: null,

  /**
   * Fetch backend Allauth configuration (login methods, signup enabled, etc.)
   */
  fetchConfig: async () => {
    try {
      const response = await authApi.get("/config");
      const configData = response.data?.data || response.data;
      set({ authConfig: configData });
      return configData;
    } catch (err) {
      console.warn("[AuthStore] Failed to fetch Allauth config:", err);
      return null;
    }
  },

  /**
   * Standard User / Inspector Login
   * @param {string} username
   * @param {string} password
   */
  login: async (username, password) => {
    set({ status: "loading" });
    try {
      // Clear any prior stale session token before initiating a fresh login attempt
      clearToken();

      const trimmed = username.trim();
      // Django backend strictly expects 'username' as the primary key
      const payload = {
        username: trimmed,
        password,
      };

      const response = await authApi.post("/auth/login", payload);

      const { data, meta } = response.data || {};
      const sessionToken = meta?.session_token || response.headers["x-session-token"];

      if (meta?.is_authenticated && sessionToken) {
        setToken(sessionToken);
        const userObj = data?.user || {
          id: `user-${Date.now()}`,
          username: username.trim(),
          name: username.trim(),
          role: "inspector",
        };

        try {
          localStorage.setItem("parakh.active_user", JSON.stringify(userObj));
        } catch (e) {}

        set({
          user: userObj,
          token: sessionToken,
          status: "authenticated",
          pendingFlows: [],
          pendingEmail: null,
        });
        return { kind: "success", user: userObj };
      }

      set({ status: "unauthenticated", user: null, token: null });
      return {
        kind: "error",
        errors: [{ message: "Unexpected response from authentication server.", code: "unknown" }],
      };
    } catch (error) {
      const res = error.response;

      // 401 with pending verification flow
      if (res && res.status === 401) {
        const flows = res.data?.data?.flows || res.data?.flows || [];
        const isVerifyPending = flows.some(
          (f) => f.id === "verify_email" && f.is_pending === true
        );

        if (isVerifyPending) {
          const sessionToken = res.data?.meta?.session_token;
          if (sessionToken) setToken(sessionToken);

          const pendingList = ["verify_email"];
          set({
            status: "unauthenticated",
            user: null,
            pendingFlows: pendingList,
            pendingEmail: username.includes("@") ? username : null,
          });
          return { kind: "pending", flows: pendingList };
        }
      }

      // Any HTTP response with error payload (400, 401, 403, 422, etc.)
      if (res && (res.data || res.status >= 400)) {
        const errors = parseBackendAuthErrors(res, "Incorrect username or password. Please verify your credentials and try again.");
        set({ status: "unauthenticated", user: null, token: null });
        return { kind: "error", errors };
      }

      // Network / Connection Error
      set({ status: "unauthenticated", user: null, token: null });
      const networkErrors = [
        {
          message:
            error.message?.includes("Network Error") || error.code === "ECONNABORTED"
              ? "Cannot connect to authentication backend (Django port 8000). You can use SIH Demo Mode below for evaluation."
              : error.message || "Incorrect username or password. Please try again.",
          code: "network_error",
          param: "password",
        },
      ];
      return { kind: "error", errors: networkErrors };
    }
  },

  /**
   * Zonal Supervisor Login
   */
  supervisorLogin: async (username, password, supervisorPin = "") => {
    set({ status: "loading" });
    try {
      // Clear any prior stale session token before initiating a fresh login attempt
      clearToken();

      const trimmed = username.trim();
      const payload = {
        username: trimmed,
        password,
      };

      const response = await authApi.post("/auth/login", payload);

      const { data, meta } = response.data || {};
      const sessionToken = meta?.session_token || response.headers["x-session-token"];

      if (meta?.is_authenticated && sessionToken) {
        setToken(sessionToken);
        const userObj = {
          ...(data?.user || {}),
          id: data?.user?.id || `sup-${Date.now()}`,
          username: username.trim(),
          name: data?.user?.name || data?.user?.first_name || username.trim(),
          role: "supervisor",
          supervisor_pin: supervisorPin ? "VERIFIED" : undefined,
        };

        try {
          localStorage.setItem("parakh.active_user", JSON.stringify(userObj));
        } catch (e) {}

        set({
          user: userObj,
          token: sessionToken,
          status: "authenticated",
          pendingFlows: [],
        });
        return { kind: "success", user: userObj };
      }

      set({ status: "unauthenticated", user: null, token: null });
      return {
        kind: "error",
        errors: [{ message: "Supervisor authentication failed.", code: "supervisor_failed", param: "password" }],
      };
    } catch (error) {
      const res = error.response;
      set({ status: "unauthenticated", user: null, token: null });
      if (res && (res.data || res.status >= 400)) {
        return {
          kind: "error",
          errors: parseBackendAuthErrors(res, "Incorrect supervisor credentials or password."),
        };
      }
      return {
        kind: "error",
        errors: [
          {
            message: error.message || "Failed to contact supervisor auth server.",
            code: "network",
            param: "password",
          },
        ],
      };
    }
  },

  /**
   * SIH Demo Access Mode
   * On-demand demo login for Smart India Hackathon evaluators & judges.
   * Only activates when explicitly clicked on the login page; never auto-logs in.
   * @param {'inspector' | 'supervisor'} role
   */
  guestLogin: (role = "inspector") => {
    const isSupervisor = role === "supervisor";
    const demoToken = `guest_sih_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const demoUser = isSupervisor
      ? {
          id: "sih-sup-01",
          username: "demo_supervisor",
          name: "Dr. Alok Verma",
          email: "supervisor.lm@up.gov.in",
          role: "supervisor",
          designation: "Zonal Legal Metrology Controller",
          department: "Department of Consumer Affairs, Legal Metrology",
          badge_number: "UP-LM-DIR-08",
          jurisdiction: "Kanpur Division (Zone 4)",
          phone: "+91 94150 12844",
          is_guest: true,
          stats: {
            total_inspections: 42,
            violations_flagged: 11,
            inspections_today: 4,
          },
        }
      : {
          id: "sih-insp-01",
          username: "demo_inspector",
          name: "Rajesh Kumar",
          email: "rajesh.lm@up.gov.in",
          role: "inspector",
          designation: "Legal Metrology Field Inspector",
          department: "Department of Consumer Affairs, Legal Metrology",
          badge_number: "UP-4471",
          jurisdiction: "Kanpur Nagar (Wards 12, 18, 24, 31)",
          phone: "+91 98765 43210",
          duty_status: "ON_DUTY",
          is_guest: true,
          stats: {
            total_inspections: 8,
            violations_flagged: 2,
            inspections_today: 1,
          },
        };

    setToken(demoToken);
    try {
      localStorage.setItem("parakh.guest_user", JSON.stringify(demoUser));
      localStorage.setItem("parakh.active_user", JSON.stringify(demoUser));
    } catch (e) {}

    set({
      user: demoUser,
      token: demoToken,
      status: "authenticated",
      pendingFlows: [],
      pendingEmail: null,
    });
    return { kind: "success", user: demoUser };
  },

  /**
   * Register a new Officer Account
   */
  signup: async ({ username, email, password, role = "inspector", designation = "" }) => {
    set({ status: "loading" });
    try {
      // Clear any prior stale session token before initiating a fresh registration
      clearToken();

      const response = await authApi.post("/auth/signup", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const { data, meta } = response.data || {};
      const sessionToken = meta?.session_token || response.headers["x-session-token"];

      if (meta?.is_authenticated && sessionToken) {
        setToken(sessionToken);
        const newUser = {
          ...(data?.user || {}),
          id: data?.user?.id || `user-${Date.now()}`,
          username: username.trim(),
          name: username.trim(),
          email: email.trim().toLowerCase(),
          role,
          designation,
        };

        try {
          localStorage.setItem("parakh.active_user", JSON.stringify(newUser));
        } catch (e) {}

        set({
          user: newUser,
          token: sessionToken,
          status: "authenticated",
          pendingFlows: [],
          pendingEmail: null,
        });
        return { kind: "success", user: newUser };
      }

      set({ status: "unauthenticated", user: null, token: null });
      return {
        kind: "error",
        errors: [{ message: "Registration succeeded but session could not be established.", code: "unknown" }],
      };
    } catch (error) {
      const res = error.response;

      if (res && res.status === 401) {
        const flows = res.data?.data?.flows || res.data?.flows || [];
        const isVerifyPending = flows.some(
          (f) => f.id === "verify_email" && f.is_pending === true
        );

        if (isVerifyPending) {
          const sessionToken = res.data?.meta?.session_token;
          if (sessionToken) setToken(sessionToken);

          const pendingList = ["verify_email"];
          set({
            status: "unauthenticated",
            user: null,
            pendingFlows: pendingList,
            pendingEmail: email,
          });
          return { kind: "pending", flows: pendingList, email };
        }
      }

      if (res && (res.data || res.status >= 400)) {
        const errors = parseBackendAuthErrors(res, "Registration failed. Check submitted values.");
        set({ status: "unauthenticated", user: null, token: null });
        return { kind: "error", errors };
      }

      set({ status: "unauthenticated", user: null, token: null });
      return {
        kind: "error",
        errors: [
          {
            message: error.message?.includes("Network Error") || error.code === "ECONNABORTED"
              ? "Cannot reach backend server. Please verify backend is running on port 8000."
              : error.message || "Registration encountered an unexpected error.",
            code: "network_error",
          },
        ],
      };
    }
  },

  /**
   * Session Restoration: strictly checks active session.
   * If no token exists, user remains unauthenticated (Landing page shown).
   */
  restoreSession: async () => {
    const token = getToken();

    // If no token exists, user is strictly unauthenticated
    if (!token) {
      set({ user: null, token: null, status: "unauthenticated", pendingFlows: [], pendingEmail: null });
      return;
    }

    // SIH Demo Session restoration: only if explicitly initiated in this browser
    if (token.startsWith("guest_sih_") || token.startsWith("guest_session_")) {
      let guestUser = null;
      try {
        const saved = localStorage.getItem("parakh.guest_user");
        if (saved) guestUser = JSON.parse(saved);
      } catch (e) {}

      if (guestUser) {
        set({ user: guestUser, token, status: "authenticated", pendingFlows: [] });
        return;
      }
    }

    set({ status: "loading" });
    try {
      const response = await authApi.get("/auth/session");
      const { data, meta } = response.data || {};

      if (meta?.is_authenticated && data?.user) {
        const userObj = {
          ...data.user,
          name: data.user.name || [data.user.first_name, data.user.last_name].filter(Boolean).join(" ") || data.user.username,
          role: data.user.role || (data.user.is_superuser || data.user.is_staff ? "supervisor" : "inspector"),
        };
        try {
          localStorage.setItem("parakh.active_user", JSON.stringify(userObj));
        } catch (e) {}

        set({
          user: userObj,
          token,
          status: "authenticated",
          pendingFlows: [],
        });
      } else {
        clearToken();
        try {
          localStorage.removeItem("parakh.active_user");
          localStorage.removeItem("parakh.guest_user");
        } catch (e) {}
        set({ user: null, token: null, status: "unauthenticated", pendingFlows: [] });
      }
    } catch (err) {
      // Backend rejected token or session is dead: strictly unauthenticate
      clearToken();
      try {
        localStorage.removeItem("parakh.active_user");
        localStorage.removeItem("parakh.guest_user");
      } catch (e) {}
      set({ user: null, token: null, status: "unauthenticated", pendingFlows: [] });
    }
  },

  /**
   * Secure Logout: informs backend and purges all local auth storage
   */
  logout: async () => {
    const token = getToken();
    try {
      if (token && !token.startsWith("guest_sih_") && !token.startsWith("guest_session_")) {
        await authApi.delete("/auth/session");
      }
    } catch (err) {
      console.warn("[AuthStore] Server logout notification failed:", err);
    } finally {
      clearToken();
      try {
        localStorage.removeItem("parakh.active_user");
        localStorage.removeItem("parakh.guest_user");
      } catch (e) {}
      set({
        user: null,
        token: null,
        status: "unauthenticated",
        pendingFlows: [],
        pendingEmail: null,
      });
    }
  },

  /**
   * Request Password Reset Link
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await authApi.post("/auth/password/request", {
        email: email.trim().toLowerCase(),
      });
      return { kind: "success", data: response.data };
    } catch (error) {
      const res = error.response;
      return {
        kind: "error",
        errors: res?.data?.errors || [{ message: error.message || "Failed to request password reset." }],
      };
    }
  },

  /**
   * Reset Password with Key
   */
  resetPassword: async (key, password) => {
    try {
      const response = await authApi.post("/auth/password/reset", {
        key: key.trim(),
        password,
      });
      return { kind: "success", data: response.data };
    } catch (error) {
      const res = error.response;
      return {
        kind: "error",
        errors: res?.data?.errors || [{ message: error.message || "Failed to reset password." }],
      };
    }
  },

  setPendingFlows: (flows) => set({ pendingFlows: flows }),
  setPendingEmail: (email) => set({ pendingEmail: email }),
}));

export default useAuthStore;
