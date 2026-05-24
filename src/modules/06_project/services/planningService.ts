import { ActivityPlan, ResourcePlanItem } from '../types';

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

export const planningService = {
  getActivities: (): ActivityPlan[] => {
    return load<ActivityPlan[]>('erp_activities', defaultActivities);
  },

  getActivitiesByProject: (projectId: string): ActivityPlan[] => {
    return planningService.getActivities().filter(a => a.projectId === projectId);
  },

  saveActivities: (acts: ActivityPlan[]) => {
    save('erp_activities', acts);
  },

  addActivity: (activity: Omit<ActivityPlan, 'id'>): ActivityPlan => {
    const list = planningService.getActivities();
    const newItem: ActivityPlan = {
      ...activity,
      id: `act-${Date.now()}`
    };
    list.push(newItem);
    planningService.saveActivities(list);
    return newItem;
  },

  updateActivity: (updated: ActivityPlan): void => {
    const list = planningService.getActivities();
    const idx = list.findIndex(a => a.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      planningService.saveActivities(list);
    }
  },

  deleteActivity: (id: string): void => {
    const list = planningService.getActivities();
    const filtered = list.filter(a => a.id !== id);
    planningService.saveActivities(filtered);
  },

  addResourceItem: (
    activityId: string,
    category: 'material' | 'labour' | 'machine',
    name: string,
    qty: string
  ): ActivityPlan | null => {
    const list = planningService.getActivities();
    const idx = list.findIndex(a => a.id === activityId);
    if (idx === -1) return null;

    const act = list[idx];
    const newItem: ResourcePlanItem = {
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      qty: qty.trim()
    };

    if (category === 'material') {
      act.materials = [...(act.materials || []), newItem];
    } else if (category === 'labour') {
      act.labours = [...(act.labours || []), newItem];
    } else {
      act.machineries = [...(act.machineries || []), newItem];
    }

    list[idx] = act;
    planningService.saveActivities(list);
    return act;
  },

  deleteResourceItem: (
    activityId: string,
    category: 'material' | 'labour' | 'machine',
    itemId: string
  ): ActivityPlan | null => {
    const list = planningService.getActivities();
    const idx = list.findIndex(a => a.id === activityId);
    if (idx === -1) return null;

    const act = list[idx];

    if (category === 'material') {
      act.materials = (act.materials || []).filter(i => i.id !== itemId);
    } else if (category === 'labour') {
      act.labours = (act.labours || []).filter(i => i.id !== itemId);
    } else {
      act.machineries = (act.machineries || []).filter(i => i.id !== itemId);
    }

    list[idx] = act;
    planningService.saveActivities(list);
    return act;
  }
};
