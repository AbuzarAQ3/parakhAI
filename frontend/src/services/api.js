/**
 * Centralized API Service for Parakh AI
 * Communicates with Django REST Framework backend at /api/v1/
 *
 * Backend Endpoint Verification Status:
 * - getHealth: VERIFIED (backend/urls.py -> HealthCheckView)
 * - getReadiness: VERIFIED (backend/urls.py -> ReadinessCheckView)
 * - getDashboardSummary: UNVERIFIED (Backend app URLs are empty stubs)
 * - getInspectorProfile: UNVERIFIED (Backend app URLs are empty stubs)
 * - getInspections: UNVERIFIED (Backend app URLs are empty stubs)
 * - getInspection: UNVERIFIED (Backend app URLs are empty stubs)
 * - reviewInspection: UNVERIFIED (Backend app URLs are empty stubs)
 * - analyzeInspection: UNVERIFIED (Backend app URLs are empty stubs)
 * - getInspectionEvidence: UNVERIFIED (Backend app URLs are empty stubs)
 * - getComplianceRules: UNVERIFIED (Backend app URLs are empty stubs)
 * - getWeeklyAnalytics: UNVERIFIED (Backend app URLs are empty stubs)
 * - getLocationAnalytics: UNVERIFIED (Backend app URLs are empty stubs)
 */

import { api as axiosClient } from "../lib/api";

const API_V1_PREFIX = "";

export const api = {
  // --- VERIFIED SYSTEM PROBES ---
  /**
   * System Health Liveness Probe (VERIFIED)
   */
  getHealth: async () => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/health/`);
    return res.data;
  },

  /**
   * Database Readiness Probe (VERIFIED)
   */
  getReadiness: async () => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/ready/`);
    return res.data;
  },

  // --- UNVERIFIED BUSINESS ENDPOINTS (Pending Backend App URLs) ---
  /**
   * Aggregate Dashboard Summary (UNVERIFIED)
   */
  getDashboardSummary: async () => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/dashboard/summary/`);
    return res.data;
  },

  /**
   * Current Inspector / Officer Profile (UNVERIFIED)
   */
  getInspectorProfile: async () => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/inspector/profile/`);
    return res.data;
  },

  /**
   * Paginated Field Inspections (UNVERIFIED)
   */
  getInspections: async (params = {}) => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/inspections/`, { params });
    return res.data;
  },

  /**
   * Inspection Details by ID (UNVERIFIED)
   */
  getInspection: async (id) => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/inspections/${id}/`);
    return res.data;
  },

  /**
   * Patch Inspection Review Status (UNVERIFIED)
   */
  reviewInspection: async (id, data) => {
    const res = await axiosClient.patch(`${API_V1_PREFIX}/inspections/${id}/review/`, data);
    return res.data;
  },

  /**
   * Upload & OCR Analyze Packaged Commodity (UNVERIFIED)
   */
  analyzeInspection: async (formData) => {
    const res = await axiosClient.post(`${API_V1_PREFIX}/inspections/analyze/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  /**
   * Inspection Evidence Coordinates & Image (UNVERIFIED)
   */
  getInspectionEvidence: async (id) => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/inspections/${id}/evidence/`);
    return res.data;
  },

  /**
   * PCR 2011 Statutory Compliance Rules (UNVERIFIED)
   */
  getComplianceRules: async () => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/rules/`);
    return res.data;
  },

  /**
   * Weekly Analytics Trends (UNVERIFIED)
   */
  getWeeklyAnalytics: async () => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/analytics/weekly/`);
    return res.data;
  },

  /**
   * Geolocation Inspection Mapping Analytics (UNVERIFIED)
   */
  getLocationAnalytics: async () => {
    const res = await axiosClient.get(`${API_V1_PREFIX}/analytics/locations/`);
    return res.data;
  },
};

export default api;
