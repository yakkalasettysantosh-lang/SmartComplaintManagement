const Complaint = require('../models/Complaint');

/**
 * Generates a unique, readable complaint ID.
 * Format: CMP-YYYY-XXXX (e.g. CMP-2026-1001)
 */
const generateComplaintId = async () => {
  const year = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const sequentialId = `CMP-${year}-${String(count + 1).padStart(4, '0')}-${randomSuffix}`;
  
  // Double-check collision
  const existing = await Complaint.findOne({ complaintId: sequentialId });
  if (existing) {
    return `CMP-${year}-${Date.now().toString().slice(-6)}`;
  }
  return sequentialId;
};

module.exports = { generateComplaintId };
