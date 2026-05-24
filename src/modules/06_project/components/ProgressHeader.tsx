import React from 'react';
import { Project } from '../types';
import { Calendar, Layers, RefreshCw, Sparkles } from 'lucide-react';

interface ProgressHeaderProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectChange: (id: string) => void;
  periods: { label: string; value: string }[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onRefresh: () => void;
}

export default function ProgressHeader({
  projects,
  selectedProjectId,
  onProjectChange,
  periods,
  selectedPeriod,
  onPeriodChange,
  onRefresh
}: ProgressHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
          <Layers className="w-5 h-5 text-indigo-400 animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            Planned vs Achieved Progress
            <span className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-650 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
              <Sparkles className="w-2.5 h-2.5" /> Monitoring
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mt-1">
            Execution Phase & Task Deviation Analysis
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Project Select */}
        <div className="flex flex-col">
          <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
            Active Project
          </label>
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => onProjectChange(e.target.value)}
              className="w-56 bg-slate-50 border border-slate-200 text-slate-800 text-[10px] uppercase font-bold tracking-tight rounded-lg px-2.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all cursor-pointer"
            >
              <option value="" disabled>Select Project...</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name} ({proj.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Period Select */}
        <div className="flex flex-col">
          <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
            Reporting Period (Month)
          </label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="w-36 bg-slate-50 border border-slate-200 text-slate-800 text-[10px] uppercase font-bold tracking-tight rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all cursor-pointer"
            >
              {periods.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="self-end p-2 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 rounded-lg transition-all h-[34px] flex items-center justify-center cursor-pointer"
          title="Refresh calculations"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
