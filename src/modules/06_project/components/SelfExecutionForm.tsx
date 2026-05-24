import React from 'react';
import { Users, ShieldCheck, Clipboard } from 'lucide-react';

interface SelfExecutionFormProps {
  internalLead: string;
  onLeadChange: (val: string) => void;
  crewCount: string;
  onCrewChange: (val: string) => void;
}

export default function SelfExecutionForm({
  internalLead,
  onLeadChange,
  crewCount,
  onCrewChange
}: SelfExecutionFormProps) {
  return (
    <div className="space-y-4 bg-slate-50/40 p-5 rounded-2xl border border-slate-100/50 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-amber-500" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Internal Resource Deployment</span>
      </div>

      <div className="space-y-1">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Internal Supervisor / Lead Engineer *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            placeholder="e.g. Senior Eng. Rajesh Kumar"
            value={internalLead}
            onChange={(e) => onLeadChange(e.target.value)}
            className="w-full bg-white border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-slate-800"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Workforce & Crew Description *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. 14 Technicians & Labours"
          value={crewCount}
          onChange={(e) => onCrewChange(e.target.value)}
          className="w-full bg-white border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-slate-800"
        />
      </div>

      <div className="pt-2 flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase leading-none">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>Fully covered under internal site safety logs</span>
      </div>
    </div>
  );
}
