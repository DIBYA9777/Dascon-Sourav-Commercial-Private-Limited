import React, { useState } from 'react';
import { HardHat, Trash2, Plus, Clock } from 'lucide-react';
import { DPRMachine } from '../types';

interface MachineTabProps {
  machines: DPRMachine[];
  onChange: (updated: DPRMachine[]) => void;
  isViewOnly?: boolean;
}

const PRESET_MACHINES = [
  'Excavator JCB',
  'Concrete Mixer S4',
  'Dynapac Vibratory Roller',
  'Tata Tipper Truck 16T',
  'CAT Bulldozer D6',
  'Schwing Stetter Boom Placer',
  'Transit Mixer 6m³',
  'Pneumatic Compactor'
];

export default function MachineTab({ machines, onChange, isViewOnly = false }: MachineTabProps) {
  const [selectedMachine, setSelectedMachine] = useState(PRESET_MACHINES[0]);
  const [customMachine, setCustomMachine] = useState('');
  const [inputHours, setInputHours] = useState<number>(8);
  const [useCustom, setUseCustom] = useState(false);

  const handleAdd = () => {
    const finalMachine = useCustom ? customMachine.trim() : selectedMachine;
    if (!finalMachine) return;

    const existingIdx = machines.findIndex(m => m.name.toLowerCase() === finalMachine.toLowerCase());
    const next = [...machines];

    if (existingIdx !== -1) {
      next[existingIdx] = {
        ...next[existingIdx],
        hours: next[existingIdx].hours + inputHours
      };
    } else {
      next.push({
        name: finalMachine,
        hours: inputHours
      });
    }

    onChange(next);
    setCustomMachine('');
    setInputHours(8);
    setUseCustom(false);
  };

  const handleRemove = (index: number) => {
    const next = machines.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleHoursChange = (index: number, newHours: number) => {
    const next = [...machines];
    next[index] = {
      ...next[index],
      hours: Math.max(1, newHours)
    };
    onChange(next);
  };

  const totalMachineHours = machines.reduce((sum, curr) => sum + curr.hours, 0);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase">Machinery & Logistics Logs</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Track total operating run-hours for heavy plant equipment</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 font-black text-[10px] uppercase w-fit tracking-wider">
          <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
          Active Equipment Hours: {totalMachineHours} Hrs
        </div>
      </div>

      {/* Editor Block */}
      {!isViewOnly && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Choose machine */}
            <div className="space-y-1">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Machinery Equipment Type
              </label>
              {useCustom ? (
                <input
                  type="text"
                  required
                  placeholder="e.g. Forklift 5-Ton"
                  value={customMachine}
                  onChange={(e) => setCustomMachine(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors"
                />
              ) : (
                <select
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors cursor-pointer"
                >
                  {PRESET_MACHINES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Run hours */}
            <div className="space-y-1">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Operating Hours (Hrs)
              </label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={inputHours}
                onChange={(e) => setInputHours(Math.max(0.5, Number(e.target.value)))}
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800 transition-colors"
              />
            </div>

            {/* Form Button Action */}
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
                <Plus className="w-3.5 h-3.5" /> Log Hours
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Grid displays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.length > 0 ? (
          machines.map((item, idx) => (
            <div 
              key={item.name}
              className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 p-4 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-50 text-slate-650 rounded-xl border border-slate-100/50 flex items-center justify-center">
                  <HardHat className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-805 uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Heavy machinery log</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono">
                {isViewOnly ? (
                  <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
                    {item.hours} Hrs
                  </span>
                ) : (
                  <>
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={item.hours}
                      onChange={(e) => handleHoursChange(idx, Number(e.target.value))}
                      className="w-16 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg py-1 px-2 text-center text-xs font-black text-slate-900 outline-none"
                    />
                    <span className="text-[10px] font-black text-slate-400">Hrs</span>

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
            <HardHat className="w-6 h-6 text-slate-300 mx-auto" />
            <p className="text-[10px] font-black uppercase text-slate-400 mt-2">No heavy equipment registered for this period.</p>
          </div>
        )}
      </div>

    </div>
  );
}
