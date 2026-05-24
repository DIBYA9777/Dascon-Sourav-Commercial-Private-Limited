import React from 'react';

interface SCBillStatusBadgeProps {
  status: 'Submitted' | 'Approved' | 'Rejected';
}

export default function SCBillStatusBadge({ status }: SCBillStatusBadgeProps) {
  let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  if (status === 'Approved') {
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (status === 'Rejected') {
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${badgeColor}`}>
      {status === 'Approved' ? 'PASSED' : status}
    </span>
  );
}
