import React, { useState } from 'react';
import { 
  Trello, 
  Plus, 
  Layers,
  FilePlus,
  RefreshCw
} from 'lucide-react';
import { useWBS } from '../hooks/useWBS';
import { WBSLayer, WBSChainage, WBSComponent } from '../types';
import { 
  LayerForm, 
  ChainageForm, 
  ComponentForm, 
  ComponentTable, 
  WBSTree 
} from '../components';
import WBSFormPage from './WBSFormPage';

export default function WBSPage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    layers,
    chainages,
    components,
    expandedLayers,
    expandedChainages,
    activeChainageId,
    setActiveChainageId,
    
    toggleLayerExpanded,
    toggleChainageExpanded,
    
    addLayer,
    updateLayer,
    deleteLayer,
    
    addChainage,
    updateChainage,
    deleteChainage,
    
    addComponent,
    updateComponent,
    deleteComponent,
    
    refreshData
  } = useWBS();

  // Mode View state: 'tree' | 'form_workspace'
  const [viewMode, setViewMode] = useState<'tree' | 'form_workspace'>('tree');

  // MODAL FORM STATE
  const [activeModal, setActiveModal] = useState<'add_layer' | 'edit_layer' | 'add_chainage' | 'edit_chainage' | 'add_component' | 'edit_component' | null>(null);
  
  // Selection/Target references for editing
  const [selectedLayer, setSelectedLayer] = useState<WBSLayer | null>(null);
  const [selectedChainage, setSelectedChainage] = useState<WBSChainage | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<WBSComponent | null>(null);

  // Active child range strings for display
  const activeChainageObj = chainages.find(c => c.id === activeChainageId);
  const activeChainageLayerObj = activeChainageObj ? layers.find(l => l.id === activeChainageObj.layerId) : null;
  const filteredComps = components.filter(c => c.chainageId === activeChainageId);

  if (viewMode === 'form_workspace') {
    return (
      <WBSFormPage 
        onBack={() => {
          setViewMode('tree');
          refreshData();
        }} 
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-200">
      
      {/* HEADER SECTION WITH PROJECT SELECTOR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Trello className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase">WBS & Road Structure Tree</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">
              Expand Layers & Chainage Ranges to configure site components
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          {/* View Workspace Mode toggle button */}
          <button
            onClick={() => setViewMode('form_workspace')}
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl py-2 px-3 text-2xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-amber-100"
          >
            <FilePlus className="w-3.5 h-3.5" />
            WBS Forms Workspace
          </button>

          <button
            onClick={refreshData}
            title="Refresh active dataset"
            className="p-2 hover:bg-slate-150 text-slate-400 hover:text-slate-700 bg-slate-50 border border-slate-100 rounded-xl transition-all mr-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <select 
            value={selectedProjectId}
            onChange={e => {
              setSelectedProjectId(e.target.value);
              setActiveChainageId(null);
            }}
            className="w-full sm:w-auto min-w-0 max-w-full sm:max-w-[240px] md:max-w-[320px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-4 text-xs font-black outline-none cursor-pointer truncate"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* THREE INTERACTIVE BLOCKS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: HIERARCHICAL TREE VIEW */}
        <div className="lg:col-span-5">
          <WBSTree
            layers={layers}
            chainages={chainages}
            components={components}
            expandedLayers={expandedLayers}
            expandedChainages={expandedChainages}
            activeChainageId={activeChainageId}
            onToggleLayerExpanded={toggleLayerExpanded}
            onToggleChainageExpanded={toggleChainageExpanded}
            onActiveChainageSelect={setActiveChainageId}
            
            onAddLayerClick={() => setActiveModal('add_layer')}
            onAddChainageClick={() => {
              if (layers.length > 0) {
                setSelectedLayer(layers[0]);
              }
              setActiveModal('add_chainage');
            }}
            onEditLayerClick={(layer) => {
              setSelectedLayer(layer);
              setActiveModal('edit_layer');
            }}
            onDeleteLayerClick={(id) => {
              if (confirm('Are you absolutely sure you want to remove this WBS layer? All child chainages & component configurations under it will be deleted!')) {
                deleteLayer(id);
              }
            }}
            onEditChainageClick={(chain) => {
              const originLayer = layers.find(l => l.id === chain.layerId) || null;
              setSelectedLayer(originLayer);
              setSelectedChainage(chain);
              setActiveModal('edit_chainage');
            }}
            onDeleteChainageClick={(id) => {
              if (confirm('Are you absolutely sure you want to delete this chainage range interval? Connected components under it will be unlinked!')) {
                deleteChainage(id);
              }
            }}
          />
        </div>

        {/* RIGHT COLUMN: LINKED COMPONENTS MATRIX TABLE */}
        <div className="lg:col-span-7">
          <ComponentTable
            components={filteredComps}
            activeChainageId={activeChainageId}
            activeChainageRange={activeChainageObj?.range}
            activeLayerName={activeChainageLayerObj?.name}
            onAddComponentClick={() => setActiveModal('add_component')}
            onEditComponent={(comp) => {
              setSelectedComponent(comp);
              setActiveModal('edit_component');
            }}
            onDeleteComponent={(id) => {
              if (confirm('Are you sure you want to detach this component node from the current WBS chainage?')) {
                deleteComponent(id);
              }
            }}
          />
        </div>
      </div>

      {/* POPUP MODALS CORNER */}
      {/* 1. LAYER ADD MODE */}
      {activeModal === 'add_layer' && (
        <LayerForm
          onSave={(name) => {
            addLayer(name);
            setActiveModal(null);
          }}
          onCancel={() => setActiveModal(null)}
        />
      )}

      {/* 2. LAYER EDIT MODE */}
      {activeModal === 'edit_layer' && selectedLayer && (
        <LayerForm
          initialName={selectedLayer.name}
          onSave={(name) => {
            updateLayer(selectedLayer.id, name);
            setSelectedLayer(null);
            setActiveModal(null);
          }}
          onCancel={() => {
            setSelectedLayer(null);
            setActiveModal(null);
          }}
        />
      )}

      {/* 3. CHAINAGE ADD MODE */}
      {activeModal === 'add_chainage' && (
        <ChainageForm
          layers={layers}
          initialLayerId={selectedLayer?.id || ''}
          onSave={(layerId, range) => {
            addChainage(layerId, range);
            setSelectedLayer(null);
            setActiveModal(null);
          }}
          onCancel={() => {
            setSelectedLayer(null);
            setActiveModal(null);
          }}
        />
      )}

      {/* 4. CHAINAGE EDIT MODE */}
      {activeModal === 'edit_chainage' && selectedChainage && (
        <ChainageForm
          layers={layers}
          initialLayerId={selectedLayer?.id || selectedChainage.layerId}
          initialRange={selectedChainage.range}
          onSave={(layerId, range) => {
            updateChainage(selectedChainage.id, layerId, range);
            setSelectedChainage(null);
            setSelectedLayer(null);
            setActiveModal(null);
          }}
          onCancel={() => {
            setSelectedChainage(null);
            setSelectedLayer(null);
            setActiveModal(null);
          }}
        />
      )}

      {/* 5. COMPONENT ADD MODE */}
      {activeModal === 'add_component' && activeChainageId && activeChainageObj && (
        <ComponentForm
          onSave={(name, unit) => {
            addComponent(activeChainageId, activeChainageObj.layerId, name, unit);
            setActiveModal(null);
          }}
          onCancel={() => setActiveModal(null)}
        />
      )}

      {/* 6. COMPONENT EDIT MODE */}
      {activeModal === 'edit_component' && selectedComponent && (
        <ComponentForm
          initialName={selectedComponent.name}
          initialUnit={selectedComponent.unit}
          onSave={(name, unit) => {
            updateComponent(
              selectedComponent.id,
              selectedComponent.chainageId,
              selectedComponent.layerId,
              selectedComponent.code,
              name,
              unit
            );
            setSelectedComponent(null);
            setActiveModal(null);
          }}
          onCancel={() => {
            setSelectedComponent(null);
            setActiveModal(null);
          }}
        />
      )}

    </div>
  );
}
