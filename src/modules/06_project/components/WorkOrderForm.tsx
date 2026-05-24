import React from 'react';
import { Plus, Save, FileText, AlertCircle } from 'lucide-react';
import { WorkOrder } from '../types';
import { KNOWN_CONTRACTORS } from '../hooks/useExecutionType';
import { useWorkOrderForm } from '../hooks/useWorkOrderForm';

interface WorkOrderFormProps {
  initialData?: WorkOrder;
  onSubmit: (data: Omit<WorkOrder, 'id' | 'woNo'>) => void;
  onCancel: () => void;
  activities: { id: string; activityName: string }[];
}

export default function WorkOrderForm({ initialData, onSubmit, onCancel, activities }: WorkOrderFormProps) {
  const {
    contractorName,
    setContractorName,
    activityName,
    setActivityName,
    amount,
    setAmount,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    scope,
    setScope,
    status,
    setStatus,
    error,
    handleSubmit
  } = useWorkOrderForm({ initialData, onSubmit, activities });

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {/* Informative Auto WO No alert if editing */}
      <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-500" />
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none">
            Contract Number Reference
          </p>
          <p className="text-xs font-black text-slate-800 mt-1 uppercase font-mono">
            {initialData ? initialData.woNo : 'AUTO_GENERATED_ON_SAVE'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-xl flex items-start gap-2 text-[10px] font-black text-rose-600 uppercase">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Subcontractor Choice */}
      <div className="space-y-1">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Assigned Subcontractor *
        </label>
        <select 
          value={contractorName}
          onChange={e => setContractorName(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 hover:bg-slate-100/50 rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-slate-800 transition-all cursor-pointer"
        >
          {KNOWN_CONTRACTORS.map(con => (
            <option key={con} value={con}>{con}</option>
          ))}
        </select>
      </div>

      {/* Linked Task Module Choice */}
      <div className="space-y-1">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Task Activity Node *
        </label>
        {activities.length > 0 ? (
          <select 
            value={activityName}
            onChange={e => setActivityName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 hover:bg-slate-100/50 rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-slate-800 transition-all cursor-pointer"
          >
            {activities.map(act => (
              <option key={act.id} value={act.activityName}>{act.activityName}</option>
            ))}
          </select>
        ) : (
          <input 
            type="text"
            required
            placeholder="e.g. Earth excavation and backfill"
            value={activityName}
            onChange={e => setActivityName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-slate-800 transition-all"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Value Tag */}
        <div className="space-y-1">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Commissions Value (₹) *
          </label>
          <input 
            type="number"
            required
            min={1}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-slate-800 transition-all"
          />
        </div>

        {/* Status Tag (only displayed when editing) */}
        {initialData && (
          <div className="space-y-1">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Signing Status State
            </label>
            <select 
              value={status}
              onChange={e => setStatus(e.target.value as 'Pending' | 'Approved' | 'Rejected')}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-slate-800 transition-all cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Date Span Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Commencing Timeline
          </label>
          <input 
            type="date"
            required
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs font-bold outline-none font-mono text-slate-850"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Deadline Scheduled
          </label>
          <input 
            type="date"
            required
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs font-bold outline-none font-mono text-slate-850"
          />
        </div>
      </div>

      {/* Scope Block */}
      <div className="space-y-1">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Detailed Technical Scope of work
        </label>
        <textarea 
          rows={3}
          placeholder="Summarize key labor milestones, material specifications, machinery requirements or checklists..."
          value={scope}
          onChange={e => setScope(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl p-3.5 text-xs font-bold outline-none text-slate-700 resize-none transition-all leading-normal"
        />
      </div>

      {/* Trigger Buttons */}
      <div className="flex gap-2.5 pt-2 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 py-3 text-2xs font-black uppercase tracking-widest border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          Decline Draft
        </button>

        <button 
          type="submit" 
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-2xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          {initialData ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {initialData ? 'Save Signed Changes' : 'Draft Work Order'}
        </button>
      </div>
    </form>
  );
}
