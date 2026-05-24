import React, { memo } from 'react';

const ProjectCodeBadge = memo(function ProjectCodeBadge({ code }: { code: string }) {
  return (
    <span className="font-mono font-black text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">
      {code}
    </span>
  );
});

export default ProjectCodeBadge;
