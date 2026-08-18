# CloudVuln - Technical System Architecture & Documentation

## 1. Executive Architecture Summary

**CloudVuln** is an enterprise-grade cloud security engine engineered for continuous security assessment, static code analysis, cloud misconfiguration detection, and compliance auditing.

The platform follows a decoupled modern web application architecture:
- **Frontend Layer**: Single Page Application (SPA) built with React 18, Vite, Tailwind CSS, Lucide Icons, and Recharts. Deployed on **Vercel** edge infrastructure.
- **Backend Service Layer**: RESTful API engine powered by **FastAPI** (Python 3.10+), executed via **Gunicorn** process supervisor with **Uvicorn** worker processes. Deployed on **Render** cloud compute.
- **Database Engine**: Production-tuned **SQLite** in Write-Ahead Logging (WAL) mode with persistent disk storage (`/var/data/cloudvuln.db`), providing zero-downtime concurrent reader/writer operations and automated online backups.

---

## 2. System Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│       React 18 SPA + Recharts + Tailwind CSS (Vercel)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Edge Proxy                         │
│         Rewrites /api/* ──► Render Backend Service          │
└──────────────────────────────┬──────────────────────────────┘
                               │ TLS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Render Cloud Web Service                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                  Gunicorn Supervisor                    │ │
│ │  ┌───────────────────┐        ┌───────────────────┐    │ │
│ │  │ Uvicorn Worker 1  │        │ Uvicorn Worker 2  │    │ │
│ │  └─────────┬─────────┘        └─────────┬─────────┘    │ │
│ └────────────┼────────────────────────────┼──────────────┘ │
│              │                            │                │
│              ▼                            ▼                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    FastAPI Engine                       │ │
│ │ ┌───────────────┐ ┌───────────────┐ ┌─────────────────┐ │ │
│ │ │ Auth & JWT    │ │ Vulnerability │ │ Report Generator│ │ │
│ │ │ Security      │ │ Analyzer      │ │ (ReportLab PDF) │ │ │
│ │ └───────────────┘ └───────────────┘ └─────────────────┘ │ │
│ └────────────────────────────┬────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────┘
                               │ SQLAlchemy ORM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Persistent SQLite Database                     │
│          Mount Path: /var/data/cloudvuln.db (WAL Mode)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Security Architecture & Threat Model

### 3.1 Authentication & Token Lifecycle
- **Password Hashing**: Passlib with `bcrypt` (work factor 12) for secure password hashing and storage.
- **Access Tokens**: Short-lived JSON Web Tokens (`HS256`, 60-minute expiration) containing user identity (`sub`) and role scope.
- **Refresh Tokens**: Long-lived tokens (`HS256`, 7-day expiration) supporting sliding session refresh.

### 3.2 Network & Middleware Security
- **Rate Limiting**: Sliding-window in-memory rate limiter enforcing a limit of **100 requests / minute per IP address**.
- **CORS Protection**: Explicit origin whitelist (`ALLOWED_ORIGINS`) restricting unauthorized cross-site requests.
- **Security Headers**: Standard HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Content-Security-Policy`).

### 3.3 Production Error Obscuration
In production mode (`APP_ENV=production`), global exception handling intercepts uncaught 500 errors, logging detailed stack traces to internal loggers while serving sanitized, generic error responses to clients to prevent information disclosure.

---

## 4. Vulnerability Detection Engine (Analyzer)

The scanner engine (`backend/analyzer.py`) processes three distinct scanning target vectors:

1. **Cloud Infrastructure Scan Vector**:
   - AWS S3 Public Read/Write ACLs
   - Open Security Group ingress (`0.0.0.0/0` on ports 22, 3389, 27017)
   - IAM Root Account Active API Keys
   - Unencrypted EBS & RDS Storage Volumes

2. **Container Security Vector**:
   - Root execution privilege in Dockerfiles (`USER root`)
   - Hardcoded Secrets / Tokens in Environment Variables
   - Outdated base image vulnerabilities
   - Unrestricted Container Resource Limits (CPU/RAM exhaustion)

3. **Infrastructure as Code (IaC) Vector**:
   - Broad IAM statement wildcard privileges (`Action: "*"`, `Resource: "*"`)
   - Unencrypted S3 Terraform State Backend Storage
   - Kubernetes Privileged Pod Security Contexts (`privileged: true`)

---

## 5. Database Schema & Persistence

SQLite WAL (Write-Ahead Logging) mode allows concurrent readers to query the database while a writer transaction is committed.

### Primary Database Models (`backend/models.py`)

- **User**: ID, email, hashed_password, full_name, role, is_active, created_at.
- **Scan**: ID, scan_ref, target, provider, scan_type, status, risk_score, critical_count, high_count, medium_count, low_count, user_id, created_at.
- **Vulnerability**: ID, scan_id, title, cve_id, severity, score, component, description, remediation, created_at.

---

## 6. Backup & Disaster Recovery

The system includes an online atomic SQLite backup script (`backend/backup_db.py`) utilizing Python's native `sqlite3.connect().backup()` API. This creates continuous hot backups without locking database tables or interrupting active users. Automated cleanup retains the 7 most recent backups.
