import React from 'react';
import { Target, CheckCircle2, Percent, AlertTriangle } from 'lucide-react';

interface ProgressSummaryCardsProps {
  plannedProgress: number;
  achievedProgress: number;
  overallProgressPercent: number;
  delayDays: number;
}

export default function ProgressSummaryCards({
  plannedProgress,
  achievedProgress,
  overallProgressPercent,
  delayDays
}: ProgressSummaryCardsProps) {
  // If we have some values, try to display them elegantly.
  // The user guide states: 4 cards - Planned Progress (2000 Mtr), Achieved Progress (1200 Mtr), Overall Progress (60%), Delay (5 Days)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* CARD 1: PLANNED PROGRESS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs hover:shadow-xs transition-all flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
            Planned Progress
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight font-sans">
            {plannedProgress.toLocaleString()} <span className="text-[10px] font-bold text-slate-500 lowercase">Mtr</span>
          </h2>
          <span className="text-[8px] text-slate-400 font-bold leading-normal">
            Scheduled targeted quantity in WBS
          </span>
        </div>
        <div className="w-10 h-10 bg-indigo-50 text-indigo-650 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      {/* CARD 2: ACHIEVED PROGRESS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs hover:shadow-xs transition-all flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
            Achieved Progress
          </span>
          <h2 className="text-xl font-black text-slate-950 tracking-tight font-sans">
            {achievedProgress.toLocaleString()} <span className="text-[10px] font-bold text-slate-500 lowercase">Mtr</span>
          </h2>
          <span className="text-[8px] text-slate-400 font-bold leading-normal">
            Sum of certified daily progress reports
          </span>
        </div>
        <div className="w-10 h-10 bg-emerald-50 text-emerald-650 rounded-xl flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      {/* CARD 3: OVERALL PROGRESS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs hover:shadow-xs transition-all flex items-center justify-between">
        <div className="flex flex-col gap-1.5 animate-fade-in">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
            Overall Progress
          </span>
          <h2 className="text-xl font-black text-indigo-950 tracking-tight font-sans">
            {overallProgressPercent}%
          </h2>
          <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-indigo-650 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, overallProgressPercent)}%` }}
            />
          </div>
        </div>
        <div className="w-10 h-10 bg-violet-50 text-violet-650 rounded-xl flex items-center justify-center">
          <Percent className="w-5 h-5 text-violet-500" />
        </div>
      </div>

      {/* CARD 4: DELAY */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs hover:shadow-xs transition-all flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
            Critical Delay
          </span>
          <h2 className="text-xl font-black text-rose-600 tracking-tight font-sans flex items-baseline gap-1">
            {delayDays} <span className="text-[10px] font-bold text-rose-500 uppercase">Days</span>
          </h2>
          <span className="text-[8px] text-rose-500 font-black tracking-wide bg-rose-50 px-1.5 py-0.5 rounded uppercase self-start">
            {delayDays > 0 ? 'NEEDS INTERVENTION' : 'ON TRACK'}
          </span>
        </div>
        <div className="w-10 h-10 bg-rose-50 text-rose-650 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
