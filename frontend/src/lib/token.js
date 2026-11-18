/**
 * Token Persistence Helper
 * Manages the allauth headless session token in browser storage.
 * 
 * Includes an in-memory fallback for SSR, test environments (Node.js/Vitest),
 * and strict private browsing modes where storage access throws.
 * 
 * Known Dev-Phase Compromise:
 * Uses localStorage for development and mobile field caching.
 * // TODO: migrate to httpOnly cookie for production or in-memory + refresh tokens
 */

const TOKEN_KEY = "watchtower.session_token";

// In-memory fallback cache when window.localStorage is absent or unavailable
let memoryToken = null;

const isStorageAvailable = () => {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined" && window.localStorage !== null;
  } catch {
    return false;
  }
};

/**
 * Retrieve the current session token from localStorage (or memory cache)
 * Wrapped in try/catch to gracefully handle incognito/private browsing restrictions
 * @returns {string | null}
 */
export const getToken = () => {
  if (isStorageAvailable()) {
    try {
      return window.localStorage.getItem(TOKEN_KEY) || memoryToken || null;
    } catch {
      return memoryToken;
    }
  }
  return memoryToken;
};

/**
 * Store the session token
 * @param {string} token 
 */
export const setToken = (token) => {
  memoryToken = token || null;
  if (isStorageAvailable()) {
    try {
      if (token) {
        window.localStorage.setItem(TOKEN_KEY, token);
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    } catch (err) {
      console.warn("[TokenStorage] Unable to persist session token to localStorage:", err);
    }
  }
};

/**
 * Clear the session token from storage
 */
export const clearToken = () => {
  memoryToken = null;
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem("parakh.session_token");
      window.localStorage.removeItem("parakh.active_user");
      window.localStorage.removeItem("parakh.guest_user");
      if (typeof window.sessionStorage !== "undefined" && window.sessionStorage !== null) {
        window.sessionStorage.clear();
      }
    } catch (err) {
      console.warn("[TokenStorage] Unable to clear session token:", err);
    }
  }
};

export default {
  getToken,
  setToken,
  clearToken,
};
