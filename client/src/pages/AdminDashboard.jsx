import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  ArrowRight,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../services/adminService';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import SimplePieChart from '../components/charts/SimplePieChart';
import Loader from '../components/common/Loader';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      setError('Failed to load administrative analytics. Please ensure database connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loader message="Generating institutional analytics from MongoDB..." />;
  }

  const { users = {}, complaints = {}, categories = [], priorities = {}, departments = [], recentComplaints = [] } =
    stats || {};

  // Priority segments for pie chart
  const prioritySegments = [
    { label: 'High Priority', value: priorities.High || 0, color: '#dc2626' },
    { label: 'Medium Priority', value: priorities.Medium || 0, color: '#d97706' },
    { label: 'Low Priority', value: priorities.Low || 0, color: '#64748b' }
  ];

  // Status segments for status distribution
  const statusSegments = [
    { label: 'Pending', value: complaints.pending || 0, color: '#d97706' },
    { label: 'In Progress', value: complaints.inProgress || 0, color: '#2563eb' },
    { label: 'Resolved', value: complaints.resolved || 0, color: '#059669' },
    { label: 'Rejected', value: complaints.rejected || 0, color: '#dc2626' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Institutional Command Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Live complaint metrics, departmental resolution rates, and systemic audit logs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/complaints" className="btn btn-primary btn-sm">
            Manage All Complaints
          </Link>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            Manage Users
          </Link>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: 'var(--status-rejected-bg)',
            border: '1px solid var(--status-rejected-border)',
            color: 'var(--status-rejected)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Summary Stat Cards Grid */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Users"
          value={users.total || 0}
          icon={Users}
          color="slate"
          subtitle={`${users.students || 0} Students · ${users.staff || 0} Staff`}
        />
        <StatCard
          title="Total Complaints"
          value={complaints.total || 0}
          icon={FileText}
          color="blue"
          subtitle={`Resolution: ${complaints.resolutionRate || 0}%`}
        />
        <StatCard
          title="Pending Complaints"
          value={complaints.pending || 0}
          icon={Clock}
          color="amber"
          subtitle="Awaiting staff dispatch"
        />
        <StatCard
          title="In Progress"
          value={complaints.inProgress || 0}
          icon={RefreshCw}
          color="purple"
          subtitle="Under staff investigation"
        />
        <StatCard
          title="Resolved"
          value={complaints.resolved || 0}
          icon={CheckCircle2}
          color="green"
          subtitle="Closed successfully"
        />
        <StatCard
          title="Rejected"
          value={complaints.rejected || 0}
          icon={XCircle}
          color="red"
          subtitle="Non-actionable / Policy"
        />
      </div>

      {/* 2. Graphical Analytics Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Category Breakdown Bar Chart */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="var(--primary)" />
              Complaints by Category
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top categories</span>
          </div>

          <SimpleBarChart
            data={categories.slice(0, 6)}
            labelKey="category"
            valueKey="count"
            color="var(--primary)"
          />
        </div>

        {/* Priority & Status Breakdown */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieIcon size={18} color="#d97706" />
              Priority & Status Distribution
            </h3>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.785rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Urgency Levels
            </span>
            <div style={{ marginTop: '0.5rem' }}>
              <SimplePieChart segments={prioritySegments} />
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.785rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Current Status Pipeline
            </span>
            <div style={{ marginTop: '0.5rem' }}>
              <SimplePieChart segments={statusSegments} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Complaints Table */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recently Filed Complaints</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Real-time feed of newly registered grievances across all departments
            </p>
          </div>
          <Link
            to="/admin/complaints"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            Manage All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Complainant</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map((cmp) => (
                <tr key={cmp._id}>
                  <td>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                      {cmp.complaintId}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cmp.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cmp.category}</div>
                  </td>
                  <td>{cmp.department}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{cmp.submittedBy?.name || 'User'}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {cmp.submittedBy?.userType || 'Student'}
                    </div>
                  </td>
                  <td>
                    <PriorityBadge priority={cmp.priority} />
                  </td>
                  <td>
                    <StatusBadge status={cmp.status} />
                  </td>
                  <td>
                    {cmp.assignedTo ? (
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {cmp.assignedTo.name}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    {formatDate(cmp.createdAt)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/track/${cmp._id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      Audit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
