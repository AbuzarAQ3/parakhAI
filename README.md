# ParakhAI: AI-Powered Legal Metrology Compliance System

*Smart India Hackathon (SIH) 2026 | Problem Statement ID: SIH26034*

[![SIH 2026](https://img.shields.io/badge/SIH-2026-blue)](https://sih.gov.in) [![Python](https://img.shields.io/badge/Python-3.10+-yellow)](https://www.python.org/) [![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/) [![Django](https://img.shields.io/badge/Django-4.2-green)](https://www.djangoproject.com/)

---

## About the Project
*ParakhAI* is an intelligent, AI-driven software ecosystem designed to automate the inspection and compliance verification of packaged commodities under the *Legal Metrology (Packaged Commodities) Rules, 2011*. 

By combining advanced OCR, Computer Vision, and a deterministic rule engine, Parakh empowers Legal Metrology Inspectors, Manufacturers, and Regulatory Authorities to detect label violations, geo-tag fraud, and generate court-admissible digital reports in seconds—shifting from a 10-minute manual process to a 15-second automated workflow.

---

## Problem Statement
*SIH26034:* Software System to check compliance of Packaged Commodities under Legal Metrology (Packaged Commodities) Rules, 2011 by scanning products, images, and labels.

---

## Key Features

### Core AI & Compliance
*   *Intelligent Label Analysis (ParakhAI):* Uses OCR + Custom AI to understand product labels, converting unstructured package images into structured data.
*   *Rule-Based Compliance Engine:* Automatically applies Legal Metrology rules, amendments, and category-specific requirements to detect missing or incorrect declarations.
*   *Hybrid OCR Engine:* Combines *Tesseract 5.0* (for offline/edge processing) and *Google Vision API* (for complex/cloud processing) to achieve 95%+ text extraction accuracy.

### Inspector-Centric Workflow
*   *Seamless Flow:* Capture  Verify ➔ Review ➔ Report from a single unified platform.
*   *Geo-Tagging of Violations:* Captures exact GPS coordinates alongside photographic evidence to identify geographic fraud hotspots.
*   *Offline-First Architecture:* Inspectors can store evidence locally in remote areas and auto-sync when connectivity returns.

### Security & Advanced Features
*   *Blockchain Audit Trail:* Generates tamper-proof, hash-locked PDF reports (SHA-256) for court-admissible evidence.
*   *Role-Based Access Control (RBAC):* Tailored dashboards for Inspectors, Manufacturers, Importers, and Admins.
*   *Smart Route Planner:* Analytics dashboard showing Green/Red pins for regional compliance trends.
*   *Manufacturer Self-Audit Mode:* Allows FMCG companies to pre-validate labels before mass production.

---

## Technology Stack

| Category | Technologies Used |
| :--- | :--- |
| *Frontend* | React.js, Tailwind CSS |
| *Core Backend* | Django, Django REST Framework (DRF) |
| *AI & ML* | Python, PyTorch, Tesseract 5.0, Google Vision API, YOLOv8 |
| *Databases* | PostgreSQL (Cloud) |
| *Task Queue* | Redis, Celery (For async AI processing) |
| *Cloud & DevOps* | AWS S3 (Object Storage), Docker, GitHub Actions |

---

## System Architecture & Workflow

Parakh utilizes a *Microservices Architecture* to ensure high scalability and zero UI lag during heavy AI processing:

1.  *Data Capture:* Inspector uploads an image.
2.  *Core Routing:* Django backend authenticates the user and stores the raw image in AWS S3.
3.  *Async Processing:* The task is pushed to a *Redis/Celery* queue.
4.  *Decision Engine:* Extracted data is validated against the Legal Metrology Rules 2011 database.
5.  *Storage & Delivery:* Results are saved to PostgreSQL, and a hash-locked PDF report is generated and pushed to the frontend.

---

##  Installation & Local Setup

### Prerequisites
*   Node.js (v16+)
*   Python (v3.10+)
*   PostgreSQL

### 1. Clone the Repository

'''bash

git clone https://github.com/abuzaraq3/parakhAI.git

cd parakhAI
'''

### 2. Backend Setup (Django)

bash

cd backend

python -m venv venv

linux: source venv/bin/activate | Windows: venv\Scripts\activate

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate

python manage.py runserver
'''


### 3. Frontend Setup (React/Next.js)

'''bash

cd frontend

npm install

npm run dev
'''

---

## Impact & Benefits

*   *Social:* Protects 1.4 billion Indians from underweight, overpriced, and expired goods. Eliminates "short-weighing" fraud.
*   *Economic:* Reduces inspection costs. Prevents annual consumer revenue leakage.
*   *Regulatory:* Increases inspection capacity by exponentially. Ensures unbiased, consistent enforcement.
*   *Environmental:* *100% paperless workflow*, eliminating millions of physical challans and manual logbooks annually.

---

## Research & References

1.  *Legal Metrology Act, 2009* & *Packaged Commodities Rules, 2011* - Govt. of India
2.  *Department of Consumer Affairs Annual Report 2024-25*
3.  Mittal, R., & Garg, A. (2020). "Text extraction using OCR: A Systematic Review." IEEE ICIRCA. *DOI:* 10.1109/ICIRCA48905.2020.9183326
4.  Tejaswi, L.S., et al. (2024). "Automating Nutritional Claim Verification: The Role of OCR and Machine Learning." IEEE. *DOI:* 10.1109/ICICNIS64247.2024.10823177
5.  Ahmed, I., et al. (2024). "AI-Enhanced Visual Inspection Systems for Robust Detection of Product Packaging Defects." IEEE UEMCON. *DOI:* 10.1109/UEMCON62879.2024.10754674

---

## Team Pramaan

| Name | Role | GitHub | LinkedIn |
| :--- | :--- | :--- | :--- |
| *[Ali]* | Team Lead / ML Engineer | [@Alishad01](https://github.com/Alishad01) | [@username](#) |
| *[Shahabuzar]* | Backend Lead | [@AbuzarAQ3](https://github.com/AbuzarAQ3) | [@username](#) |
| *[Owais]* | Frontend Lead | [@Owaisraza-02qalad](https://github.com/anshikatiwari064-droid) | [@username](#) |
| *[Aarna]* | Frontend Developer | [@aarnatiwariwhs-blip](https://github.com/aarnatiwariwhs-blip) | [@username](#) |
| *[Mansi]* | Backend Developer | [@mansi-sharma123](https://github.com/mansi-sharma123) | [@username](#) |
| *[Anshika]* | R&D / AI Researcher | [@anshikatiwari064-droid](https://github.com/anshikatiwari064-droid) | [@username](#) |

---