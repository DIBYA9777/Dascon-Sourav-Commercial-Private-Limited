import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface WorkOrderStatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected';
  className?: string;
}

export default function WorkOrderStatusBadge({ status, className = '' }: WorkOrderStatusBadgeProps) {
  switch (status) {
    case 'Approved':
      return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tight px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          {status}
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tight px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full ${className}`}>
          <XCircle className="w-3 h-3 text-rose-500" />
          {status}
        </span>
      );
    case 'Pending':
    default:
      return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tight px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full ${className}`}>
          <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
          {status}
        </span>
      );
  }
}
