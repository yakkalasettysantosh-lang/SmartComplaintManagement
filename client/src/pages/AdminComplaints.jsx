import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  UserCheck,
  Edit,
  Eye,
  RefreshCw,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { complaintService } from '../services/complaintService';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const CATEGORIES = [
  'All',
  'Academic',
  'Hostel & Housing',
  'Infrastructure & Maintenance',
  'IT & Network',
  'Library',
  'Transportation',
  'Canteen & Food',
  'Administrative & Accounts',
  'Security & Safety',
  'Other'
];

const DEPARTMENTS = [
  'All',
  'IT & Network',
  'Infrastructure & Maintenance',
  'Hostel & Housing',
  'Academic Affairs',
  'Central Library',
  'Transportation Services',
  'Campus Security',
  'Central Administration',
  'Accounts & Finance'
];

export const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Form states for modals
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [newStatus, setNewStatus] = useState('In Progress');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (departmentFilter !== 'All') params.department = departmentFilter;
      if (search.trim()) params.search = search.trim();

      const data = await adminService.getAdminComplaints(params);
      if (data.success) {
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const res = await adminService.getAllUsers({ role: 'staff' });
      if (res.success) {
        setStaffUsers(res.users || []);
      }
    } catch (err) {
      console.error('Failed to load staff list:', err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchStaffMembers();
  }, [statusFilter, priorityFilter, categoryFilter, departmentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  // Assign staff handler
  const openAssignModal = (cmp) => {
    setSelectedComplaint(cmp);
    setSelectedStaffId(cmp.assignedTo?._id || '');
    setAssignRemarks('');
    setAssignModalOpen(true);
  };

  const submitAssign = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      alert('Please select a staff member.');
      return;
    }

    try {
      setActionLoading(true);
      await complaintService.assignStaff(selectedComplaint._id, {
        staffId: selectedStaffId,
        remarks: assignRemarks
      });
      setAssignModalOpen(false);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Status update handler
  const openStatusModal = (cmp) => {
    setSelectedComplaint(cmp);
    setNewStatus(cmp.status);
    setStatusRemarks('');
    setResolutionSummary(cmp.resolutionSummary || '');
    setStatusModalOpen(true);
  };

  const submitStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await complaintService.updateStatus(selectedComplaint._id, {
        status: newStatus,
        remarks: statusRemarks,
        resolutionSummary: newStatus === 'Resolved' ? resolutionSummary : ''
      });
      setStatusModalOpen(false);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed.');
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

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Complaint Management & Dispatch</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Assign grievances to specialized staff, alter lifecycle statuses, and audit complete records
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Search by ID, title, keyword, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)'
            }}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>Department: {d}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setPriorityFilter('All');
              setCategoryFilter('All');
              setDepartmentFilter('All');
            }}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Complaints Table */}
      {loading ? (
        <Loader message="Loading complaints catalog..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No complaints matched current filters"
          description="Adjust your search query or reset the filter dropdowns to see more complaints."
          actionText="Reset All Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('All');
            setPriorityFilter('All');
            setCategoryFilter('All');
            setDepartmentFilter('All');
          }}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Title</th>
                <th>Category / Dept</th>
                <th>Complainant</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((cmp) => (
                <tr key={cmp._id}>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: 'var(--primary)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {cmp.complaintId}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cmp.title}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cmp.category}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{cmp.department}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cmp.submittedBy?.name || 'User'}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{cmp.submittedBy?.department}</div>
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
                      <button
                        onClick={() => openAssignModal(cmp)}
                        style={{
                          fontSize: '0.75rem',
                          color: '#dc2626',
                          backgroundColor: '#fee2e2',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700
                        }}
                      >
                        + Assign Now
                      </button>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    {formatDate(cmp.createdAt)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => openAssignModal(cmp)}
                        className="btn btn-secondary btn-sm"
                        title="Assign to Staff"
                      >
                        <UserCheck size={14} />
                      </button>
                      <button
                        onClick={() => openStatusModal(cmp)}
                        className="btn btn-secondary btn-sm"
                        title="Change Status"
                      >
                        <Edit size={14} />
                      </button>
                      <Link
                        to={`/track/${cmp._id}`}
                        className="btn btn-secondary btn-sm"
                        title="Audit & Tracking"
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

      {/* Modal 1: Assign Complaint to Staff */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Staff: ${selectedComplaint?.complaintId}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitAssign}
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
            >
              {actionLoading ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </>
        }
      >
        <form onSubmit={submitAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Complaint Target Department
            </label>
            <input type="text" value={selectedComplaint?.department || ''} readOnly disabled style={{ backgroundColor: '#f1f5f9' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Select Department Staff Member <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              required
            >
              <option value="">-- Choose Staff Member --</option>
              {staffUsers.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name} — ({st.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Assignment Remark / Instruction
            </label>
            <textarea
              rows={3}
              value={assignRemarks}
              onChange={(e) => setAssignRemarks(e.target.value)}
              placeholder="Provide specific instructions or priority dispatch notes for the staff..."
            />
          </div>
        </form>
      </Modal>

      {/* Modal 2: Change Status & Remarks */}
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
              onClick={submitStatusUpdate}
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating...' : 'Save Status Update'}
            </button>
          </>
        }
      >
        <form onSubmit={submitStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Lifecycle Status <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {newStatus === 'Resolved' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Resolution Summary <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                rows={3}
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                placeholder="Explain the corrective work performed to resolve the issue..."
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Progress Remark / Audit Note
            </label>
            <textarea
              rows={3}
              value={statusRemarks}
              onChange={(e) => setStatusRemarks(e.target.value)}
              placeholder="Add audit remark visible to user and staff..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminComplaints;
