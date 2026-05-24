import React, { useState } from 'react';
import { Package, Trash2, Plus, FileText } from 'lucide-react';
import { DPRMaterial } from '../types';

interface MaterialTabProps {
  materials: DPRMaterial[];
  onChange: (updated: DPRMaterial[]) => void;
  isViewOnly?: boolean;
}

const PRESET_MATERIALS = [
  { name: 'Cement (OPC 53 Grade)', unit: 'bags' },
  { name: 'River Sand', unit: 'tons' },
  { name: 'Aggregate 20mm', unit: 'tons' },
  { name: 'Bitumen VG-40', unit: 'tons' },
  { name: 'Steel (TMT Bars)', unit: 'tons' },
  { name: 'Admixture concrete additive', unit: 'Ltrs' },
  { name: 'RCC Pipe 1200mm Dia', unit: 'Mtr' }
];

export default function MaterialTab({ materials, onChange, isViewOnly = false }: MaterialTabProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customName, setCustomName] = useState('');
  const [customUnit, setCustomUnit] = useState('bags');
  const [inputQty, setInputQty] = useState<number>(10);
  const [useCustom, setUseCustom] = useState(false);

  const handleAdd = () => {
    const finalName = useCustom ? customName.trim() : PRESET_MATERIALS[selectedIdx].name;
    const finalUnit = useCustom ? customUnit.trim() : PRESET_MATERIALS[selectedIdx].unit;
    
    if (!finalName) return;

    const existingIdx = materials.findIndex(m => m.name.toLowerCase() === finalName.toLowerCase());
    const next = [...materials];

    if (existingIdx !== -1) {
      next[existingIdx] = {
        ...next[existingIdx],
        qty: next[existingIdx].qty + inputQty
      };
    } else {
      next.push({
        name: finalName,
        qty: inputQty,
        unit: finalUnit
      });
    }

    onChange(next);
    setCustomName('');
    setCustomUnit('bags');
    setInputQty(10);
    setUseCustom(false);
  };

  const handleRemove = (index: number) => {
    const next = materials.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleQtyChange = (index: number, newQty: number) => {
    const next = [...materials];
    next[index] = {
      ...next[index],
      qty: Math.max(1, newQty)
    };
    onChange(next);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase">Material Consumption Grid</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Deduct physical material counts used during daily operations</p>
        </div>
      </div>

      {/* Editor Form Panel */}
      {!isViewOnly && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Choose item */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Material Item Description
              </label>
              {useCustom ? (
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bricks Blocks Red"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="col-span-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors"
                  />
                  <input
                    type="text"
                    required
                    placeholder="unit (e.g. Nos)"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors"
                  />
                </div>
              ) : (
                <select
                  value={selectedIdx}
                  onChange={(e) => setSelectedIdx(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors cursor-pointer"
                >
                  {PRESET_MATERIALS.map((item, idx) => (
                    <option key={item.name} value={idx}>{item.name} ({item.unit})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Qty count */}
            <div className="space-y-1">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Quantity Consumed
              </label>
              <input
                type="number"
                min={1}
                value={inputQty}
                onChange={(e) => setInputQty(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className="py-2.5 px-3 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white transition-colors cursor-pointer shrink-0"
              >
                {useCustom ? 'Presets' : 'Custom'}
              </button>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-grow py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Deduct Stock
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Materials log table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Material Item Name</th>
              <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Measurement Unit</th>
              <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Amount Consumed</th>
              {!isViewOnly && <th className="py-3 px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Delete</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {materials.length > 0 ? (
              materials.map((item, idx) => (
                <tr key={item.name} className="hover:bg-slate-50/20">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase font-mono bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {item.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isViewOnly ? (
                      <span className="font-mono text-xs font-black text-slate-800">
                        {item.qty.toLocaleString()}
                      </span>
                    ) : (
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => handleQtyChange(idx, Number(e.target.value))}
                        className="w-20 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg py-1 px-2.5 text-center text-xs font-black text-slate-900 outline-none"
                      />
                    )}
                  </td>
                  {!isViewOnly && (
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-[10px] font-black text-slate-400 uppercase">
                  No materials expended for this daily run.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
