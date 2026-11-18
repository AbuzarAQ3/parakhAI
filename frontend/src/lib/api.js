/**
 * Modular Axios API Client for Django Allauth Headless + DRF
 * Shared between ParakhAI and ATMASYN platforms.
 * 
 * Contract:
 * - Session token passed via `X-Session-Token` header.
 * - No CSRF or Cookie tokens (stateless session tokens).
 * - 401 with pending flows is preserved without auto-redirecting.
 */

import axios from "axios";
import { getToken, clearToken } from "./token";

// Read API Base URL (defaults to empty string when Vite proxy is active or http://localhost:8000)
const BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined 
  ? import.meta.env.VITE_API_BASE_URL 
  : "";

// Standard DRF API Client
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Django Allauth Headless API Client (mounted at /_allauth/app/v1)
export const authApi = axios.create({
  baseURL: "/_allauth/app/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Configure Request Interceptors:
 * Injects X-Session-Token from storage into all outgoing requests,
 * EXCEPT initial login/signup requests where a fresh session is initiated.
 */
const attachAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const isFreshAuthInit =
        config.url &&
        (config.url.endsWith("/auth/login") ||
          config.url.endsWith("/auth/signup") ||
          config.url === "/auth/login" ||
          config.url === "/auth/signup");

      const token = getToken();
      if (token && !isFreshAuthInit) {
        config.headers["X-Session-Token"] = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Configure Response Interceptor:
   * - 401 with pending flow (e.g. verify_email): preserve error for caller.
   * - 401 with dead session OR 410 Gone: clear expired token from storage.
   * - 400 validation errors passed through unchanged.
   */
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const res = error.response;

      if (res && (res.status === 401 || res.status === 410)) {
        // Inspect response data flows
        const flows = res.data?.data?.flows || res.data?.flows || [];
        const hasPendingFlow = Array.isArray(flows) && flows.some(
          (flow) => flow.is_pending === true || (flow.id !== "login" && flow.id !== "signup")
        );

        if (!hasPendingFlow || res.status === 410) {
          // Dead session: token expired, purged on server, or returned 410 Gone
          clearToken();
        }
      }

      return Promise.reject(error);
    }
  );
};

attachAuthInterceptor(api);
attachAuthInterceptor(authApi);

export default api;
