import models
from database import SessionLocal, engine

def seed_database():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if scans already exist
        if db.query(models.Scan).first() is not None:
            return

        print("Seeding initial SecOps database records...")

        # 1. Seed Scans
        scans_data = [
            models.Scan(
                scan_ref="SCAN-2026-9810",
                target="prod-k8s-api-gateway",
                provider="AWS US-East-1",
                scan_type="Cloud Misconfig",
                status="critical",
                critical_count=1,
                high_count=2,
                medium_count=2,
                low_count=0,
                risk_score=9.8,
                duration="4m 12s"
            ),
            models.Scan(
                scan_ref="SCAN-2026-9788",
                target="finance-db-cluster-primary",
                provider="Azure East",
                scan_type="Port & Service Probe",
                status="high",
                critical_count=0,
                high_count=3,
                medium_count=4,
                low_count=5,
                risk_score=7.4,
                duration="2m 45s"
            ),
            models.Scan(
                scan_ref="SCAN-2026-9650",
                target="analytics-storage-bucket-public",
                provider="GCP Central",
                scan_type="Public Bucket Audit",
                status="critical",
                critical_count=2,
                high_count=4,
                medium_count=6,
                low_count=10,
                risk_score=9.1,
                duration="1m 50s"
            ),
            models.Scan(
                scan_ref="SCAN-2026-9511",
                target="auth-service-auth0-proxy",
                provider="AWS EU-West-1",
                scan_type="Container SAST",
                status="high",
                critical_count=1,
                high_count=3,
                medium_count=5,
                low_count=8,
                risk_score=5.2,
                duration="3m 10s"
            ),
            models.Scan(
                scan_ref="SCAN-2026-9400",
                target="staging-k8s-cluster",
                provider="AWS US-West-2",
                scan_type="K8s Cluster Audit",
                status="passed",
                critical_count=0,
                high_count=0,
                medium_count=1,
                low_count=4,
                risk_score=1.2,
                duration="5m 02s"
            )
        ]
        db.add_all(scans_data)

        # 2. Seed Vulnerabilities
        vulns_data = [
            models.Vulnerability(
                cve_id="CVE-2026-1184",
                title="Remote Code Execution in Apache Tomcat Servlet Container",
                severity="critical",
                cvss_score=9.8,
                component="prod-k8s-api-gateway (Port 8080)",
                description="Unauthenticated remote attacker can inject arbitrary bytecode via crafted HTTP header payloads.",
                remediation="Upgrade Apache Tomcat package to version >= 9.0.85 or update base container image.",
                remediation_cmd="kubectl set image deployment/api-gateway api-gateway=tomcat:9.0.85-jdk17-corretto --namespace=production",
                scan_ref="SCAN-2026-9810"
            ),
            models.Vulnerability(
                cve_id="MISCONFIG-AWS-S3-04",
                title="S3 Storage Bucket Configured with Public Read ACL",
                severity="high",
                cvss_score=8.2,
                component="arn:aws:s3:::analytics-storage-bucket-public",
                description="S3 bucket allows anonymous HTTP GET requests without authentication token verification.",
                remediation="Enable S3 Block Public Access setting and restrict access using IAM bucket policies.",
                remediation_cmd="aws s3api put-public-access-block --bucket analytics-storage-bucket-public --public-access-block-configuration 'BlockPublicAcls=true'",
                scan_ref="SCAN-2026-9650"
            ),
            models.Vulnerability(
                cve_id="CVE-2025-9831",
                title="OpenSSL Out-of-Bounds Memory Buffer Leak",
                severity="high",
                cvss_score=7.5,
                component="auth-service (OpenSSL 1.1.1t)",
                description="Buffer over-read flaw in TLS extension parser allows remote memory extraction.",
                remediation="Patch OpenSSL package to version 1.1.1w or OpenSSL 3.0.x series.",
                remediation_cmd="apt-get update && apt-get install --only-upgrade libssl-dev",
                scan_ref="SCAN-2026-9511"
            )
        ]
        db.add_all(vulns_data)

        # 3. Seed Activity Logs
        activities = [
            models.ActivityLog(
                text="Automated Port Scanner detected open port 22 on 192.168.1.104",
                type="warning",
                time_ago="2m ago"
            ),
            models.ActivityLog(
                text="Remediation patch applied to CVE-2026-8841 on auth-service",
                type="success",
                time_ago="14m ago"
            ),
            models.ActivityLog(
                text="S3 Public Bucket misconfiguration flagged on GCP Central",
                type="error",
                time_ago="1h ago"
            ),
            models.ActivityLog(
                text="Weekly Compliance Audit passed for CIS Benchmark v2.0",
                type="info",
                time_ago="3h ago"
            )
        ]
        db.add_all(activities)

        db.commit()
        print("Database successfully seeded with live SecOps data!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
