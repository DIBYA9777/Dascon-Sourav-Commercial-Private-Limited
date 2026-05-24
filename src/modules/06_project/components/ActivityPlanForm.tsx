import React, { useState } from 'react';
import { Plus, X, Layers } from 'lucide-react';
import { ActivityPlan } from '../types';

interface ActivityPlanFormProps {
  onSubmit: (activity: {
    activityName: string;
    startDate: string;
    endDate: string;
    plannedQty: number;
    unit: string;
    workers: number;
    equipment: string;
  }) => void;
  onClose: () => void;
  initialData?: ActivityPlan;
}

export default function ActivityPlanForm({ onSubmit, onClose, initialData }: ActivityPlanFormProps) {
  const [activityName, setActivityName] = useState(initialData?.activityName || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [plannedQty, setPlannedQty] = useState<number>(initialData?.plannedQty ?? 1000);
  const [unit, setUnit] = useState(initialData?.unit || 'Mtr');
  const [workers, setWorkers] = useState<number>(initialData?.workers ?? 15);
  const [equipment, setEquipment] = useState(initialData?.equipment || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName.trim() || !startDate || !endDate) return;

    onSubmit({
      activityName: activityName.trim(),
      startDate,
      endDate,
      plannedQty: Number(plannedQty),
      unit,
      workers: Number(workers),
      equipment: equipment.trim()
    });

    onClose();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 max-w-lg w-full text-left relative animate-in slide-in-from-top-4 duration-250">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            {initialData ? 'Edit Planned Activity Node' : 'Plan New Activity Node'}
          </h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            {initialData ? 'Update scope, timelines and base labor metrics' : 'Define scope, timelines and base labor metrics'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Activity Name / Specification *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Subgrade preparation & surface watering"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Planned Start Date *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Planned End Date *
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Planned Quantity *
            </label>
            <input
              type="number"
              required
              min={1}
              value={plannedQty}
              onChange={(e) => setPlannedQty(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Unit of Measure *
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer text-slate-800"
            >
              <option value="Mtr">Metres (Mtr)</option>
              <option value="Sqm">Square Metres (Sqm)</option>
              <option value="Cum">Cubic Metres (Cum)</option>
              <option value="Nos">Numbers (Nos)</option>
              <option value="Ton">Tons (Ton)</option>
              <option value="Kg">Kilograms (Kg)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Demanded Workforce (No.) *
            </label>
            <input
              type="number"
              required
              min={1}
              value={workers}
              onChange={(e) => setWorkers(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Primary Equipment
            </label>
            <input
              type="text"
              placeholder="e.g. Grader: 1, Roller: 2"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-tight flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            {initialData ? 'Save Changes' : <><Plus className="w-3.5 h-3.5" /> Log Activity</>}
          </button>
        </div>
      </form>
    </div>
  );
}
