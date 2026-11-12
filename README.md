# Smart Complaint Management and Tracking System

A full-stack, enterprise-grade MERN application for colleges and organizations to submit, monitor, track, assign, and resolve grievances with complete transparency, role-based workflows, and audit trails.

---

## 🌟 Key Features

### 1. User (Student / Employee) Portal
- **Interactive Landing Page**: Hero banner, how-it-works process steps, security overview, and contact info.
- **Registration & Role Verification**: Full validation, user type (Student or Employee), department selection, and password hashing.
- **User Dashboard**: Live count cards (Total, Pending, In Progress, Resolved) and recent grievances table.
- **Submit Complaint**: Form validation with Category, Department, Urgency Priority (Low, Medium, High), Detailed description, and optional file/image attachments.
- **My Complaints & Search**: Search by ID or keyword, filter by status and priority.
- **Visual Complaint Tracking**: Step progress bar (Submitted &rarr; In Progress &rarr; Resolved/Rejected), timestamped status history logs, updater roles, and remarks discussion feed.

### 2. Administrator Operations
- **Command Dashboard**: Aggregated MongoDB analytics (Total Users, Total Complaints, Pending, In Progress, Resolved, Rejected, and Resolution percentage).
- **Graphical Statistics**: Category distribution charts, Urgency priority charts, and lifecycle stage breakdown.
- **Complaint Management**: View all complaints, search & filter across departments, assign tickets to specialized department staff, modify statuses, and add administrative remarks.
- **User & Access Control**: Directory of registered students, faculty, and staff with ability to update roles, departments, and active statuses.

### 3. Department Staff Desk
- **Assigned Complaints Queue**: Staff only see complaints assigned to them or within their department.
- **Status Transition Workflow**: Progress complaints from *Pending* &rarr; *In Progress* &rarr; *Resolved* or *Rejected*.
- **Resolution Summary**: Record official corrective action summary and technical logs.
- **Remark System**: Add diagnostic remarks visible to the student and administration.

### 4. Automated Notification Center
- **Bell Dropdown**: Live unread badge counter and real-time alerts.
- **Triggered Events**: Status changes, new assignments, and official remarks trigger notifications for the affected parties.
- **Mark as Read**: Individual or bulk mark-all-read capabilities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Axios, Lucide Icons, Modern Responsive CSS |
| **Backend** | Node.js, Express.js REST API, Morgan logger, Multer |
| **Database** | MongoDB, Mongoose ODM (with automatic in-memory fallback for local testing) |
| **Security & Auth** | JSON Web Tokens (JWT), bcryptjs password hashing, RBAC Middleware |

---

## 📁 Project Structure

```text
SmartComplaintManagement/
├── client/                                 # React Frontend (Vite)
│   ├── index.html                          # Entry HTML with custom typography
│   ├── package.json                        # Frontend dependencies
│   ├── vite.config.js                      # Dev server & API proxy config
│   └── src/
│       ├── assets/                         # Static assets and graphics
│       ├── components/
│       │   ├── charts/                     # SimpleBarChart.jsx, SimplePieChart.jsx
│       │   ├── common/                     # Navbar, Sidebar, Footer, StatCard, StatusBadge,
│       │   │                               # PriorityBadge, Timeline, Modal, Loader, EmptyState,
│       │   │                               # ProtectedRoute
│       │   └── notifications/              # NotificationDropdown.jsx
│       ├── context/                        # AuthContext.jsx, NotificationContext.jsx
│       ├── layouts/                        # MainLayout.jsx, DashboardLayout.jsx
│       ├── pages/                          # Home, Login, Register, UserDashboard,
│       │                                   # SubmitComplaint, MyComplaints, ComplaintTracking,
│       │                                   # AdminDashboard, AdminComplaints, AdminUsers,
│       │                                   # StaffDashboard, NotFound
│       ├── services/                       # api.js, authService.js, complaintService.js,
│       │                                   # adminService.js, notificationService.js
│       ├── App.jsx                         # Application router & role protection
│       ├── index.css                       # Blue, white, light-grey design system
│       └── main.jsx                        # React root entry point
├── server/                                 # Express.js Backend
│   ├── config/
│   │   └── db.js                           # MongoDB Mongoose connection + auto fallback
│   ├── controllers/
│   │   ├── adminController.js              # Aggregation stats, user management
│   │   ├── authController.js               # Register, login, me, profile
│   │   ├── complaintController.js          # CRUD, assign, status update, remarks
│   │   └── notificationController.js       # Notifications fetch & read
│   ├── middleware/
│   │   ├── authMiddleware.js               # verifyToken & authorizeRoles
│   │   ├── errorHandler.js                 # Centralized error handler
│   │   └── uploadMiddleware.js             # Multer attachments handler
│   ├── models/
│   │   ├── Complaint.js                    # Schema with status history & remarks
│   │   ├── Notification.js                 # Notification schema
│   │   └── User.js                         # User schema with bcrypt pre-save
│   ├── routes/
│   │   ├── adminRoutes.js                  # /api/admin/*
│   │   ├── authRoutes.js                   # /api/auth/*
│   │   ├── complaintRoutes.js              # /api/complaints/*
│   │   └── notificationRoutes.js           # /api/notifications/*
│   ├── utils/
│   │   ├── generateId.js                   # CMP-YYYY-XXXX generator
│   │   └── seedData.js                     # Demo accounts & realistic complaint logs
│   ├── tests/
│   │   ├── e2e-verification.js             # 13-step comprehensive verification suite
│   │   └── run-all-tests.js                # In-process test runner
│   ├── uploads/                            # Stored file attachments
│   ├── .env.example                        # Environment variables template
│   ├── .env                                # Local configuration
│   ├── package.json                        # Backend dependencies
│   └── server.js                           # Express app entry & API mount
└── README.md                               # Project documentation
```

