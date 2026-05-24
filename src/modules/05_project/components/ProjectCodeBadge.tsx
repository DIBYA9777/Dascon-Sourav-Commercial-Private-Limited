import React from 'react';

export default function ProjectCodeBadge({ code }: { code: string }) {
  return (
    <span className="font-mono font-black text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">
      {code}
    </span>
  );
}
