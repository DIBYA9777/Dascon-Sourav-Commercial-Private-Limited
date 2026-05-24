import { WBSLayer, WBSChainage, WBSComponent } from '../types';

const load = <T>(key: string, backup: T): T => {
  const item = localStorage.getItem(key);
  if (!item) return backup;
  try {
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && Array.isArray(backup) && parsed.length < backup.length) {
      return backup;
    }
    return parsed as T;
  } catch {
    return backup;
  }
};

const save = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const defaultLayers: WBSLayer[] = [
  // Kolkata Highway (prj-001)
  { id: 'lay-1', projectId: 'prj-001', name: 'Earthwork' },
  { id: 'lay-2', projectId: 'prj-001', name: 'Subgrade Preparation' },
  { id: 'lay-3', projectId: 'prj-001', name: 'Base Course Construction' },
  
  // Mumbai Coastal (prj-002)
  { id: 'lay-4', projectId: 'prj-002', name: 'Marine Reclamation' },
  { id: 'lay-5', projectId: 'prj-002', name: 'Concrete Sea Wall' },
  { id: 'lay-6', projectId: 'prj-002', name: 'Viaduct Foundation' },

  // Delhi Expressway (prj-003)
  { id: 'lay-7', projectId: 'prj-003', name: 'Excavation & Clearing' },
  { id: 'lay-8', projectId: 'prj-003', name: 'Dense Bituminous Macadam' },

  // Bangalore Metro (prj-004)
  { id: 'lay-9', projectId: 'prj-004', name: 'Elevated Pier Erection' },
  { id: 'lay-10', projectId: 'prj-004', name: 'Station Girders' },

  // Hyderabad (prj-013)
  { id: 'lay-11', projectId: 'prj-013', name: 'Underpass Excavation' },
  { id: 'lay-12', projectId: 'prj-013', name: 'Precast Shuttering' },

  // Other Project Nodes
  { id: 'lay-13', projectId: 'prj-006', name: 'Slab Overlay & Curing' },
  { id: 'lay-14', projectId: 'prj-007', name: 'Trench Shoring' },
  { id: 'lay-15', projectId: 'prj-010', name: 'Cable Piling Anchors' }
];

const defaultChainages: WBSChainage[] = [
  // Kolkata Highway (prj-001)
  { id: 'ch-1', layerId: 'lay-3', projectId: 'prj-001', range: '0-1 KM Interval' },
  { id: 'ch-2', layerId: 'lay-3', projectId: 'prj-001', range: '1-2 KM Interval' },
  { id: 'ch-3', layerId: 'lay-3', projectId: 'prj-001', range: '2-3 KM Interval' },

  // Mumbai Coastal (prj-002)
  { id: 'ch-4', layerId: 'lay-4', projectId: 'prj-002', range: 'South Sector Yard 1' },
  { id: 'ch-5', layerId: 'lay-5', projectId: 'prj-002', range: 'Sea Wall Plot B' },
  { id: 'ch-6', layerId: 'lay-6', projectId: 'prj-002', range: 'Segmental Span 10' },

  // Delhi Expressway (prj-003)
  { id: 'ch-7', layerId: 'lay-7', projectId: 'prj-003', range: 'Plot 4 Clearing Unit 1' },
  { id: 'ch-8', layerId: 'lay-8', projectId: 'prj-003', range: 'Expressway CH 44+200' },

  // Bangalore Metro (prj-004)
  { id: 'ch-9', layerId: 'lay-9', projectId: 'prj-004', range: 'Indiranagar Junction Pier P1-P4' },
  { id: 'ch-10', layerId: 'lay-10', projectId: 'prj-004', range: 'Station Gate Terminal A' },

  // Hyderabad (prj-013)
  { id: 'ch-11', layerId: 'lay-11', projectId: 'prj-013', range: 'Sector Alpha Grid' },
  { id: 'ch-12', layerId: 'lay-12', projectId: 'prj-013', range: 'Box Culvert Portal' },

  // Other Projects
  { id: 'ch-13', layerId: 'lay-13', projectId: 'prj-006', range: 'Main Highway Sector 4' },
  { id: 'ch-14', layerId: 'lay-14', projectId: 'prj-007', range: 'Sector V Ring Sector 12' },
  { id: 'ch-15', layerId: 'lay-15', projectId: 'prj-010', range: 'River Bed Pier Grounding' }
];

