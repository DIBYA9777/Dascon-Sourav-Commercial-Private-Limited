import { projectService } from './projectService';
import { WorkOrder } from '../types';

export const workOrderService = {
  getWorkOrders: (projectId?: string): WorkOrder[] => {
    const list = projectService.getWorkOrders();
    if (projectId) {
      return list.filter(w => w.projectId === projectId);
    }
    return list;
  },

  getWorkOrder: (id: string): WorkOrder | undefined => {
    return projectService.getWorkOrders().find(w => w.id === id);
  },

  createWorkOrder: (wo: Omit<WorkOrder, 'id' | 'woNo' | 'status'>): WorkOrder => {
    return projectService.addWorkOrder(wo);
  },

  updateWorkOrder: (updated: WorkOrder): void => {
    const list = projectService.getWorkOrders();
    const idx = list.findIndex(w => w.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      projectService.saveWorkOrders(list);
    }
  },

  deleteWorkOrder: (id: string): void => {
    const list = projectService.getWorkOrders();
    const filtered = list.filter(w => w.id !== id);
    projectService.saveWorkOrders(filtered);
  },

  approveWorkOrder: (id: string, status: 'Approved' | 'Rejected'): void => {
    projectService.approveWorkOrder(id, status);
  }
};
