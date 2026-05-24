import React from 'react';

interface BOQStatusBadgeProps {
  status: 'Draft' | 'Approved' | 'Revised';
}

export default function BOQStatusBadge({ status }: BOQStatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Revised':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      default:
        return 'bg-amber-50 text-amber-600 border border-amber-100';
    }
  };

  return (
    <span className={`inline-flex items-center text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${getStyles()}`}>
      {status}
    </span>
  );
}
