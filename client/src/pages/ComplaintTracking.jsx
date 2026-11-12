import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  User,
  Calendar,
  Paperclip,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Timeline from '../components/common/Timeline';
import Loader from '../components/common/Loader';

export const ComplaintTracking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRemark, setNewRemark] = useState('');
  const [postingRemark, setPostingRemark] = useState(false);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getComplaintById(id);
      if (res.success) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load complaint details. Please check the ID or your access permissions.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;

    try {
      setPostingRemark(true);
      const res = await complaintService.addRemark(complaint._id, newRemark.trim());
      if (res.success) {
        setComplaint({
          ...complaint,
          remarks: res.remarks
        });
        setNewRemark('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post remark.');
    } finally {
      setPostingRemark(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader message="Retrieving complaint tracking history..." />;
  }

  if (error || !complaint) {
    return (
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Unable to Access Complaint</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/my-complaints" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Complaints
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Top back & actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <button
          onClick={() => window.history.back()}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Printer size={15} /> Print Audit Report
          </button>
        </div>
      </div>

      {/* Main Complaint Header Card */}
      <div className="card" style={{ padding: '1.75rem 2rem', marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {complaint.complaintId}
              </span>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
              {complaint.title}
            </h1>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            <div>Registered: <strong>{formatDate(complaint.createdAt)}</strong></div>
            {complaint.resolvedAt && (
              <div style={{ color: '#059669', marginTop: '0.25rem' }}>
                Resolved: <strong>{formatDate(complaint.resolvedAt)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
              CATEGORY
            </span>
            <strong style={{ color: 'var(--text-main)' }}>{complaint.category}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
              TARGET DEPARTMENT
            </span>
            <strong style={{ color: 'var(--text-main)' }}>{complaint.department}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
              SUBMITTED BY
            </span>
            <strong style={{ color: 'var(--text-main)' }}>
              {complaint.submittedBy?.name || 'User'}
            </strong>{' '}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({complaint.submittedBy?.department || 'Member'})
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
              ASSIGNED STAFF
            </span>
            {complaint.assignedTo ? (
              <strong style={{ color: 'var(--text-main)' }}>
                {complaint.assignedTo.name} ({complaint.assignedTo.department})
              </strong>
            ) : (
              <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
                Pending Assignment
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
            Description of Grievance
          </h4>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-main)',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              backgroundColor: '#ffffff',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}
          >
            {complaint.description}
          </p>
        </div>

        {/* Attachments if any */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Attachments ({complaint.attachments.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {complaint.attachments.map((att, i) => (
                <a
                  key={i}
                  href={att.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Paperclip size={14} color="var(--primary)" />
                  <span>{att.filename || `Attachment ${i + 1}`}</span>
                  <Download size={12} color="var(--text-muted)" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visual Timeline and Audit Trail */}
      <div className="card" style={{ padding: '1.75rem 2rem', marginBottom: '1.75rem' }}>
        <Timeline
          statusHistory={complaint.statusHistory}
          currentStatus={complaint.status}
          resolutionSummary={complaint.resolutionSummary}
          resolvedAt={complaint.resolvedAt}
        />
      </div>

      {/* Discussion & Administrative Remarks Section */}
      <div className="card" style={{ padding: '1.75rem 2rem' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <MessageSquare size={18} color="var(--primary)" />
          Official Remarks & Resolution Notes ({complaint.remarks?.length || 0})
        </h3>

        {complaint.remarks?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            No administrative or staff remarks have been posted yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
            {complaint.remarks.map((r, idx) => {
              const isAdmin = r.authorRole === 'admin';
              const isStaff = r.authorRole === 'staff';

              return (
                <div
                  key={r._id || idx}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isAdmin ? '#eff6ff' : isStaff ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${isAdmin ? '#bfdbfe' : isStaff ? '#bbf7d0' : '#e2e8f0'}`
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {r.authorName || 'Official'}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.685rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '0.1rem 0.45rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isAdmin ? '#dbeafe' : isStaff ? '#dcfce7' : '#f1f5f9',
                          color: isAdmin ? '#1e40af' : isStaff ? '#15803d' : '#475569'
                        }}
                      >
                        {r.authorRole}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {r.comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Remark Form */}
        <form onSubmit={handleAddRemark} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Post a Remark / Progress Update
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <textarea
              rows={2}
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
              placeholder="Write a message, diagnostic note, or inquiry..."
              style={{ flex: 1 }}
              required
            />
            <button
              type="submit"
              disabled={postingRemark || !newRemark.trim()}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-end', height: 44 }}
            >
              <Send size={16} />
              {postingRemark ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintTracking;
