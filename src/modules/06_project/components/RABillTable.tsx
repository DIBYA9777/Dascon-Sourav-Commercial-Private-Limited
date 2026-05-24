import React from 'react';
import { RABillItem } from '../types';
import { Plus, Trash2, FileSpreadsheet } from 'lucide-react';

interface RABillTableProps {
  items: (Omit<RABillItem, 'amount'> & { amount: number })[];
  isEditable?: boolean;
  onUpdateItem?: (id: string, field: 'description' | 'amount', value: any) => void;
  onAddItem?: () => void;
  onRemoveItem?: (id: string) => void;
}

export default function RABillTable({
  items,
  isEditable = false,
  onUpdateItem,
  onAddItem,
  onRemoveItem
}: RABillTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-tight">
            RA Bill Breakdown
          </h3>
        </div>
        {isEditable && onAddItem && (
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-1 bg-slate-900 text-white hover:bg-slate-800 text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all shadow-3xs cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add Item Line
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/50 border-b border-slate-100">
              <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                SNo
              </th>
              <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-3/5">
                Work Item Description
              </th>
              <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right w-52">
                Certified Value (₹)
              </th>
              {isEditable && onRemoveItem && (
                <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {items.length === 0 ? (
              <tr>
                <td colSpan={isEditable ? 4 : 3} className="text-center py-10">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    No work items defined yet. Click "Add Item Line" to begin.
                  </p>
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                return (
                  <tr key={item.id} className="hover:bg-slate-50/20 transition-all">
                    {/* Serial index */}
                    <td className="px-6 py-3.5 text-[10px] font-bold text-slate-400">
                      {index + 1}
                    </td>

                    {/* Description */}
                    <td className="px-6 py-3.5">
                      {isEditable && onUpdateItem ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="e.g. Civil Work Completed Section B"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold tracking-tight rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
                          required
                        />
                      ) : (
                        <span className="font-bold text-[10px] text-slate-800 uppercase tracking-tight">
                          {item.description}
                        </span>
                      )}
                    </td>

                    {/* Certified Amount */}
                    <td className="px-6 py-3.5 text-right">
                      {isEditable && onUpdateItem ? (
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            value={item.amount === 0 ? '' : item.amount}
                            onChange={(e) => onUpdateItem(item.id, 'amount', Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold text-right tracking-tight rounded-lg pl-6 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
                            min="0"
                            placeholder="0"
                            step="any"
                            required
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] font-bold text-slate-800">
                          ₹{item.amount.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Actions if editable */}
                    {isEditable && onRemoveItem && (
                      <td className="px-6 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-605 transition-all p-1.5 rounded-md hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </td>
                    )}
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
