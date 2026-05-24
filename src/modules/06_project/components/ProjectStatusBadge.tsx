import React, { memo } from 'react';
import { Project } from '../types';

const ProjectStatusBadge = memo(function ProjectStatusBadge({ status }: { status: Project['status'] }) {
  return (
    <span className={`inline-flex items-center text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
      status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
      status === 'Planning' ? 'bg-amber-50 text-amber-600' :
      status === 'Completed' ? 'bg-blue-50 text-blue-600' :
      'bg-slate-50 text-slate-400'
    }`}>
      {status}
    </span>
  );
});

export default ProjectStatusBadge;
