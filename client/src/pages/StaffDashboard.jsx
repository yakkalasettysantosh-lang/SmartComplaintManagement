import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  FolderOpen,
  Edit,
  Eye,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Status update modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStaffComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;

      // Staff gets complaints assigned to them or in their department
      const data = await complaintService.getComplaints(params);
      if (data.success) {
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error('Failed to load staff complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffComplaints();
  }, [statusFilter]);

  // Compute live statistics for staff
  const totalAssigned = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const openStatusModal = (cmp) => {
    setSelectedComplaint(cmp);
    setNewStatus(cmp.status);
    setStatusRemarks('');
    setResolutionSummary(cmp.resolutionSummary || '');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await complaintService.updateStatus(selectedComplaint._id, {
        status: newStatus,
        remarks: statusRemarks,
        resolutionSummary: newStatus === 'Resolved' ? resolutionSummary : ''
      });
      setStatusModalOpen(false);
      fetchStaffComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loader message="Loading assigned grievances..." />;
  }

  return (
    <div>
      {/* Header Banner */}
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
          gap: '1.25rem',
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
            Staff Desk &bull; {user?.department}
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem' }}>
            Officer Workspace: {user?.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
            Investigate reported tickets, record diagnostics, post progress notes, and close resolved grievances.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-card-grid">
        <StatCard
          title="Assigned to Department"
          value={totalAssigned}
          icon={FolderOpen}
          color="blue"
          subtitle="Active ticket queue"
        />
        <StatCard
          title="Pending Action"
          value={pending}
          icon={Clock}
          color="amber"
          subtitle="New unaddressed tickets"
        />
        <StatCard
          title="Under Investigation"
          value={inProgress}
          icon={RefreshCw}
          color="purple"
          subtitle="In-progress work"
        />
        <StatCard
          title="Resolved by Me"
          value={resolved}
          icon={CheckCircle2}
          color="green"
          subtitle="Completed tickets"
        />
      </div>

      {/* Complaints List Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Task Queue</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Complaints routed to your department
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Filter Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Queue is empty"
            description="There are currently no complaints assigned to your desk matching this filter."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title & Description</th>
                  <th>Complainant</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((cmp) => (
                  <tr key={cmp._id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        {cmp.complaintId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cmp.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {cmp.category}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{cmp.submittedBy?.name || 'User'}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {cmp.submittedBy?.department} ({cmp.submittedBy?.phone || 'No phone'})
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={cmp.priority} />
                    </td>
                    <td>
                      <StatusBadge status={cmp.status} />
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      {formatDate(cmp.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openStatusModal(cmp)}
                          className="btn btn-primary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Edit size={14} /> Update
                        </button>
                        <Link
                          to={`/track/${cmp._id}`}
                          className="btn btn-secondary btn-sm"
                          title="View Full History"
                        >
                          <Eye size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Status: ${selectedComplaint?.complaintId}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateStatus}
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving...' : 'Save Resolution / Status'}
            </button>
          </>
        }
      >
        <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Select Status <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="In Progress">In Progress (Work Ongoing)</option>
              <option value="Resolved">Resolved (Work Completed)</option>
              <option value="Rejected">Rejected (Infeasible / Non-issue)</option>
            </select>
          </div>

          {newStatus === 'Resolved' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Resolution Summary & Fix Applied <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                rows={3}
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                placeholder="Detail the root cause and the specific corrective fix applied..."
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Progress Remark / Log Note
            </label>
            <textarea
              rows={3}
              value={statusRemarks}
              onChange={(e) => setStatusRemarks(e.target.value)}
              placeholder="Add technician remarks or notes for the complainant and administration..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffDashboard;
