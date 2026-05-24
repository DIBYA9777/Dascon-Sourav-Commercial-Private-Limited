import React from 'react';
import { Boxes, HardHat, Cpu } from 'lucide-react';

interface PlanningTabsProps {
  activeTab: 'material' | 'labour' | 'machine';
  onChangeTab: (tab: 'material' | 'labour' | 'machine') => void;
  materialCount: number;
  labourCount: number;
  machineCount: number;
}

export default function PlanningTabs({
  activeTab,
  onChangeTab,
  materialCount,
  labourCount,
  machineCount
}: PlanningTabsProps) {
  return (
    <div className="flex border-b border-slate-100/40 gap-1 w-full text-left">
      <button
        onClick={() => onChangeTab('material')}
        className={`pb-3.5 px-5 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
          activeTab === 'material'
            ? 'border-indigo-600 text-indigo-700 font-extrabold'
            : 'border-transparent text-slate-400 hover:text-slate-800'
        }`}
      >
        <Boxes className="w-4 h-4" />
        Material Plan
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-black ${
          activeTab === 'material' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {materialCount}
        </span>
      </button>

      <button
        onClick={() => onChangeTab('labour')}
        className={`pb-3.5 px-5 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
          activeTab === 'labour'
            ? 'border-indigo-600 text-indigo-700 font-extrabold'
            : 'border-transparent text-slate-400 hover:text-slate-800'
        }`}
      >
        <HardHat className="w-4 h-4" />
        Labour Plan
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-black ${
          activeTab === 'labour' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {labourCount}
        </span>
      </button>

      <button
        onClick={() => onChangeTab('machine')}
        className={`pb-3.5 px-5 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
          activeTab === 'machine'
            ? 'border-indigo-600 text-indigo-700 font-extrabold'
            : 'border-transparent text-slate-400 hover:text-slate-800'
        }`}
      >
        <Cpu className="w-4 h-4" />
        Machine Plan
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-black ${
          activeTab === 'machine' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {machineCount}
        </span>
      </button>
    </div>
  );
}
