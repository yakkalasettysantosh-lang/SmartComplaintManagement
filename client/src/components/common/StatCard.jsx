import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, onClick }) => {
  const colorStyles = {
    blue: {
      bg: '#eff6ff',
      text: '#2563eb',
      border: '#bfdbfe'
    },
    amber: {
      bg: '#fef3c7',
      text: '#d97706',
      border: '#fde68a'
    },
    green: {
      bg: '#ecfdf5',
      text: '#059669',
      border: '#a7f3d0'
    },
    red: {
      bg: '#fef2f2',
      text: '#dc2626',
      border: '#fecaca'
    },
    purple: {
      bg: '#f3e8ff',
      text: '#7c3aed',
      border: '#ddd6fe'
    },
    slate: {
      bg: '#f1f5f9',
      text: '#475569',
      border: '#cbd5e1'
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className="stat-card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
      </div>
      {Icon && (
        <div
          className="stat-icon-box"
          style={{ backgroundColor: style.bg, color: style.text }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
