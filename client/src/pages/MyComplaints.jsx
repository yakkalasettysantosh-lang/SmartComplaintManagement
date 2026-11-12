import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  PlusCircle,
  FolderOpen,
  ArrowRight,
  Eye,
  Calendar,
  Building,
  RefreshCw
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const data = await complaintService.getMyComplaints(params);
      if (data.success) {
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
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
      {/* Header */}
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Complaints</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            All grievances registered by your account and their real-time resolution history
          </p>
        </div>

        <Link to="/submit" className="btn btn-primary">
          <PlusCircle size={18} />
          Submit New Complaint
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          style={{ flex: 1, minWidth: 260, position: 'relative' }}
        >
          <input
            type="text"
            placeholder="Search by ID, keyword, or department..."
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

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Status:
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

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Priority:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Reset / Refresh */}
        <button
          onClick={() => {
            setSearch('');
            setStatusFilter('All');
            setPriorityFilter('All');
          }}
          className="btn btn-secondary btn-sm"
          title="Reset Filters"
        >
          <RefreshCw size={15} />
          Reset
        </button>
      </div>

      {/* Complaints Table */}
      {loading ? (
        <Loader message="Loading complaints..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No complaints match your criteria"
          description={
            search || statusFilter !== 'All'
              ? 'Try adjusting your search terms or filter selection.'
              : "You haven't filed any complaints yet."
          }
          actionText={!search && statusFilter === 'All' ? 'Submit Complaint' : 'Clear Filters'}
          onAction={() => {
            if (!search && statusFilter === 'All') {
              window.location.href = '/submit';
            } else {
              setSearch('');
              setStatusFilter('All');
              setPriorityFilter('All');
            }
          }}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Title & Category</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Submitted Date</th>
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
                        fontSize: '0.9rem'
                      }}
                    >
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
                    <span style={{ fontSize: '0.85rem' }}>{cmp.department}</span>
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                        Not yet assigned
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
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Eye size={14} />
                      Track
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
