import React from 'react';
import { Activity, Percent, ArrowRight } from 'lucide-react';
import { DPRWorkProgress } from '../types';

interface WorkProgressTabProps {
  workProgress: DPRWorkProgress[];
  onChange: (updated: DPRWorkProgress[]) => void;
  isViewOnly?: boolean;
}

export default function WorkProgressTab({ workProgress, onChange, isViewOnly = false }: WorkProgressTabProps) {
  const handleCompletedChange = (idx: number, val: number) => {
    const next = [...workProgress];
    const completed = Math.max(0, val);
    const pending = Math.max(0, next[idx].plannedQty - completed);
    next[idx] = {
      ...next[idx],
      completedQty: completed,
      pendingQty: pending
    };
    onChange(next);
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase">Work Milestones & Quantum</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Measure actual completed site task units versus target</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">WBS Activity Target</th>
              <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Planned Qty</th>
              <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Today Completed</th>
              <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Rem. Balance</th>
              <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Completion %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {workProgress.length > 0 ? (
              workProgress.map((item, idx) => {
                const pct = item.plannedQty > 0 ? Math.min(100, Math.round((item.completedQty / item.plannedQty) * 100)) : 0;
                return (
                  <tr key={item.activityId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-500 shrink-0" />
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tight leading-snug">{item.activityName}</p>
                          <span className="text-[9px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                            Unit: {item.unit}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-xs font-black text-slate-700">
                      {item.plannedQty.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-center">
                      {isViewOnly ? (
                        <span className="font-mono text-xs font-black text-slate-800 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg inline-block">
                          {item.completedQty.toLocaleString()}
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 max-w-[120px]">
                          <input
                            type="number"
                            min={0}
                            value={item.completedQty || ''}
                            onChange={(e) => handleCompletedChange(idx, Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg py-1 px-2.5 text-center text-xs font-black text-slate-900 outline-none transition-colors"
                          />
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-xs font-black">
                      <span className={item.pendingQty > 0 ? 'text-amber-600' : 'text-emerald-605'}>
                        {item.pendingQty.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1 max-w-[80px] mx-auto">
                        <span className="font-mono text-[10px] font-extrabold text-slate-700">
                          {pct}%
                        </span>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[10px] font-black text-slate-400 uppercase">
                  No linked activity configurations for WBS execution mapping.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
