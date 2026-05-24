import React from 'react';
import { 
  Layers, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { WBSLayer, WBSChainage, WBSComponent } from '../types';

interface WBSTreeProps {
  layers: WBSLayer[];
  chainages: WBSChainage[];
  components: WBSComponent[];
  expandedLayers: Record<string, boolean>;
  expandedChainages: Record<string, boolean>;
  activeChainageId: string | null;
  onToggleLayerExpanded: (id: string) => void;
  onToggleChainageExpanded: (id: string) => void;
  onActiveChainageSelect: (id: string) => void;
  onAddLayerClick: () => void;
  onAddChainageClick: () => void;
  onEditLayerClick: (layer: WBSLayer) => void;
  onDeleteLayerClick: (id: string) => void;
  onEditChainageClick: (chainage: WBSChainage) => void;
  onDeleteChainageClick: (id: string) => void;
}

export default function WBSTree({
  layers,
  chainages,
  components,
  expandedLayers,
  expandedChainages,
  activeChainageId,
  onToggleLayerExpanded,
  onToggleChainageExpanded,
  onActiveChainageSelect,
  onAddLayerClick,
  onAddChainageClick,
  onEditLayerClick,
  onDeleteLayerClick,
  onEditChainageClick,
  onDeleteChainageClick
}: WBSTreeProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4 shadow-xs h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-500" />
            Hierarchical Tree
          </h2>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={onAddLayerClick}
              className="bg-slate-50 hover:bg-slate-100 text-blue-600 font-black uppercase text-[8px] tracking-wider px-2 py-1.5 rounded-lg border border-slate-100 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" /> Layer
            </button>
            <button 
              onClick={onAddChainageClick}
              disabled={layers.length === 0}
              className="bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-amber-600 font-black uppercase text-[8px] tracking-wider px-2 py-1.5 rounded-lg border border-slate-100 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" /> Chainage
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-none text-left">
          {layers.length > 0 ? (
            layers.map(layer => {
              const layerExpanded = !!expandedLayers[layer.id];
              const layerChains = chainages.filter(c => c.layerId === layer.id);

              return (
                <div key={layer.id} className="space-y-2 group/layer">
                  {/* Layer Header Node */}
                  <div className="flex items-center justify-between p-1 rounded-xl hover:bg-slate-50/50 transition-all">
                    <div 
                      onClick={() => onToggleLayerExpanded(layer.id)}
                      className={`flex items-center gap-2 p-1 cursor-pointer flex-1`}
                    >
                      {layerExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      <span className="font-mono text-[9px] font-black bg-blue-100 text-blue-700 w-5 h-5 rounded-md flex items-center justify-center">L</span>
                      <span className="text-xs font-black uppercase tracking-tight text-slate-900">{layer.name}</span>
                    </div>

                    {/* Layer Actions on Hover */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/layer:opacity-100 transition-opacity pr-1">
                      <button 
                        onClick={() => onEditLayerClick(layer)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-all cursor-pointer"
                        title="Edit Layer Name"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => onDeleteLayerClick(layer.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Layer Content */}
                  {layerExpanded && (
                    <div className="pl-6 space-y-1.5 border-l-2 border-slate-100 ml-4 animate-in slide-in-from-left-1 duration-100">
                      {layerChains.length > 0 ? (
                        layerChains.map(chain => {
                          const isChExpanded = !!expandedChainages[chain.id];
                          const chainComps = components.filter(c => c.chainageId === chain.id);
                          const isChActive = activeChainageId === chain.id;

                          return (
                            <div key={chain.id} className="space-y-1 group/chain">
                              {/* Chainage Header Node */}
                              <div 
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                                  isChActive 
                                    ? 'bg-amber-50/50 border-amber-200 text-amber-900 font-extrabold' 
                                    : 'hover:bg-slate-50 border-transparent text-slate-600 font-semibold'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onActiveChainageSelect(chain.id);
                                }}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleChainageExpanded(chain.id);
                                    }}
                                    className="p-0.5 hover:bg-slate-200/50 rounded"
                                  >
                                    {isChExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                  </span>
                                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span className="text-xs uppercase truncate">{chain.range}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  {/* Actions inside header node */}
                                  <div className="flex items-center gap-0.5 opacity-0 group-hover/chain:opacity-100 transition-opacity">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditChainageClick(chain);
                                      }}
                                      className="p-0.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-200/50 transition-all cursor-pointer"
                                      title="Edit Chainage Range"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteChainageClick(chain.id);
                                      }}
                                      className="p-0.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-100/50 transition-all cursor-pointer"
                                      title="Delete Chainage"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  
                                  <span className="text-[8px] font-mono tracking-tighter px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-black shrink-0">
                                    {chainComps.length} COMPS
                                  </span>
                                </div>
                              </div>

                              {/* Chainage Sub-Components list preview */}
                              {isChExpanded && (
                                <div className="pl-6 space-y-1 ml-3 border-l border-dashed border-slate-200 animate-in slide-in-from-left-1 duration-100">
                                  {chainComps.length > 0 ? (
                                    chainComps.map(comp => (
                                      <div key={comp.id} className="flex items-center gap-2 p-1 text-[11px] font-semibold text-slate-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-350 shrink-0" />
                                        <span className="font-mono text-slate-400 font-black shrink-0">{comp.code}</span>
                                        <span className="truncate italic">{comp.name}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-[10px] text-slate-350 italic pl-1">No components linked.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-slate-450 italic pl-2 py-1">Please add chainages under this layer.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-slate-400 text-xs italic py-8 leading-relaxed">No layers registered. Use "+ Layer" to begin setup.</p>
          )}
        </div>
      </div>
    </div>
  );
}
