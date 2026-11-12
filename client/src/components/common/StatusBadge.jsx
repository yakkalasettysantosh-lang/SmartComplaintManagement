import React from 'react';
import { Clock, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="badge badge-pending">
          <Clock size={12} />
          Pending
        </span>
      );
    case 'In Progress':
      return (
        <span className="badge badge-progress">
          <RefreshCw size={12} className="spin-slow" />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="badge badge-resolved">
          <CheckCircle2 size={12} />
          Resolved
        </span>
      );
    case 'Rejected':
      return (
        <span className="badge badge-rejected">
          <XCircle size={12} />
          Rejected
        </span>
      );
    default:
      return <span className="badge">{status || 'Unknown'}</span>;
  }
};

export default StatusBadge;
