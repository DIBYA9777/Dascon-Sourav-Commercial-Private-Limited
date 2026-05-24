import React, { useState } from 'react';
import { UsersRound, Trash2, Plus, Users } from 'lucide-react';
import { DPRLabour } from '../types';

interface LabourTabProps {
  labours: DPRLabour[];
  onChange: (updated: DPRLabour[]) => void;
  isViewOnly?: boolean;
}

const PRESET_LABOUR_TYPES = [
  'Skilled Operator',
  'Mason',
  'Carpenter',
  'Steel Fabricator',
  'Supervisor',
  'General Helper',
  'Electrician',
  'Welder'
];

export default function LabourTab({ labours, onChange, isViewOnly = false }: LabourTabProps) {
  const [selectedType, setSelectedType] = useState(PRESET_LABOUR_TYPES[0]);
  const [customType, setCustomType] = useState('');
  const [inputCount, setInputCount] = useState<number>(1);
  const [useCustom, setUseCustom] = useState(false);

  const handleAdd = () => {
    const finalType = useCustom ? customType.trim() : selectedType;
    if (!finalType) return;

    const existingIdx = labours.findIndex(l => l.type.toLowerCase() === finalType.toLowerCase());
    const next = [...labours];

    if (existingIdx !== -1) {
      next[existingIdx] = {
        ...next[existingIdx],
        count: next[existingIdx].count + inputCount
      };
    } else {
      next.push({
        type: finalType,
        count: inputCount
      });
    }

    onChange(next);
    setCustomType('');
    setInputCount(1);
    setUseCustom(false);
  };

  const handleRemove = (index: number) => {
    const next = labours.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleCountChange = (index: number, newCount: number) => {
    const next = [...labours];
    next[index] = {
      ...next[index],
      count: Math.max(1, newCount)
    };
    onChange(next);
  };

  const totalWorkers = labours.reduce((sum, curr) => sum + curr.count, 0);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase">Human Capital Deployment</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Log active site constructors and trade specialists</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-black text-[10px] uppercase w-fit tracking-wider">
          <UsersRound className="w-4 h-4 text-indigo-500 animate-pulse" />
          Total Active Workforce: {totalWorkers}
        </div>
      </div>

      {/* Inputs Form Section (only available in Edit Mode) */}
      {!isViewOnly && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Toggle standard / custom */}
            <div className="space-y-1">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                劳动力 trade Category
              </label>
              {useCustom ? (
                <input
                  type="text"
                  placeholder="e.g. Scaffolder Expert"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors"
                />
              ) : (
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors cursor-pointer"
                >
                  {PRESET_LABOUR_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Attendance Staff count */}
            <div className="space-y-1">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Daily Head Count
              </label>
              <input
                type="number"
                min={1}
                value={inputCount}
                onChange={(e) => setInputCount(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors"
              />
            </div>

            {/* Form actions */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className="py-2.5 px-3 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white transition-colors cursor-pointer shrink-0"
              >
                {useCustom ? 'Use Presets' : 'Custom Trade'}
              </button>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-grow py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Book Roster
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Log list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {labours.length > 0 ? (
          labours.map((item, idx) => (
            <div 
              key={item.type}
              className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 p-4 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-50 text-slate-650 rounded-xl border border-slate-100/50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-805 uppercase tracking-tight">{item.type}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Active trade Deployment</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isViewOnly ? (
                  <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
                    {item.count}
                  </span>
                ) : (
                  <>
                    <input
                      type="number"
                      min={1}
                      value={item.count}
                      onChange={(e) => handleCountChange(idx, Number(e.target.value))}
                      className="w-16 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg py-1 px-2 text-center text-xs font-black text-slate-900 outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center bg-slate-50/40 border border-dashed border-slate-200 rounded-2xl">
            <UsersRound className="w-6 h-6 text-slate-300 mx-auto" />
            <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Active trade attendance ledger is blank.</p>
          </div>
        )}
      </div>

    </div>
  );
}
