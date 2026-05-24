import React from 'react';
import { AccountingEntry } from '../types';
import { Coins, FileSpreadsheet } from 'lucide-react';

interface AccountingTableProps {
  entries: AccountingEntry[];
}

export default function AccountingTable({ entries = [] }: AccountingTableProps) {
  const safeEntries = entries || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
        <h3 className="text-xs font-black uppercase text-slate-900 tracking-tight">
          Audit Ledger Posting Ledger Lines
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/50 border-b border-slate-100">
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider w-28">
                Account Code
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                Account Head Description
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right w-44">
                Debit (Dr)
              </th>
              <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right w-44">
                Credit (Cr)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {safeEntries.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    No ledger entries mapped to this business event.
                  </p>
                </td>
              </tr>
            ) : (
              safeEntries.map((entry) => {
                const debitVal = entry.debit ?? 0;
                const creditVal = entry.credit ?? 0;
                const isDebit = debitVal > 0;
                return (
                  <tr key={entry.id} className="hover:bg-slate-50/20 transition-all">
                    <td className="px-6 py-4">
                      <span className="font-mono text-[10px] font-black text-indigo-600 uppercase">
                        #{entry.accountCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isDebit ? (
                          <span className="text-[8px] bg-slate-100 font-black text-slate-655 px-1 rounded">Dr</span>
                        ) : (
                          <span className="text-[8px] bg-slate-100 font-black text-slate-655 px-1 rounded pl-3">Cr</span>
                        )}
                        <span className="font-bold text-[10px] text-slate-800 uppercase tracking-tight">
                          {entry.accountName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[10.5px]">
                      {debitVal > 0 ? (
                        <span className="font-black text-emerald-600">
                          ₹{debitVal.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[10.5px]">
                      {creditVal > 0 ? (
                        <span className="font-black text-indigo-650">
                          ₹{creditVal.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
