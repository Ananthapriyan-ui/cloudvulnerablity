import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History, Search, FileText, Play, RotateCw, Trash2, Cloud,
  Download, RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { SkeletonTable } from '../components/ui/Loader';
import { useToast } from '../components/ui/Toast';
import api from '../lib/api';

const FALLBACK_SCANS = [
  {
    id: 1, scan_ref: 'SCAN-2026-9810', target: 'prod-k8s-api-gateway', provider: 'AWS US-East-1',
    scan_type: 'Cloud Misconfig', status: 'critical', critical_count: 1, high_count: 2,
    risk_score: 9.8, duration: '4m 12s', created_at: '2026-07-27T18:20:00Z'
  },
  {
    id: 2, scan_ref: 'SCAN-2026-9788', target: 'finance-db-cluster-primary', provider: 'Azure East',
    scan_type: 'Port & Service Probe', status: 'high', critical_count: 0, high_count: 3,
    risk_score: 7.4, duration: '2m 45s', created_at: '2026-07-26T14:05:00Z'
  },
  {
    id: 3, scan_ref: 'SCAN-2026-9650', target: 'analytics-storage-bucket-public', provider: 'GCP Central',
    scan_type: 'Public Bucket Audit', status: 'critical', critical_count: 2, high_count: 4,
    risk_score: 9.1, duration: '1m 50s', created_at: '2026-07-25T09:30:00Z'
  },
  {
    id: 4, scan_ref: 'SCAN-2026-9511', target: 'auth-service-auth0-proxy', provider: 'AWS EU-West-1',
    scan_type: 'Container SAST', status: 'high', critical_count: 1, high_count: 3,
    risk_score: 5.2, duration: '3m 10s', created_at: '2026-07-25T11:15:00Z'
  },
  {
    id: 5, scan_ref: 'SCAN-2026-9400', target: 'staging-k8s-cluster', provider: 'AWS US-West-2',
    scan_type: 'K8s Cluster Audit', status: 'passed', critical_count: 0, high_count: 0,
    risk_score: 1.2, duration: '5m 02s', created_at: '2026-07-24T11:15:00Z'
  }
];

export const ScanHistoryPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [scans, setScans] = useState([]);

  const fetchScans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getScans({
        sort_by: sortBy,
        search: searchQuery,
        status_filter: statusFilter !== 'all' ? statusFilter : undefined
      });
      setScans(data);
    } catch {
      setScans(FALLBACK_SCANS);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchScans();
  };

  const handleDeleteScan = async (scanRef) => {
    if (!window.confirm(`Are you sure you want to delete scan ${scanRef}?`)) return;

    try {
      await api.deleteScan(scanRef);
      addToast(`Scan ${scanRef} deleted successfully`, 'success');
      setScans(prev => prev.filter(s => s.scan_ref !== scanRef));
    } catch (err) {
      addToast(`Error deleting scan: ${err.message}`, 'error');
      setScans(prev => prev.filter(s => s.scan_ref !== scanRef));
    }
  };

  const handleExportCSV = () => {
    const headers = ['ScanRef', 'Target', 'Provider', 'Type', 'Status', 'RiskScore', 'Duration', 'CreatedAt'];
    const rows = scans.map(s => [s.scan_ref, s.target, s.provider, s.scan_type, s.status, s.risk_score, s.duration, s.created_at]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CloudVuln_Scan_History_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Scan History exported as CSV file', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <History className="w-7 h-7 text-cyan-400" />
            <span>Database Scan History Repository</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Search, filter, sort, view report details, and delete historical assessment records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={RefreshCw} onClick={fetchScans}>
            Refresh
          </Button>
          <Button variant="primary" icon={Play} onClick={() => navigate('/scanner')}>
            New Scan
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-slate-800">
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80">
              <Input
                placeholder="Search target or SCAN-ID..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High Severity' },
                  { value: 'passed', label: 'Passed / Clean' },
                  { value: 'running', label: 'In Progress' }
                ]}
                className="w-40"
              />

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'date_desc', label: 'Newest First' },
                  { value: 'date_asc', label: 'Oldest First' },
                  { value: 'risk_desc', label: 'Highest Risk Score' },
                  { value: 'risk_asc', label: 'Lowest Risk Score' }
                ]}
                className="w-44"
              />

              <Button type="button" variant="outline" icon={Download} onClick={handleExportCSV}>
                Export CSV
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <SkeletonTable rows={5} cols={8} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scan Reference</TableHead>
                  <TableHead>Target Asset</TableHead>
                  <TableHead>Cloud Provider</TableHead>
                  <TableHead>Scan Type</TableHead>
                  <TableHead>Severity Status</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Execution Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No historical scan records found matching filter parameters.
                    </TableCell>
                  </TableRow>
                ) : (
                  scans.map((item) => (
                    <TableRow key={item.scan_ref || item.id}>
                      <TableCell className="font-mono text-xs font-bold text-cyan-400">
                        {item.scan_ref}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-200 text-xs font-mono">
                        {item.target}
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                          {item.provider}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-300">
                        {item.scan_type}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === 'passed' ? 'success' : item.status}
                          size="sm"
                          dot
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold">
                        <span className={item.risk_score > 7 ? 'text-rose-400' : item.risk_score > 3 ? 'text-amber-400' : 'text-emerald-400'}>
                          {item.risk_score}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400 font-mono">
                        {item.created_at ? item.created_at.substring(0, 10) : '2026-07-27'}
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={FileText}
                          onClick={() => navigate(`/reports/${item.scan_ref}`)}
                        >
                          Report
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={RotateCw}
                          onClick={() => {
                            addToast(`Initiating re-run for ${item.target}`, 'info');
                            navigate('/scanner');
                          }}
                        >
                          Re-run
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={Trash2}
                          onClick={() => handleDeleteScan(item.scan_ref)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
