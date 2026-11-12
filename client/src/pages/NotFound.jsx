import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}
        >
          <ShieldAlert size={34} />
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          404
        </h1>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The complaint ticket or portal destination you are trying to reach does not exist, has been moved, or has restricted access.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
