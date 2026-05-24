import React from 'react';
import { ShieldCheck, Users, Briefcase, Save } from 'lucide-react';
import SelfExecutionForm from './SelfExecutionForm';
import ContractorForm from './ContractorForm';

interface ExecutionTypeFormProps {
  activityName: string;
  type: 'Self' | 'Contractor';
  onTypeChange: (type: 'Self' | 'Contractor') => void;
  
  // Self properties
  internalLead: string;
  onLeadChange: (val: string) => void;
  crewCount: string;
  onCrewChange: (val: string) => void;
  
  // Contractor properties
  contractorName: string;
  onContractorChange: (val: string) => void;
  contractStartDate: string;
  onStartDateChange: (val: string) => void;
  contractEndDate: string;
  onEndDateChange: (val: string) => void;
  
  onSubmit: (e: React.FormEvent) => void;
  saveStatus: string | null;
}

export default function ExecutionTypeForm({
  activityName,
  type,
  onTypeChange,
  
  internalLead,
  onLeadChange,
  crewCount,
  onCrewChange,
  
  contractorName,
  onContractorChange,
  contractStartDate,
  onStartDateChange,
  contractEndDate,
  onEndDateChange,
  
  onSubmit,
  saveStatus
}: ExecutionTypeFormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} className="space-y-6 text-left">
      {saveStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100/50 rounded-xl text-[10px] font-black text-emerald-700 uppercase tracking-wide">
          {saveStatus}
        </div>
      )}

      {/* Selected Action Info */}
      <div className="bg-slate-550/5 p-4 rounded-xl border border-slate-100 bg-slate-50/20">
        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Mapping Strategy For:</span>
        <span className="text-xs font-black uppercase text-slate-800 tracking-tight mt-0.5 block">{activityName}</span>
      </div>

      {/* Action Type selectors */}
      <div className="space-y-2">
        <label className="block text-[8px] font-black text-slate-450 uppercase tracking-widest ml-1">
          Select Operational Category *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onTypeChange('Self')}
            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer text-left ${
              type === 'Self'
                ? 'border-indigo-600 bg-indigo-50/50 text-slate-900 shadow-3xs'
                : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${type === 'Self' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-500'}`}>
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight">Self-Execute</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Internal workforce</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${type === 'Self' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-white'}`}>
              {type === 'Self' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTypeChange('Contractor')}
            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer text-left ${
              type === 'Contractor'
                ? 'border-indigo-600 bg-indigo-50/50 text-slate-900 shadow-3xs'
                : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${type === 'Contractor' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-500'}`}>
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight">Contractor Outsource</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Trusted site vendors</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${type === 'Contractor' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-white'}`}>
              {type === 'Contractor' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </button>
        </div>
      </div>

      {/* Render subforms conditionally */}
      {type === 'Self' ? (
        <SelfExecutionForm
          internalLead={internalLead}
          onLeadChange={onLeadChange}
          crewCount={crewCount}
          onCrewChange={onCrewChange}
        />
      ) : (
        <ContractorForm
          contractorName={contractorName}
          onContractorChange={onContractorChange}
          contractStartDate={contractStartDate}
          onStartDateChange={onStartDateChange}
          contractEndDate={contractEndDate}
          onEndDateChange={onEndDateChange}
        />
      )}

      {/* Button Commit */}
      <button
        type="submit"
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        <Save className="w-4 h-4" /> Save Execution Strategy
      </button>
    </form>
  );
}
