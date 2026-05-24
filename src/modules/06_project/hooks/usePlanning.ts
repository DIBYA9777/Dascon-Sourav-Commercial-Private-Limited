import { useState, useEffect } from 'react';
import { Project, ActivityPlan } from '../types';
import { projectService } from '../services/projectService';
import { planningService } from '../services/planningService';

export function usePlanning() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [activities, setActivities] = useState<ActivityPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'material' | 'labour' | 'machine'>('material');

  // Load projects initially
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  // Load activities when project selection changes
  useEffect(() => {
    if (selectedProjectId) {
      loadActivities();
    } else {
      setActivities([]);
      setActivePlanId(null);
    }
  }, [selectedProjectId]);

  const loadActivities = () => {
    const list = planningService.getActivitiesByProject(selectedProjectId);
    setActivities(list);
    if (list.length > 0) {
      // Pick first activity if none is active or active is not in the new list
      if (!activePlanId || !list.some(a => a.id === activePlanId)) {
        setActivePlanId(list[0].id);
      }
    } else {
      setActivePlanId(null);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleAddActivity = (activity: Omit<ActivityPlan, 'id' | 'projectId' | 'materials' | 'labours' | 'machineries'>) => {
    if (!selectedProjectId) return;
    const newAct = planningService.addActivity({
      ...activity,
      projectId: selectedProjectId,
      materials: [],
      labours: [],
      machineries: []
    });
    loadActivities();
    setActivePlanId(newAct.id);
  };

  const handleUpdateActivity = (updated: ActivityPlan) => {
    planningService.updateActivity(updated);
    loadActivities();
  };

  const handleDeleteActivity = (id: string) => {
    planningService.deleteActivity(id);
    if (activePlanId === id) {
      setActivePlanId(null);
    }
    loadActivities();
  };

  const handleAddResource = (category: 'material' | 'labour' | 'machine', name: string, qty: string) => {
    if (!activePlanId) return;
    planningService.addResourceItem(activePlanId, category, name, qty);
    loadActivities();
  };

  const handleDeleteResource = (category: 'material' | 'labour' | 'machine', itemId: string) => {
    if (!activePlanId) return;
    planningService.deleteResourceItem(activePlanId, category, itemId);
    loadActivities();
  };

  const currentPlan = activities.find(a => a.id === activePlanId) || null;
  const currentProject = projects.find(p => p.id === selectedProjectId) || null;

  return {
    projects,
    selectedProjectId,
    currentProject,
    activities,
    activePlanId,
    activeTab,
    currentPlan,
    setSelectedProjectId: handleSelectProject,
    setActivePlanId,
    setActiveTab,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleAddResource,
    handleDeleteResource,
    refresh: loadActivities
  };
}