---

## ⚡ Quick Start & Execution Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+ installed
- **MongoDB** (Local instance or MongoDB Atlas URI). If local MongoDB is not running, the backend automatically starts an in-memory MongoDB instance for instant evaluation!

### 2. Environment Configuration
Create or inspect `server/.env` (a `.env.example` is also provided):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/complaint_management_db
JWT_SECRET=super_secret_jwt_key_smart_complaint_system_2026_secure!
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies

```bash
# In the server directory:
cd server
npm install

# In the client directory:
cd ../client
npm install
```

### 4. Running the Application

Open two terminal windows:

#### Terminal 1: Backend API
```bash
cd server
npm start
# Server starts on http://localhost:5000
```

#### Terminal 2: Frontend Web App
```bash
cd client
npm run dev
# Frontend starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Pre-Seeded Demo Credentials

The system comes pre-seeded with realistic demo accounts across all three user roles:

| Role | Email | Password | Department / Description |
|---|---|---|---|
| **Admin** | `admin@complaints.org` | `Password123` | Central Administration |
| **Staff (IT)** | `staff.it@complaints.org` | `Password123` | IT & Network |
| **Staff (Maint)** | `staff.maint@complaints.org` | `Password123` | Infrastructure & Maintenance |
| **Student** | `student@complaints.org` | `Password123` | Computer Science & Engineering |
| **Employee** | `employee@complaints.org` | `Password123` | Central Library |

> **Tip**: On the Login page (`/login`), click any of the **Fast Demo Login** buttons to autofill credentials with 1 click!

---

## 📡 API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register user (name, email, password, confirmPassword, phone, userType, department)
- `POST /api/auth/login`: Authenticate and receive JWT token
- `GET /api/auth/me`: Fetch authenticated user profile (Requires Bearer token)
- `PUT /api/auth/profile`: Update user profile (name, phone, department)

### Complaints (`/api/complaints`)
- `POST /api/complaints`: Submit a complaint (Supports `multipart/form-data` with attachments)
- `GET /api/complaints/my`: Get current logged-in user's complaints
- `GET /api/complaints`: Get complaints list (Role-filtered: Users see theirs; Staff see assigned/dept; Admins see all)
- `GET /api/complaints/:id`: Get full complaint details by MongoDB `_id` or `complaintId`
- `PUT /api/complaints/:id/status`: Update status (*Pending, In Progress, Resolved, Rejected*) & resolution summary
- `PUT /api/complaints/:id/assign`: Assign complaint to staff member (Admin only)
- `POST /api/complaints/:id/remarks`: Post official remark/discussion comment

### Admin Management (`/api/admin`)
- `GET /api/admin/dashboard`: Aggregate MongoDB counts (Users, Complaints, Priorities, Categories, Departments)
- `GET /api/admin/users`: Query all registered users with role and department filters
- `GET /api/admin/complaints`: Master complaints catalog for administrative dispatch
- `PUT /api/admin/users/:id/role`: Change user role, department, or active status

### Notifications (`/api/notifications`)
- `GET /api/notifications`: Retrieve latest notifications and unread count for user
- `PUT /api/notifications/:id/read`: Mark single notification as read
- `PUT /api/notifications/read-all`: Mark all notifications as read

---

## 🧪 Automated Testing

To run the complete 13-step end-to-end test suite that verifies database persistence, authentication, role authorization, complaint submission, staff assignment, and tracking:

```bash
cd server
node tests/run-all-tests.js
```

All 13 test suites verify:
1. API Health Check
2. New User Registration & JWT Issuance
3. User Login
4. Admin Login
5. Staff Login
6. Complaint Registration
7. My Complaints Retrieval
8. Admin Assigning Complaint to Staff
9. Staff Updating Status to "Resolved" with summary
10. Complainant Adding Remarks
11. Complaint Lifecycle Tracking & Timeline Audit Log
12. Notification Generation & Delivery
13. Admin Dashboard MongoDB Aggregations
