/**
 * Centralized API Service for Parakh AI
 * Communicates with Django REST Framework backend at /api/v1/
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorDetail = "API Request failed";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson?.error?.message || errorJson?.detail || JSON.stringify(errorJson);
    } catch {
      errorDetail = `${response.status} ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // System Health
  getHealth: () => request("/health/"),
  getReadiness: () => request("/ready/"),

  // Dashboard
  getDashboardSummary: () => request("/dashboard/summary/"),

  // Inspector
  getInspectorProfile: () => request("/inspector/profile/"),

  // Inspections
  getInspections: (params = {}) => {
    const query = new URLSearchParams();
    if (params.compliance_status) query.append("compliance_status", params.compliance_status);
    if (params.category) query.append("category", params.category);
    if (params.review_status) query.append("review_status", params.review_status);
    if (params.search) query.append("search", params.search);
    if (params.page) query.append("page", params.page.toString());
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return request(`/inspections/${queryString}`);
  },

  getInspection: (id) => request(`/inspections/${id}/`),

  reviewInspection: (id, data) =>
    request(`/inspections/${id}/review/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  analyzeInspection: (formData) =>
    request("/inspections/analyze/", {
      method: "POST",
      body: formData,
    }),

  getInspectionEvidence: (id) => request(`/inspections/${id}/evidence/`),

  // Statutory Rules
  getComplianceRules: () => request("/rules/"),

  // Analytics
  getWeeklyAnalytics: () => request("/analytics/weekly/"),
  getLocationAnalytics: () => request("/analytics/locations/"),
};
