import React, { useState } from 'react';
import { Eye, Edit3, Archive, MoreVertical } from 'lucide-react';
import { Project } from '../types';

interface ProjectActionMenuProps {
  project: Project;
  onView: () => void;
  onEdit: () => void;
  onToggleDeactivate: () => void;
  key?: string;
}

export default function ProjectActionMenu({ 
  project, 
  onView, 
  onEdit, 
  onToggleDeactivate 
}: ProjectActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Fully transparent overlay to close dropdown on clicking anywhere outside */}
          <div 
            className="fixed inset-0 z-30 cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          
          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-150 rounded-xl shadow-lg z-40 py-1 divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-2xs font-extrabold uppercase text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                View Detail
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-2xs font-extrabold uppercase text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                Edit Details
              </button>
            </div>
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDeactivate();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-2xs font-extrabold uppercase transition-colors text-left cursor-pointer ${
                  project.status === 'Archived' 
                    ? 'text-emerald-700 hover:bg-emerald-50' 
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <Archive className={`w-3.5 h-3.5 ${project.status === 'Archived' ? 'text-emerald-500' : 'text-slate-400'}`} />
                {project.status === 'Archived' ? 'Activate' : 'Archive'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
