import React from 'react';
import { Layers, Calendar, HardHat, FileBadge } from 'lucide-react';
import { Project, ActivityPlan } from '../types';

interface PlanningHeaderProps {
  project: Project | null;
  activityPlan: ActivityPlan | null;
  projects: Project[];
  selectedProjectId: string;
  onProjectChange: (id: string) => void;
}

export default function PlanningHeader({
  project,
  activityPlan,
  projects,
  selectedProjectId,
  onProjectChange
}: PlanningHeaderProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6 text-left border-none">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Module title & description */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center font-bold">
            <Layers className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Activity Planning Center
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">
              Draft materials, human capital demands, and machine distributions
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden sm:block shrink-0">
            Project Workspace:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full sm:w-auto min-w-0 max-w-full sm:max-w-[280px] md:max-w-[360px] bg-white hover:bg-slate-50 text-slate-800 border border-slate-250/80 rounded-xl py-2 px-3 text-xs font-black outline-none cursor-pointer shadow-1xs transition-all truncate"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.code}] {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {project && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50/40 p-4 rounded-xl border border-slate-100/50">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Selected Project</p>
            <p className="text-xs font-black text-slate-800 uppercase truncate">{project.name}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Client Name</p>
            <p className="text-xs font-bold text-slate-600 uppercase truncate">{project.client}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Project Code</p>
            <div className="flex items-center gap-1">
              <span className="font-mono font-black text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                {project.code}
              </span>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-sans">Timeline Limits</p>
            <p className="text-xs font-bold text-slate-500 font-mono">
              {project.startDate} to {project.endDate}
            </p>
          </div>
        </div>
      )}

      {activityPlan && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-4 border-t border-slate-100/30 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-950 uppercase tracking-tight">
                {activityPlan.activityName}
              </span>
              <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded">
                Active Node
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-semibold uppercase font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Plan Time: {activityPlan.startDate} to {activityPlan.endDate}
              </span>
              <span>•</span>
              <span className="text-indigo-600 font-black">
                Target Volume: {activityPlan.plannedQty.toLocaleString()} {activityPlan.unit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 py-1.5 bg-slate-50 border border-slate-100/40 rounded-xl font-bold text-[10px] text-slate-700 flex items-center gap-1.5">
              <HardHat className="w-4 h-4 text-slate-400" />
              <span>{activityPlan.workers} workers onsite limit</span>
            </div>
            {activityPlan.equipment && (
              <div className="p-2 py-1.5 bg-slate-50 border border-slate-100/40 rounded-xl font-bold text-[10px] text-slate-700 flex items-center gap-1.5">
                <FileBadge className="w-4 h-4 text-slate-400" />
                <span>Machinery allocation summary: {activityPlan.equipment}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
