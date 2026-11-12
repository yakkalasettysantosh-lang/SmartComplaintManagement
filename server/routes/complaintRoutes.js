const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  addRemark
} = require('../controllers/complaintController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All complaint routes require authentication
router.use(verifyToken);

router.post('/', upload.array('attachments', 5), createComplaint);
router.get('/my', getMyComplaints);
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.put('/:id/status', authorizeRoles('admin', 'staff'), updateComplaintStatus);
router.put('/:id/assign', authorizeRoles('admin'), assignComplaint);
router.post('/:id/remarks', addRemark);

module.exports = router;
