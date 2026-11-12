import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display.',
  actionText,
  onAction
}) => {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 420 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          className="btn btn-primary btn-sm"
          onClick={onAction}
          style={{ marginTop: '0.5rem' }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
