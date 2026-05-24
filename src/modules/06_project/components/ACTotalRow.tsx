import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ACTotalRowProps {
  debitTotal: number;
  creditTotal: number;
}

export default function ACTotalRow({ debitTotal = 0, creditTotal = 0 }: ACTotalRowProps) {
  const safeDebit = debitTotal ?? 0;
  const safeCredit = creditTotal ?? 0;
  const isBalanced = safeDebit === safeCredit && safeDebit > 0;
  const difference = Math.abs(safeDebit - safeCredit);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4 font-sans text-left">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-3">
          {isBalanced ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-300">
              Double-Entry Compliance Status
            </h4>
            <p className={`text-[11px] font-bold ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isBalanced 
                ? 'Balanced Ledger (Equilibrium Achieved)' 
                : `Out of Balance (Discrepancy: ₹${difference.toLocaleString()})`
              }
            </p>
          </div>
        </div>

        {/* Totals */}
        <div className="flex items-center gap-8 justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
              Total Debits
            </span>
            <p className="font-mono text-xs font-black text-white mt-0.5">
              ₹{safeDebit.toLocaleString()}
            </p>
          </div>
          <div className="text-right border-l border-slate-800 pl-8">
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
              Total Credits
            </span>
            <p className="font-mono text-xs font-black text-white mt-0.5">
              ₹{safeCredit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {!isBalanced && (
        <div className="bg-rose-950/40 border border-rose-900/40 text-rose-350 p-2 text-[9px] rounded-lg font-black uppercase tracking-wide text-center">
          <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5 align-text-bottom" />
          Financial Post Blocked — Ledger must be balanced (Debit Total = Credit Total)
        </div>
      )}
    </div>
  );
}
