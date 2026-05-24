import React from 'react';
import { Calendar, Hash, Lock, History, CheckCircle } from 'lucide-react';
import { BOQ, Project } from '../types';
import BOQStatusBadge from './BOQStatusBadge';

interface BOQHeaderProps {
  boq: BOQ;
  project: Project | null;
  onStatusChange?: (status: BOQ['status']) => void;
}

export default function BOQHeader({ boq, project, onStatusChange }: BOQHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 flex flex-col md:flex-row justify-between gap-6 shadow-xs relative overflow-hidden text-left">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono font-black text-xs px-2.5 py-1 bg-slate-100 rounded-md flex items-center gap-1.5 text-slate-700">
            <Hash className="w-3.5 h-3.5" /> {boq.boqNo}
          </span>
          <BOQStatusBadge status={boq.status} />
          <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
            VERSION {boq.version}.0
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Associated Project</p>
            <p className="text-xs font-black text-slate-800 uppercase mt-1">
              {project ? `${project.code} - ${project.name}` : 'Unknown Project'}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Baseline Creation Date</p>
            <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {boq.date}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch md:items-center justify-end gap-3 shrink-0 self-start md:self-center">
        {boq.status !== 'Approved' ? (
          <button 
            type="button"
            onClick={() => onStatusChange?.('Approved')}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            Lock & Approve
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-black uppercase p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
              <Lock className="w-3.5 h-3.5" /> Checked & Locked
            </div>
            <button 
              type="button"
              onClick={() => onStatusChange?.('Revised')}
              className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <History className="w-4 h-4" />
              Open Revision (Revise BOQ)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
