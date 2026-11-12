const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(' Seed data already present in database, skipping seeding.');
      return;
    }

    console.log(' Seeding comprehensive initial demo data...');

    // 1. Create Users
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@complaints.org',
      password: 'Password123',
      phone: '+91 98765 43210',
      role: 'admin',
      userType: 'Admin',
      department: 'Central Administration'
    });

    const staffIT = await User.create({
      name: 'Prof. Rajesh Kumar',
      email: 'staff.it@complaints.org',
      password: 'Password123',
      phone: '+91 98765 43211',
      role: 'staff',
      userType: 'Staff',
      department: 'IT & Network'
    });

    const staffMaint = await User.create({
      name: 'Dr. Ananya Sharma',
      email: 'staff.maint@complaints.org',
      password: 'Password123',
      phone: '+91 98765 43212',
      role: 'staff',
      userType: 'Staff',
      department: 'Infrastructure & Maintenance'
    });

    const staffHostel = await User.create({
      name: 'Mr. Vikram Patel',
      email: 'staff.hostel@complaints.org',
      password: 'Password123',
      phone: '+91 98765 43213',
      role: 'staff',
      userType: 'Staff',
      department: 'Hostel & Housing'
    });

    const studentUser = await User.create({
      name: 'Aarav Sharma',
      email: 'student@complaints.org',
      password: 'Password123',
      phone: '+91 98765 43214',
      role: 'user',
      userType: 'Student',
      department: 'Computer Science & Engineering'
    });

    const employeeUser = await User.create({
      name: 'Priya Sen',
      email: 'employee@complaints.org',
      password: 'Password123',
      phone: '+91 98765 43215',
      role: 'user',
      userType: 'Employee',
      department: 'Central Library'
    });

    // 2. Create Complaints with Realistic History & Remarks
    const now = new Date();

    // Complaint 1: In Progress (Assigned to IT Staff)
    const cmp1 = await Complaint.create({
      complaintId: 'CMP-2026-1001',
      title: 'Lab 4 High-Speed Wi-Fi Router Disconnecting Frequently',
      category: 'IT & Network',
      description: 'The Wi-Fi access point in Computer Lab 4 drops every 10 minutes, disrupting online lab sessions and compiler access for 40+ students.',
      department: 'IT & Network',
      priority: 'High',
      status: 'In Progress',
      submittedBy: studentUser._id,
      assignedTo: staffIT._id,
      createdAt: new Date(now.getTime() - 3 * 86400000),
      updatedAt: new Date(now.getTime() - 1 * 86400000),
      remarks: [
        {
          author: admin._id,
          authorName: admin.name,
          authorRole: admin.role,
          comment: 'Assigned with high priority to Prof. Rajesh Kumar for urgent switch diagnostics.',
          createdAt: new Date(now.getTime() - 2 * 86400000)
        },
        {
          author: staffIT._id,
          authorName: staffIT.name,
          authorRole: staffIT.role,
          comment: 'Firmware reset performed. A new dual-band Cisco router has been requisitioned.',
          createdAt: new Date(now.getTime() - 1 * 86400000)
        }
      ],
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: studentUser._id,
          updaterName: studentUser.name,
          updaterRole: studentUser.role,
          remarks: 'Complaint lodged by student.',
          timestamp: new Date(now.getTime() - 3 * 86400000)
        },
        {
          status: 'In Progress',
          updatedBy: admin._id,
          updaterName: admin.name,
          updaterRole: admin.role,
          remarks: `Assigned to ${staffIT.name} (IT Department)`,
          timestamp: new Date(now.getTime() - 2 * 86400000)
        }
      ]
    });

    // Complaint 2: Resolved
    const cmp2 = await Complaint.create({
      complaintId: 'CMP-2026-1002',
      title: 'AC Leaking Water over Reference Desk in 2nd Floor Library',
      category: 'Infrastructure & Maintenance',
      description: 'Water condensate is dripping directly on top of journals and academic journals shelf near table 12.',
      department: 'Infrastructure & Maintenance',
      priority: 'High',
      status: 'Resolved',
      submittedBy: employeeUser._id,
      assignedTo: staffMaint._id,
      createdAt: new Date(now.getTime() - 6 * 86400000),
      resolvedAt: new Date(now.getTime() - 1 * 86400000),
      resolutionSummary: 'Drain line unclogged and cooling coil serviced. Sealed insulation foam replaced.',
      remarks: [
        {
          author: staffMaint._id,
          authorName: staffMaint.name,
          authorRole: staffMaint.role,
          comment: 'Maintenance technician dispatched with plumbing gear.',
          createdAt: new Date(now.getTime() - 4 * 86400000)
        },
        {
          author: staffMaint._id,
          authorName: staffMaint.name,
          authorRole: staffMaint.role,
          comment: 'Leak stopped. Tested for 4 hours without any seepage. Resolved.',
          createdAt: new Date(now.getTime() - 1 * 86400000)
        }
      ],
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: employeeUser._id,
          updaterName: employeeUser.name,
          updaterRole: employeeUser.role,
          remarks: 'Reported by library staff.',
          timestamp: new Date(now.getTime() - 6 * 86400000)
        },
        {
          status: 'In Progress',
          updatedBy: admin._id,
          updaterName: admin.name,
          updaterRole: admin.role,
          remarks: 'Escalated to Maintenance staff.',
          timestamp: new Date(now.getTime() - 5 * 86400000)
        },
        {
          status: 'Resolved',
          updatedBy: staffMaint._id,
          updaterName: staffMaint.name,
          updaterRole: staffMaint.role,
          remarks: 'Drain pipe replaced and verified dry.',
          timestamp: new Date(now.getTime() - 1 * 86400000)
        }
      ]
    });

    // Complaint 3: Pending
    const cmp3 = await Complaint.create({
      complaintId: 'CMP-2026-1003',
      title: 'Water Cooler on Hostel Block B Ground Floor Malfunctioning',
      category: 'Hostel & Housing',
      description: 'The drinking water cooler is discharging warm water and the UV purifer LED light is blinking red.',
      department: 'Hostel & Housing',
      priority: 'Medium',
      status: 'Pending',
      submittedBy: studentUser._id,
      assignedTo: null,
      createdAt: new Date(now.getTime() - 1 * 86400000),
      remarks: [],
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: studentUser._id,
          updaterName: studentUser.name,
          updaterRole: studentUser.role,
          remarks: 'Complaint registered by student.',
          timestamp: new Date(now.getTime() - 1 * 86400000)
        }
      ]
    });

    // Complaint 4: Rejected (Invalid/Duplicate)
    const cmp4 = await Complaint.create({
      complaintId: 'CMP-2026-1004',
      title: 'Request for Gaming Server Bandwidth Allocation',
      category: 'IT & Network',
      description: 'Hostel LAN port should have port forwarding open for non-academic multiplayer gaming servers.',
      department: 'IT & Network',
      priority: 'Low',
      status: 'Rejected',
      submittedBy: studentUser._id,
      assignedTo: staffIT._id,
      createdAt: new Date(now.getTime() - 5 * 86400000),
      resolutionSummary: 'Violates campus acceptable use policy section 4.2 (Network bandwidth dedicated to research and education).',
      remarks: [
        {
          author: staffIT._id,
          authorName: staffIT.name,
          authorRole: staffIT.role,
          comment: 'Campus firewall policy prohibits unverified port openings per IT compliance rules.',
          createdAt: new Date(now.getTime() - 4 * 86400000)
        }
      ],
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: studentUser._id,
          updaterName: studentUser.name,
          updaterRole: studentUser.role,
          remarks: 'Submitted.',
          timestamp: new Date(now.getTime() - 5 * 86400000)
        },
        {
          status: 'Rejected',
          updatedBy: staffIT._id,
          updaterName: staffIT.name,
          updaterRole: staffIT.role,
          remarks: 'Rejected per institutional security guidelines.',
          timestamp: new Date(now.getTime() - 4 * 86400000)
        }
      ]
    });

    // 3. Create Sample Notifications
    await Notification.create({
      userId: studentUser._id,
      complaintId: cmp1._id,
      type: 'assignment',
      message: 'Your complaint CMP-2026-1001 has been assigned to Prof. Rajesh Kumar (IT & Network).',
      isRead: false
    });

    await Notification.create({
      userId: employeeUser._id,
      complaintId: cmp2._id,
      type: 'status_change',
      message: 'Great news! Your complaint CMP-2026-1002 has been marked as Resolved.',
      isRead: true
    });

    await Notification.create({
      userId: staffIT._id,
      complaintId: cmp1._id,
      type: 'assignment',
      message: 'New high priority complaint CMP-2026-1001 assigned to you: Lab 4 Wi-Fi.',
      isRead: false
    });

    console.log(' Demo data seeded successfully with Admin, Staff, Student, and Employee accounts.');
  } catch (err) {
    console.error(' Error during initial data seeding:', err.message);
  }
};

// If run directly from CLI
if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
  const connectDB = require('../config/db');

  connectDB().then(async () => {
    await seedInitialData();
    console.log('Seeding CLI execution finished.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seeding script failed:', err);
    process.exit(1);
  });
}

module.exports = { seedInitialData };
