import React from 'react';
import { IndianRupee, ShieldCheck } from 'lucide-react';

interface SCBillTotalBarProps {
  totalAmount: number;
}

export default function SCBillTotalBar({ totalAmount }: SCBillTotalBarProps) {
  return (
    <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-5 rounded-2xl border border-slate-950 shadow-xs mt-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
          Total Certified Bill Value (Excl. Tax)
        </span>
      </div>
      <div className="flex items-center gap-1.5 font-sans">
        <span className="text-[10px] font-extrabold uppercase text-slate-400">Total =</span>
        <h2 className="text-lg font-black tracking-tight text-white flex items-center">
          <IndianRupee className="w-4 h-4 shrink-0 text-indigo-400" />
          {totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </h2>
      </div>
    </div>
  );
}
