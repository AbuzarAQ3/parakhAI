/**
 * TypeScript Data Models matching Django REST Framework API schemas.
 */

export type ComplianceStatus = "COMPLIANT" | "NON_COMPLIANT" | "PARTIAL_COMPLIANCE" | "NEEDS_REVIEW";
export type ReviewStatus = "PENDING" | "REVIEWED" | "ESCALATED";
export type RuleResult = "PASS" | "FAIL" | "REVIEW" | "NOT_APPLICABLE";

export interface InspectorProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  inspector_id: string;
  badge_number: string;
  jurisdiction: string;
  phone: string;
  duty_status: string;
  system_diagnostics?: {
    backend_status: string;
    database_engine: string;
    ai_ocr_processing_mode: string;
    rule_engine_version: string;
    app_version: string;
    legal_framework: string;
    is_demo_mode: boolean;
  };
  inspection_statistics?: {
    total_inspections: number;
    compliant: number;
    violations: number;
    pending_review: number;
    compliance_rate: number;
  };
}

export interface ExtractedField {
  id: string;
  field_key: string;
  display_name: string;
  extracted_value: string;
  extracted_value_hindi?: string;
  normalized_value: string;
  confidence: number;
  coordinates: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  verification_status: "UNVERIFIED" | "VERIFIED" | "FLAGGED";
  is_mandatory: boolean;
}

export interface RuleEvaluation {
  id: string;
  rule_id: string;
  rule_code: string;
  title: string;
  requirement: string;
  legal_reference: string;
  result: RuleResult;
  explanation: string;
  observed_value: string;
  evidence_reference: string;
  inspector_review_required: boolean;
  confidence: number;
  inspector_notes: string;
}

export interface InspectionEvidence {
  id: string;
  image_url: string;
  field_name: string;
  bounding_box: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  evidence_type: string;
  metadata?: Record<string, any>;
}

export interface Inspection {
  id: string;
  inspection_number: string;
  product?: string;
  product_name: string;
  product_name_hindi?: string;
  category: string;
  inspection_method: "CAMERA" | "UPLOAD" | "BARCODE" | "SAMPLE";
  timestamp: string;
  jurisdiction: string;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  compliance_score: number;
  compliance_status: ComplianceStatus;
  extraction_confidence: number;
  review_status: ReviewStatus;
  image_url: string;
  notes: string;
  is_simulated: boolean;
  extracted_fields?: ExtractedField[];
  rule_evaluations?: RuleEvaluation[];
  evidence_records?: InspectionEvidence[];
  created_at: string;
}

export interface DashboardSummary {
  summary: {
    total_inspections: number;
    compliant_count: number;
    violations_count: number;
    pending_review_count: number;
    compliance_rate: number;
  };
  inspector: InspectorProfile | null;
  recent_inspections: Inspection[];
  jurisdiction: {
    name: string;
    zone: string;
    state: string;
  };
}

export interface WeeklyTrendsResponse {
  start_date: string;
  end_date: string;
  trends: Array<{
    date: string;
    day: string;
    total: number;
    compliant: number;
    violations: number;
    pending: number;
    rate: number;
  }>;
}

export interface LocationCluster {
  location_name: string;
  jurisdiction: string;
  latitude: number;
  longitude: number;
  total_inspections: number;
  compliant_count: number;
  violations_count: number;
  latest_inspection: {
    id: string;
    inspection_number: string;
    product_name: string;
    compliance_status: ComplianceStatus;
    timestamp: string;
  } | null;
  inspections: Array<{
    id: string;
    inspection_number: string;
    product_name: string;
    compliance_status: ComplianceStatus;
    compliance_score: number;
  }>;
}

export interface ComplianceRule {
  id: string;
  rule_id: string;
  rule_version: string;
  title: string;
  requirement: string;
  legal_reference: string;
  applicability_criteria: string;
  severity: string;
  penalty_clause: string;
  enabled: boolean;
}
