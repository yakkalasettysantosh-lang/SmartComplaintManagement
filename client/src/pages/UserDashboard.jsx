import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  PlusCircle,
  FolderOpen,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaintService';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserComplaints = async () => {
      try {
        setLoading(true);
        const data = await complaintService.getMyComplaints();
        if (data.success) {
          setComplaints(data.complaints || []);
        }
      } catch (err) {
        setError('Failed to fetch your complaints. Please check server connectivity.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserComplaints();
  }, []);

  // Compute live statistics from MongoDB
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  return (
    <div>
      {/* 1. Welcome Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem 2rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <span
            style={{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {user?.userType || 'Student'} &bull; {user?.department}
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
            Track your open grievances, monitor departmental action, and submit new requests.
          </p>
        </div>

        <Link to="/submit" className="btn btn-primary">
          <PlusCircle size={18} />
          Submit New Complaint
        </Link>
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

      {/* 2. Stat Cards Grid */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Complaints"
          value={total}
          icon={FileText}
          color="blue"
          subtitle="All grievances submitted by you"
        />
        <StatCard
          title="Pending Review"
          value={pending}
          icon={Clock}
          color="amber"
          subtitle="Awaiting staff assignment"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={RefreshCw}
          color="purple"
          subtitle="Actively being resolved"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="green"
          subtitle="Completed grievances"
        />
      </div>

      {/* 3. Recent Complaints Section */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Complaints</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Your latest submitted complaints and their live tracking status
            </p>
          </div>
          {complaints.length > 0 && (
            <Link
              to="/my-complaints"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              View All ({complaints.length}) <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            title="No complaints filed yet"
            description="You haven't submitted any complaints. If you are experiencing any campus or organizational issues, lodge a complaint to begin tracking."
            actionText="Submit Complaint"
            onAction={() => window.location.href = '/submit'}
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map((cmp) => (
                  <tr key={cmp._id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        {cmp.complaintId}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, display: 'block', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cmp.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cmp.category}</span>
                    </td>
                    <td>{cmp.department}</td>
                    <td>
                      <PriorityBadge priority={cmp.priority} />
                    </td>
                    <td>
                      <StatusBadge status={cmp.status} />
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(cmp.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/track/${cmp._id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        Track <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
