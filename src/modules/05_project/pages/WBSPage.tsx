import React, { useState, useEffect } from 'react';
import { 
  Trello, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Trash2, 
  MapPin, 
  Database,
  Layers,
  FolderOpen,
  Eye,
  GitCommit,
  CheckCircle,
  X
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { Project, WBSLayer, WBSChainage, WBSComponent } from '../types';

export default function WBSPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // Tree states
  const [layers, setLayers] = useState<WBSLayer[]>([]);
  const [chainages, setChainages] = useState<WBSChainage[]>([]);
  const [components, setComponents] = useState<WBSComponent[]>([]);
  
  // Expanded IDs for tree nodes
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({
    'lay-1': true, 'lay-2': true, 'lay-3': true
  });
  const [expandedChainages, setExpandedChainages] = useState<Record<string, boolean>>({
    'ch-1': true, 'ch-2': true
  });

  // Selected item reference for right-side component view
  const [activeChainageId, setActiveChainageId] = useState<string | null>('ch-1');

  // Popups state to append new elements
  const [isLayerFormOpen, setIsLayerFormOpen] = useState(false);
  const [isChainageFormOpen, setIsChainageFormOpen] = useState(false);
  const [isCompFormOpen, setIsCompFormOpen] = useState(false);

  // Form Fields
  const [newLayerName, setNewLayerName] = useState('');
  const [newChainageRange, setNewChainageRange] = useState('');
  const [selectedLayerForChainage, setSelectedLayerForChainage] = useState('');
  
  const [newCompName, setNewCompName] = useState('');
  const [newCompUnit, setNewCompUnit] = useState('Mtr');

  useEffect(() => {
    const projs = projectService.getProjects();
    setProjects(projs);
    if (projs.length > 0) {
      setSelectedProjectId(projs[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadWBSData();
    }
  }, [selectedProjectId]);

  const loadWBSData = () => {
    const allLayers = projectService.getLayers().filter(l => l.projectId === selectedProjectId);
    const allChainages = projectService.getChainages().filter(c => c.projectId === selectedProjectId);
    const allComps = projectService.getComponents().filter(c => c.projectId === selectedProjectId);
    
    setLayers(allLayers);
    setChainages(allChainages);
    setComponents(allComps);

    // Default select first chainage if available
    if (allChainages.length > 0 && !activeChainageId) {
      setActiveChainageId(allChainages[0].id);
    }
  };

  const toggleLayer = (id: string) => {
    setExpandedLayers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleChainage = (id: string) => {
    setExpandedChainages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Add Layer submit
  const handleAddLayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLayerName.trim()) return;
    projectService.addLayer(selectedProjectId, newLayerName.trim());
    setNewLayerName('');
    setIsLayerFormOpen(false);
    loadWBSData();
  };

  // Add Chainage submit
  const handleAddChainageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lId = selectedLayerForChainage || (layers[0]?.id);
    if (!newChainageRange.trim() || !lId) return;
    
    projectService.addChainage(lId, selectedProjectId, newChainageRange.trim());
    setNewChainageRange('');
    setIsChainageFormOpen(false);
    loadWBSData();
  };

  // Add Component submit
  const handleAddCompSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChainageId || !newCompName.trim()) return;

    // Find layer linked to active chainage
    const chainage = chainages.find(c => c.id === activeChainageId);
    if (!chainage) return;

    projectService.addComponent(
      activeChainageId,
      chainage.layerId,
      selectedProjectId,
      newCompName.trim(),
      newCompUnit
    );

    setNewCompName('');
    setNewCompUnit('Mtr');
    setIsCompFormOpen(false);
    loadWBSData();
  };

  const handleDeleteComp = (id: string) => {
    const filtered = components.filter(c => c.id !== id);
    projectService.saveComponents(filtered);
    loadWBSData();
  };

  const activeChainageObj = chainages.find(c => c.id === activeChainageId);
  const activeChainageLayer = activeChainageObj ? layers.find(l => l.id === activeChainageObj.layerId) : null;
  const filteredComps = components.filter(c => c.chainageId === activeChainageId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION WITH PROJECT SELECTOR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Trello className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase">WBS & Road Structure Tree</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Expand Layers & Chainage Ranges to configure site components</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden sm:block">Select Project Context:</label>
          <select 
            value={selectedProjectId}
            onChange={e => {
              setSelectedProjectId(e.target.value);
              setActiveChainageId(null);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-4 text-xs font-black outline-none cursor-pointer"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* THREE INTERACTIVE BLOCKS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: WBS TREE */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" />
              Hierarchical Tree
            </h2>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsLayerFormOpen(true)}
                className="bg-slate-50 hover:bg-slate-100 text-blue-600 font-black uppercase text-[8px] tracking-wider px-2 py-1.5 rounded-lg border border-slate-100 transition-all flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5" /> Layer
              </button>
              <button 
                onClick={() => {
                  if (layers.length > 0) {
                    setSelectedLayerForChainage(layers[0].id);
                  }
                  setIsChainageFormOpen(true);
                }}
                className="bg-slate-50 hover:bg-slate-100 text-amber-600 font-black uppercase text-[8px] tracking-wider px-2 py-1.5 rounded-lg border border-slate-100 transition-all flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5" /> Chainage
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-none">
            {layers.length > 0 ? (
              layers.map(layer => {
                const layerExpanded = !!expandedLayers[layer.id];
                const layerChains = chainages.filter(c => c.layerId === layer.id);

                return (
                  <div key={layer.id} className="space-y-2">
                    {/* Layer Header Node */}
                    <div 
                      onClick={() => toggleLayer(layer.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${
                        layerExpanded ? 'bg-slate-50 text-slate-900' : 'hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      {layerExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      <span className="font-mono text-2xs font-bold bg-blue-100 text-blue-700 w-5 h-5 rounded-md flex items-center justify-center">L</span>
                      <span className="text-xs font-black uppercase tracking-tight">{layer.name}</span>
                    </div>

                    {/* Layer Content */}
                    {layerExpanded && (
                      <div className="pl-6 space-y-1.5 border-l-2 border-slate-100 ml-4">
                        {layerChains.length > 0 ? (
                          layerChains.map(chain => {
                            const isChExpanded = !!expandedChainages[chain.id];
                            const chainComps = components.filter(c => c.chainageId === chain.id);
                            const isChActive = activeChainageId === chain.id;

                            return (
                              <div key={chain.id} className="space-y-1">
                                {/* Chainage Header Node */}
                                <div 
                                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                    isChActive 
                                      ? 'bg-amber-50/50 border border-amber-200 text-amber-900 font-black' 
                                      : 'hover:bg-slate-50 text-slate-600 font-bold'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveChainageId(chain.id);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <span 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleChainage(chain.id);
                                      }}
                                      className="p-0.5 hover:bg-slate-200/50 rounded"
                                    >
                                      {isChExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                    </span>
                                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span className="text-xs uppercase">{chain.range}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[8px] font-mono tracking-tighter px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-black">
                                      {chainComps.length} COMPS
                                    </span>
                                  </div>
                                </div>

                                {/* Chainage Sub-Components lists */}
                                {isChExpanded && (
                                  <div className="pl-6 space-y-1 ml-3 border-l border-dashed border-slate-200">
                                    {chainComps.length > 0 ? (
                                      chainComps.map(comp => (
                                        <div key={comp.id} className="flex items-center gap-2 p-1 text-[11px] font-semibold text-slate-500">
                                          <div className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                                          <span className="font-mono text-slate-400 font-black">{comp.code}</span>
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

        {/* RIGHT COLUMN: ACTIVE CELL DETAILS & COMPONENTS GRID */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-4 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-50 pb-3 gap-2">
            <div>
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-500" />
                Linked Components
              </h2>
              {activeChainageObj && (
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">
                  Layer: <span className="text-blue-600 font-black">{activeChainageLayer?.name || 'Unknown'}</span> | Range: <span className="text-amber-600 font-black">{activeChainageObj.range}</span>
                </p>
              )}
            </div>

            <button 
              disabled={!activeChainageId}
              onClick={() => setIsCompFormOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg py-1.5 px-3 text-[10px] uppercase font-black flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Component
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-50 rounded-xl shadow-inner bg-slate-50/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Comp Code</th>
                  <th className="p-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Component Name</th>
                  <th className="p-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Unit of Measure</th>
                  <th className="p-3 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeChainageId ? (
                  filteredComps.length > 0 ? (
                    filteredComps.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <span className="font-mono font-black text-2xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                            {comp.code}
                          </span>
                        </td>
                        <td className="p-3 font-black text-slate-800 text-xs">
                          {comp.name}
                        </td>
                        <td className="p-3 text-slate-500 font-bold text-xs">{comp.unit}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleDeleteComp(comp.id)}
                            className="p-1 hover:bg-rose-50 rounded text-slate-350 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* MODAL / NEW LAYER FORM */}
      {isLayerFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl border-4 border-white p-6 relative">
            <button onClick={() => setIsLayerFormOpen(false)} className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-blue-500" /> New Layer Addition
            </h3>
            <form onSubmit={handleAddLayerSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Layer Description</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Subgrade, Earthwork, Granular Sub-base"
                  value={newLayerName}
                  onChange={e => setNewLayerName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
              <button type="submit" className="w-full bg-slate-950 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest">
                Save Layer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / NEW CHAINAGE FORM */}
      {isChainageFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl border-4 border-white p-6 relative">
            <button onClick={() => setIsChainageFormOpen(false)} className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-amber-500" /> New Chainage Range Allocation
            </h3>
            <form onSubmit={handleAddChainageSubmit} className="space-y-4">
              {layers.length > 0 && (
                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Layer Node</label>
                  <select 
                    value={selectedLayerForChainage}
                    onChange={e => setSelectedLayerForChainage(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  >
                    {layers.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Chainage Range</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 0-1 KM, 5.2-10 KM, Plot 4"
                  value={newChainageRange}
                  onChange={e => setNewChainageRange(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
              <button type="submit" className="w-full bg-slate-950 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest">
                Deploy Chainage
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / NEW COMPONENT FORM */}
      {isCompFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl border-4 border-white p-6 relative">
            <button onClick={() => setIsCompFormOpen(false)} className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Component Node
            </h3>
            <form onSubmit={handleAddCompSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Component name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Drain, Shoulder, Culvert Box"
                  value={newCompName}
                  onChange={e => setNewCompName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit of Measure (UOM)</label>
                <select 
                  value={newCompUnit}
                  onChange={e => setNewCompUnit(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                >
                  <option value="Mtr">Metres (Mtr)</option>
                  <option value="Nos">Numbers (Nos)</option>
                  <option value="Sqm">Square Metres (Sqm)</option>
                  <option value="Cum">Cubic Metres (Cum)</option>
                  <option value="Kg">Kilograms (Kg)</option>
                  <option value="Ton">Tons</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-slate-955 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest">
                Attach Component
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
