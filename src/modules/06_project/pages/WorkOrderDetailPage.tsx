import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, Activity, FileText, CheckCircle } from 'lucide-react';
import { WorkOrder, Project } from '../types';
import WorkOrderStatusBadge from '../components/WorkOrderStatusBadge';
import WorkOrderApproval from '../components/WorkOrderApproval';
import WorkOrderForm from '../components/WorkOrderForm';

interface WorkOrderDetailPageProps {
  workOrder: WorkOrder;
  project?: Project;
  isAdmin: boolean;
  onBack: () => void;
  onUpdate: (updated: WorkOrder) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string, status: 'Approved' | 'Rejected') => void;
  activities: { id: string; activityName: string }[];
}

export default function WorkOrderDetailPage({
  workOrder,
  project,
  isAdmin,
  onBack,
  onUpdate,
  onDelete,
  onApprove,
  activities
}: WorkOrderDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-xl mx-auto text-left animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <button 
            type="button"
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel Editing
          </button>
          <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
            Modifying {workOrder.woNo}
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900 uppercase">Revamp Work Order Terms</h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Adjust contract valuations and task targets</p>
          </div>

          <WorkOrderForm 
            initialData={workOrder}
            activities={activities}
            onSubmit={(fields) => {
              onUpdate({
                ...workOrder,
                ...fields
              });
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-left animate-in fade-in duration-300">
      {/* NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Work Orders List
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Contract
          </button>

          {workOrder.status !== 'Pending' && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you calling off this registered contract draft permanently?')) {
                  onDelete(workOrder.id);
                  onBack();
                }
              }}
              className="px-3.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100/60 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Terminate WO
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTRACT SHIELD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Work Order Primary Metadata Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-3xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="font-mono font-black text-[10px] px-2.5 py-1 bg-slate-150 border border-slate-200 text-slate-700 rounded-lg uppercase tracking-wider">
                  {workOrder.woNo}
                </span>
                <h1 className="text-sm font-black text-slate-900 uppercase mt-2">{workOrder.contractorName}</h1>
              </div>
              <WorkOrderStatusBadge status={workOrder.status} />
            </div>

            {/* Project context block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/40">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Registered Project Code</p>
                <p className="text-slate-800 uppercase mt-1 font-mono">{project?.code || 'PRJ-N/A'}</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Full Workspace Location</p>
                <p className="text-slate-800 uppercase mt-1 truncate">{project?.name || 'General Project Scope'}</p>
              </div>
            </div>

            {/* Linked site activity */}
            <div className="space-y-1.5 bg-indigo-50/15 border border-indigo-100/40 p-4 rounded-2xl">
              <span className="inline-flex items-center gap-1 text-[8px] font-black text-indigo-650 uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 text-indigo-500" /> Linked Site Activity Node
              </span>
              <p className="text-xs font-bold text-indigo-950 uppercase leading-snug">
                {workOrder.activityName}
              </p>
            </div>

            {/* Detailed technical scope */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Technical Scope and Milestones
              </span>
              <div className="text-xs text-slate-600 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100/60 leading-relaxed italic">
                "{workOrder.scope}"
              </div>
            </div>
          </div>
        </div>

        {/* High-Impact Info Panel (Timeline / Fiscal stats) */}
        <div className="space-y-6">
          {/* Financial details card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-3xs space-y-4">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Financial Commissions Valuation
            </span>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3.5 text-emerald-800">
              <DollarSign className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[8px] font-bold uppercase text-emerald-600 leading-none">Net Contract Value</p>
                <p className="text-sm font-black text-emerald-700 mt-1 font-mono">
                  ₹{workOrder.amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-bold space-y-1.5 pt-2 border-t border-slate-50">
              <div className="flex justify-between">
                <span>WBS Target Share:</span>
                <span className="text-slate-800 font-black">100% Guaranteed</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Allocation:</span>
                <span className="text-slate-800 font-black">Inclusive of GST</span>
              </div>
            </div>
          </div>

          {/* Timeline Schedule Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-3xs space-y-4">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Scheduled Contract Duration
            </span>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-slate-700">
              <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[8px] font-bold uppercase text-slate-500 leading-none">Signing Timeline</p>
                <p className="text-xs font-black text-slate-800 mt-1 font-mono">
                  {workOrder.startDate} / {workOrder.endDate}
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-bold space-y-1.5 pt-2 border-t border-slate-50">
              <div className="flex justify-between">
                <span>Elapsed Progress:</span>
                <span className="text-indigo-600 font-extrabold uppercase animate-pulse">Pending Deployment</span>
              </div>
            </div>
          </div>

          {/* Work Order Approval Panel */}
          <WorkOrderApproval 
            status={workOrder.status}
            isAdmin={isAdmin}
            onApprove={() => onApprove(workOrder.id, 'Approved')}
            onReject={() => onApprove(workOrder.id, 'Rejected')}
          />
        </div>
      </div>
    </div>
  );
}
