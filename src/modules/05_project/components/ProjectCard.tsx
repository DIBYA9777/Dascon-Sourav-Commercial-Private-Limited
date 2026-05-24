import React from 'react';
import { Calendar } from 'lucide-react';
import { Project } from '../types';
import ProjectCodeBadge from './ProjectCodeBadge';
import ProjectStatusBadge from './ProjectStatusBadge';
import ProjectActionMenu from './ProjectActionMenu';

interface ProjectCardProps {
  project: Project;
  onView: () => void;
  onEdit: () => void;
  onToggleDeactivate: () => void;
  key?: string;
}

export default function ProjectCard({ 
  project, 
  onView, 
  onEdit, 
  onToggleDeactivate 
}: ProjectCardProps) {
  return (
    <div className="p-4 space-y-3 bg-white hover:bg-slate-50/40 transition-colors">
      <div className="flex items-center justify-between">
        <ProjectCodeBadge code={project.code} />
        <div className="flex items-center gap-2">
          <ProjectStatusBadge status={project.status} />
          <ProjectActionMenu 
            project={project} 
            onView={onView} 
            onEdit={onEdit} 
            onToggleDeactivate={onToggleDeactivate} 
          />
        </div>
      </div>
      <div>
        <h3 className="font-black text-slate-800 text-xs">{project.name}</h3>
        <p className="text-[10px] text-slate-400 font-bold">Client: {project.client}</p>
      </div>
      <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-350" />
        <span>{project.startDate}</span> to <span>{project.endDate}</span>
      </div>
    </div>
  );
}
