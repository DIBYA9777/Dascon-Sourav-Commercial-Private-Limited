import { useState, useEffect, useMemo } from 'react';
import { WorkOrder, Project, ActivityPlan } from '../types';
import { workOrderService } from '../services/workOrderService';
import { projectService } from '../services/projectService';

export function useWorkOrders() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [activities, setActivities] = useState<ActivityPlan[]>([]);

  // Search, filter and paging states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Initial load
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  // Reload data when project changes
  useEffect(() => {
    if (selectedProjectId) {
      loadWorkOrders();
      loadActivities();
      setCurrentPage(1); // Reset page on project change
    }
  }, [selectedProjectId]);

  const loadWorkOrders = () => {
    const list = workOrderService.getWorkOrders(selectedProjectId);
    setWorkOrders(list);
  };

  const loadActivities = () => {
    const acts = projectService.getActivities().filter(a => a.projectId === selectedProjectId);
    setActivities(acts);
  };

  // Filter listings based on project, text search and status
  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(w => {
      const matchesSearch = w.contractorName.toLowerCase().includes(search.toLowerCase()) || 
                            w.activityName.toLowerCase().includes(search.toLowerCase()) || 
                            w.woNo.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [workOrders, search, statusFilter]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredWorkOrders.length / itemsPerPage));
  const paginatedWorkOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredWorkOrders.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredWorkOrders, currentPage]);

  const handleCreateWorkOrder = (woData: Omit<WorkOrder, 'id' | 'woNo'>) => {
    const { status, ...rest } = woData;
    const freshWO = workOrderService.createWorkOrder(rest);
    loadWorkOrders();
    return freshWO;
  };

  const handleUpdateWorkOrder = (updated: WorkOrder) => {
    workOrderService.updateWorkOrder(updated);
    loadWorkOrders();
  };

  const handleDeleteWorkOrder = (id: string) => {
    workOrderService.deleteWorkOrder(id);
    loadWorkOrders();
  };

  const handleApproveWorkOrder = (id: string, nextStatus: 'Approved' | 'Rejected') => {
    workOrderService.approveWorkOrder(id, nextStatus);
    loadWorkOrders();
  };

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    workOrders,
    activities,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredWorkOrders,
    paginatedWorkOrders,
    currentPage,
    setCurrentPage,
    totalPages,
    handleCreateWorkOrder,
    handleUpdateWorkOrder,
    handleDeleteWorkOrder,
    handleApproveWorkOrder,
    reload: loadWorkOrders
  };
}
