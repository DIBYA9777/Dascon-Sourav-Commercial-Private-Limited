import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2 } from 'lucide-react';
import { WBSLayer } from '../types';

interface ChainageFormProps {
  layers: WBSLayer[];
  initialLayerId?: string;
  initialRange?: string;
  onSave: (layerId: string, range: string) => void;
  onCancel: () => void;
}

export default function ChainageForm({ 
  layers, 
  initialLayerId = '', 
  initialRange = '', 
  onSave, 
  onCancel 
}: ChainageFormProps) {
  const [layerId, setLayerId] = useState(initialLayerId || (layers[0]?.id || ''));
  const [range, setRange] = useState(initialRange);

  useEffect(() => {
    if (initialLayerId) {
      setLayerId(initialLayerId);
    } else if (layers.length > 0 && !layerId) {
      setLayerId(layers[0].id);
    }
  }, [initialLayerId, layers, layerId]);

  useEffect(() => {
    setRange(initialRange);
  }, [initialRange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!range.trim() || !layerId) return;
    onSave(layerId, range.trim());
  };

  const isEdit = !!initialRange;

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
              <Edit2 className="w-3.5 h-3.5 text-amber-500" /> Modify Chainage Allocation
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-amber-500" /> New Chainage Range Allocation
            </>
          )}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {layers.length > 0 && (
            <div className="space-y-1 text-left">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Parent Layer Node
              </label>
              <select 
                value={layerId}
                onChange={e => setLayerId(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-3 text-xs font-bold outline-none cursor-pointer"
              >
                {layers.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Chainage Range (e.g. 0-1 KM, plot 4)
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. 0-1 KM, 5.2-10 KM, Plot 4"
              value={range}
              onChange={e => setRange(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-amber-500 transition-colors"
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest transition-colors cursor-pointer"
          >
            {isEdit ? 'Update Chainage' : 'Deploy Chainage'}
          </button>
        </form>
      </div>
    </div>
  );
}
