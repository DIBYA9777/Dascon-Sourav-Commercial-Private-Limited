import React from 'react';
import { Calendar, Building2, ShieldAlert } from 'lucide-react';
import { Project } from '../types';

interface DPRHeaderProps {
  project?: Project;
  date: string;
}

export default function DPRHeader({ project, date }: DPRHeaderProps) {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-slate-800 border border-slate-700/60 text-blue-400 rounded-2xl flex items-center justify-center font-bold">
          <Building2 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-black uppercase text-slate-400 font-mono">
              [{project?.code || 'PRJ'}] Daily Progress Report
            </h2>
          </div>
          <h1 className="text-sm font-black text-white uppercase mt-0.5 tracking-tight">
            {project?.name || 'Workspace Project'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700/60 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-300 w-fit self-start sm:self-auto font-mono">
        <Calendar className="w-4 h-4 text-blue-400" />
        {date}
      </div>
    </div>
  );
}
