const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorRole: {
      type: String,
      enum: ['user', 'admin', 'staff'],
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updaterName: {
      type: String,
      default: 'System'
    },
    updaterRole: {
      type: String,
      default: 'system'
    },
    remarks: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Academic',
        'Hostel & Housing',
        'Infrastructure & Maintenance',
        'IT & Network',
        'Library',
        'Transportation',
        'Canteen & Food',
        'Administrative & Accounts',
        'Security & Safety',
        'Other'
      ]
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Target department is required'],
      trim: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    remarks: [remarkSchema],
    statusHistory: [statusHistorySchema],
    resolvedAt: {
      type: Date,
      default: null
    },
    resolutionSummary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for search performance
complaintSchema.index({ complaintId: 1, status: 1, department: 1, priority: 1, submittedBy: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
