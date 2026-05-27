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
import apiClient from '@/src/services/apiClient.ts';

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

// Seed Data
const defaultProjects: Project[] = [
  {
    id: 'prj-001',
    code: 'PRJ-001',
    name: 'Kolkata Highway Phase II',
    client: 'PWD-WB',
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
    name: 'Mumbai Coastal Ring Road',
    client: 'BMC',
    siteId: 'site-mum',
    startDate: '2026-05-15',
    endDate: '2027-05-14',
    status: 'Active',
    description: 'High speed sea linkage project with flyovers.',
    createdAt: '2026-05-02T12:00:00Z'
  },
  {
    id: 'prj-003',
    code: 'PRJ-003',
    name: 'Delhi-Dehradun Expressway',
    client: 'NHAI',
    siteId: 'site-del',
    startDate: '2026-06-10',
    endDate: '2027-06-09',
    status: 'Planning',
    description: 'Delhi boundary bypass link expressway.',
    createdAt: '2026-05-03T12:00:00Z'
  },
  {
    id: 'prj-004',
    code: 'PRJ-004',
    name: 'Bangalore Metro Line 5',
    client: 'BMRCL',
    siteId: 'site-blr',
    startDate: '2026-04-01',
    endDate: '2028-03-31',
    status: 'Active',
    description: 'Elevated rapid transit corridor with 12 stations.',
    createdAt: '2026-04-05T09:00:00Z'
  },
  {
    id: 'prj-005',
    code: 'PRJ-005',
    name: 'Chennai Port Flyover Link',
    client: 'Chennai Port Trust',
    siteId: 'site-mum',
    startDate: '2026-07-01',
    endDate: '2027-12-31',
    status: 'Planning',
    description: 'Grade separator connecting port terminals to highway.',
    createdAt: '2026-05-10T11:00:00Z'
  },
  {
    id: 'prj-006',
    code: 'PRJ-006',
    name: 'Ahmedabad-Dholera Tollway',
    client: 'NHAI',
    siteId: 'site-del',
    startDate: '2026-01-15',
    endDate: '2026-12-30',
    status: 'Active',
    description: 'Premium concrete high-speed outer expressway Corridor.',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'prj-007',
    code: 'PRJ-007',
    name: 'Kolkata Sector V Ring Main',
    client: 'KMDA',
    siteId: 'site-kol',
    startDate: '2026-05-20',
    endDate: '2027-02-15',
    status: 'Active',
    description: 'Laying of high-capacity smart drainage core pipelines.',
    createdAt: '2026-05-20T10:00:00Z'
  },
  {
    id: 'prj-008',
    code: 'PRJ-008',
    name: 'Lucknow Smart Sewerage Sector C',
    client: 'LMC',
    siteId: 'site-del',
    startDate: '2026-08-01',
    endDate: '2027-08-31',
    status: 'Planning',
    description: 'Urban sewage rehabilitation and bypass pipeline system.',
    createdAt: '2026-05-11T14:30:00Z'
  },
  {
    id: 'prj-009',
    code: 'PRJ-009',
    name: 'Pune IT Park Elevated Path',
    client: 'PMRDA',
    siteId: 'site-mum',
    startDate: '2026-03-10',
    endDate: '2026-11-20',
    status: 'Active',
    description: 'Dedicated transit link flyover with crash barriers.',
    createdAt: '2026-03-12T15:00:00Z'
  },
  {
    id: 'prj-010',
    code: 'PRJ-010',
    name: 'Guwahati Brahmaputra Bridge Sec B',
    client: 'NHIDCL',
    siteId: 'site-kol',
    startDate: '2026-02-01',
    endDate: '2028-06-30',
    status: 'Active',
    description: 'Cable-stayed bridge structural substructure layout.',
    createdAt: '2026-02-05T09:15:00Z'
  },
  {
    id: 'prj-011',
    code: 'PRJ-011',
    name: 'Jaipur Sewer Treatment Phase 2',
    client: 'JDA',
    siteId: 'site-del',
    startDate: '2026-09-01',
    endDate: '2027-11-30',
    status: 'Planning',
    description: 'Biological purification treatment base layout design.',
    createdAt: '2026-05-12T16:00:00Z'
  },
  {
    id: 'prj-012',
    code: 'PRJ-012',
    name: 'Indore City Drainage Project',
    client: 'IMC',
    siteId: 'site-del',
    startDate: '2026-04-10',
    endDate: '2026-10-31',
    status: 'Active',
    description: 'Reinforced cement concrete micro-tunnel channels.',
    createdAt: '2026-04-12T11:00:00Z'
  },
  {
    id: 'prj-013',
    code: 'PRJ-013',
    name: 'Hyderabad Cyberabad Underpass',
    client: 'GHMC',
    siteId: 'site-blr',
    startDate: '2026-05-22',
    endDate: '2027-01-20',
    status: 'Active',
    description: 'Pre-cast concrete underpass at major intersection hub.',
    createdAt: '2026-05-22T08:00:00Z'
  },
  {
    id: 'prj-014',
    code: 'PRJ-014',
    name: 'Goa Smart Parking Multi Level Terminal',
    client: 'GSIDC',
    siteId: 'site-mum',
    startDate: '2026-10-01',
    endDate: '2027-12-15',
    status: 'Planning',
    description: 'Structural steel framing for intelligent car transit.',
    createdAt: '2026-05-13T10:00:00Z'
  },
  {
    id: 'prj-015',
    code: 'PRJ-015',
    name: 'Zojila Tunnel Bypass Track Layout',
    client: 'NHIDCL',
    siteId: 'site-del',
    startDate: '2026-05-30',
    endDate: '2028-05-30',
    status: 'Planning',
    description: 'Extending asphalt track inside tunnel connecting high-altitude roads.',
    createdAt: '2026-05-14T12:00:00Z'
  }
];

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
      { id: 'm1-1', name: 'Cement (OPC 53 Grade)', qty: '100 bags' },
      { id: 'm1-2', name: 'River Sand', qty: '40 tons' }
    ],
    labours: [
      { id: 'l1-1', name: 'Mason', qty: '4' },
      { id: 'l1-2', name: 'Helper', qty: '16' }
    ],
    machineries: [
      { id: 'mc1-1', name: 'Concrete Mixer', qty: '1 unit' },
      { id: 'mc1-2', name: 'Excavator JCB', qty: '1 unit' }
    ]
  },
  {
    id: 'act-2',
    projectId: 'prj-002',
    activityName: 'Marine Subgrade Reclamation Phase 1',
    startDate: '2026-06-01',
    endDate: '2026-06-25',
    plannedQty: 4500,
    unit: 'Cum',
    workers: 35,
    equipment: 'Dredger: 1, Dumper: 8',
    materials: [
      { id: 'm2-1', name: 'Silt Filter Geo-fabric Sheet', qty: '12 rolls' },
      { id: 'm2-2', name: 'Coarse Sand Backfill', qty: '1500 tons' }
    ],
    labours: [
      { id: 'l2-1', name: 'Diver Expert', qty: '2' },
      { id: 'l2-2', name: 'Heavy Operator', qty: '8' },
      { id: 'l2-3', name: 'Helper Grade B', qty: '25' }
    ],
    machineries: [
      { id: 'mc2-1', name: 'Marine Dredging Siphon', qty: '1 unit' },
      { id: 'mc2-2', name: 'Voltas Dump Truck', qty: '6 units' }
    ]
  },
  {
    id: 'act-3',
    projectId: 'prj-003',
    activityName: 'Clearing and Excavation Plot 4',
    startDate: '2026-06-15',
    endDate: '2026-06-30',
    plannedQty: 2500,
    unit: 'Sqm',
    workers: 15,
    equipment: 'Dozer: 2, Tipper: 4',
    materials: [
      { id: 'm3-1', name: 'Marking Powders & Stakes', qty: '15 pkts' }
    ],
    labours: [
      { id: 'l3-1', name: 'Surveyor Team Lead', qty: '2' },
      { id: 'l3-2', name: 'D-Graders Operators', qty: '4' },
      { id: 'l3-3', name: 'General Labours', qty: '9' }
    ],
    machineries: [
      { id: 'mc3-1', name: 'CAT Buldozer D6', qty: '2 units' },
      { id: 'mc3-2', name: 'Tata Tipper Truck', qty: '4 units' }
    ]
  },
  {
    id: 'act-4',
    projectId: 'prj-004',
    activityName: 'Metro Elevated Pier Concrete Pouring',
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    plannedQty: 120,
    unit: 'Nos',
    workers: 40,
    equipment: 'Transit Mixer: 5, Boom Placer: 1',
    materials: [
      { id: 'm4-1', name: 'Superplasticizer Admixture', qty: '500 Ltrs' },
      { id: 'm4-2', name: 'TMT Steel Ribbed Bars 25mm', qty: '32 tons' }
    ],
    labours: [
      { id: 'l4-1', name: 'Steel Fabricator', qty: '15' },
      { id: 'l4-2', name: 'Qualified Welder', qty: '5' },
      { id: 'l4-3', name: 'Riggers/Helpers', qty: '20' }
    ],
    machineries: [
      { id: 'mc4-1', name: 'Schwing Stetter Boom Placer', qty: '1 unit' },
      { id: 'mc4-2', name: 'Sany Concrete Pumpline', qty: '2 units' }
    ]
  },
  {
    id: 'act-5',
    projectId: 'prj-005',
    activityName: 'Grade Separator Pavement Overcast',
    startDate: '2026-07-15',
    endDate: '2026-08-05',
    plannedQty: 1800,
    unit: 'Sqm',
    workers: 22,
    equipment: 'Asphalt Paver: 1, Pneumatic Roller: 2',
    materials: [
      { id: 'm5-1', name: 'VG-30 grade Bitumen Emulsion', qty: '40 drums' },
      { id: 'm5-2', name: 'Crushed Granite Dust 10mm', qty: '180 tons' }
    ],
    labours: [
      { id: 'l5-1', name: 'Paver Operator', qty: '2' },
      { id: 'l5-2', name: 'Rake Men Team', qty: '6' },
      { id: 'l5-3', name: 'Unskilled Crew', qty: '14' }
    ],
    machineries: [
      { id: 'mc5-1', name: 'Vogele Asphalt Paver 1800-3', qty: '1 unit' },
      { id: 'mc5-2', name: 'Hamm Tandem Roller', qty: '2 units' }
    ]
  },
  {
    id: 'act-6',
    projectId: 'prj-006',
    activityName: 'Aggregate Packing & Bitumen Leveling',
    startDate: '2026-02-01',
    endDate: '2026-02-20',
    plannedQty: 6000,
    unit: 'Ton',
    workers: 28,
    equipment: 'Asphalt Spreader: 1, Roller: 3',
    materials: [
      { id: 'm6-1', name: 'Aggregate Base Binder 40mm', qty: '4000 tons' },
      { id: 'm6-2', name: 'Bitumen VG-40', qty: '80 tons' }
    ],
    labours: [
      { id: 'l6-1', name: 'Levelling Officer', qty: '2' },
      { id: 'l6-2', name: 'Screed Master', qty: '4' },
      { id: 'l6-3', name: 'Compactor Operators', qty: '3' },
      { id: 'l6-4', name: 'Sling Boys', qty: '19' }
    ],
    machineries: [
      { id: 'mc6-1', name: 'Dynapac Vibratory Roller', qty: '3 units' },
      { id: 'mc6-2', name: 'Bituminous Sprayer Truck', qty: '1 unit' }
    ]
  },
  {
    id: 'act-7',
    projectId: 'prj-007',
    activityName: 'Trench Shoring & Pipe Installation',
    startDate: '2026-05-25',
    endDate: '2026-06-15',
    plannedQty: 800,
    unit: 'Mtr',
    workers: 18,
    equipment: 'Hydraulic Crane: 1, Jack-hammer: 4',
    materials: [
      { id: 'm7-1', name: 'NP4 RCC Pipe 1200mm Dia', qty: '800 meters' },
      { id: 'm7-2', name: 'Rubber Joint Rings', qty: '200 units' }
    ],
    labours: [
      { id: 'l7-1', name: 'Pipe Alignment Expert', qty: '3' },
      { id: 'l7-2', name: 'Shoring Carpenter', qty: '4' },
      { id: 'l7-3', name: 'Excavator rigger', qty: '11' }
    ],
    machineries: [
      { id: 'mc7-1', name: 'ESCO Crawler Excavator', qty: '1 unit' },
      { id: 'mc7-2', name: 'Hydraulic Pipe Lowering Crane', qty: '1 unit' }
    ]
  },
  {
    id: 'act-8',
    projectId: 'prj-008',
    activityName: 'Urban Sewage Bypass Pipeline Intercept',
    startDate: '2026-08-05',
    endDate: '2026-08-25',
    plannedQty: 300,
    unit: 'Mtr',
    workers: 12,
    equipment: 'Submersible Sump Pumps: 4',
    materials: [
      { id: 'm8-1', name: 'Glass-fiber Reinforced Pipe', qty: '300 meters' },
      { id: 'm8-2', name: 'Bentonite Clay bags', qty: '120 bags' }
    ],
    labours: [
      { id: 'l8-1', name: 'Wastewater Specialist', qty: '2' },
      { id: 'l8-2', name: 'Diver Assistant', qty: '2' },
      { id: 'l8-3', name: 'Support Staff', qty: '8' }
    ],
    machineries: [
      { id: 'mc8-1', name: 'Kirloskar High Discharge Pumps', qty: '4 units' },
      { id: 'mc8-2', name: 'Trench Shield Box', qty: '2 panels' }
    ]
  },
  {
    id: 'act-9',
    projectId: 'prj-009',
    activityName: 'Transit Link Bridge Gantry Erection',
    startDate: '2026-04-01',
    endDate: '2026-04-18',
    plannedQty: 30,
    unit: 'Nos',
    workers: 50,
    equipment: 'Launching Gantry: 1, Crawler Crane: 2',
    materials: [
      { id: 'm9-1', name: 'High Tensile Anchor Bolts', qty: '120 units' },
      { id: 'm9-2', name: 'Epoxy Grout Compound', qty: '15 drums' }
    ],
    labours: [
      { id: 'l9-1', name: 'Certified Lifting Engineer', qty: '2' },
      { id: 'l9-2', name: 'Structural Erector', qty: '12' },
      { id: 'l9-3', name: 'Rigging Technicians', qty: '16' },
      { id: 'l9-4', name: 'Utility Helper', qty: '20' }
    ],
    machineries: [
      { id: 'mc9-1', name: '200-Ton Launching Gantry', qty: '1 unit' },
      { id: 'mc9-2', name: 'Demag CC2800 Crawler Crane', qty: '1 unit' }
    ]
  },
  {
    id: 'act-10',
    projectId: 'prj-010',
    activityName: 'Deep Bed Cable Anchor Grounding',
    startDate: '2026-03-01',
    endDate: '2026-03-22',
    plannedQty: 180,
    unit: 'Nos',
    workers: 24,
    equipment: 'Anchorage Drill Rig: 2',
    materials: [
      { id: 'm10-1', name: 'Prestressed Steel wire 15.2mm', qty: '12,000 meters' },
      { id: 'm10-2', name: 'Chemical Shear Anchors', qty: '180 units' }
    ],
    labours: [
      { id: 'l10-1', name: 'Piling Master Operator', qty: '4' },
      { id: 'l10-2', name: 'Grouting Artisan', qty: '6' },
      { id: 'l10-3', name: 'Grounding Helper', qty: '14' }
    ],
    machineries: [
      { id: 'mc10-1', name: 'Soilmec SR-75 Rotary Drilling Rig', qty: '2 units' },
      { id: 'mc10-2', name: 'High-Pressure Grout Pump', qty: '1 unit' }
    ]
  },
  {
    id: 'act-11',
    projectId: 'prj-011',
    activityName: 'Sludge Filtration Tank Wall Casting',
    startDate: '2026-09-10',
    endDate: '2026-10-01',
    plannedQty: 4,
    unit: 'Nos',
    workers: 30,
    equipment: 'Shuttering System: 1 set, Steel Bender: 2',
    materials: [
      { id: 'm11-1', name: 'Water-proofing Admixture liquid', qty: '800 Litres' },
      { id: 'm11-2', name: 'Plywood Shutter Boards 18mm', qty: '240 sheets' }
    ],
    labours: [
      { id: 'l11-1', name: 'Formwork Carpenter', qty: '10' },
      { id: 'l11-2', name: 'Iron Bender', qty: '8' },
      { id: 'l11-3', name: 'Helper concrete pourer', qty: '12' }
    ],
    machineries: [
      { id: 'mc11-1', name: 'Automatic Bar Bending machine', qty: '1 unit' },
      { id: 'mc11-2', name: 'Putzmeister Stationary pump', qty: '1 unit' }
    ]
  },
  {
    id: 'act-12',
    projectId: 'prj-012',
    activityName: 'Concrete Slab Micro-Tunnel Cover',
    startDate: '2026-05-02',
    endDate: '2026-05-18',
    plannedQty: 1200,
    unit: 'Sqm',
    workers: 16,
    equipment: 'Skid Steer Loader: 1, Compactor: 2',
    materials: [
      { id: 'm12-1', name: 'M35 Concrete aggregate premix', qty: '350 Cum' },
      { id: 'm12-2', name: 'Dowels Bars 12mm', qty: '1,500 units' }
    ],
    labours: [
      { id: 'l12-1', name: 'Screeder Expert', qty: '3' },
      { id: 'l12-2', name: 'Mason helper', qty: '5' },
      { id: 'l12-3', name: 'Bobcat driver', qty: '1' },
      { id: 'l12-4', name: 'Unskilled helpers', qty: '7' }
    ],
    machineries: [
      { id: 'mc12-1', name: 'Bobcat S450 Skid Steer Loader', qty: '1 unit' },
      { id: 'mc12-2', name: 'Concrete Vibrator Needle 40mm', qty: '4 units' }
    ]
  },
  {
    id: 'act-13',
    projectId: 'prj-013',
    activityName: 'Cyberabad Portal Box Culvert Laying',
    startDate: '2026-06-01',
    endDate: '2026-06-14',
    plannedQty: 18,
    unit: 'Nos',
    workers: 26,
    equipment: '70-Ton mobile Crane: 1, Hydraulic Jack: 4',
    materials: [
      { id: 'm13-1', name: 'Pre-cast RCC Culvert Blocks', qty: '18 segments' },
      { id: 'm13-2', name: 'Bituminous Sealant Cord', qty: '65 Kg' }
    ],
    labours: [
      { id: 'l13-1', name: 'Erector Supervisor', qty: '2' },
      { id: 'l13-2', name: 'Heavy Duty Crane Rigger', qty: '4' },
      { id: 'l13-3', name: 'Mason Fitters', qty: '6' },
      { id: 'l13-4', name: 'Laying labor', qty: '14' }
    ],
    machineries: [
      { id: 'mc13-1', name: 'Kato NK-750 Mobile Crane', qty: '1 unit' },
      { id: 'mc13-2', name: 'Hydraulic Pushing Jack 150-Ton', qty: '2 units' }
    ]
  },
  {
    id: 'act-14',
    projectId: 'prj-014',
    activityName: 'Steel Framing Base Plate Anchor Weld',
    startDate: '2026-10-15',
    endDate: '2026-11-05',
    plannedQty: 140,
    unit: 'Nos',
    workers: 16,
    equipment: 'DC Inverter Welder: 6, Compressor: 1',
    materials: [
      { id: 'm14-1', name: 'MS Anchor Plates 20mm Thk', qty: '140 plates' },
      { id: 'm14-2', name: 'E7018 Welding Electrodes', qty: '120 Kg' }
    ],
    labours: [
      { id: 'l14-1', name: '6G High pressure welder', qty: '6' },
      { id: 'l14-2', name: 'Grinder Man', qty: '4' },
      { id: 'l14-3', name: 'Helper Rigger', qty: '6' }
    ],
    machineries: [
      { id: 'mc14-1', name: 'Miller Inverter welding machines', qty: '6 units' },
      { id: 'mc14-2', name: 'Elgi Diesel Air Compressor 10HP', qty: '1 unit' }
    ]
  },
  {
    id: 'act-15',
    projectId: 'prj-015',
    activityName: 'Tunnel Base Asphalt Track Overlay',
    startDate: '2026-06-15',
    endDate: '2026-07-02',
    plannedQty: 1500,
    unit: 'Mtr',
    workers: 30,
    equipment: 'Sensor Paver: 1, Static roller: 2',
    materials: [
      { id: 'm15-1', name: 'Crushed Basalt aggregates 20mm', qty: '950 tons' },
      { id: 'm15-2', name: 'Polymer Modified Bitumen PMB-40', qty: '42 tons' }
    ],
    labours: [
      { id: 'l15-1', name: 'Senior Paver pilot', qty: '2' },
      { id: 'l15-2', name: 'Temperature check marshal', qty: '1' },
      { id: 'l15-3', name: 'Shovellers & edge finish crew', qty: '27' }
    ],
    machineries: [
      { id: 'mc15-1', name: 'CAT AP-1055F Asphalt Paver', qty: '1 unit' },
      { id: 'mc15-2', name: 'Volvo DD100 Double Drum Roller', qty: '2 units' }
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
  addProject: async (p: Omit<Project, 'id' | 'code' | 'createdAt'>) => {
    let backendStatus = 'PLANNED';
    if (p.status === 'Active') backendStatus = 'ACTIVE';
    else if (p.status === 'Completed') backendStatus = 'COMPLETED';
    else if (p.status === 'Archived') backendStatus = 'ARCHIVED';

    const payload = {
      projectName: p.name,
      clientName: p.client,
      clientContact: p.clientContact || '',
      siteMapping: p.siteMapping || p.siteId || '',
      startDate: p.startDate,
      endDate: p.endDate,
      status: backendStatus
    };

    const response = await apiClient.post('/projects', payload);
    const data = response.data;

    let localStatus: Project['status'] = 'Planning';
    if (data.status === 'ACTIVE') localStatus = 'Active';
    else if (data.status === 'COMPLETED') localStatus = 'Completed';
    else if (data.status === 'ARCHIVED') localStatus = 'Archived';

    const newProj: Project = {
      id: String(data.id),
      code: data.projectCode || `PRJ-${String(data.id).padStart(3, '0')}`,
      name: data.projectName,
      client: data.clientName,
      clientContact: data.clientContact || '',
      siteId: data.siteMapping || '',
      siteMapping: data.siteMapping || '',
      startDate: data.startDate,
      endDate: data.endDate,
      status: localStatus,
      description: p.description || '',
      createdAt: data.createdAt || new Date().toISOString()
    };

    const list = projectService.getProjects();
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
