import React from 'react';

export const SimpleBarChart = ({ data = [], labelKey = 'category', valueKey = 'count', color = '#2563eb' }) => {
  if (!data || data.length === 0) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data available to chart.</div>;
  }

  const maxValue = Math.max(...data.map((d) => d[valueKey] || 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {data.map((item, index) => {
        const val = item[valueKey] || 0;
        const percentage = Math.round((val / maxValue) * 100);
        return (
          <div key={item[labelKey] || index} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
              <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{item[labelKey]}</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{val}</span>
            </div>
            <div
              style={{
                width: '100%',
                height: 10,
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleBarChart;
