import React from 'react';
import { SCBillItem } from '../types';
import { Plus, Trash2, Edit3, HelpCircle, FileSpreadsheet } from 'lucide-react';

interface SCBillTableProps {
  items: (Omit<SCBillItem, 'amount'> & { amount: number })[];
  isEditable?: boolean;
  onUpdateItem?: (id: string, field: keyof Omit<SCBillItem, 'amount'>, value: any) => void;
  onAddItem?: () => void;
  onRemoveItem?: (id: string) => void;
}

export default function SCBillTable({
  items,
  isEditable = false,
  onUpdateItem,
  onAddItem,
  onRemoveItem
}: SCBillTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-tight">
            Bill Line Items Breakup
          </h3>
        </div>
        {isEditable && onAddItem && (
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-1 bg-slate-900 text-white hover:bg-slate-800 text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all shadow-3xs cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add Item Row
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/50 border-b border-slate-100">
              <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-1/2">
                WBS Activity / Task Description
              </th>
              <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right w-36">
                Completed Qty
              </th>
              <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right w-36">
                Certified Rate (₹)
              </th>
              <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right w-40">
                Amount (₹)
              </th>
              {isEditable && onRemoveItem && (
                <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center w-20">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={isEditable ? 6 : 5} className="text-center py-8">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    No items added yet. Click "Add Item Row" to start.
                  </p>
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const calculatedAmount = (Number(item.completedQty) || 0) * (Number(item.rate) || 0);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-all font-sans">
                    {/* Activity name */}
                    <td className="px-6 py-3.5">
                      {isEditable && onUpdateItem ? (
                        <input
                          type="text"
                          value={item.activityName}
                          onChange={(e) => onUpdateItem(item.id, 'activityName', e.target.value)}
                          placeholder="e.g. Drain Construction (0-1 KM)"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold tracking-tight rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
                          required
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[10px] text-slate-800 uppercase tracking-tight">
                            {item.activityName}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Unit */}
                    <td className="px-6 py-3.5">
                      {isEditable && onUpdateItem ? (
                        <select
                          value={item.unit}
                          onChange={(e) => onUpdateItem(item.id, 'unit', e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold tracking-tight rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="Mtr">Mtr</option>
                          <option value="Cum">Cum</option>
                          <option value="Sqm">Sqm</option>
                          <option value="Nos">Nos</option>
                          <option value="Ton">Ton</option>
                          <option value="Kg">Kg</option>
                        </select>
                      ) : (
                        <span className="font-extrabold text-[8px] uppercase text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                          {item.unit}
                        </span>
                      )}
                    </td>

                    {/* Completed Qty */}
                    <td className="px-6 py-3.5 text-right">
                      {isEditable && onUpdateItem ? (
                        <input
                          type="number"
                          value={item.completedQty === 0 ? '' : item.completedQty}
                          onChange={(e) => onUpdateItem(item.id, 'completedQty', Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold text-right tracking-tight rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
                          min="0"
                          placeholder="0"
                          step="any"
                          required
                        />
                      ) : (
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          {item.completedQty.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Rate */}
                    <td className="px-6 py-3.5 text-right">
                      {isEditable && onUpdateItem ? (
                        <input
                          type="number"
                          value={item.rate === 0 ? '' : item.rate}
                          onChange={(e) => onUpdateItem(item.id, 'rate', Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold text-right tracking-tight rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
                          min="0"
                          placeholder="0"
                          step="any"
                          required
                        />
                      ) : (
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          ₹{item.rate.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-3.5 text-right">
                      <span className="font-mono text-xs font-black text-slate-900">
                        ₹{calculatedAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Actions if editable */}
                    {isEditable && onRemoveItem && (
                      <td className="px-6 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-all p-1 rounded-md hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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
