import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  X,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { complaintService } from '../services/complaintService';

const CATEGORIES = [
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

export const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'IT & Network',
    department: 'IT & Network',
    priority: 'Medium',
    description: ''
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    // Limit to max 3 files and max 5MB each
    const validFiles = selected.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB size limit.`);
        return false;
      }
      return true;
    });

    setFiles([...files, ...validFiles].slice(0, 3));
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a descriptive title for your complaint.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide detailed description of the issue.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('department', formData.department);
      data.append('priority', formData.priority);
      data.append('description', formData.description.trim());

      files.forEach((file) => {
        data.append('attachments', file);
      });

      const res = await complaintService.createComplaint(data);
      if (res.success && res.complaint) {
        navigate(`/track/${res.complaint._id}`);
      } else {
        navigate('/my-complaints');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to submit complaint. Please check your network and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Submit a New Complaint</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
          Please specify the issue details clearly so the administration can dispatch the appropriate departmental staff.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && (
          <div
            style={{
              backgroundColor: 'var(--status-rejected-bg)',
              border: '1px solid var(--status-rejected-border)',
              color: 'var(--status-rejected)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Complaint Title / Summary <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Broken projector in Room 302 / Water cooler leaking on 2nd floor"
              maxLength={120}
              required
            />
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
              {formData.title.length}/120 characters
            </div>
          </div>

          {/* Category & Department & Priority (3 Cols) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Responsible Department <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select name="department" value={formData.department} onChange={handleChange}>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Urgency Priority <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low - Minor Inconvenience</option>
                <option value="Medium">Medium - Regular Operational Issue</option>
                <option value="High">High - Critical / Urgent Impact</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Detailed Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Provide exact location, time, equipment numbers, and specific error or disturbance encountered..."
              required
            />
          </div>

          {/* File Attachments */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Optional Image or Document Attachments (Max 3 files, 5MB each)
            </label>

            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-main)',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />
              <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Click or drag & drop photos/files here to upload
              </p>
              <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, WEBP, and PDF up to 5MB
              </p>
            </div>

            {/* Uploaded File Pills */}
            {files.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.35rem 0.75rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem'
                    }}
                  >
                    <Paperclip size={14} color="var(--primary)" />
                    <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>
                      ({Math.round(file.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      style={{ background: 'none', color: '#ef4444', padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.25rem'
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Registering Complaint...
                </>
              ) : (
                <>
                  Submit Complaint
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
