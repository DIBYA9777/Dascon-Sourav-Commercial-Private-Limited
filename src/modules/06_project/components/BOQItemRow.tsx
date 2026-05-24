import React, { useState } from 'react';
import { Save, X, Trash2, Edit3 } from 'lucide-react';
import { BOQItem } from '../types';

interface BOQItemRowProps {
  key?: string;
  item: BOQItem;
  readonly: boolean;
  onUpdate: (id: string, description: string, unit: string, qty: number, rate: number) => void;
  onDelete: (id: string) => void;
}

export default function BOQItemRow({ item, readonly, onUpdate, onDelete }: BOQItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(item.description);
  const [unit, setUnit] = useState(item.unit);
  const [qty, setQty] = useState(item.qty);
  const [rate, setRate] = useState(item.rate);

  const handleSave = () => {
    onUpdate(item.id, desc, unit, qty, rate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDesc(item.description);
    setUnit(item.unit);
    setQty(item.qty);
    setRate(item.rate);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="bg-blue-50/20">
        <td className="p-4 text-xs font-black text-slate-400">{item.sNo}</td>
        <td className="p-4">
          <input 
            type="text"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 px-3 font-bold text-xs outline-none focus:border-blue-500 text-left"
          />
        </td>
        <td className="p-4 text-left">
          <select 
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs outline-none"
          >
            <option value="Bag">Bag</option>
            <option value="Ton">Ton</option>
            <option value="Mtr">Mtr</option>
            <option value="Sqm">Sqm</option>
            <option value="Nos">Nos</option>
            <option value="Cum">Cum</option>
            <option value="Kg">Kg</option>
          </select>
        </td>
        <td className="p-4 text-left">
          <input 
            type="number"
            value={qty}
            min={1}
            onChange={e => setQty(Number(e.target.value))}
            className="w-24 bg-white border border-slate-200 rounded-lg p-1.5 px-3 font-bold text-xs outline-none focus:border-blue-500 font-mono"
          />
        </td>
        <td className="p-4 text-left">
          <input 
            type="number"
            value={rate}
            min={1}
            onChange={e => setRate(Number(e.target.value))}
            className="w-28 bg-white border border-slate-200 rounded-lg p-1.5 px-3 font-bold text-xs outline-none focus:border-blue-500 font-mono"
          />
        </td>
        <td className="p-4 font-black text-xs text-slate-900 font-mono text-left">
          ₹{(qty * rate).toLocaleString('en-IN')}
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <button 
              type="button"
              onClick={handleSave}
              className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={handleCancel}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr 
      className="hover:bg-slate-50/50 transition-colors group cursor-pointer text-left"
      onClick={() => { if (!readonly) setIsEditing(true); }}
    >
      <td className="p-4 text-xs font-black text-slate-400 font-mono">{item.sNo}</td>
      <td className="p-4">
        <p className="font-black text-slate-800 text-xs uppercase">{item.description}</p>
      </td>
      <td className="p-4 text-slate-500 font-bold text-xs">{item.unit}</td>
      <td className="p-4 text-slate-700 font-bold text-xs font-mono">{item.qty.toLocaleString()}</td>
      <td className="p-4 text-slate-700 font-bold text-xs font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
      <td className="p-4 font-black text-xs text-slate-900 font-mono">₹{item.amount.toLocaleString('en-IN')}</td>
      {!readonly && (
        <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <button 
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button 
              type="button"
              onClick={() => onDelete(item.id)}
              className="p-1 hover:bg-rose-50 rounded text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
