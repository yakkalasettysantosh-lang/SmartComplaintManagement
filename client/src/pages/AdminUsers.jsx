import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserCheck,
  ShieldAlert,
  Building,
  Mail,
  Phone,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { adminService } from '../services/adminService';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Edit User Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('user');
  const [newDept, setNewDept] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter !== 'All') params.role = roleFilter;
      if (search.trim()) params.search = search.trim();

      const res = await adminService.getAllUsers(params);
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const openEditModal = (u) => {
    setSelectedUser(u);
    setNewRole(u.role);
    setNewDept(u.department || '');
    setIsActive(u.isActive !== false);
    setEditModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await adminService.updateUserRole(selectedUser._id, {
        role: newRole,
        department: newDept,
        isActive
      });
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>User & Access Control Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Inspect user directories, configure staff roles, and manage institutional access rights
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search
            size={18}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Role:
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="All">All Roles</option>
            <option value="user">User (Student/Employee)</option>
            <option value="staff">Staff</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearch('');
            setRoleFilter('All');
          }}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <Loader message="Loading registered users..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="No users matched your search criteria."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setRoleFilter('All');
          }}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Type</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Registered</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = u.role === 'admin';
                const isStaff = u.role === 'staff';

                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isAdmin ? '#fee2e2' : isStaff ? '#eff6ff' : '#ecfdf5',
                          color: isAdmin ? '#b91c1c' : isStaff ? '#1d4ed8' : '#047857'
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{u.userType || 'Student'}</td>
                    <td>{u.department}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {u.phone || '—'}
                    </td>
                    <td>
                      {u.isActive !== false ? (
                        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                          ● Active
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
                          ● Deactivated
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      {formatDate(u.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openEditModal(u)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Edit2 size={13} /> Edit Role
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Role Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Role: ${selectedUser?.name}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveUser}
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Assign Role <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="user">User (Student/Employee)</option>
              <option value="staff">Staff (Can be assigned complaints)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Department <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <span style={{ fontWeight: 600 }}>Account is Active & Permitted to Login</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
