import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Share2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ShieldCheck,
  ArrowLeft,
  Server,
  Lock,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { PageSkeleton } from '../components/ui/Loader';

export const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [expandedId, setExpandedId] = useState('CVE-2026-1184');
  const [copiedId, setCopiedId] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('cloudvuln_token');
        const res = await fetch(`/api/reports/${id || 'SCAN-2026-9810'}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      } catch (e) {
        console.warn('Failed to fetch report from live API', e);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const reportMeta = {
    scanId: id || 'SCAN-2026-9810',
    target: reportData?.target || 'api.production.cloudvuln.io',
    cloudProvider: reportData?.cloud_provider || 'AWS US-East-1 (Account: 9482-1049-2041)',
    executedAt: reportData?.executed_at || '2026-07-27 18:20 UTC',
    duration: '4m 12s',
    totalIssues: 5,
    criticalCount: reportData?.critical_count || 1,
    highCount: reportData?.high_count || 2,
    mediumCount: reportData?.medium_count || 2,
    overallScore: reportData?.risk_score || 9.8,
    securityScore: 50,
    riskLevel: reportData?.status?.toUpperCase() || 'CRITICAL'
  };

  const executiveSummary = `Automated security posture analysis completed for ${reportMeta.target}. The assessment evaluated SSL/TLS configurations, HTTP security header directives, public CVE mappings from NVD API, OWASP Top 10 categories, and domain WHOIS parameters. High and Critical severity findings require immediate remediation.`;

  const whoisSummary = {
    registrar: 'MarkMonitor Inc. (IANA ID 292)',
    creationDate: '2021-04-15',
    expiryDate: '2028-04-15',
    nameServers: ['ns1.markmonitor.com', 'ns2.markmonitor.com'],
    domainStatus: ['clientTransferProhibited', 'active']
  };

  const owaspFindings = [
    {
      id: 'A01:2021',
      category: 'Broken Access Control',
      status: 'Passed',
      severity: 'Passed',
      title: 'Transport Layer Enforces Encrypted Endpoint Boundary',
      recommendation: 'Enforce RBAC controls on internal server routes.'
    },
    {
      id: 'A02:2021',
      category: 'Cryptographic Failures',
      status: 'Failed',
      severity: 'Medium',
      title: 'Missing Strict-Transport-Security (HSTS) Header',
      recommendation: 'Configure HSTS max-age=31536000 directive.'
    },
    {
      id: 'A03:2021',
      category: 'Injection',
      status: 'Warning',
      severity: 'High',
      title: 'Content Security Policy (CSP) Unconfigured',
      recommendation: 'Deploy script-src CSP rules.'
    },
    {
      id: 'A04:2021',
      category: 'Insecure Design',
      status: 'Unable to Verify',
      severity: 'Unable to Verify',
      title: 'Business Logic Design Verification',
      recommendation: 'Perform formal threat modeling review.'
    },
    {
      id: 'A05:2021',
      category: 'Security Misconfiguration',
      status: 'Failed',
      severity: 'Medium',
      title: 'Server Banner Information Disclosure',
      recommendation: 'Suppress Server & X-Powered-By HTTP headers.'
    },
    {
      id: 'A06:2021',
      category: 'Vulnerable & Outdated Components',
      status: 'Failed',
      severity: 'High',
      title: 'Public CVE Matches Discovered in Component Stack',
      recommendation: 'Upgrade software stack to latest release.'
    }
  ];

  const sslSummary = {
    cert_status: 'Valid',
    issuer: 'DigiCert Global TLS RSA SHA256 CA',
    expiry_date: '2026-11-28',
    tls_version: 'TLSv1.3',
    days_left: 124,
    recommendations: [
      'TLS 1.3 Cipher Suite verified (ECDHE-RSA-AES128-GCM-SHA256).',
      'Ensure HTTP Strict Transport Security (HSTS) preload header is attached.'
    ]
  };

  const vulnerabilities = [
    {
      id: 'CVE-2026-1184',
      title: 'Remote Code Execution in Apache Tomcat Servlet Container',
      severity: 'critical',
      cvss: 9.8,
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      component: 'prod-k8s-api-gateway (Port 8080)',
      description: 'An unauthenticated remote attacker can inject arbitrary bytecode via crafted HTTP header payloads due to improper input sanitization in Tomcat 9.0.41.',
      remediation: 'Upgrade Apache Tomcat package to version >= 9.0.85 or update base container image in Dockerfile.',
      remediationCmd: 'kubectl set image deployment/api-gateway api-gateway=tomcat:9.0.85-jdk17-corretto --namespace=production'
    },
    {
      id: 'MISCONFIG-AWS-S3-04',
      title: 'S3 Storage Bucket Configured with Public Read ACL',
      severity: 'high',
      cvss: 8.2,
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      component: 'arn:aws:s3:::analytics-storage-bucket-public',
      description: 'The S3 bucket contains customer telemetry logs but allows anonymous HTTP GET requests without authentication token verification.',
      remediation: 'Enable S3 Block Public Access setting and restrict access using IAM bucket policies.',
      remediationCmd: 'aws s3api put-public-access-block --bucket analytics-storage-bucket-public --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"'
    },
    {
      id: 'CVE-2025-9831',
      title: 'OpenSSL Out-of-Bounds Memory Buffer Leak',
      severity: 'high',
      cvss: 7.5,
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      component: 'auth-service (OpenSSL 1.1.1t)',
      description: 'Buffer over-read flaw in TLS extension parser allows remote attackers to obtain sensitive memory contents.',
      remediation: 'Patch OpenSSL package to version 1.1.1w or OpenSSL 3.0.x series.',
      remediationCmd: 'apt-get update && apt-get install --only-upgrade libssl-dev'
    },
    {
      id: 'WARN-TLS-1.0',
      title: 'Deprecated TLS 1.0 & TLS 1.1 Protocol Enabled',
      severity: 'medium',
      cvss: 5.3,
      vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:P/I:N/A:N',
      component: 'ingress-loadbalancer (ALB)',
      description: 'Legacy TLS versions vulnerable to POODLE and BEAST protocol downgrade attacks are currently enabled on port 443 listener.',
      remediation: 'Enforce minimum TLS 1.2 in ALB Security Policy (ELBSecurityPolicy-TLS13-1-2-2021-06).',
      remediationCmd: 'aws elbv2 modify-listener --listener-arn <LISTENER_ARN> --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06'
    }
  ];

  const handleCopy = (text, itemKey) => {
    navigator.clipboard.writeText(text);
    setCopiedId(itemKey);
    addToast('Remediation command copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (format = 'pdf') => {
    setIsExportModalOpen(false);
    addToast(`Generating and downloading ${format.toUpperCase()} report...`, 'info');
    try {
      const token = localStorage.getItem('cloudvuln_token');
      const res = await fetch(`/api/reports/${reportMeta.scanId}/download?format=${format}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CloudVuln_Report_${reportMeta.scanId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      addToast(`${format.toUpperCase()} report downloaded successfully!`, 'success');
    } catch (err) {
      console.error(err);
      addToast(`Failed to download ${format.toUpperCase()} report`, 'error');
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Back button & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scan History</span>
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={Share2}
            onClick={() => addToast('Shareable encrypted report link created', 'info')}
          >
            Share Report
          </Button>
          <Button
            variant="primary"
            icon={Download}
            onClick={() => setIsExportModalOpen(true)}
          >
            Export Report (PDF / HTML)
          </Button>
        </div>
      </div>

      {/* Report Summary Header Card */}
      <Card className="border-cyan-500/30">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="critical" size="sm" dot>{reportMeta.riskLevel} RISK AUDIT</Badge>
                <span className="text-xs font-mono text-slate-400">ID: {reportMeta.scanId}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-100">{reportMeta.target}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>{reportMeta.cloudProvider}</span>
                <span className="text-slate-600">•</span>
                <span>Scanned on {reportMeta.executedAt} ({reportMeta.duration})</span>
              </p>
            </div>

            {/* Score Gauge Box */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
              <div className="text-center">
                <span className="block text-[10px] font-mono uppercase text-slate-400">Security Score</span>
                <span className="text-3xl font-black text-emerald-400">{reportMeta.securityScore}/100</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="critical" size="sm">{reportMeta.criticalCount} Critical</Badge>
                  <Badge variant="high" size="sm">{reportMeta.highCount} High</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="medium" size="sm">{reportMeta.mediumCount} Medium</Badge>
                  <Badge variant="info" size="sm">0 Low</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary Box */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Executive Summary & Posture Evaluation
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{executiveSummary}</p>
          </div>

          {/* OWASP Top 10 Assessment Findings Card */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> OWASP Top 10 Security Assessment Breakdown
              </span>
              <Badge variant="cyan" size="sm">OWASP 2021 Compliant</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800 bg-slate-900">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Severity</th>
                    <th className="p-2.5">Finding</th>
                    <th className="p-2.5">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {owaspFindings.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-bold text-cyan-400">{f.id}</td>
                      <td className="p-2.5 text-slate-200">{f.category}</td>
                      <td className="p-2.5">
                        <Badge variant={f.status === 'Passed' ? 'success' : f.status === 'Failed' ? 'critical' : f.status === 'Warning' ? 'warning' : 'ghost'} size="sm">
                          {f.status}
                        </Badge>
                      </td>
                      <td className="p-2.5 text-slate-300">{f.severity}</td>
                      <td className="p-2.5 text-slate-300 font-sans">{f.title}</td>
                      <td className="p-2.5 text-slate-400 font-sans">{f.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Module Summaries: WHOIS & SSL/TLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WHOIS Summary Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> WHOIS Domain Registration
                </span>
                <Badge variant="info" size="sm">ACTIVE</Badge>
              </div>
              <div className="space-y-1 text-slate-300">
                <p>Registrar: <span className="text-slate-100 font-semibold">{whoisSummary.registrar}</span></p>
                <p>Created: <span className="font-mono text-slate-200">{whoisSummary.creationDate}</span> | Expires: <span className="font-mono text-slate-200">{whoisSummary.expiryDate}</span></p>
                <p className="text-[11px] font-mono text-cyan-300">NS: {whoisSummary.nameServers.join(', ')}</p>
              </div>
            </div>

            {/* SSL/TLS Summary */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> SSL / TLS Configuration Audit
                </span>
                <Badge variant="success" size="sm">TLS 1.3</Badge>
              </div>
              <p className="text-xs text-slate-300">
                Issuer: <span className="text-slate-100 font-semibold">{sslSummary.issuer}</span> ({sslSummary.days_left} days remaining)
              </p>
            </div>
          </div>

          {/* Vulnerability List Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Detected Security Vulnerabilities & Remediations ({vulnerabilities.length})</span>
            </h3>

            <div className="space-y-3">
              {vulnerabilities.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-all ${
                      isExpanded
                        ? 'bg-slate-900/90 border-cyan-500/40 shadow-[0_0_20px_rgba(0,243,255,0.08)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Collapsible Header Row */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Badge variant={item.severity} size="sm">
                          CVSS {item.cvss}
                        </Badge>
                        <span className="font-mono text-xs font-bold text-cyan-400 shrink-0">
                          {item.id}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-200 truncate">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden md:inline text-xs font-mono text-slate-400">
                          {item.component}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded Detail Body */}
                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          <div>
                            <span className="font-mono text-slate-400 uppercase text-[10px]">Impact Summary</span>
                            <p className="text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                          </div>
                          <div>
                            <span className="font-mono text-slate-400 uppercase text-[10px]">CVSS Vector</span>
                            <p className="font-mono text-slate-300 mt-1 bg-slate-950 p-2 rounded border border-slate-800">
                              {item.vector}
                            </p>
                          </div>
                        </div>

                        {/* Remediation Guide */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" /> Recommended SecOps Remediation
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(item.remediationCmd, item.id);
                              }}
                              className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono text-[11px]"
                            >
                              {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedId === item.id ? 'Copied!' : 'Copy Fix Command'}</span>
                            </button>
                          </div>
                          <p className="text-slate-300">{item.remediation}</p>
                          <div className="p-2.5 rounded-lg bg-black font-mono text-cyan-300 text-[11px] overflow-x-auto border border-cyan-500/20">
                            $ {item.remediationCmd}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Report Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Security Audit Report"
        subtitle="Choose export file format and compliance standard summary."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsExportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={Download} onClick={() => handleDownload('pdf')}>
              Download PDF Report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-xs">
            Export full technical analysis including executive summary, WHOIS info, OWASP Top 10 findings, SSL/TLS audit, HTTP security header checklist, NVD CVE mappings, and CLI remediation commands for report <span className="font-mono text-cyan-400">{reportMeta.scanId}</span>.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownload('pdf')}
              className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-semibold cursor-pointer flex items-center gap-2 hover:border-cyan-400 transition-colors text-xs text-left"
            >
              <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>📄 Executive PDF Report</span>
            </button>

            <button
              onClick={() => handleDownload('html')}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-500/40 cursor-pointer flex items-center gap-2 transition-colors text-xs text-left"
            >
              <FileText className="w-5 h-5 text-amber-400 shrink-0" />
              <span>🌐 Standalone HTML Report</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
