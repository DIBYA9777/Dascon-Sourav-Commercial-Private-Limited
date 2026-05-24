import { useState, useEffect, useCallback } from 'react';
import { boqService } from '../services/boqService';
import { projectService } from '../services/projectService';
import { Project, BOQ } from '../types';

export function useBOQ(projectId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [boqs, setBoqs] = useState<BOQ[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const [currentBOQ, setCurrentBOQ] = useState<BOQ | null>(null);

  const loadData = useCallback(() => {
    const projList = projectService.getProjects();
    setProjects(projList);
    const boqList = boqService.getBOQs();
    setBoqs(boqList);

    if (projectId) {
      setSelectedProjectId(projectId);
    } else if (projList.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projList[0].id);
    }
  }, [projectId, selectedProjectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedProjectId) {
      const boq = boqService.getBOQByProject(selectedProjectId);
      if (boq) {
        setCurrentBOQ(boq);
      } else {
        const proj = projectService.getProjectById(selectedProjectId);
        if (proj) {
          const freshBOQ: BOQ = {
            id: `boq-${Date.now()}`,
            projectId: selectedProjectId,
            boqNo: `BOQ/${proj.code}/01`,
            date: new Date().toISOString().split('T')[0],
            status: 'Draft',
            version: 1,
            totalAmount: 0,
            items: []
          };
          setCurrentBOQ(freshBOQ);
        } else {
          setCurrentBOQ(null);
        }
      }
    }
  }, [selectedProjectId, boqs]);

  const updateBOQStatus = useCallback((status: BOQ['status']) => {
    if (!currentBOQ) return;
    
    let nextVersion = currentBOQ.version;
    let nextBOQNo = currentBOQ.boqNo;

    if (status === 'Revised') {
      nextVersion = currentBOQ.version + 1;
      const codeBase = currentBOQ.boqNo.split('/')[1] || 'PRJ';
      nextBOQNo = `BOQ/${codeBase}/${String(nextVersion).padStart(2, '0')}`;
    }

    const updated: BOQ = {
      ...currentBOQ,
      status,
      version: nextVersion,
      boqNo: nextBOQNo
    };

    boqService.createOrUpdateBOQ(updated);
    loadData();
  }, [currentBOQ, loadData]);

  const saveBOQ = useCallback((updated: BOQ) => {
    boqService.createOrUpdateBOQ(updated);
    setCurrentBOQ(updated);
    loadData();
  }, [loadData]);

  return {
    projects,
    boqs,
    selectedProjectId,
    setSelectedProjectId,
    currentBOQ,
    setCurrentBOQ,
    updateBOQStatus,
    saveBOQ,
    reload: loadData
  };
}
