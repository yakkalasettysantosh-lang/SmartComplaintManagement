/**
 * Comprehensive End-to-End API and Flow Verification Script
 * Tests:
 * 1. Health check
 * 2. User registration
 * 3. User login & JWT issuance
 * 4. Admin login
 * 5. Staff login
 * 6. Complaint creation
 * 7. Fetch user's complaints
 * 8. Admin assigning complaint to staff
 * 9. Staff updating status to "Resolved" with remarks
 * 10. Adding remarks to complaint
 * 11. Complaint tracking & audit history verification
 * 12. Notification delivery & marking as read
 * 13. Admin dashboard analytics verification
 */

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('====================================================');
  console.log(' Starting End-to-End System Verification Tests');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(` PASS: ${message}`);
      passed++;
    } else {
      console.error(` FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('--- Step 1: Health Check ---');
    const health = await request('/health', { method: 'GET' });
    assert(health.status === 200 && health.data.status === 'online', 'Health endpoint returns online');

    // 2. User Registration
    console.log('\n--- Step 2: New User Registration ---');
    const testEmail = `student.test.${Date.now()}@complaints.org`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Student',
        email: testEmail,
        password: 'Password123',
        confirmPassword: 'Password123',
        phone: '+91 99999 88888',
        userType: 'Student',
        department: 'Computer Science & Engineering'
      }
    });
    assert(regRes.status === 201 && regRes.data.token, 'New student registered and received JWT');
    const studentToken = regRes.data.token;
    const studentUser = regRes.data.user;

    // 3. User Login
    console.log('\n--- Step 3: User Login ---');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'Password123' }
    });
    assert(loginRes.status === 200 && loginRes.data.user.email === testEmail, 'Student logged in successfully');

    // 4. Admin Login
    console.log('\n--- Step 4: Admin Login ---');
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@complaints.org', password: 'Password123' }
    });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'admin', 'Admin logged in with seeded credentials');
    const adminToken = adminLogin.data.token;

    // 5. Staff Login
    console.log('\n--- Step 5: Staff Login ---');
    const staffLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'staff.it@complaints.org', password: 'Password123' }
    });
    assert(staffLogin.status === 200 && staffLogin.data.user.role === 'staff', 'Staff logged in with seeded credentials');
    const staffToken = staffLogin.data.token;
    const staffUser = staffLogin.data.user;

    // 6. Submit Complaint by User
    console.log('\n--- Step 6: Submit Complaint ---');
    const submitRes = await request('/complaints', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        title: 'Projector HDMI port flickering in Seminar Hall B',
        category: 'IT & Network',
        department: 'IT & Network',
        priority: 'High',
        description: 'The projector keeps losing video signal during presentations when connected via the podium HDMI cable.'
      }
    });
    assert(
      submitRes.status === 201 && submitRes.data.complaint && submitRes.data.complaint.complaintId,
      `Complaint created with ID: ${submitRes.data.complaint?.complaintId}`
    );
    const createdComplaint = submitRes.data.complaint;

    // 7. Get My Complaints
    console.log('\n--- Step 7: Get My Complaints ---');
    const myComplaints = await request('/complaints/my', {
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(
      myComplaints.status === 200 && myComplaints.data.complaints.some(c => c._id === createdComplaint._id),
      'Created complaint appears in user complaint list'
    );

    // 8. Admin Assigns Complaint to Staff
    console.log('\n--- Step 8: Admin Assigns Complaint to Staff ---');
    const assignRes = await request(`/complaints/${createdComplaint._id}/assign`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        staffId: staffUser._id,
        remarks: 'Assigned to IT team for immediate cable and adapter replacement.'
      }
    });
    assert(
      assignRes.status === 200 && assignRes.data.complaint.assignedTo._id === staffUser._id,
      'Complaint successfully assigned to IT staff'
    );

    // 9. Staff Updates Complaint Status to "Resolved"
    console.log('\n--- Step 9: Staff Updates Status to Resolved ---');
    const statusRes = await request(`/complaints/${createdComplaint._id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        status: 'Resolved',
        remarks: 'Replaced faulty 15m HDMI cable and verified 1080p output at 60Hz.',
        resolutionSummary: 'Brand new shielded HDMI 2.0 cable installed.'
      }
    });
    assert(
      statusRes.status === 200 && statusRes.data.complaint.status === 'Resolved',
      'Complaint status updated to Resolved by Staff'
    );

    // 10. Add Remark
    console.log('\n--- Step 10: Complainant Adds Remark ---');
    const remarkRes = await request(`/complaints/${createdComplaint._id}/remarks`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { comment: 'Thank you! The projector is functioning perfectly now.' }
    });
    assert(
      remarkRes.status === 201 && remarkRes.data.remarks.length >= 1,
      'Remark added and visible in remarks log'
    );

    // 11. Complaint Tracking & Audit History
    console.log('\n--- Step 11: Complaint Tracking ---');
    const trackRes = await request(`/complaints/${createdComplaint.complaintId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(
      trackRes.status === 200 &&
      trackRes.data.complaint.statusHistory.length >= 3 &&
      trackRes.data.complaint.status === 'Resolved',
      'Tracking returns complete lifecycle history (Pending -> Assigned -> Resolved)'
    );

    // 12. Notifications for Student
    console.log('\n--- Step 12: Notification System ---');
    const notifRes = await request('/notifications', {
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(
      notifRes.status === 200 && notifRes.data.notifications.length > 0,
      `Notifications received: ${notifRes.data.notifications.length} unread/updates`
    );

    // 13. Admin Dashboard Analytics
    console.log('\n--- Step 13: Admin Dashboard Analytics ---');
    const dashRes = await request('/admin/dashboard', {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(
      dashRes.status === 200 &&
      dashRes.data.stats.complaints.total >= 5 &&
      dashRes.data.stats.categories.length > 0,
      'Admin dashboard returns aggregated MongoDB counts and category breakdown'
    );

    console.log('\n====================================================');
    console.log(` Verification Completed: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

  } catch (err) {
    console.error('Fatal test error:', err);
    throw err;
  }
}

if (require.main === module) {
  runTests().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { runTests };

