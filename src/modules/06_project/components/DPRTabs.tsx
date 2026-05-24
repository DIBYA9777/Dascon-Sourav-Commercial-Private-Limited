import React from 'react';
import { Activity, UsersRound, Package, HardHat, FileText } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DPRWorkProgress, DPRLabour, DPRMaterial, DPRMachine } from '../types';
import WorkProgressTab from './WorkProgressTab';
import LabourTab from './LabourTab';
import MaterialTab from './MaterialTab';
import MachineTab from './MachineTab';
import RemarksTab from './RemarksTab';

type DPRTabType = 'WORK' | 'LABOUR' | 'MATERIAL' | 'MACHINE' | 'REMARKS';

interface DPRTabsProps {
  activeTab: DPRTabType;
  onTabChange: (tab: DPRTabType) => void;
  workProgress: DPRWorkProgress[];
  onWorkProgressChange: (wp: DPRWorkProgress[]) => void;
  labours: DPRLabour[];
  onLabourChange: (lab: DPRLabour[]) => void;
  materials: DPRMaterial[];
  onMaterialChange: (mat: DPRMaterial[]) => void;
  machines: DPRMachine[];
  onMachineChange: (mac: DPRMachine[]) => void;
  remarks: string;
  onRemarksChange: (rem: string) => void;
  isViewOnly?: boolean;
}

export default function DPRTabs({
  activeTab,
  onTabChange,
  workProgress,
  onWorkProgressChange,
  labours,
  onLabourChange,
  materials,
  onMaterialChange,
  machines,
  onMachineChange,
  remarks,
  onRemarksChange,
  isViewOnly = false
}: DPRTabsProps) {
  
  const tabs = [
    { id: 'WORK' as DPRTabType, label: 'Work Progress', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'LABOUR' as DPRTabType, label: 'Labour Deployments', icon: <UsersRound className="w-3.5 h-3.5" /> },
    { id: 'MATERIAL' as DPRTabType, label: 'Materials Consumed', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'MACHINE' as DPRTabType, label: 'Machinery Logs', icon: <HardHat className="w-3.5 h-3.5" /> },
    { id: 'REMARKS' as DPRTabType, label: 'Remarks & Delays', icon: <FileText className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Scrollable Tab header buttons */}
      <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none gap-2 pb-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer",
              activeTab === tab.id
                ? "border-slate-900 text-slate-950 font-black italic bg-slate-50/70 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-700"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render active content tab */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in duration-200">
        {activeTab === 'WORK' && (
          <WorkProgressTab 
            workProgress={workProgress} 
            onChange={onWorkProgressChange} 
            isViewOnly={isViewOnly} 
          />
        )}
        
        {activeTab === 'LABOUR' && (
          <LabourTab 
            labours={labours} 
            onChange={onLabourChange} 
            isViewOnly={isViewOnly} 
          />
        )}
        
        {activeTab === 'MATERIAL' && (
          <MaterialTab 
            materials={materials} 
            onChange={onMaterialChange} 
            isViewOnly={isViewOnly} 
          />
        )}
        
        {activeTab === 'MACHINE' && (
          <MachineTab 
            machines={machines} 
            onChange={onMachineChange} 
            isViewOnly={isViewOnly} 
          />
        )}
        
        {activeTab === 'REMARKS' && (
          <RemarksTab 
            remarks={remarks} 
            onChange={onRemarksChange} 
            isViewOnly={isViewOnly} 
          />
        )}
      </div>

    </div>
  );
}
