import { useState, useEffect } from 'react';
import { progressService, ProgressReportDashboardData } from '../services/progressService';
import { projectService } from '../services/projectService';
import { Project } from '../types';

export function useProgressReport() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [periods, setPeriods] = useState<{ label: string; value: string }[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [dashboardData, setDashboardData] = useState<ProgressReportDashboardData>({
    plannedProgress: 0,
    achievedProgress: 0,
    overallProgressPercent: 0,
    delayDays: 0,
    activityData: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Load active projects
  useEffect(() => {
    const activeProjects = projectService.getProjects().filter(p => p.status === 'Active');
    setProjects(activeProjects);
    if (activeProjects.length > 0) {
      // Default to Kolkata Highway if available, otherwise first active project
      const kolkataPrj = activeProjects.find(p => p.name.includes('Kolkata'));
      setSelectedProjectId(kolkataPrj ? kolkataPrj.id : activeProjects[0].id);
    }
    setLoading(false);
  }, []);

  // 2. Fetch available periods when selected project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const availablePeriods = progressService.getAvailablePeriods(selectedProjectId);
    setPeriods(availablePeriods);
    
    // Choose "ALL" or find a default active period (like May-2026/2026-05) if it exists
    const hasMay2026 = availablePeriods.find(p => p.value === '2026-05');
    if (hasMay2026) {
      setSelectedPeriod('2026-05');
    } else {
      setSelectedPeriod('ALL');
    }
  }, [selectedProjectId]);

  // 3. Compute dashboard stats whenever project or period changes
  useEffect(() => {
    if (!selectedProjectId) return;
    const data = progressService.getDashboardData(selectedProjectId, selectedPeriod);
    setDashboardData(data);
  }, [selectedProjectId, selectedPeriod]);

  const refreshData = () => {
    if (!selectedProjectId) return;
    const data = progressService.getDashboardData(selectedProjectId, selectedPeriod);
    setDashboardData(data);
  };

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    periods,
    selectedPeriod,
    setSelectedPeriod,
    dashboardData,
    loading,
    refreshData
  };
}
