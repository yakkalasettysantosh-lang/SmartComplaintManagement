import api from './api';

export const complaintService = {
  // Submit new complaint (handles multipart/form-data for image attachments)
  async createComplaint(formData) {
    const res = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  // Get user's own complaints
  async getMyComplaints(params = {}) {
    const res = await api.get('/complaints/my', { params });
    return res.data;
  },

  // Get complaints list based on role
  async getComplaints(params = {}) {
    const res = await api.get('/complaints', { params });
    return res.data;
  },

  // Get complaint by ID or complaintId
  async getComplaintById(id) {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  },

  // Update status (Admin/Staff)
  async updateStatus(id, { status, remarks, resolutionSummary }) {
    const res = await api.put(`/complaints/${id}/status`, {
      status,
      remarks,
      resolutionSummary
    });
    return res.data;
  },

  // Assign complaint to staff (Admin)
  async assignStaff(id, { staffId, remarks }) {
    const res = await api.put(`/complaints/${id}/assign`, {
      staffId,
      remarks
    });
    return res.data;
  },

  // Add remark/comment
  async addRemark(id, comment) {
    const res = await api.post(`/complaints/${id}/remarks`, { comment });
    return res.data;
  }
};
