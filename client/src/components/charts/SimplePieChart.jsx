import React from 'react';

export const SimplePieChart = ({ segments = [] }) => {
  // segments: [{ label, value, color }]
  const total = segments.reduce((acc, curr) => acc + (curr.value || 0), 0);

  if (total === 0) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data to display.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Visual Stacked Multi-Bar */}
      <div
        style={{
          width: '100%',
          height: 16,
          display: 'flex',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9'
        }}
      >
        {segments.map((seg, idx) => {
          if (!seg.value) return null;
          const pct = ((seg.value / total) * 100).toFixed(1);
          return (
            <div
              key={seg.label || idx}
              style={{
                width: `${pct}%`,
                backgroundColor: seg.color,
                transition: 'width 0.4s ease'
              }}
              title={`${seg.label}: ${seg.value} (${pct}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
        {segments.map((seg, idx) => {
          const pct = total > 0 ? Math.round(((seg.value || 0) / total) * 100) : 0;
          return (
            <div key={seg.label || idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: seg.color,
                  flexShrink: 0
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>{seg.label}:</span>
              <strong style={{ color: 'var(--text-main)' }}>{seg.value || 0} ({pct}%)</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimplePieChart;
