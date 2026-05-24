import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface BOQAddItemFormProps {
  onAdd: (description: string, unit: string, qty: number, rate: number) => void;
}

export default function BOQAddItemForm({ onAdd }: BOQAddItemFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [unit, setUnit] = useState('Bag');
  const [qty, setQty] = useState<number>(100);
  const [rate, setRate] = useState<number>(350);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || qty <= 0 || rate <= 0) return;
    onAdd(desc, unit, qty, rate);
    
    setDesc('');
    setUnit('Bag');
    setQty(100);
    setRate(350);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl py-4.5 text-xs font-black tracking-tight uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add Item Line to BOQ
      </button>
    );
  }

  return (
    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-3xs animate-in slide-in-from-top-4 duration-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Append Estimate Line</h4>
        <button 
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-1 bg-white hover:bg-slate-100 rounded-full text-slate-400 border border-slate-150 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5 space-y-1 text-left">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Description / Specification *</label>
          <input 
            type="text"
            required
            placeholder="e.g. Reinforced cement concrete paving standard M30"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2 space-y-1 text-left">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">UOM *</label>
          <select 
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="Bag">Bag</option>
            <option value="Ton">Ton</option>
            <option value="Mtr">Mtr</option>
            <option value="Sqm">Sqm</option>
            <option value="Nos">Nos</option>
            <option value="Cum">Cum</option>
            <option value="Kg">Kg</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-1 text-left">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimated Qty *</label>
          <input 
            type="number"
            required
            min={1}
            value={qty}
            onChange={e => setQty(Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="md:col-span-2 space-y-1 text-left">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Rate (₹) *</label>
          <input 
            type="number"
            required
            min={1}
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="md:col-span-1">
          <button 
            type="submit"
            className="w-full bg-slate-900 override-bg-to-jcb hover:bg-slate-800 text-white rounded-xl py-2 px-4 text-xs font-black tracking-tight uppercase flex items-center justify-center gap-1 cursor-pointer h-[38px]"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </form>
    </div>
  );
}
