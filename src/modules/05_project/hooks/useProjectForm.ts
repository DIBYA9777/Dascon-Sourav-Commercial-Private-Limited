import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../types';

interface UseProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
}

export function useProjectForm({ project, onSuccess }: UseProjectFormProps) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [siteId, setSiteId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<Project['status']>('Planning');
  const [description, setDescription] = useState('');
  const [errorStatus, setErrorStatus] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClient(project.client);
      setSiteId(project.siteId);
      setStartDate(project.startDate);
      setEndDate(project.endDate);
      setStatus(project.status);
      setDescription(project.description || '');
    } else {
      setName('');
      setClient('');
      setSiteId('');
      setStartDate('');
      setEndDate('');
      setStatus('Planning');
      setDescription('');
    }
    setErrorStatus('');
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !client.trim() || !startDate || !endDate || !siteId) {
      setErrorStatus('All required fields must be completed.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorStatus('Start Date cannot be after End Date.');
      return;
    }

    if (project) {
      projectService.updateProject({
        ...project,
        name: name.trim(),
        client: client.trim(),
        siteId,
        startDate,
        endDate,
        status,
        description: description.trim()
      });
    } else {
      projectService.addProject({
        name: name.trim(),
        client: client.trim(),
        siteId,
        startDate,
        endDate,
        status,
        description: description.trim()
      });
    }

    onSuccess();
  };

  return {
    name,
    setName,
    client,
    setClient,
    siteId,
    setSiteId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    description,
    setDescription,
    errorStatus,
    setErrorStatus,
    handleSubmit
  };
}
