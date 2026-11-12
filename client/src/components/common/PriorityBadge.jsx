import React from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export const PriorityBadge = ({ priority }) => {
  switch (priority) {
    case 'High':
      return (
        <span className="badge badge-priority-high">
          <ShieldAlert size={12} />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="badge badge-priority-medium">
          <AlertTriangle size={12} />
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className="badge badge-priority-low">
          <AlertCircle size={12} />
          Low
        </span>
      );
  }
};

export default PriorityBadge;
