import { 
  Project, 
  WBSLayer, 
  WBSChainage, 
  WBSComponent, 
  BOQ, 
  ActivityPlan, 
  ExecutionTypeConfig, 
  WorkOrder 
} from '../types';

// Hardcoded sites for dropdowns/linking
export const KNOWN_SITES = [
  { id: 'site-kol', name: 'Kolkata Sector V Site' },
  { id: 'site-mum', name: 'Mumbai Coast Phase A' },
  { id: 'site-del', name: 'Delhi Expressway Plot 4' },
  { id: 'site-blr', name: 'Bangalore Metro Ring' }
];

// Helper to load/save localStorage helper
const load = <T>(key: string, backup: T): T => {
  const item = localStorage.getItem(key);
  if (!item) return backup;
  try {
    return JSON.parse(item) as T;
  } catch {
    return backup;
  }
};

const save = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Seed Data
const defaultProjects: Project[] = [
  {
    id: 'prj-001',
    code: 'PRJ-001',
    name: 'Kolkata Highway',
    client: 'PWD',
    siteId: 'site-kol',
    startDate: '2026-05-01',
    endDate: '2027-04-30',
    status: 'Active',
    description: '4-Lane Expansion of national highway connecting city limits.',
    createdAt: '2026-05-01T12:00:00Z'
  },
  {
    id: 'prj-002',
    code: 'PRJ-002',
    name: 'Mumbai Coastal Road',
    client: 'BMC',
    siteId: 'site-mum',
    startDate: '2026-05-15',
    endDate: '2027-05-14',
    status: 'Active',
    description: 'High speed sea linkage project.',
    createdAt: '2026-05-02T12:00:00Z'
  },
  {
    id: 'prj-003',
    code: 'PRJ-003',
    name: 'Delhi Expressway',
    client: 'NHAI',
    siteId: 'site-del',
    startDate: '2026-06-10',
    endDate: '2027-06-09',
    status: 'Planning',
    description: 'Delhi boundary bypass link expressway.',
    createdAt: '2026-05-03T12:00:00Z'
  }
];

const defaultLayers: WBSLayer[] = [
  { id: 'lay-1', projectId: 'prj-001', name: 'Earthwork' },
  { id: 'lay-2', projectId: 'prj-001', name: 'Subgrade' },
  { id: 'lay-3', projectId: 'prj-001', name: 'Base Course' }
];

const defaultChainages: WBSChainage[] = [
  { id: 'ch-1', layerId: 'lay-3', projectId: 'prj-001', range: '0-1 KM' },
  { id: 'ch-2', layerId: 'lay-3', projectId: 'prj-001', range: '1-2 KM' },
  { id: 'ch-3', layerId: 'lay-3', projectId: 'prj-001', range: '2-3 KM' }
];

const defaultComponents: WBSComponent[] = [
  { id: 'comp-1', chainageId: 'ch-1', layerId: 'lay-3', projectId: 'prj-001', code: 'CMP-001', name: 'Drain', unit: 'Mtr' },
  { id: 'comp-2', chainageId: 'ch-1', layerId: 'lay-3', projectId: 'prj-001', code: 'CMP-002', name: 'Culvert', unit: 'Nos' },
  { id: 'comp-3', chainageId: 'ch-1', layerId: 'lay-3', projectId: 'prj-001', code: 'CMP-003', name: 'Shoulder', unit: 'Mtr' }
];

const defaultBOQs: BOQ[] = [
  {
    id: 'boq-1',
    projectId: 'prj-001',
    boqNo: 'BOQ/PRJ-001/01',
    date: '2026-05-01',
    status: 'Draft',
    version: 1,
    totalAmount: 12250000,
    items: [
      { id: 'bi-1', sNo: 1, description: 'Cement (OPC 53 Grade)', unit: 'Bag', qty: 1000, rate: 350, amount: 350000 },
      { id: 'bi-2', sNo: 2, description: 'Sand (River Sand)', unit: 'Ton', qty: 20, rate: 1500, amount: 30000 },
      { id: 'bi-3', sNo: 3, description: 'Aggregate 20mm', unit: 'Ton', qty: 100, rate: 1200, amount: 120000 },
      { id: 'bi-4', sNo: 4, description: 'Bitumen', unit: 'Ton', qty: 10, rate: 45000, amount: 450000 },
      { id: 'bi-5', sNo: 5, description: 'Steel (TMT Bars)', unit: 'Ton', qty: 50, rate: 55000, amount: 2750000 }
    ]
  }
];

const defaultActivities: ActivityPlan[] = [
  {
    id: 'act-1',
    projectId: 'prj-001',
    activityName: 'Drain Construction (0-1 KM)',
    startDate: '2026-05-20',
    endDate: '2026-05-30',
    plannedQty: 1000,
    unit: 'Mtr',
    workers: 20,
    equipment: 'Excavator: 2',
    materials: [
      { id: 'r1', name: 'Cement (OPC 53 Grade)', qty: '100 bags' },
      { id: 'r2', name: 'River Sand', qty: '40 tons' }
    ],
    labours: [
      { id: 'l1', name: 'Mason', qty: '4' },
      { id: 'l2', name: 'Helper', qty: '16' }
    ],
    machineries: [
      { id: 'm1', name: 'Concrete Mixer', qty: '1 unit' },
      { id: 'm2', name: 'Excavator JCB', qty: '1 unit' }
    ]
  }
];

const defaultExecutionConfigs: ExecutionTypeConfig[] = [
  {
    id: 'cfg-1',
    projectId: 'prj-001',
    activityId: 'act-1',
    type: 'Contractor',
    contractorName: 'ABC Constructions',
    contractStartDate: '2026-06-01',
    contractEndDate: '2026-06-30'
  }
];

const defaultWorkOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    projectId: 'prj-001',
    woNo: 'WO_PRJ-001_01',
    contractorName: 'ABC Constructions',
    activityName: 'Drain Construction (0-1 KM)',
    amount: 500000,
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    scope: 'Excavation and brick lining of drains.',
    status: 'Approved'
  }
];

// Service Methods implementation with localStorage reactivity
export const projectService = {
  // Projects
  getProjects: () => load<Project[]>('erp_projects', defaultProjects),
  saveProjects: (projects: Project[]) => save('erp_projects', projects),
  getProjectById: (id: string) => projectService.getProjects().find(p => p.id === id),
  addProject: (p: Omit<Project, 'id' | 'code' | 'createdAt'>) => {
    const list = projectService.getProjects();
    const cleanName = p.name.trim().toUpperCase().replace(/\s+/g, '_');
    const autoCode = `PRJ-${String(list.length + 1).padStart(3, '0')}`;
    const newProj: Project = {
      ...p,
      id: `prj-${Date.now()}`,
      code: autoCode,
      createdAt: new Date().toISOString()
    };
    list.push(newProj);
    projectService.saveProjects(list);
    return newProj;
  },
  updateProject: (updated: Project) => {
    const list = projectService.getProjects();
    const idx = list.findIndex(p => p.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      projectService.saveProjects(list);
    }
  },

  // WBS Structure
  getLayers: () => load<WBSLayer[]>('erp_wbs_layers', defaultLayers),
  saveLayers: (layers: WBSLayer[]) => save('erp_wbs_layers', layers),
  addLayer: (projectId: string, name: string) => {
    const list = projectService.getLayers();
    const item: WBSLayer = { id: `lay-${Date.now()}`, projectId, name };
    list.push(item);
    projectService.saveLayers(list);
    return item;
  },

  getChainages: () => load<WBSChainage[]>('erp_wbs_chainages', defaultChainages),
  saveChainages: (chainages: WBSChainage[]) => save('erp_wbs_chainages', chainages),
  addChainage: (layerId: string, projectId: string, range: string) => {
    const list = projectService.getChainages();
    const item: WBSChainage = { id: `ch-${Date.now()}`, layerId, projectId, range };
    list.push(item);
    projectService.saveChainages(list);
    return item;
  },

  getComponents: () => load<WBSComponent[]>('erp_wbs_components', defaultComponents),
  saveComponents: (comps: WBSComponent[]) => save('erp_wbs_components', comps),
  addComponent: (chainageId: string, layerId: string, projectId: string, name: string, unit: string) => {
    const list = projectService.getComponents();
    const code = `CMP-${String(list.length + 1).padStart(3, '0')}`;
    const item: WBSComponent = { id: `comp-${Date.now()}`, chainageId, layerId, projectId, code, name, unit };
    list.push(item);
    projectService.saveComponents(list);
    return item;
  },

  // BOQ
  getBOQs: () => load<BOQ[]>('erp_boqs', defaultBOQs),
  saveBOQs: (boqList: BOQ[]) => save('erp_boqs', boqList),
  getBOQByProject: (projectId: string) => projectService.getBOQs().find(b => b.projectId === projectId),
  createOrUpdateBOQ: (boq: BOQ) => {
    const list = projectService.getBOQs();
    const idx = list.findIndex(b => b.projectId === boq.projectId);
    if (idx !== -1) {
      list[idx] = boq;
    } else {
      list.push(boq);
    }
    projectService.saveBOQs(list);
  },

  // Planning
  getActivities: () => load<ActivityPlan[]>('erp_activities', defaultActivities),
  saveActivities: (acts: ActivityPlan[]) => save('erp_activities', acts),
  addActivity: (activity: Omit<ActivityPlan, 'id'>) => {
    const list = projectService.getActivities();
    const item: ActivityPlan = { ...activity, id: `act-${Date.now()}` };
    list.push(item);
    projectService.saveActivities(list);
    return item;
  },

  // Execution config
  getExecutionConfigs: () => load<ExecutionTypeConfig[]>('erp_exec_configs', defaultExecutionConfigs),
  saveExecutionConfigs: (cfgs: ExecutionTypeConfig[]) => save('erp_exec_configs', cfgs),
  setExecutionType: (cfg: Omit<ExecutionTypeConfig, 'id'>) => {
    const list = projectService.getExecutionConfigs();
    const idx = list.findIndex(c => c.projectId === cfg.projectId && c.activityId === cfg.activityId);
    const item: ExecutionTypeConfig = { ...cfg, id: idx !== -1 ? list[idx].id : `cfg-${Date.now()}` };
    if (idx !== -1) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    projectService.saveExecutionConfigs(list);
    return item;
  },

  // Work Orders
  getWorkOrders: () => load<WorkOrder[]>('erp_work_orders', defaultWorkOrders),
  saveWorkOrders: (wos: WorkOrder[]) => save('erp_work_orders', wos),
  addWorkOrder: (wo: Omit<WorkOrder, 'id' | 'woNo' | 'status'>) => {
    const list = projectService.getWorkOrders();
    const woNo = `WO/PRJ-${String(list.length + 1).padStart(3, '0')}/01`;
    const item: WorkOrder = {
      ...wo,
      id: `wo-${Date.now()}`,
      woNo,
      status: 'Pending'
    };
    list.push(item);
    projectService.saveWorkOrders(list);
    return item;
  },
  approveWorkOrder: (id: string, status: 'Approved' | 'Rejected') => {
    const list = projectService.getWorkOrders();
    const idx = list.findIndex(w => w.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      projectService.saveWorkOrders(list);
    }
  }
};
