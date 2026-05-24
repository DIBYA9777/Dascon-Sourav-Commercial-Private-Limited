import React from 'react';
import { AlertCircle, FileText, CloudRain } from 'lucide-react';

interface RemarksTabProps {
  remarks: string;
  onChange: (val: string) => void;
  isViewOnly?: boolean;
}

const PRESET_REMARKS = [
  'Optimal operations. Weather clear, resources deployed on target schedule.',
  'Minor delay: Heavy rainfall in the afternoon restricted excavation activities.',
  'Logistics bottleneck: Cement shipment delayed due to highway traffic restrictions.',
  'Plant maintenance: Excavator hydraulic repair scheduled, restricted daily earthwork.',
  'Power failure: Local electric line drop, back-up generators commissioned.'
];

export default function RemarksTab({ remarks, onChange, isViewOnly = false }: RemarksTabProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="flex border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase">Site Supervisor logs & Delays</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Explain general remarks, environmental conditions, or progress disruptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core supervisor textarea notes */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
            General supervisor notes *
          </label>
          {isViewOnly ? (
            <div className="text-xs text-slate-700 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100 italic min-h-[120px] leading-relaxed">
              "{remarks || 'No notes logged for this Daily Progress Report.'}"
            </div>
          ) : (
            <textarea
              rows={6}
              required
              placeholder="Log down any key occurrences, incidents, site inspection approvals, safety compliance clearances, or delay factors..."
              value={remarks}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl p-4 text-xs font-bold outline-none text-slate-800 resize-none transition-colors leading-relaxed"
            />
          )}
        </div>

        {/* Quick select presets list (only visible in edit mode) */}
        {!isViewOnly ? (
          <div className="space-y-3">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Quick select delay templates
            </span>
            <div className="space-y-2">
              {PRESET_REMARKS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset)}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 rounded-xl border border-slate-150 text-[10px] font-bold text-slate-700 leading-normal transition-colors cursor-pointer block uppercase text-tiny truncate shrink-0"
                  title={preset}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-155 p-4 rounded-2xl flex flex-col justify-center text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-[10px] font-black uppercase text-slate-800">Authorization Record</h4>
            <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase">
              These supervisor entries are finalized and locked from changes once submitted to system managers.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
