import React from 'react';
import { Calendar, Eye, Trash2 } from 'lucide-react';
import { WorkOrder } from '../types';
import WorkOrderStatusBadge from './WorkOrderStatusBadge';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onInspect: (wo: WorkOrder) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  key?: any;
}

export default function WorkOrderCard({ workOrder, onInspect, onDelete, isAdmin }: WorkOrderCardProps) {
  const { woNo, contractorName, activityName, amount, startDate, endDate, status } = workOrder;

  return (
    <div 
      className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 border-l-4 overflow-hidden group"
      style={{
        borderLeftColor: status === 'Approved' ? '#10b981' : status === 'Rejected' ? '#ef4444' : '#f59e0b'
      }}
    >
      <div className="space-y-3">
        {/* Header Metadata */}
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-[10px] px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 uppercase tracking-tight">
            {woNo}
          </span>
          <WorkOrderStatusBadge status={status} />
        </div>

        {/* Contractor and Activity Core Info */}
        <div>
          <h3 className="font-black text-slate-800 text-xs truncate uppercase tracking-tight leading-tight">
            {contractorName}
          </h3>
          <p className="text-[10px] font-extrabold text-indigo-600 uppercase mt-1 leading-tight">
            Activity: {activityName}
          </p>
        </div>

        {/* Budget Value and Schedule Grid */}
        <div className="text-[10px] text-slate-400 font-bold space-y-1.5 bg-slate-50/60 border border-slate-100/50 p-3 rounded-2xl">
          <div className="flex justify-between items-center">
            <span>Valuation:</span>
            <span className="font-black text-slate-900 text-xs">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-100/50">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Duration:
            </span>
            <span className="font-mono text-slate-600">{startDate} ~ {endDate}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
        <button 
          type="button"
          onClick={() => onInspect(workOrder)}
          className="text-[10px] text-slate-500 hover:text-indigo-650 font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:underline transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View Details
        </button>

        {status !== 'Pending' && onDelete && (
          <button 
            type="button"
            onClick={() => onDelete(workOrder.id)}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-350 hover:text-rose-500 transition-colors cursor-pointer"
            title="Remove work order record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
