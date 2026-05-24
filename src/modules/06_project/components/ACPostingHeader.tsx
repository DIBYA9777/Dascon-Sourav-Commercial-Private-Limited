import React from 'react';
import { ArrowLeft, BookOpen, Calendar, HelpCircle, Receipt } from 'lucide-react';
import PostingStatusBadge from './PostingStatusBadge';

interface ACPostingHeaderProps {
  referenceType: 'RA Bill' | 'Contractor Bill';
  referenceNo: string;
  date: string;
  status: 'Pending' | 'Posted';
  onBack: () => void;
}

export default function ACPostingHeader({
  referenceType,
  referenceNo,
  date,
  status,
  onBack
}: ACPostingHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs gap-4 mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all cursor-pointer mr-1"
          title="Back to Accounting Ledger"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-10 h-10 bg-emerald-50 text-emerald-650 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Journal Entry: {referenceNo}
            </h1>
            <PostingStatusBadge status={status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-slate-450 shrink-0" />
              Source Category: <span className="text-slate-700 normal-case">{referenceType}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-455 shrink-0" />
              Document Date: <span className="text-slate-700">{date}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-center">
        <span className="bg-emerald-50 border border-emerald-100/50 text-emerald-700 px-2.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
          Double-Entry Postings
        </span>
      </div>
    </div>
  );
}
