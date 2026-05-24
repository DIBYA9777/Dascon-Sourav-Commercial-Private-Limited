import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2 } from 'lucide-react';

interface ComponentFormProps {
  initialName?: string;
  initialUnit?: string;
  onSave: (name: string, unit: string) => void;
  onCancel: () => void;
}

export default function ComponentForm({ 
  initialName = '', 
  initialUnit = 'Mtr', 
  onSave, 
  onCancel 
}: ComponentFormProps) {
  const [name, setName] = useState(initialName);
  const [unit, setUnit] = useState(initialUnit);

  useEffect(() => {
    setName(initialName);
    setUnit(initialUnit);
  }, [initialName, initialUnit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), unit);
  };

  const isEdit = !!initialName;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl border-4 border-white p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button 
          onClick={onCancel} 
          className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1.5">
          {isEdit ? (
            <>
              <Edit2 className="w-3.5 h-3.5 text-blue-600" /> Modify Component Node
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Component Node
            </>
          )}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Component name
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Drain, Shoulder, Culvert Box"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Unit of Measure (UOM)
            </label>
            <select 
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-3 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="Mtr">Metres (Mtr)</option>
              <option value="Nos">Numbers (Nos)</option>
              <option value="Sqm">Square Metres (Sqm)</option>
              <option value="Cum">Cubic Metres (Cum)</option>
              <option value="Kg">Kilograms (Kg)</option>
              <option value="Ton">Tons</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest transition-colors cursor-pointer"
          >
            {isEdit ? 'Update Component' : 'Attach Component'}
          </button>
        </form>
      </div>
    </div>
  );
}
