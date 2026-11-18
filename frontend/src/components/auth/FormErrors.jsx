import React from "react";
import { AlertCircle, XCircle } from "lucide-react";

/**
 * FormErrors Component
 * Renders top-level non-field error banners and provides helper functions
 * for inline field-level validation errors returned by the django-allauth backend.
 * 
 * Backend error envelope shape:
 * errors: [{ message: string, code: string, param?: string }]
 */

export const FormErrors = ({ errors = [], title = "Authentication Error" }) => {
  if (!errors || errors.length === 0) return null;

  // Deduplicate error messages so the user sees every unique issue clearly
  const seen = new Set();
  const uniqueErrors = errors.filter((err) => {
    const msg = err.message || "";
    if (!msg || seen.has(msg)) return false;
    seen.add(msg);
    return true;
  });

  if (uniqueErrors.length === 0) return null;

  return (
    <div
      role="alert"
      className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs space-y-1.5 animate-in fade-in duration-200 shadow-xs dark:bg-rose-950/40 dark:border-rose-800/50 dark:text-rose-200"
    >
      <div className="flex items-center space-x-2 font-bold text-rose-900 dark:text-rose-100">
        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>{title}</span>
      </div>
      <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-rose-800 dark:text-rose-200 font-medium">
        {uniqueErrors.map((err, idx) => (
          <li key={idx} className="leading-snug">
            {err.message || "An unexpected error occurred."}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Helper to extract field-specific error from errors array with intelligent fallback
 * @param {Array} errors 
 * @param {string} fieldParam 
 * @returns {string | null}
 */
export const getFieldError = (errors = [], fieldParam) => {
  if (!errors || !Array.isArray(errors)) return null;

  // 1. Direct param match
  const match = errors.find((e) => e.param === fieldParam);
  if (match?.message) return match.message;

  // 2. Intelligent fallback for password errors
  if (fieldParam === "password") {
    const credError = errors.find(
      (e) =>
        e.code === "incorrect_password" ||
        e.code === "username_password_mismatch" ||
        e.code === "password_too_short" ||
        e.code === "password_too_common" ||
        e.code === "password_entirely_numeric" ||
        e.message?.toLowerCase().includes("password") ||
        e.message?.toLowerCase().includes("credential")
    );
    if (credError?.message) return credError.message;
  }

  // 3. Intelligent fallback for username errors
  if (fieldParam === "username") {
    const userError = errors.find(
      (e) =>
        e.code === "account_not_found" ||
        e.code === "user_not_found" ||
        e.code === "username_taken" ||
        e.message?.toLowerCase().includes("account not found") ||
        (e.message?.toLowerCase().includes("username") && !e.message?.toLowerCase().includes("password"))
    );
    if (userError?.message) return userError.message;
  }

  // 4. Intelligent fallback for email errors
  if (fieldParam === "email") {
    const emailError = errors.find(
      (e) =>
        e.code === "email_taken" ||
        e.message?.toLowerCase().includes("email")
    );
    if (emailError?.message) return emailError.message;
  }

  return null;
};

/**
 * Inline Field Error text component
 */
export const FieldErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <p
      className="mt-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center space-x-1 animate-in fade-in"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{error}</span>
    </p>
  );
};

export default FormErrors;
