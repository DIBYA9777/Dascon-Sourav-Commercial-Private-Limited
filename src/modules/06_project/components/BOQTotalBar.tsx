import React from 'react';
import { Landmark } from 'lucide-react';

interface BOQTotalBarProps {
  totalAmount: number;
  itemCount: number;
}

export default function BOQTotalBar({ totalAmount, itemCount }: BOQTotalBarProps) {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-lg shadow-slate-900/15">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center font-bold">
          <Landmark className="w-5 h-5 text-blue-300" />
        </div>
        <div>
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest leading-none">Bill of Quantities valuation summary</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1">
            Total active registered lines: <span className="text-white font-extrabold">{itemCount} items</span>
          </p>
        </div>
      </div>

      <div className="text-left sm:text-right flex flex-col justify-center">
        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none">Aggregated baseline value</p>
        <p className="text-xl sm:text-2xl font-black text-white leading-none mt-1.5 font-mono">
          ₹{totalAmount.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}
