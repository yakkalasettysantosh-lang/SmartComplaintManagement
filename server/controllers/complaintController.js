const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { generateComplaintId } = require('../utils/generateId');

/**
 * @desc    Submit a new complaint
 * @route   POST /api/complaints
 * @access  Private (User/Student/Employee)
 */
const createComplaint = async (req, res, next) => {
  try {
    const { title, category, description, department, priority } = req.body;

    if (!title || !category || !description || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, category, description, department.'
      });
    }

    const complaintId = await generateComplaintId();

    // Process attachments from multer if provided
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: `/uploads/${file.filename}`,
          mimetype: file.mimetype,
          size: file.size
        });
      });
    } else if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    }

    const complaint = await Complaint.create({
      complaintId,
      title,
      category,
      description,
      department,
      priority: priority || 'Medium',
      status: 'Pending',
      submittedBy: req.user._id,
      attachments,
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: req.user._id,
          updaterName: req.user.name,
          updaterRole: req.user.role,
          remarks: 'Complaint registered in the system.'
        }
      ]
    });

    // Notify admins about new complaint
    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await Notification.create({
          userId: admin._id,
          complaintId: complaint._id,
          type: 'complaint_created',
          message: `New complaint submitted: ${complaint.complaintId} - "${complaint.title}" in ${complaint.department}`
        });
      }
    } catch (notifErr) {
      console.error('Failed to dispatch admin notification:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all complaints submitted by the logged-in user
 * @route   GET /api/complaints/my
 * @access  Private (User)
 */
const getMyComplaints = async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;

    const query = { submittedBy: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query)
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
 * @desc    Get complaints (role-based filter)
 * @route   GET /api/complaints
 * @access  Private
 */
const getComplaints = async (req, res, next) => {
  try {
    const { status, priority, category, department, search, assignedTo } = req.query;
    let query = {};

    // Role restrictions
    if (req.user.role === 'user') {
      query.submittedBy = req.user._id;
    } else if (req.user.role === 'staff') {
      // Staff see complaints assigned to them OR in their department
      query.$or = [
        { assignedTo: req.user._id },
        { department: req.user.department }
      ];
    }
    // Admin sees all by default

    if (status && status !== 'All') {
      query.status = status;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (department && department !== 'All') {
      query.department = department;
    }
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchConditions = [
        { title: searchRegex },
        { complaintId: searchRegex },
        { description: searchRegex }
      ];
      if (query.$or) {
        query = {
          $and: [{ $or: query.$or }, { $or: searchConditions }]
        };
      } else {
        query.$or = searchConditions;
      }
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
 * @desc    Get complaint details by ID or complaintId
 * @route   GET /api/complaints/:id
 * @access  Private
 */
const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Support both MongoDB _id and human-friendly complaintId
    let complaint;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      complaint = await Complaint.findById(id)
        .populate('submittedBy', 'name email department userType phone')
        .populate('assignedTo', 'name email department phone')
        .populate('remarks.author', 'name email role department');
    } else {
      complaint = await Complaint.findOne({ complaintId: id })
        .populate('submittedBy', 'name email department userType phone')
        .populate('assignedTo', 'name email department phone')
        .populate('remarks.author', 'name email role department');
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    // Role-based security check:
    // If regular user, they can only view their own complaint
    if (
      req.user.role === 'user' &&
      complaint.submittedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own complaints.'
      });
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update complaint status
 * @route   PUT /api/complaints/:id/status
 * @access  Private (Admin, Staff)
 */
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks, resolutionSummary } = req.body;

    const allowedStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    // Staff authorization check: Staff can only update complaints assigned to them
    if (
      req.user.role === 'staff' &&
      (!complaint.assignedTo || complaint.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Staff can only update status for complaints assigned to them.'
      });
    }

    const previousStatus = complaint.status;
    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
      if (resolutionSummary) {
        complaint.resolutionSummary = resolutionSummary;
      }
    }

    // Push into status history
    complaint.statusHistory.push({
      status,
      updatedBy: req.user._id,
      updaterName: req.user.name,
      updaterRole: req.user.role,
      remarks: remarks || `Status transitioned from ${previousStatus} to ${status}.`,
      timestamp: new Date()
    });

    // Optionally append to remarks
    if (remarks) {
      complaint.remarks.push({
        author: req.user._id,
        authorName: req.user.name,
        authorRole: req.user.role,
        comment: remarks
      });
    }

    await complaint.save();

    // Create notification for complainant
    await Notification.create({
      userId: complaint.submittedBy,
      complaintId: complaint._id,
      type: 'status_change',
      message: `Your complaint (${complaint.complaintId}) status changed to "${status}". Remarks: ${remarks || 'No remarks provided.'}`
    });

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}.`,
      complaint
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Assign complaint to department staff
 * @route   PUT /api/complaints/:id/assign
 * @access  Private (Admin only)
 */
const assignComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { staffId, remarks } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid staffId to assign.'
      });
    }

    const staffUser = await User.findById(staffId);
    if (!staffUser || staffUser.role !== 'staff') {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff member selected.'
      });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    complaint.assignedTo = staffUser._id;
    if (complaint.status === 'Pending') {
      complaint.status = 'In Progress';
    }

    complaint.statusHistory.push({
      status: complaint.status,
      updatedBy: req.user._id,
      updaterName: req.user.name,
      updaterRole: req.user.role,
      remarks: `Assigned to staff member: ${staffUser.name} (${staffUser.department}). ${remarks || ''}`.trim(),
      timestamp: new Date()
    });

    if (remarks) {
      complaint.remarks.push({
        author: req.user._id,
        authorName: req.user.name,
        authorRole: req.user.role,
        comment: `[Assignment Note]: ${remarks}`
      });
    }

    await complaint.save();

    // Notify the assigned staff
    await Notification.create({
      userId: staffUser._id,
      complaintId: complaint._id,
      type: 'assignment',
      message: `You have been assigned to handle complaint ${complaint.complaintId}: "${complaint.title}".`
    });

    // Notify the complainant
    await Notification.create({
      userId: complaint.submittedBy,
      complaintId: complaint._id,
      type: 'assignment',
      message: `Your complaint (${complaint.complaintId}) has been assigned to ${staffUser.name} (${staffUser.department}).`
    });

    const populatedComplaint = await Complaint.findById(id)
      .populate('submittedBy', 'name email department')
      .populate('assignedTo', 'name email department');

    res.status(200).json({
      success: true,
      message: `Complaint assigned to ${staffUser.name} successfully.`,
      complaint: populatedComplaint
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add remarks/comments to complaint
 * @route   POST /api/complaints/:id/remarks
 * @access  Private (Admin, Staff, Complainant)
 */
const addRemark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Remark comment text cannot be empty.'
      });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    // Role check:
    const isOwner = complaint.submittedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isAssignedStaff =
      req.user.role === 'staff' &&
      complaint.assignedTo &&
      complaint.assignedTo.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isAssignedStaff) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to comment on this complaint.'
      });
    }

    const newRemark = {
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      comment: comment.trim(),
      createdAt: new Date()
    };

    complaint.remarks.push(newRemark);
    await complaint.save();

    // Dispatch notifications to relevant parties
    if (!isOwner) {
      // If staff/admin added remark, notify complainant
      await Notification.create({
        userId: complaint.submittedBy,
        complaintId: complaint._id,
        type: 'remark_added',
        message: `New remark on your complaint (${complaint.complaintId}) from ${req.user.name} (${req.user.role}).`
      });
    }

    if (complaint.assignedTo && complaint.assignedTo.toString() !== req.user._id.toString()) {
      // If complainant or admin added remark, notify assigned staff
      await Notification.create({
        userId: complaint.assignedTo,
        complaintId: complaint._id,
        type: 'remark_added',
        message: `New remark on assigned complaint (${complaint.complaintId}) from ${req.user.name}.`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Remark posted successfully.',
      remark: newRemark,
      remarks: complaint.remarks
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  addRemark
};
