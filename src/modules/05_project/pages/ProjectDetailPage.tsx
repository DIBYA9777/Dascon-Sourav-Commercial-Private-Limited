import React from 'react';
import { ArrowLeft, Edit3, Calendar, FileText, MapPin, Building2 } from 'lucide-react';
import { Project } from '../types';
import { KNOWN_SITES } from '../services/projectService';
import ProjectCodeBadge from '../components/ProjectCodeBadge';
import ProjectStatusBadge from '../components/ProjectStatusBadge';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
}

export default function ProjectDetailPage({ project, onBack, onEdit }: ProjectDetailPageProps) {
  const siteName = KNOWN_SITES.find(s => s.id === project.siteId)?.name || 'Direct Allocation';

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <ProjectCodeBadge code={project.code} />
              <ProjectStatusBadge status={project.status} />
            </div>
            <h1 className="text-lg font-black text-slate-950 mt-1 uppercase tracking-tight">{project.name}</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Project MASTER INFRASTRUCTURE</p>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="self-start sm:self-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-4 text-xs font-black tracking-tight uppercase flex items-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          Edit Project
        </button>
      </div>

      {/* Main Grid Detail Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Client Name</h4>
            <div className="flex items-center gap-2 text-slate-800">
              <Building2 className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-black uppercase">{project.client}</p>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Project Location Site</h4>
            <div className="flex items-center gap-2 text-slate-800">
              <MapPin className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-bold">{siteName}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Commencement Date</h4>
            <div className="flex items-center gap-2 text-slate-800">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-bold font-mono">{project.startDate}</p>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Target End Date</h4>
            <div className="flex items-center gap-2 text-slate-800">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-bold font-mono">{project.endDate}</p>
            </div>
          </div>
        </div>

        {/* Project Description Scope */}
        <div className="space-y-2">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Consolidated Scope (Description)</h4>
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <p className="text-xs text-slate-600 font-bold leading-relaxed whitespace-pre-wrap italic">
              {project.description || 'No custom scope declarations documented.'}
            </p>
          </div>
        </div>

        {/* Linked Module Mapping Help Banner */}
        <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-105 flex items-start gap-3 mt-4">
          <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-blue-900 font-black uppercase tracking-wider">Engineering Node Sync</p>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed mt-1 text-left">
              WBS tree nodes, BOQs (Bill of Quantities), execution milestones, and vendor work contracts are synced directly with this core Project entity ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
