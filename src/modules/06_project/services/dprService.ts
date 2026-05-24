import { DPR } from '../types';

const defaultDPRs: DPR[] = [
  {
    id: 'dpr-1',
    projectId: 'prj-001',
    date: '2026-05-21',
    status: 'Submitted',
    workProgress: [
      {
        activityId: 'act-1',
        activityName: 'Drain Construction (0-1 KM)',
        plannedQty: 100,
        completedQty: 110,
        pendingQty: 890,
        unit: 'Mtr'
      }
    ],
    labours: [
      { type: 'Mason', count: 4 },
      { type: 'Helper', count: 16 }
    ],
    materials: [
      { name: 'Cement (OPC 53 Grade)', qty: 10, unit: 'bags' },
      { name: 'River Sand', qty: 4, unit: 'tons' }
    ],
    machines: [
      { name: 'Concrete Mixer', hours: 8 },
      { name: 'Excavator JCB', hours: 5 }
    ],
    remarks: 'Clear weather. Work completed ahead of planned daily run.'
  },
  {
    id: 'dpr-2',
    projectId: 'prj-001',
    date: '2026-05-22',
    status: 'Submitted',
    workProgress: [
      {
        activityId: 'act-1',
        activityName: 'Drain Construction (0-1 KM)',
        plannedQty: 100,
        completedQty: 40,
        pendingQty: 850,
        unit: 'Mtr'
      }
    ],
    labours: [
      { type: 'Mason', count: 4 },
      { type: 'Helper', count: 12 }
    ],
    materials: [
      { name: 'Cement (OPC 53 Grade)', qty: 4, unit: 'bags' },
      { name: 'River Sand', qty: 2, unit: 'tons' }
    ],
    machines: [
      { name: 'Concrete Mixer', hours: 3 },
      { name: 'Excavator JCB', hours: 2 }
    ],
    remarks: 'Rain delay in the afternoon session. Heavy clay slippery path restricted excavator movement.'
  }
];

const load = <T>(key: string, backup: T): T => {
  const item = localStorage.getItem(key);
  if (!item) return backup;
  try {
    const parsed = JSON.parse(item);
    return parsed as T;
  } catch {
    return backup;
  }
};

const save = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dprService = {
  getDPRs: (projectId?: string): DPR[] => {
    const list = load<DPR[]>('erp_dprs', defaultDPRs);
    if (projectId) {
      return list.filter(d => d.projectId === projectId);
    }
    return list;
  },

  getDPR: (id: string): DPR | undefined => {
    return dprService.getDPRs().find(d => d.id === id);
  },

  createDPR: (dpr: Omit<DPR, 'id'>): DPR => {
    const list = dprService.getDPRs();
    const item: DPR = {
      ...dpr,
      id: `dpr-${Date.now()}`
    };
    list.push(item);
    save('erp_dprs', list);
    return item;
  },

  updateDPR: (updated: DPR): void => {
    const list = dprService.getDPRs();
    const idx = list.findIndex(d => d.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      save('erp_dprs', list);
    }
  },

  deleteDPR: (id: string): void => {
    const list = dprService.getDPRs();
    const filtered = list.filter(d => d.id !== id);
    save('erp_dprs', filtered);
  }
};
