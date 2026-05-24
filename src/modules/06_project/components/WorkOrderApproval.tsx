import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, Check, X } from 'lucide-react';

interface WorkOrderApprovalProps {
  status: 'Pending' | 'Approved' | 'Rejected';
  isAdmin: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export default function WorkOrderApproval({ status, isAdmin, onApprove, onReject }: WorkOrderApprovalProps) {
  if (status !== 'Pending') {
    return null;
  }

  return (
    <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl space-y-3">
      <div className="flex gap-2.5 text-[10px] text-amber-800 font-bold uppercase leading-tight">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
        <div>
          <p className="font-extrabold text-[10px] text-amber-850">Awaiting Authority approvals</p>
          <p className="text-[9px] text-amber-600 mt-0.5 normal-case font-medium">
            Administrative credentials are required to authorize this contract budget commitment. All modifications are logged.
          </p>
        </div>
      </div>

      {isAdmin ? (
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={onReject}
            className="flex-1 py-2.5 px-3 text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 hover:bg-rose-100/80 border border-rose-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Reject Contract
          </button>
          
          <button 
            type="button"
            onClick={onApprove}
            className="flex-1 py-2.5 px-3 text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" /> Approve & Sign
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 justify-center py-2 text-[9px] text-slate-400 border border-dashed border-slate-200 bg-white rounded-xl font-black uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-slate-350" /> Insufficient Authority Access
        </div>
      )}
    </div>
  );
}
