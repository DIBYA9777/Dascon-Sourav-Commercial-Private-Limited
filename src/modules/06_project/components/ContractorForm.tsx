import React from 'react';
import { Briefcase, Calendar, Info } from 'lucide-react';
import { KNOWN_CONTRACTORS } from '../hooks/useExecutionType';

interface ContractorFormProps {
  contractorName: string;
  onContractorChange: (val: string) => void;
  contractStartDate: string;
  onStartDateChange: (val: string) => void;
  contractEndDate: string;
  onEndDateChange: (val: string) => void;
}

export default function ContractorForm({
  contractorName,
  onContractorChange,
  contractStartDate,
  onStartDateChange,
  contractEndDate,
  onEndDateChange
}: ContractorFormProps) {
  return (
    <div className="space-y-4 bg-slate-50/40 p-5 rounded-2xl border border-slate-100/50 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="w-4 h-4 text-blue-500" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Sub-Contractor Outsource Profile</span>
      </div>

      <div className="space-y-1">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Registered Contractor Entity *
        </label>
        <select
          value={contractorName}
          onChange={(e) => onContractorChange(e.target.value)}
          className="w-full bg-white border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all text-slate-800 cursor-pointer"
        >
          {KNOWN_CONTRACTORS.map((con) => (
            <option key={con} value={con}>
              {con}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Contract Start Date *
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={contractStartDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full bg-white border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold font-mono outline-none focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Contract End Date *
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={contractEndDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full bg-white border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold font-mono outline-none focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-start gap-1.5 text-[9px] text-slate-400 font-bold uppercase leading-tight">
        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
        <span>Saves auto-populate corresponding Work Order registry pipelines.</span>
      </div>
    </div>
  );
}
