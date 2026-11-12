const User = require('../models/User');
const Complaint = require('../models/Complaint');

/**
 * @desc    Get aggregate stats for Admin Dashboard
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin only)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStaff,
      totalStudents,
      totalEmployees,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      categoryStats,
      priorityStats,
      departmentStats,
      recentComplaints
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'staff' }),
      User.countDocuments({ userType: 'Student' }),
      User.countDocuments({ userType: 'Employee' }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Rejected' }),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Complaint.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Complaint.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Complaint.find()
        .populate('submittedBy', 'name email department userType')
        .populate('assignedTo', 'name email department')
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

    // Format category distribution
    const categoryBreakdown = categoryStats.map((item) => ({
      category: item._id,
      count: item.count
    }));

    // Format priority breakdown
    const priorityBreakdown = {
      Low: 0,
      Medium: 0,
      High: 0
    };
    priorityStats.forEach((p) => {
      if (p._id) priorityBreakdown[p._id] = p.count;
    });

    // Format department breakdown
    const departmentBreakdown = departmentStats.map((item) => ({
      department: item._id,
      count: item.count
    }));

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          staff: totalStaff,
          students: totalStudents,
          employees: totalEmployees
        },
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          rejected: rejectedComplaints,
          resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0
        },
        categories: categoryBreakdown,
        priorities: priorityBreakdown,
        departments: departmentBreakdown,
        recentComplaints
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all users (with optional filtering)
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, department, search } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }
    if (department && department !== 'All') {
      query.department = department;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get complaints for Admin Management
 * @route   GET /api/admin/complaints
 * @access  Private (Admin only)
 */
const getAdminComplaints = async (req, res, next) => {
  try {
    const { status, priority, category, department, search, assignedTo } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (category && category !== 'All') query.category = category;
    if (department && department !== 'All') query.department = department;
    if (assignedTo && assignedTo !== 'All') {
      if (assignedTo === 'unassigned') {
        query.assignedTo = null;
      } else {
        query.assignedTo = assignedTo;
      }
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { complaintId: searchRegex },
        { description: searchRegex }
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email department userType phone')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user role or status
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin only)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, department, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (role && ['user', 'staff', 'admin'].includes(role)) {
      user.role = role;
    }
    if (department) {
      user.department = department;
    }
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        department: user.department,
        isActive: user.isActive
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAdminComplaints,
  updateUserRole
};
