import React from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Project } from '../types';
import ProjectForm from '../components/ProjectForm';

interface ProjectFormPageProps {
  project?: Project | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ProjectFormPage({ project, onCancel, onSuccess }: ProjectFormPageProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      {/* Header bar */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <button
          onClick={onCancel}
          type="button"
          className="p-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-700">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">
              {project ? `Modify Project: ${project.code}` : 'Register New Project Entity'}
            </h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">
              PROJECT MASTER FORM ENGINE
            </p>
          </div>
        </div>
      </div>

      {/* Main card wrapper */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sm:p-8">
        <ProjectForm project={project} onSuccess={onSuccess} onCancel={onCancel} />
      </div>
    </div>
  );
}
