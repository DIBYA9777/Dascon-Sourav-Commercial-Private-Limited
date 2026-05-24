import React from 'react';
import { Database, Plus, Edit2, Trash2 } from 'lucide-react';
import { WBSComponent } from '../types';

interface ComponentTableProps {
  components: WBSComponent[];
  activeChainageId: string | null;
  activeChainageRange?: string;
  activeLayerName?: string;
  onAddComponentClick: () => void;
  onEditComponent: (comp: WBSComponent) => void;
  onDeleteComponent: (id: string) => void;
}

export default function ComponentTable({
  components,
  activeChainageId,
  activeChainageRange = '',
  activeLayerName = '',
  onAddComponentClick,
  onEditComponent,
  onDeleteComponent
}: ComponentTableProps) {
  return (
    <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-50/50 pb-3 gap-2">
          <div>
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
              <Database className="w-4 h-4 text-amber-500" />
              Linked Components
            </h2>
            {activeChainageId && (
              <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">
                Layer: <span className="text-blue-600 font-black">{activeLayerName || 'Unknown'}</span> | Range: <span className="text-amber-600 font-black">{activeChainageRange}</span>
              </p>
            )}
          </div>

          <button 
            disabled={!activeChainageId}
            onClick={onAddComponentClick}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg py-1.5 px-3 text-[10px] uppercase font-black flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Component
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl bg-slate-50/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/40">
                <th className="p-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Comp Code</th>
                <th className="p-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Component Name</th>
                <th className="p-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Unit of Measure</th>
                <th className="p-3 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/30">
              {activeChainageId ? (
                components.length > 0 ? (
                  components.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors animate-in fade-in duration-100">
                      <td className="p-3">
                        <span className="font-mono font-black text-2xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                          {comp.code}
                        </span>
                      </td>
                      <td className="p-3 font-black text-slate-800 text-xs">
                        {comp.name}
                      </td>
                      <td className="p-3 text-slate-500 font-bold text-xs">{comp.unit}</td>
                      <td className="p-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => onEditComponent(comp)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Edit Component Name/Unit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onDeleteComponent(comp.id)}
                            className="p-1 hover:bg-rose-50 rounded text-slate-350 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove Component"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 text-xs font-semibold leading-relaxed">
                      No component nodes exist for this combination. Click "Add Component" above.
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 text-xs font-semibold leading-relaxed">
                    Please select or expand a Chainage node in the left-hand hierarchical tree.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