const defaultComponents: WBSComponent[] = [
  // Kolkata (prj-001)
  { id: 'comp-1', chainageId: 'ch-1', layerId: 'lay-3', projectId: 'prj-001', code: 'CMP-001', name: 'Drain Wall Foundation', unit: 'Mtr' },
  { id: 'comp-2', chainageId: 'ch-1', layerId: 'lay-3', projectId: 'prj-001', code: 'CMP-002', name: 'Box Culvert Section A', unit: 'Nos' },
  { id: 'comp-3', chainageId: 'ch-1', layerId: 'lay-3', projectId: 'prj-001', code: 'CMP-003', name: 'Kerb Stone Shoulders', unit: 'Mtr' },

  // Mumbai (prj-002)
  { id: 'comp-4', chainageId: 'ch-4', layerId: 'lay-4', projectId: 'prj-002', code: 'CMP-004', name: 'Reclaimed Soil Cover', unit: 'Cum' },
  { id: 'comp-5', chainageId: 'ch-5', layerId: 'lay-5', projectId: 'prj-002', code: 'CMP-005', name: 'Tetrapod Pile Armour', unit: 'Nos' },
  { id: 'comp-6', chainageId: 'ch-6', layerId: 'lay-6', projectId: 'prj-002', code: 'CMP-006', name: 'Pier Cap Casting Block', unit: 'Sqm' },

  // Delhi (prj-003)
  { id: 'comp-7', chainageId: 'ch-8', layerId: 'lay-8', projectId: 'prj-003', code: 'CMP-007', name: 'Subgrade Aggregate Packing', unit: 'Ton' },
  { id: 'comp-8', chainageId: 'ch-8', layerId: 'lay-8', projectId: 'prj-003', code: 'CMP-008', name: 'Bituminous Binder Spread', unit: 'Sqm' },

  // Bangalore Metro (prj-004)
  { id: 'comp-9', chainageId: 'ch-9', layerId: 'lay-9', projectId: 'prj-004', code: 'CMP-009', name: 'TMT Reinforcement Steel cages', unit: 'Ton' },
  { id: 'comp-10', chainageId: 'ch-10', layerId: 'lay-10', projectId: 'prj-004', code: 'CMP-010', name: 'Prestressed Concrete Girder', unit: 'Nos' },

  // Hyderabad (prj-013)
  { id: 'comp-11', chainageId: 'ch-11', layerId: 'lay-11', projectId: 'prj-013', code: 'CMP-011', name: 'Retaining Pile Wall Shrub', unit: 'Mtr' },
  { id: 'comp-12', chainageId: 'ch-12', layerId: 'lay-12', projectId: 'prj-013', code: 'CMP-012', name: 'Pre-Cast concrete Base Boxes', unit: 'Nos' },

  // Other Projects
  { id: 'comp-13', chainageId: 'ch-13', layerId: 'lay-13', projectId: 'prj-006', code: 'CMP-013', name: 'Expansion Joint Gaskets', unit: 'Nos' },
  { id: 'comp-14', chainageId: 'ch-14', layerId: 'lay-14', projectId: 'prj-007', code: 'CMP-014', name: 'Cast-iron Manhole Caps', unit: 'Nos' },
  { id: 'comp-15', chainageId: 'ch-15', layerId: 'lay-15', projectId: 'prj-010', code: 'CMP-015', name: 'Cable Anchors Strands', unit: 'Kg' }
];

export const wbsService = {
  getLayers: () => load<WBSLayer[]>('erp_wbs_layers', defaultLayers),
  saveLayers: (layers: WBSLayer[]) => save('erp_wbs_layers', layers),
  addLayer: (projectId: string, name: string) => {
    const list = wbsService.getLayers();
    const item: WBSLayer = { id: `lay-${Date.now()}`, projectId, name: name.trim() };
    list.push(item);
    wbsService.saveLayers(list);
    return item;
  },
  updateLayer: (layer: WBSLayer) => {
    const list = wbsService.getLayers();
    const idx = list.findIndex(l => l.id === layer.id);
    if (idx !== -1) {
      list[idx] = layer;
      wbsService.saveLayers(list);
    }
  },
  deleteLayer: (id: string) => {
    const layers = wbsService.getLayers().filter(l => l.id !== id);
    wbsService.saveLayers(layers);
    
    // Cascade delete chainages & components under this layer
    const chainages = wbsService.getChainages().filter(c => c.layerId !== id);
    wbsService.saveChainages(chainages);

    const comps = wbsService.getComponents().filter(c => c.layerId !== id);
    wbsService.saveComponents(comps);
  },

  getChainages: () => load<WBSChainage[]>('erp_wbs_chainages', defaultChainages),
  saveChainages: (chainages: WBSChainage[]) => save('erp_wbs_chainages', chainages),
  addChainage: (layerId: string, projectId: string, range: string) => {
    const list = wbsService.getChainages();
    const item: WBSChainage = { id: `ch-${Date.now()}`, layerId, projectId, range: range.trim() };
    list.push(item);
    wbsService.saveChainages(list);
    return item;
  },
  updateChainage: (chainage: WBSChainage) => {
    const list = wbsService.getChainages();
    const idx = list.findIndex(c => c.id === chainage.id);
    if (idx !== -1) {
      list[idx] = chainage;
      wbsService.saveChainages(list);
    }
  },
  deleteChainage: (id: string) => {
    const chainages = wbsService.getChainages().filter(c => c.id !== id);
    wbsService.saveChainages(chainages);

    // Cascade delete components under this chainage
    const comps = wbsService.getComponents().filter(c => c.chainageId !== id);
    wbsService.saveComponents(comps);
  },

  getComponents: () => load<WBSComponent[]>('erp_wbs_components', defaultComponents),
  saveComponents: (comps: WBSComponent[]) => save('erp_wbs_components', comps),
  addComponent: (chainageId: string, layerId: string, projectId: string, name: string, unit: string) => {
    const list = wbsService.getComponents();
    const code = `CMP-${String(list.length + 1).padStart(3, '0')}`;
    const item: WBSComponent = { id: `comp-${Date.now()}`, chainageId, layerId, projectId, code, name: name.trim(), unit };
    list.push(item);
    wbsService.saveComponents(list);
    return item;
  },
  updateComponent: (comp: WBSComponent) => {
    const list = wbsService.getComponents();
    const idx = list.findIndex(c => c.id === comp.id);
    if (idx !== -1) {
      list[idx] = comp;
      wbsService.saveComponents(list);
    }
  },
  deleteComponent: (id: string) => {
    const filtered = wbsService.getComponents().filter(c => c.id !== id);
    wbsService.saveComponents(filtered);
  }
};
