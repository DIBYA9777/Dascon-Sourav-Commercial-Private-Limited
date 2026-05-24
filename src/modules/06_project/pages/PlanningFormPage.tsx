import React from 'react';
import { ArrowLeft, HardHat, FileSignature, Sparkles } from 'lucide-react';
import ActivityPlanForm from '../components/ActivityPlanForm';
import { ActivityPlan } from '../types';

interface PlanningFormPageProps {
  onBack: () => void;
  onSubmit: (activity: {
    activityName: string;
    startDate: string;
    endDate: string;
    plannedQty: number;
    unit: string;
    workers: number;
    equipment: string;
  }) => void;
  initialData?: ActivityPlan;
}

export default function PlanningFormPage({ onBack, onSubmit, initialData }: PlanningFormPageProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto text-left animate-in fade-in duration-300">
      {/* Back button and page indicator */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-white hover:bg-slate-50 border border-slate-250/60 text-slate-700 rounded-xl py-2 px-3 text-[10px] font-black tracking-tight uppercase flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Planning Dashboard
        </button>

        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Live validation enabled
        </span>
      </div>

      {/* Decorative Intro Banner */}
      <div className="bg-indigo-50/60 border border-indigo-100 text-slate-800 p-5 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
          <FileSignature className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-[9px] text-indigo-650 font-black uppercase tracking-widest leading-none">Resource modeling node</p>
          <p className="text-[10px] text-slate-600 font-bold mt-1">
            {initialData 
              ? 'Update the parameters below to save changes of the activity log.' 
              : 'Fill the parameters below to insert a new baseline activity log.'
            }
          </p>
        </div>
      </div>

      {/* Embedded form container */}
      <div className="bg-white rounded-2xl shadow-sm p-1">
        <ActivityPlanForm 
          onSubmit={onSubmit} 
          onClose={onBack} 
          initialData={initialData}
        />
      </div>
    </div>
  );
}
