import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  MapPin, 
  Database, 
  ArrowLeft, 
  CheckCircle,
  Construction
} from 'lucide-react';
import { useWBS } from '../hooks/useWBS';

interface WBSFormPageProps {
  onBack?: () => void;
}

type TabType = 'layer' | 'chainage' | 'component';

export default function WBSFormPage({ onBack }: WBSFormPageProps) {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    layers,
    chainages,
    addLayer,
    addChainage,
    addComponent
  } = useWBS();

  const [activeTab, setActiveTab] = useState<TabType>('layer');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [layerName, setLayerName] = useState('');
  
  const [selectedLayerId, setSelectedLayerId] = useState('');
  const [chainageRange, setChainageRange] = useState('');

  const [selectedChainageId, setSelectedChainageId] = useState('');
  const [componentName, setComponentName] = useState('');
  const [componentUnit, setComponentUnit] = useState('Mtr');

  // Sync selected options when lists load
  useEffect(() => {
    if (layers.length > 0 && !selectedLayerId) {
      setSelectedLayerId(layers[0].id);
    }
  }, [layers, selectedLayerId]);

  useEffect(() => {
    if (chainages.length > 0 && !selectedChainageId) {
      setSelectedChainageId(chainages[0].id);
    }
  }, [chainages, selectedChainageId]);

  const triggerSuccessFeedback = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3500);
  };

  const handleLayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!layerName.trim()) return;
    addLayer(layerName);
    triggerSuccessFeedback(`Successfully registered layer: "${layerName.trim()}"`);
    setLayerName('');
  };

  const handleChainageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lId = selectedLayerId || (layers[0]?.id);
    if (!chainageRange.trim() || !lId) return;
    
    addChainage(lId, chainageRange);
    triggerSuccessFeedback(`Successfully allocated chainage range: "${chainageRange.trim()}"`);
    setChainageRange('');
  };

  const handleComponentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cId = selectedChainageId || (chainages[0]?.id);
    if (!componentName.trim() || !cId) return;

    const parentChain = chainages.find(c => c.id === cId);
    if (!parentChain) return;

    addComponent(cId, parentChain.layerId, componentName, componentUnit);
    triggerSuccessFeedback(`Successfully attached component: "${componentName.trim()}" (${componentUnit})`);
    setComponentName('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left animate-in fade-in duration-200">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tree View
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider shrink-0">Project Context:</label>
          <select 
            value={selectedProjectId}
            onChange={e => {
              setSelectedProjectId(e.target.value);
              setSelectedLayerId('');
              setSelectedChainageId('');
            }}
            className="w-full sm:w-auto min-w-0 max-w-full sm:max-w-[240px] md:max-w-[320px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-3.5 text-xs font-black outline-none cursor-pointer truncate"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FEEDBACK PROMPTS */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-center gap-2.5 shadow-3xs animate-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-xs font-bold">{successMsg}</span>
        </div>
      )}

      {/* WBS CREATOR WORKSPACE BOX */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-950 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-bold shrink-0">
            <Construction className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase">WBS Form Workspace</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">
              Add layers, chainage intervals, and custom component specifications
            </p>
          </div>
        </div>

        {/* CONTROLLING TABS */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/50 p-2 gap-1.5">
          <button
            onClick={() => setActiveTab('layer')}
            className={`py-3.5 rounded-xl text-center text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'layer' 
                ? 'bg-white shadow-xs text-blue-600 border border-slate-100' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Add Layer
          </button>
          <button
            onClick={() => setActiveTab('chainage')}
            className={`py-3.5 rounded-xl text-center text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'chainage' 
                ? 'bg-white shadow-xs text-amber-600 border border-slate-100' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Add Chainage
          </button>
          <button
            onClick={() => setActiveTab('component')}
            className={`py-3.5 rounded-xl text-center text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'component' 
                ? 'bg-white shadow-xs text-emerald-600 border border-slate-100' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Add Component
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: ADD LAYER FORM */}
          {activeTab === 'layer' && (
            <form onSubmit={handleLayerSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Layer Description</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Earthwork, Subgrade, GSB, WMM, Bituminous Concrete"
                  value={layerName}
                  onChange={e => setLayerName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-3 px-3.5 text-xs font-bold outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button type="submit" className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-2xs uppercase py-4 rounded-xl block tracking-widest transition-colors cursor-pointer">
                Save Layer Node
              </button>
            </form>
          )}

          {/* TAB 2: ADD CHAINAGE FORM */}
          {activeTab === 'chainage' && (
            <form onSubmit={handleChainageSubmit} className="space-y-4">
              {layers.length > 0 ? (
                <>
                  <div className="space-y-1">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Parent Layer Node</label>
                    <select 
                      value={selectedLayerId}
                      onChange={e => setSelectedLayerId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-3 px-3.5 text-xs font-bold outline-none cursor-pointer"
                    >
                      {layers.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Chainage Range</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 0-1 KM, 1.2-5 KM, Plot 4"
                      value={chainageRange}
                      onChange={e => setChainageRange(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-3 px-3.5 text-xs font-bold outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <button type="submit" className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-2xs uppercase py-4 rounded-xl block tracking-widest transition-colors cursor-pointer">
                    Deploy Chainage Interval
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400 italic">No parent layers reside within the active project context. Please register a layer first.</p>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: ADD COMPONENT FORM */}
          {activeTab === 'component' && (
            <form onSubmit={handleComponentSubmit} className="space-y-4">
              {chainages.length > 0 ? (
                <>
                  <div className="space-y-1">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Parent Chainage Node</label>
                    <select 
                      value={selectedChainageId}
                      onChange={e => setSelectedChainageId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-3 px-3.5 text-xs font-bold outline-none cursor-pointer"
                    >
                      {chainages.map(c => {
                        const parentLay = layers.find(l => l.id === c.layerId);
                        return (
                          <option key={c.id} value={c.id}>
                            [{parentLay?.name || 'Unknown Layer'}] &rarr; {c.range}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Component name</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Culvert, Drain, Main Carriageway"
                        value={componentName}
                        onChange={e => setComponentName(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-3 px-3.5 text-xs font-bold outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit of Measure</label>
                      <select 
                        value={componentUnit}
                        onChange={e => setComponentUnit(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-3 px-3.5 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="Mtr">Metres (Mtr)</option>
                        <option value="Nos">Numbers (Nos)</option>
                        <option value="Sqm">Square Metres (Sqm)</option>
                        <option value="Cum">Cubic Metres (Cum)</option>
                        <option value="Kg">Kilograms (Kg)</option>
                        <option value="Ton">Tons</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-2xs uppercase py-4 rounded-xl block tracking-widest transition-colors cursor-pointer">
                    Attach Component Specification
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400 italic">No parent chainages exist. Please configure a chainage interval first.</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
