import React from 'react';
import { BOQItem } from '../types';
import BOQItemRow from './BOQItemRow';

interface BOQItemTableProps {
  items: BOQItem[];
  readonly: boolean;
  onUpdate: (id: string, description: string, unit: string, qty: number, rate: number) => void;
  onDelete: (id: string) => void;
}

export default function BOQItemTable({ items, readonly, onUpdate, onDelete }: BOQItemTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/40">
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-16">S.No</th>
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Item Description</th>
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-28">Unit</th>
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-28">Qty</th>
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-32">Rate (₹)</th>
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-36">Amount</th>
              {!readonly && (
                <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 text-right w-36">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/30">
            {items.length > 0 ? (
              items.map(item => (
                <BOQItemRow 
                  key={item.id}
                  item={item}
                  readonly={readonly}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={readonly ? 6 : 7} className="p-12 text-center text-slate-400 font-extrabold text-xs uppercase leading-relaxed">
                  No line items registered on this Bill of Quantities yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
