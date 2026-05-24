import React from 'react';
import { ActivityProgressSummary } from '../services/progressService';
import { Calendar, CheckSquare, Clock, ArrowRight, AlertCircle } from 'lucide-react';

interface ProgressTableProps {
  activityData: ActivityProgressSummary[];
}

export default function ProgressTable({ activityData }: ProgressTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
            Activity Wise Progress Metrics Table
          </h3>
          <p className="text-[8px] text-slate-400 uppercase tracking-widest font-extrabold leading-none mt-1">
            Audit-ready target versus achievement logs
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100">
              <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                WBS Activity
              </th>
              <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                Planned Schedule
              </th>
              <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">
                Planned Qty
              </th>
              <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">
                Achieved Qty
              </th>
              <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">
                Progress Status
              </th>
              <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">
                Delay
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activityData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-center gap-1.5 p-4">
                    <CheckSquare className="w-6 h-6 text-slate-300" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      No Activities configured
                    </span>
                    <p className="text-[9px] text-slate-400 max-w-sm">
                      Configure activities under WBS Planning or choose another dynamic reporting filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              activityData.map((act) => {
                // Determine batch coloring
                let progressColor = 'bg-slate-100 text-slate-700 border-slate-200';
                if (act.progressPercent >= 100) {
                  progressColor = 'bg-emerald-50 text-emerald-700 border-emerald-150';
                } else if (act.progressPercent >= 50) {
                  progressColor = 'bg-indigo-50 text-indigo-700 border-indigo-150';
                } else if (act.progressPercent > 0) {
                  progressColor = 'bg-amber-50 text-amber-700 border-amber-150';
                } else {
                  progressColor = 'bg-rose-50 text-rose-700 border-rose-150';
                }

                return (
                  <tr key={act.activityId} className="hover:bg-slate-50/50 transition-all font-sans">
                    {/* Activity name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 shrink-0">
                          <CheckSquare className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-800 tracking-tight leading-tight">
                            {act.activityName}
                          </p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">
                            Unit: {act.unit}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Planned Range */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{act.startDate}</span>
                        <ArrowRight className="w-3 h-3 text-slate-350" />
                        <span>{act.endDate}</span>
                      </div>
                    </td>

                    {/* Planned Quantity */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {act.plannedQty.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-slate-400 uppercase font-black tracking-wider ml-1">
                        {act.unit}
                      </span>
                    </td>

                    {/* Achieved Quantity */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {act.achievedQty.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-slate-400 uppercase font-black tracking-wider ml-1">
                        {act.unit}
                      </span>
                    </td>

                    {/* Progress percentage bar + badge */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center gap-1.5 w-full">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border ${progressColor}`}>
                          {act.progressPercent}% COMPLETE
                        </span>
                        <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-current h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min(100, act.progressPercent)}%`,
                              color: act.progressPercent >= 100 ? '#10b981' : act.progressPercent >= 50 ? '#6366f1' : act.progressPercent > 0 ? '#f59e0b' : '#ef4444'
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Delay */}
                    <td className="px-6 py-4 text-right">
                      {act.delayDays > 0 ? (
                        <div className="flex items-center justify-end gap-1 text-rose-600 font-bold">
                          <Clock className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="text-xs font-black">{act.delayDays}</span>
                          <span className="text-[8px] uppercase">Days</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase bg-slate-50 px-2 py-0.5 rounded tracking-wider">
                          On Schedule
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
