import React, { useState } from 'react';
import { Trash2, Plus, Users } from 'lucide-react';
import { ResourcePlanItem } from '../types';

interface LabourPlanTabProps {
  items: ResourcePlanItem[];
  onAdd: (name: string, qty: string) => void;
  onDelete: (id: string) => void;
}

export default function LabourPlanTab({ items, onAdd, onDelete }: LabourPlanTabProps) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !qty.trim()) return;
    onAdd(name.trim(), qty.trim());
    setName('');
    setQty('');
  };

  return (
    <div className="space-y-4 text-left">
      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/40">
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-16">Index</th>
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Trade / Labour Category</th>
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-48">Workers Allocation</th>
              <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 text-right w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/30">
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-xs font-black text-slate-400 font-mono">
                    #{String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="p-4 text-xs font-black text-slate-800 uppercase flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-450" />
                    {item.name}
                  </td>
                  <td className="p-4 text-xs font-bold text-indigo-600 font-mono lowercase">
                    {item.qty}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 hover:bg-rose-50 text-slate-355 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 font-black text-2xs uppercase tracking-tight">
                  No labour distributions logged for this activity. Add trades below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mini Append Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50/30 p-4 rounded-xl border border-dashed border-slate-200/60 flex flex-col sm:flex-row items-end gap-3">
        <div className="flex-grow space-y-1">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Labour Category / Skill Group *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Mason (Grade A) / Steel Bender / Helper"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all text-slate-800"
          />
        </div>
        <div className="sm:w-48 space-y-1">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Required Allocation *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 12 workers, 4 roles"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full bg-white border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all text-slate-800"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 h-[38px] transition-all cursor-pointer whitespace-nowrap shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Trade
        </button>
      </form>
    </div>
  );
}
