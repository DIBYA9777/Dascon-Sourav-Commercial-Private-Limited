import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ShieldCheck, CheckSquare, Edit3 } from 'lucide-react';
import { Project, DPRWorkProgress, DPRLabour, DPRMaterial, DPRMachine } from '../types';
import DPRHeader from '../components/DPRHeader';
import DPRTabs from '../components/DPRTabs';

type DPRTabType = 'WORK' | 'LABOUR' | 'MATERIAL' | 'MACHINE' | 'REMARKS';

interface DPREntryPageProps {
  project?: Project;
  date: string;
  initialStatus?: 'Pending' | 'Submitted';
  initialWorkProgress: DPRWorkProgress[];
  initialLabours: DPRLabour[];
  initialMaterials: DPRMaterial[];
  initialMachines: DPRMachine[];
  initialRemarks: string;
  onBack: () => void;
  onSave: (status: 'Pending' | 'Submitted') => void;
  
  // State hook binders
  activeTab: DPRTabType;
  setActiveTab: (tab: DPRTabType) => void;
  workProgress: DPRWorkProgress[];
  setWorkProgress: (wp: DPRWorkProgress[]) => void;
  labours: DPRLabour[];
  setLabours: (lab: DPRLabour[]) => void;
  materials: DPRMaterial[];
  setMaterials: (mat: DPRMaterial[]) => void;
  machines: DPRMachine[];
  setMachines: (mac: DPRMachine[]) => void;
  remarks: string;
  setRemarks: (rem: string) => void;
}

export default function DPREntryPage({
  project,
  date,
  initialStatus = 'Pending',
  onBack,
  onSave,

  activeTab,
  setActiveTab,
  workProgress,
  setWorkProgress,
  labours,
  setLabours,
  materials,
  setMaterials,
  machines,
  setMachines,
  remarks,
  setRemarks
}: DPREntryPageProps) {
  
  const [status, setStatus] = useState<'Pending' | 'Submitted'>(initialStatus);

  const handleSaveAndSubmit = (nextStatus: 'Pending' | 'Submitted') => {
    onSave(nextStatus);
    setStatus(nextStatus);
  };

  const isViewOnly = status === 'Submitted';

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left animate-in fade-in duration-300">
      
      {/* 1. TOP NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back to DPR Logs List
        </button>

        {/* Form submission header triggers */}
        <div className="flex items-center gap-2">
          {!isViewOnly ? (
            <>
              <button
                type="button"
                onClick={() => handleSaveAndSubmit('Pending')}
                className="px-4 py-2 bg-white border border-slate-205 text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" /> Save as Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Submit this Daily Progress Report final copy? Locked from further changes.')) {
                    handleSaveAndSubmit('Submitted');
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white animate-pulse" /> Submit Final Report
              </button>
            </>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-black uppercase tracking-wider px-3.5 py-2 rounded-xl">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Signed & Submitted to Authority
            </div>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC HEADER COMPONENT */}
      <DPRHeader project={project} date={date} />

      {/* 3. SUBMISSION ALERT INFO */}
      {!isViewOnly && (
        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-800 leading-relaxed font-bold">
          <Edit3 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-[10px] uppercase">
            <p className="font-extrabold text-amber-850">Editing mode: Active DPR session draft</p>
            <p className="text-[9px] text-amber-600 normal-case font-medium mt-0.5">
              Fill out each tab to record actual WBS completed progress, active labor roster headcount, materials used, and machinery operations. Log delays in the remarks tab.
            </p>
          </div>
        </div>
      )}

      {/* 4. MAIN MULTI-TABBED CONTAINER */}
      <DPRTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        workProgress={workProgress}
        onWorkProgressChange={(wp) => !isViewOnly && setWorkProgress(wp)}
        labours={labours}
        onLabourChange={(lab) => !isViewOnly && setLabours(lab)}
        materials={materials}
        onMaterialChange={(mat) => !isViewOnly && setMaterials(mat)}
        machines={machines}
        onMachineChange={(mac) => !isViewOnly && setMachines(mac)}
        remarks={remarks}
        onRemarksChange={(rem) => !isViewOnly && setRemarks(rem)}
        isViewOnly={isViewOnly}
      />

    </div>
  );
}
