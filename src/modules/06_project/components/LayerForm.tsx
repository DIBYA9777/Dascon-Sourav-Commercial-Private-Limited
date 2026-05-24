import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2 } from 'lucide-react';

interface LayerFormProps {
  initialName?: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export default function LayerForm({ initialName = '', onSave, onCancel }: LayerFormProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
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
              <Edit2 className="w-3.5 h-3.5 text-blue-500" /> Modify WBS Layer
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-blue-500" /> New Layer Addition
            </>
          )}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Layer Description
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Subgrade, Earthwork, Granular Sub-base"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest transition-colors cursor-pointer"
          >
            {isEdit ? 'Update Layer' : 'Save Layer'}
          </button>
        </form>
      </div>
    </div>
  );
}
