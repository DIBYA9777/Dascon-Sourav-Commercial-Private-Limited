import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ActivityProgressSummary } from '../services/progressService';
import { AreaChart, AlertCircle } from 'lucide-react';

interface ProgressBarChartProps {
  activityData: ActivityProgressSummary[];
}

export default function ProgressBarChart({ activityData }: ProgressBarChartProps) {
  // Map our data to recharts expected parameters
  // Ensure we have a beautiful fallback if no activities match the filter
  const chartData = activityData.map(act => {
    // Shorten long name to keep chart tidy
    let shortName = act.activityName;
    if (shortName.length > 22) {
      shortName = shortName.substring(0, 20) + '...';
    }
    return {
      name: shortName,
      fullName: act.activityName,
      Planned: act.plannedQty,
      Achieved: act.achievedQty,
      unit: act.unit
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-950 text-white p-3.5 rounded-xl shadow-lg text-[10px] uppercase font-bold tracking-tight">
          <p className="text-slate-400 mb-2 normal-case font-black text-xs leading-tight">
            {data.fullName}
          </p>
          <div className="flex flex-col gap-1">
            <p className="flex items-center justify-between gap-6 dark:text-indigo-400">
              <span>📅 Planned:</span>
              <span className="text-white font-mono">{data.Planned} {data.unit}</span>
            </p>
            <p className="flex items-center justify-between gap-6 text-emerald-400">
              <span>✅ Achieved:</span>
              <span className="text-white font-mono">{data.Achieved} {data.unit}</span>
            </p>
            <p className="flex items-center justify-between gap-6 text-yellow-400 border-t border-slate-800 pt-1.5 mt-1.5">
              <span>🎯 Completion:</span>
              <span className="text-white font-mono">
                {data.Planned > 0 ? Math.round((data.Achieved / data.Planned) * 100) : 0}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-650">
            <AreaChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-tight">
              Planned vs Achieved Comparison Chart (Activity Wise)
            </h3>
            <p className="text-[8px] text-slate-400 uppercase tracking-widest font-extrabold leading-none mt-1">
              Visualizing quantum metrics deviation side-by-side
            </p>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl gap-2 p-4">
          <AlertCircle className="w-8 h-8 text-slate-350" />
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            No work progress data found for this selection
          </p>
          <p className="text-[9px] text-slate-400 max-w-xs leading-normal">
            Try choosing another month-period or verify that the selected project has planning activities configured.
          </p>
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 8, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: '#475569'
                }}
              />
              <Bar
                name="Planned"
                dataKey="Planned"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                name="Achieved"
                dataKey="Achieved"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
