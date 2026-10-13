import {
  DashboardSummary,
  InspectorProfile,
  Inspection,
  WeeklyTrendsResponse,
  LocationCluster,
  ComplianceRule,
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      errorDetail = errorJson?.error?.message || JSON.stringify(errorJson);
    } catch {
      errorDetail = `${response.status} ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Dashboard
  getDashboardSummary: (): Promise<DashboardSummary> =>
    request<DashboardSummary>("/dashboard/summary/"),

  // Inspector
  getInspectorProfile: (): Promise<InspectorProfile> =>
    request<InspectorProfile>("/inspector/profile/"),

  // Inspections
  getInspections: (params?: {
    compliance_status?: string;
    category?: string;
    review_status?: string;
    search?: string;
    page?: number;
  }): Promise<{ count: number; total_pages: number; current_page: number; results: Inspection[] }> => {
    const query = new URLSearchParams();
    if (params?.compliance_status) query.append("compliance_status", params.compliance_status);
    if (params?.category) query.append("category", params.category);
    if (params?.review_status) query.append("review_status", params.review_status);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", params.page.toString());
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return request(`/inspections/${queryString}`);
  },

  getInspection: (id: string): Promise<Inspection> =>
    request<Inspection>(`/inspections/${id}/`),

  reviewInspection: (
    id: string,
    data: { review_status: string; notes: string }
  ): Promise<Inspection> =>
    request<Inspection>(`/inspections/${id}/review/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  analyzeInspection: (formData: FormData): Promise<Inspection> =>
    request<Inspection>("/inspections/analyze/", {
      method: "POST",
      body: formData,
    }),

  getInspectionEvidence: (id: string) =>
    request(`/inspections/${id}/evidence/`),

  // Rules
  getComplianceRules: (): Promise<ComplianceRule[]> =>
    request<ComplianceRule[]>("/rules/"),

  // Analytics
  getWeeklyAnalytics: (): Promise<WeeklyTrendsResponse> =>
    request<WeeklyTrendsResponse>("/analytics/weekly/"),

  getLocationAnalytics: (): Promise<LocationCluster[]> =>
    request<LocationCluster[]>("/analytics/locations/"),
};
