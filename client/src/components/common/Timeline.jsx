import React from 'react';
import { CheckCircle2, Clock, RefreshCw, XCircle, UserCheck, MessageSquare } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const Timeline = ({ statusHistory = [], currentStatus = 'Pending', resolutionSummary, resolvedAt }) => {
  // Steps in the lifecycle
  const steps = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Resolved', label: currentStatus === 'Rejected' ? 'Rejected' : 'Resolved' }
  ];

  const getStepState = (stepIndex) => {
    if (currentStatus === 'Rejected') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'completed';
      if (stepIndex === 2) return 'rejected';
      return 'upcoming';
    }

    if (currentStatus === 'Resolved') {
      return 'completed';
    }

    if (currentStatus === 'In Progress') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'current';
      return 'upcoming';
    }

    // Pending
    if (stepIndex === 0) return 'current';
    return 'upcoming';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* 1. Visual Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '1.5rem 1rem',
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '12%',
            right: '12%',
            height: '4px',
            backgroundColor: '#e2e8f0',
            transform: 'translateY(-50%)',
            zIndex: 1
          }}
        />

        {steps.map((s, idx) => {
          const state = getStepState(idx);
          let circleBg = '#e2e8f0';
          let circleColor = '#64748b';
          let border = '2px solid #cbd5e1';

          if (state === 'completed') {
            circleBg = '#10b981';
            circleColor = '#ffffff';
            border = '2px solid #059669';
          } else if (state === 'current') {
            circleBg = '#2563eb';
            circleColor = '#ffffff';
            border = '3px solid #93c5fd';
          } else if (state === 'rejected') {
            circleBg = '#ef4444';
            circleColor = '#ffffff';
            border = '2px solid #b91c1c';
          }

          return (
            <div
              key={s.key}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#ffffff',
                padding: '0 0.5rem'
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: circleBg,
                  color: circleColor,
                  border: border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: state === 'current' ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {state === 'completed' ? (
                  <CheckCircle2 size={20} />
                ) : state === 'rejected' ? (
                  <XCircle size={20} />
                ) : state === 'current' ? (
                  <RefreshCw size={18} className="spin-slow" />
                ) : (
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{idx + 1}</span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.825rem',
                  fontWeight: state === 'current' ? 700 : 500,
                  color: state === 'current' ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Resolution Details Box if Resolved */}
      {currentStatus === 'Resolved' && (
        <div
          style={{
            backgroundColor: 'var(--status-resolved-bg)',
            border: '1px solid var(--status-resolved-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h4 style={{ color: 'var(--status-resolved)', marginBottom: '0.25rem' }}>
              Complaint Successfully Resolved
            </h4>
            <p style={{ color: '#065f46', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              {resolutionSummary || 'The reported issue has been addressed and verified resolved by the department staff.'}
            </p>
            {resolvedAt && (
              <span style={{ fontSize: '0.785rem', color: '#047857', fontWeight: 500 }}>
                Resolved on: {formatDate(resolvedAt)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Status History Log */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={18} color="var(--primary)" />
        Status & Audit History
      </h3>

      {statusHistory.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No status history logged yet.</p>
      ) : (
        <div className="timeline">
          {statusHistory.map((item, index) => {
            return (
              <div key={item._id || index} className="timeline-item">
                <div className="timeline-marker">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor:
                        item.status === 'Resolved'
                          ? '#10b981'
                          : item.status === 'Rejected'
                          ? '#ef4444'
                          : item.status === 'In Progress'
                          ? '#2563eb'
                          : '#f59e0b'
                    }}
                  />
                </div>
                <div className="timeline-content">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge status={item.status} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        Updated by {item.updaterName || 'System'}
                      </span>
                      {item.updaterRole && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.1rem 0.45rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            textTransform: 'uppercase',
                            fontWeight: 700
                          }}
                        >
                          {item.updaterRole}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  {item.remarks && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.remarks}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timeline;
