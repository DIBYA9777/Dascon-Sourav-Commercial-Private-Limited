import { useState, useEffect } from 'react';
import { Project, ActivityPlan, ExecutionTypeConfig } from '../types';
import { projectService } from '../services/projectService';
import { executionService } from '../services/executionService';

export const KNOWN_CONTRACTORS = [
  'ABC Constructions',
  'BuildCorp Engineering Solutions',
  'Shiva Infra Projects Ltd',
  'Apex Bridge Works',
  'Vanguard Excavation Group'
];

export function useExecutionType() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [activities, setActivities] = useState<ActivityPlan[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');

  // Form Fields State
  const [type, setType] = useState<'Self' | 'Contractor'>('Self');
  const [contractorName, setContractorName] = useState<string>(KNOWN_CONTRACTORS[0]);
  const [contractStartDate, setContractStartDate] = useState<string>('');
  const [contractEndDate, setContractEndDate] = useState<string>('');
  
  // Internal team defaults (for Self-execution details)
  const [internalLead, setInternalLead] = useState<string>('Senior Engineer Rajesh Kumar');
  const [crewCount, setCrewCount] = useState<string>('14 Technicians & Labours');

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Initialize projects
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  // Sync activities on project change
  useEffect(() => {
    if (selectedProjectId) {
      const list = projectService.getActivities().filter(a => a.projectId === selectedProjectId);
      setActivities(list);
      if (list.length > 0) {
        setSelectedActivityId(list[0].id);
      } else {
        setSelectedActivityId('');
      }
    } else {
      setActivities([]);
      setSelectedActivityId('');
    }
  }, [selectedProjectId]);

  // Load current configuration when action changes
  useEffect(() => {
    if (selectedProjectId && selectedActivityId) {
      const config = executionService.getExecutionConfigByActivity(selectedProjectId, selectedActivityId);
      if (config) {
        setType(config.type);
        if (config.type === 'Contractor') {
          setContractorName(config.contractorName || KNOWN_CONTRACTORS[0]);
          setContractStartDate(config.contractStartDate || '');
          setContractEndDate(config.contractEndDate || '');
        }
      } else {
        setType('Self');
        setContractorName(KNOWN_CONTRACTORS[0]);
        setContractStartDate('');
        setContractEndDate('');
      }
    }
  }, [selectedProjectId, selectedActivityId]);

  const handleSave = () => {
    if (!selectedProjectId || !selectedActivityId) return;

    executionService.setExecutionType({
      projectId: selectedProjectId,
      activityId: selectedActivityId,
      type,
      contractorName: type === 'Contractor' ? contractorName : undefined,
      contractStartDate: type === 'Contractor' ? contractStartDate : undefined,
      contractEndDate: type === 'Contractor' ? contractEndDate : undefined
    });

    setSaveStatus('Strategy node mapped successfully!');
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;
  const selectedActivity = activities.find(a => a.id === selectedActivityId) || null;

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    activities,
    selectedActivityId,
    setSelectedActivityId,
    selectedActivity,
    
    // Config state
    type,
    setType,
    contractorName,
    setContractorName,
    contractStartDate,
    setContractStartDate,
    contractEndDate,
    setContractEndDate,
    
    // Internal state
    internalLead,
    setInternalLead,
    crewCount,
    setCrewCount,
    
    saveStatus,
    handleSave
  };
}
