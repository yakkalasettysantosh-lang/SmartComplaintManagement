const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAdminComplaints,
  updateUserRole
} = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// All admin routes require admin role
router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/complaints', getAdminComplaints);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
