# Changelog — Parakh AI

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - Prototype Release
### Added
- Complete monorepo architecture: React/TypeScript frontend, Django/DRF backend, PostgreSQL database.
- 6-Stage inspection processing pipeline with interactive animated UI.
- Deterministic, explainable Legal Metrology Rule Engine based on PCR 2011 provisions.
- Interchangeable OCR provider abstraction with deterministic demo mode and real vision pipeline.
- Interactive Product Evidence viewer with field-level bounding box overlays and highlight selector.
- Full inspection history, Recharts 7-day trend chart, and geo-tagged Kanpur inspection cluster map.
- Inspector Profile credentials, duty tracking, and system diagnostics view.
- Implementing Django and REST API automated tests with pytest.
- Vitest frontend test suite and successful production TypeScript build.
- Full Docker Compose stack with PostgreSQL health checks and Nginx reverse proxy.
- Complete OpenAPI 3.0 documentation via drf-spectacular.