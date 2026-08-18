# CloudVuln - User Manual & Operational Guide

Welcome to **CloudVuln**, the cloud infrastructure and security vulnerability management platform. This manual provides a complete walkthrough of all platform capabilities.

---

## 🔐 1. User Registration & Authentication

### 1.1 Account Registration
1. Navigate to the CloudVuln application URL.
2. Click **Register Account** on the login card.
3. Provide your Full Name, Email Address, and a secure password.
4. Select your role scope (**Cloud Architect**, **DevSecOps Engineer**, **Compliance Auditor**, or **Administrator**).
5. Click **Create Account**.

### 1.2 Authentication & Session Management
- Upon login, CloudVuln issues an encrypted **JWT Access Token** valid for 60 minutes and a **Refresh Token**.
- Session authentication is maintained automatically in background headers without interrupting workflow.

---

## 📊 2. Dashboard Overview

The Security Dashboard serves as your central command center:

- **Overall Risk Score**: Dynamic score (0.0 to 10.0) calculated from active vulnerability findings.
- **Scan Metrics**: Total Scans, Active Vulnerabilities, Critical Findings, and Resolved Issues.
- **Severity Breakdown Chart**: Visual distribution of Critical, High, Medium, and Low severity findings.
- **Recent Scans List**: Quick access to recent audit execution status and target environments.

---

## 🚀 3. Initiating Security Scans

Navigate to the **Scanner** page (`/scan`) to launch a new vulnerability audit:

### 3.1 Selecting Scan Target Type

1. **Cloud Infrastructure Scan**:
   - **Target**: AWS Account ID / GCP Project ID / Azure Subscription ID
   - **Provider**: AWS, Azure, or GCP
   - **Scope**: IAM Policies, S3 Buckets, Security Groups, EBS Encryption

2. **Container Security Scan**:
   - **Target**: Docker Image Tag (e.g. `gcr.io/prod-app:v2.4.1`)
   - **Scope**: Base image vulnerabilities, root user execution, exposed secrets

3. **Infrastructure as Code (IaC) Scan**:
   - **Target**: Terraform Repo / Kubernetes Manifest File Path
   - **Scope**: Hardcoded credentials, wildcard IAM permissions, unencrypted state backends

### 3.2 Executing the Scan
1. Select the Target Vector.
2. Enter the target resource identifier.
3. Click **Start Security Audit**.
4. The scan progress bar will update in real time. Once completed, you will be redirected to the Scan Result detail page.

---

## 🔍 4. Vulnerability Management & Findings

Navigate to **Scan History** (`/scans`) to review past security audits:

1. **Filtering & Search**:
   - Search by CVE ID, Title, Component, or Target.
   - Filter by Severity level (**Critical**, **High**, **Medium**, **Low**).

2. **Vulnerability Detail View**:
   - **CVE Identifier**: Official CVE reference or CloudVuln rule ID.
   - **CVSS Score**: Numerical severity score.
   - **Component**: Affected AWS service, Docker layer, or IaC file line.
   - **Description**: Technical explanation of security impact.
   - **Remediation Guide**: Step-by-step resolution instructions and code remediation samples.

---

## 📄 5. Exporting Executive Reports

CloudVuln generates PDF and HTML executive audit reports for compliance teams:

1. Open any completed scan detail page.
2. Click **Export Report** in the top right header.
3. Select **PDF Executive Audit Report** or **Interactive HTML Report**.
4. The report will compile instantly and download to your local machine.

---

## 🛠️ 6. Troubleshooting & Support

| Issue | Potential Cause | Solution |
| :--- | :--- | :--- |
| `Session Expired` error | Refresh token expired after 7 days | Log out and log back in to refresh authorization |
| Scan stays in `pending` status | Backend worker queue busy | Wait 30 seconds or check API health status |
| Download report button fails | ReportLab library generation error | Verify scan contains valid finding records |
