import React from 'react';

interface RABillStatusBadgeProps {
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
}

export default function RABillStatusBadge({ status }: RABillStatusBadgeProps) {
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  
  if (status === 'Submitted') {
    badgeColor = 'bg-amber-100 text-amber-850 border-amber-200';
  } else if (status === 'Approved') {
    badgeColor = 'bg-emerald-100 text-emerald-850 border-emerald-200';
  } else if (status === 'Rejected') {
    badgeColor = 'bg-rose-100 text-rose-850 border-rose-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${badgeColor}`}>
      {status === 'Approved' ? 'PASSED' : status}
    </span>
  );
}
