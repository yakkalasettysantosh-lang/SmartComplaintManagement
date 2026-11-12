import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import NotificationDropdown from '../components/notifications/NotificationDropdown';
import { useAuth } from '../context/AuthContext';
import { Menu, Shield } from 'lucide-react';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'User Dashboard';
    if (path === '/submit') return 'Submit a Complaint';
    if (path === '/my-complaints') return 'My Submitted Complaints';
    if (path.startsWith('/track')) return 'Complaint Tracking & Audit';
    if (path === '/admin') return 'Admin Overview';
    if (path === '/admin/complaints') return 'Complaint Management';
    if (path === '/admin/users') return 'User & Role Management';
    if (path === '/staff') return 'Staff Task Board';
    return 'Portal';
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Stage */}
      <div className="main-stage">
        {/* Top Header */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                color: 'var(--text-main)',
                padding: 6,
                borderRadius: 'var(--radius-sm)'
              }}
              className="sidebar-toggle-btn"
            >
              <Menu size={22} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{getPageTitle()}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Notification Bell Dropdown */}
            <NotificationDropdown />

            {/* User Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {user?.name?.[0] || 'U'}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user?.name?.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="content-body">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 901px) {
          .sidebar-toggle-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
