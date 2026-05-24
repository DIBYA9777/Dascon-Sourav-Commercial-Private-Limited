import React from 'react';

interface PostingStatusBadgeProps {
  status: 'Pending' | 'Posted';
}

export default function PostingStatusBadge({ status }: PostingStatusBadgeProps) {
  let badgeStyle = 'bg-amber-100 text-amber-850 border-amber-200';

  if (status === 'Posted') {
    badgeStyle = 'bg-emerald-100 text-emerald-850 border-emerald-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${badgeStyle}`}>
      {status === 'Posted' ? 'Passed' : status}
    </span>
  );
}
