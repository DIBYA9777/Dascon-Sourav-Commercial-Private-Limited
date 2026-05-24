import { ExecutionTypeConfig } from '../types';

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

const defaultExecutionConfigs: ExecutionTypeConfig[] = [
  {
    id: 'cfg-1',
    projectId: 'prj-001',
    activityId: 'act-1',
    type: 'Contractor',
    contractorName: 'ABC Constructions',
    contractStartDate: '2026-05-20',
    contractEndDate: '2026-05-30'
  },
  {
    id: 'cfg-2',
    projectId: 'prj-002',
    activityId: 'act-2',
    type: 'Self'
  },
  {
    id: 'cfg-3',
    projectId: 'prj-003',
    activityId: 'act-3',
    type: 'Contractor',
    contractorName: 'Vanguard Excavation Group',
    contractStartDate: '2026-06-15',
    contractEndDate: '2026-06-30'
  },
  {
    id: 'cfg-4',
    projectId: 'prj-004',
    activityId: 'act-4',
    type: 'Self'
  },
  {
    id: 'cfg-5',
    projectId: 'prj-005',
    activityId: 'act-5',
    type: 'Contractor',
    contractorName: 'BuildCorp Engineering Solutions',
    contractStartDate: '2026-07-15',
    contractEndDate: '2026-08-05'
  },
  {
    id: 'cfg-6',
    projectId: 'prj-006',
    activityId: 'act-6',
    type: 'Contractor',
    contractorName: 'Shiva Infra Projects Ltd',
    contractStartDate: '2026-02-01',
    contractEndDate: '2026-02-20'
  },
  {
    id: 'cfg-7',
    projectId: 'prj-007',
    activityId: 'act-7',
    type: 'Self'
  },
  {
    id: 'cfg-8',
    projectId: 'prj-008',
    activityId: 'act-8',
    type: 'Self'
  },
  {
    id: 'cfg-9',
    projectId: 'prj-009',
    activityId: 'act-9',
    type: 'Contractor',
    contractorName: 'Apex Bridge Works',
    contractStartDate: '2026-04-01',
    contractEndDate: '2026-04-18'
  },
  {
    id: 'cfg-10',
    projectId: 'prj-010',
    activityId: 'act-10',
    type: 'Contractor',
    contractorName: 'Apex Bridge Works',
    contractStartDate: '2026-03-01',
    contractEndDate: '2026-03-22'
  },
  {
    id: 'cfg-11',
    projectId: 'prj-011',
    activityId: 'act-11',
    type: 'Self'
  },
  {
    id: 'cfg-12',
    projectId: 'prj-012',
    activityId: 'act-12',
    type: 'Self'
  },
  {
    id: 'cfg-13',
    projectId: 'prj-013',
    activityId: 'act-13',
    type: 'Contractor',
    contractorName: 'BuildCorp Engineering Solutions',
    contractStartDate: '2026-06-01',
    contractEndDate: '2026-06-14'
  },
  {
    id: 'cfg-14',
    projectId: 'prj-014',
    activityId: 'act-14',
    type: 'Self'
  },
  {
    id: 'cfg-15',
    projectId: 'prj-015',
    activityId: 'act-15',
    type: 'Contractor',
    contractorName: 'Vanguard Excavation Group',
    contractStartDate: '2026-06-15',
    contractEndDate: '2026-07-02'
  }
];

export const executionService = {
  getExecutionConfigs: (): ExecutionTypeConfig[] => {
    return load<ExecutionTypeConfig[]>('erp_exec_configs', defaultExecutionConfigs);
  },

  getExecutionConfigByActivity: (projectId: string, activityId: string): ExecutionTypeConfig | undefined => {
    return executionService.getExecutionConfigs().find(
      c => c.projectId === projectId && c.activityId === activityId
    );
  },

  setExecutionType: (cfg: Omit<ExecutionTypeConfig, 'id'>): ExecutionTypeConfig => {
    const list = executionService.getExecutionConfigs();
    const idx = list.findIndex(c => c.projectId === cfg.projectId && c.activityId === cfg.activityId);
    
    const item: ExecutionTypeConfig = {
      ...cfg,
      id: idx !== -1 ? list[idx].id : `cfg-${Date.now()}`
    };

    if (idx !== -1) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    
    save('erp_exec_configs', list);
    
    // Also sync back to fallback keys if needed
    localStorage.setItem('erp_exec_configs', JSON.stringify(list));
    
    return item;
  }
};
