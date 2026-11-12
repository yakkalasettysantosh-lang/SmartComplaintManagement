import api from './api';

export const adminService = {
  // Aggregate statistics for admin dashboard
  async getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  // All users
  async getAllUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  // All complaints
  async getAdminComplaints(params = {}) {
    const res = await api.get('/admin/complaints', { params });
    return res.data;
  },

  // Update user role or status
  async updateUserRole(id, data) {
    const res = await api.put(`/admin/users/${id}/role`, data);
    return res.data;
  }
};
