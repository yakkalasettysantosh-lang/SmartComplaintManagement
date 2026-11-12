import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading details...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--text-muted)'
        }}
      >
        <Loader2 size={36} className="spin" style={{ color: 'var(--primary)' }} />
        <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        color: 'var(--text-muted)'
      }}
    >
      <Loader2 size={28} className="spin" style={{ color: 'var(--primary)' }} />
      <span style={{ fontSize: '0.875rem' }}>{message}</span>
    </div>
  );
};

export default Loader;
