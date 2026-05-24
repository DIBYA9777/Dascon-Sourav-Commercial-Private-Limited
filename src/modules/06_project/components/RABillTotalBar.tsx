import React from 'react';
import { IndianRupee, ShieldCheck, Landmark } from 'lucide-react';

interface RABillTotalBarProps {
  subtotal: number;
  gstRate?: number;
  gstAmount: number;
  grandTotal: number;
}

export default function RABillTotalBar({
  subtotal,
  gstRate = 18,
  gstAmount,
  grandTotal
}: RABillTotalBarProps) {
  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-950 p-6 shadow-md mt-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
            Government Taxation & GST Audits
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono">
          <div className="flex gap-2">
            <span className="text-[10px] font-bold text-slate-400">SUBTOTAL:</span>
            <span className="text-[10px] font-black text-slate-200">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex gap-2 border-l border-slate-800 pl-4">
            <span className="text-[10px] font-bold text-slate-400">GST ({gstRate}%):</span>
            <span className="text-[10px] font-black text-slate-200">₹{gstAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-black uppercase text-slate-300 tracking-wider">
            Grand Certified Client Invoice Value
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-sans">
          <span className="text-[9px] font-extrabold uppercase text-slate-400">NET RA PAYABLE =</span>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center">
            <IndianRupee className="w-4 h-4 shrink-0 text-emerald-400" />
            {grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </h2>
        </div>
      </div>
    </div>
  );
}
