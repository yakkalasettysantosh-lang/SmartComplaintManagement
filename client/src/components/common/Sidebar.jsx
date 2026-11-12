import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Users,
  ShieldCheck,
  LogOut,
  ListFilter,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = () => {
    if (user?.role === 'admin') return { bg: '#fee2e2', color: '#b91c1c' };
    if (user?.role === 'staff') return { bg: '#eff6ff', color: '#1d4ed8' };
    return { bg: '#ecfdf5', color: '#047857' };
  };

  const roleColors = getRoleBadgeColor();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15,23,42,0.4)',
            zIndex: 35
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <ShieldCheck size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="sidebar-brand-name">SmartResolve</div>
            <div className="sidebar-brand-sub">Management Portal</div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              color: 'var(--text-muted)',
              display: isOpen ? 'block' : 'none'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {/* USER (Student / Employee) Navigation */}
          {user?.role === 'user' && (
            <>
              <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                User Portal
              </div>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
              <NavLink
                to="/submit"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <PlusCircle size={18} />
                Submit Complaint
              </NavLink>
              <NavLink
                to="/my-complaints"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <FolderOpen size={18} />
                My Complaints
              </NavLink>
            </>
          )}

          {/* ADMIN Navigation */}
          {user?.role === 'admin' && (
            <>
              <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Admin Operations
              </div>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <LayoutDashboard size={18} />
                Overview Dashboard
              </NavLink>
              <NavLink
                to="/admin/complaints"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <ListFilter size={18} />
                All Complaints
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Users size={18} />
                User Management
              </NavLink>
            </>
          )}

          {/* STAFF Navigation */}
          {user?.role === 'staff' && (
            <>
              <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Staff Desk
              </div>
              <NavLink
                to="/staff"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <CheckCircle2 size={18} />
                Assigned Complaints
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar Footer with Logged In User Info */}
        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                <span
                  style={{
                    fontSize: '0.685rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: roleColors.bg,
                    color: roleColors.color
                  }}
                >
                  {user?.role}
                </span>
                <span
                  style={{
                    fontSize: '0.725rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user?.department}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginTop: '0.85rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.55rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#ef4444',
              backgroundColor: '#fff',
              border: '1px solid #fee2e2',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
