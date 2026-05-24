import React from 'react';
import { Calendar, User, FileText, ArrowLeft, Building2 } from 'lucide-react';
import RABillStatusBadge from './RABillStatusBadge';

interface RABillHeaderProps {
  clientName: string;
  billNo: string;
  date: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  onBack: () => void;
}

export default function RABillHeader({
  clientName,
  billNo,
  date,
  status,
  onBack
}: RABillHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs gap-4 mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all cursor-pointer mr-1"
          title="Back to List"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-10 h-10 bg-indigo-50 text-indigo-650 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">
              RA Client Bill: {billNo}
            </h1>
            <RABillStatusBadge status={status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              Client: <span className="text-slate-700 normal-case">{clientName}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              Date: <span className="text-slate-700">{date}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-center">
        <span className="bg-sky-50 border border-sky-100 text-sky-750 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
          Client Billing
        </span>
      </div>
    </div>
  );
}
