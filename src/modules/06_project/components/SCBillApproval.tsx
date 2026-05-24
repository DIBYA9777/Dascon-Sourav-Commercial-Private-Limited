import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, Check, X, MessageSquare } from 'lucide-react';
import { UserRole } from '@/src/types';

interface SCBillApprovalProps {
  status: 'Submitted' | 'Approved' | 'Rejected';
  userRole?: string;
  onApprove: (remarks?: string) => void;
  onReject: (remarks?: string) => void;
}

export default function SCBillApproval({
  status,
  userRole,
  onApprove,
  onReject
}: SCBillApprovalProps) {
  const [remarks, setRemarks] = useState('');
  const [showRemarksInput, setShowRemarksInput] = useState(false);
  const [activeAction, setActiveAction] = useState<'Approve' | 'Reject' | null>(null);

  if (status !== 'Submitted') {
    return null;
  }

  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAction === 'Approve') {
      onApprove(remarks);
    } else if (activeAction === 'Reject') {
      onReject(remarks);
    }
    // Clean up
    setRemarks('');
    setShowRemarksInput(false);
    setActiveAction(null);
  };

  return (
    <div className="bg-amber-50/60 border border-amber-100 p-5 rounded-2xl space-y-4">
      <div className="flex gap-2.5 text-[10px] text-amber-800 font-bold uppercase leading-tight">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
        <div>
          <p className="font-extrabold text-[10px] text-amber-850">Awaiting SuperAdmin Approvals</p>
          <p className="text-[9px] text-amber-600 mt-0.5 normal-case font-medium">
            This sub-contractor bill requires critical validation. SuperAdmin authority is required to approve payouts or reject the submission.
          </p>
        </div>
      </div>

      {isSuperAdmin ? (
        <div className="space-y-3">
          {!showRemarksInput ? (
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveAction('Reject');
                  setShowRemarksInput(true);
                }}
                className="flex-1 py-2.5 px-3 text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 hover:bg-rose-100/80 border border-rose-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Reject Bill
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveAction('Approve');
                  setShowRemarksInput(true);
                }}
                className="flex-1 py-2.5 px-3 text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> Pass Bill
              </button>
            </div>
          ) : (
            <form onSubmit={handleAction} className="space-y-3 animation-fade-in">
              <div className="flex flex-col">
                <label className="text-[8px] font-black text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-amber-500" />
                  Approval/Rejection Comments (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={`Provide a reason for this ${activeAction === 'Approve' ? 'passing' : 'rejection'}...`}
                  className="w-full bg-white border border-amber-200 text-slate-850 text-[10px] font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all h-16 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowRemarksInput(false);
                    setActiveAction(null);
                  }}
                  className="flex-1 py-2 px-3 text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 px-3 text-[9px] font-black uppercase tracking-wider text-white rounded-lg transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1 ${
                    activeAction === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {activeAction === 'Approve' ? 'Pass' : activeAction}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 justify-center py-2.5 text-[9px] text-slate-400 border border-dashed border-slate-200 bg-white rounded-xl font-black uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-slate-350" /> SuperAdmin Authentication Required To Take Action
        </div>
      )}
    </div>
  );
}
