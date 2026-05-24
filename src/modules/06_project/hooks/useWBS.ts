import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectService } from '../services/projectService';
import { wbsService } from '../services/wbsService';
import { Project, WBSLayer, WBSChainage, WBSComponent } from '../types';

export function useWBS() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const [layers, setLayers] = useState<WBSLayer[]>([]);
  const [chainages, setChainages] = useState<WBSChainage[]>([]);
  const [components, setComponents] = useState<WBSComponent[]>([]);

  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({
    'lay-1': true,
    'lay-2': true,
    'lay-3': true
  });
  
  const [expandedChainages, setExpandedChainages] = useState<Record<string, boolean>>({
    'ch-1': true,
    'ch-2': true
  });

  const [activeChainageId, setActiveChainageId] = useState<string | null>(null);

  // Initialize projects
  const refreshProjects = useCallback(() => {
    const projs = projectService.getProjects().filter(p => p.status !== 'Archived');
    setProjects(projs);
    if (projs.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projs[0].id);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // Load WBS Node Data
  const loadWBSData = useCallback(() => {
    if (!selectedProjectId) return;

    const allLayers = wbsService.getLayers().filter(l => l.projectId === selectedProjectId);
    const allChainages = wbsService.getChainages().filter(c => c.projectId === selectedProjectId);
    const allComps = wbsService.getComponents().filter(c => c.projectId === selectedProjectId);

    setLayers(allLayers);
    setChainages(allChainages);
    setComponents(allComps);

    // Set default selected chainage if null or no longer valid for the updated project
    const isValid = allChainages.some(c => c.id === activeChainageId);
    if (!isValid) {
      if (allChainages.length > 0) {
        setActiveChainageId(allChainages[0].id);
      } else {
        setActiveChainageId(null);
      }
    }
  }, [selectedProjectId, activeChainageId]);

  useEffect(() => {
    loadWBSData();
  }, [selectedProjectId, loadWBSData]);

  // Expand layers & chainages toggles
  const toggleLayerExpanded = useCallback((id: string) => {
    setExpandedLayers(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleChainageExpanded = useCallback((id: string) => {
    setExpandedChainages(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // LAYER ACTIONS
  const addLayer = useCallback((name: string) => {
    if (!selectedProjectId || !name.trim()) return;
    wbsService.addLayer(selectedProjectId, name);
    loadWBSData();
  }, [selectedProjectId, loadWBSData]);

  const updateLayer = useCallback((id: string, name: string) => {
    if (!selectedProjectId) return;
    wbsService.updateLayer({ id, projectId: selectedProjectId, name: name.trim() });
    loadWBSData();
  }, [selectedProjectId, loadWBSData]);

  const deleteLayer = useCallback((id: string) => {
    wbsService.deleteLayer(id);
    loadWBSData();
  }, [loadWBSData]);

  // CHAINAGE ACTIONS
  const addChainage = useCallback((layerId: string, range: string) => {
    if (!selectedProjectId || !layerId || !range.trim()) return;
    const added = wbsService.addChainage(layerId, selectedProjectId, range);
    // Auto active latest added chainage for visual feedback
    setActiveChainageId(added.id);
    // Auto expand parent
    setExpandedLayers(prev => ({ ...prev, [layerId]: true }));
    loadWBSData();
  }, [selectedProjectId, loadWBSData]);

  const updateChainage = useCallback((id: string, layerId: string, range: string) => {
    if (!selectedProjectId) return;
    wbsService.updateChainage({ id, layerId, projectId: selectedProjectId, range: range.trim() });
    loadWBSData();
  }, [selectedProjectId, loadWBSData]);

  const deleteChainage = useCallback((id: string) => {
    wbsService.deleteChainage(id);
    if (activeChainageId === id) {
      setActiveChainageId(null);
    }
    loadWBSData();
  }, [activeChainageId, loadWBSData]);

  // COMPONENT ACTIONS
  const addComponent = useCallback((chainageId: string, layerId: string, name: string, unit: string) => {
    if (!selectedProjectId || !chainageId || !layerId || !name.trim()) return;
    wbsService.addComponent(chainageId, layerId, selectedProjectId, name, unit);
    loadWBSData();
  }, [selectedProjectId, loadWBSData]);

  const updateComponent = useCallback((id: string, chainageId: string, layerId: string, code: string, name: string, unit: string) => {
    if (!selectedProjectId) return;
    wbsService.updateComponent({ id, chainageId, layerId, projectId: selectedProjectId, code, name: name.trim(), unit });
    loadWBSData();
  }, [selectedProjectId, loadWBSData]);

  const deleteComponent = useCallback((id: string) => {
    wbsService.deleteComponent(id);
    loadWBSData();
  }, [loadWBSData]);

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    layers,
    chainages,
    components,
    expandedLayers,
    setExpandedLayers,
    expandedChainages,
    setExpandedChainages,
    activeChainageId,
    setActiveChainageId,
    
    toggleLayerExpanded,
    toggleChainageExpanded,
    
    addLayer,
    updateLayer,
    deleteLayer,
    
    addChainage,
    updateChainage,
    deleteChainage,
    
    addComponent,
    updateComponent,
    deleteComponent,
    
    refreshData: loadWBSData
  };
}
