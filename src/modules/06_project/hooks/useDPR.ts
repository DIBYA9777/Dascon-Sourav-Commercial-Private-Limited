import { useState, useEffect, useMemo } from 'react';
import { Project, ActivityPlan, DPR, DPRWorkProgress, DPRLabour, DPRMaterial, DPRMachine } from '../types';
import { projectService } from '../services/projectService';
import { dprService } from '../services/dprService';

type DPRTabType = 'WORK' | 'LABOUR' | 'MATERIAL' | 'MACHINE' | 'REMARKS';

export function useDPR() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [dprs, setDprs] = useState<DPR[]>([]);
  const [activities, setActivities] = useState<ActivityPlan[]>([]);

  // Filtering / Listing State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Multi-tab Entry Form States
  const [activeTab, setActiveTab] = useState<DPRTabType>('WORK');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [workProgress, setWorkProgress] = useState<DPRWorkProgress[]>([]);
  const [labours, setLabours] = useState<DPRLabour[]>([]);
  const [materials, setMaterials] = useState<DPRMaterial[]>([]);
  const [machines, setMachines] = useState<DPRMachine[]>([]);
  const [remarks, setRemarks] = useState<string>('');

  // Initial Load Projects
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  // Reload DPRs and Project-specific WBS activities when project changes
  useEffect(() => {
    if (selectedProjectId) {
      loadDPRs();
      loadActivities();
    }
  }, [selectedProjectId]);

  const loadDPRs = () => {
    const list = dprService.getDPRs(selectedProjectId);
    setDprs(list);
  };

  const loadActivities = () => {
    const acts = projectService.getActivities().filter(a => a.projectId === selectedProjectId);
    setActivities(acts);
  };

  // Filtered DPR lists
  const filteredDPRs = useMemo(() => {
    return dprs.filter(d => {
      const matchesSearch = d.date.includes(search) || d.remarks.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a,b) => b.date.localeCompare(a.date)); // Sort newest date first
  }, [dprs, search, statusFilter]);

  // Command to bootstrap fresh empty DPR entry template for selected date
  const prepareNewDPRDraft = (targetDate: string) => {
    setDate(targetDate);
    setActiveTab('WORK');
    setRemarks('');
    setLabours([]);
    setMaterials([]);
    setMachines([]);

    // Populate workProgress with target activities for selected project
    const defaultProgress = activities.map(act => ({
      activityId: act.id,
      activityName: act.activityName,
      plannedQty: act.plannedQty,
      completedQty: 0,
      pendingQty: act.plannedQty,
      unit: act.unit
    }));
    setWorkProgress(defaultProgress);
  };

  // Command to load existing DPR details for viewing/editing
  const loadDPRDraft = (dpr: DPR) => {
    setDate(dpr.date);
    setRemarks(dpr.remarks);
    setWorkProgress(dpr.workProgress);
    setLabours(dpr.labours || []);
    setMaterials(dpr.materials || []);
    setMachines(dpr.machines || []);
    setActiveTab('WORK');
  };

  // Submit and save DPR draft
  const handleSaveDraft = (status: 'Pending' | 'Submitted', existingId?: string) => {
    const dprPayload: Omit<DPR, 'id'> = {
      projectId: selectedProjectId,
      date,
      status,
      workProgress,
      labours,
      materials,
      machines,
      remarks: remarks.trim() || 'Work scheduled and logged in WBS framework.'
    };

    if (existingId) {
      dprService.updateDPR({
        id: existingId,
        ...dprPayload
      });
    } else {
      dprService.createDPR(dprPayload);
    }
    loadDPRs();
  };

  const handleDeleteDPR = (id: string) => {
    dprService.deleteDPR(id);
    loadDPRs();
  };

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    dprs,
    activities,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDPRs,
    
    // Draft States
    activeTab,
    setActiveTab,
    date,
    setDate,
    workProgress,
    setWorkProgress,
    labours,
    setLabours,
    materials,
    setMaterials,
    machines,
    setMachines,
    remarks,
    setRemarks,

    // Operations
    prepareNewDPRDraft,
    loadDPRDraft,
    handleSaveDraft,
    handleDeleteDPR,
    reload: loadDPRs
  };
}
