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
  const [clientContact, setClientContact] = useState('');
  const [siteId, setSiteId] = useState('');
  const [siteMapping, setSiteMapping] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<Project['status']>('Planning');
  const [description, setDescription] = useState('');
  const [errorStatus, setErrorStatus] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClient(project.client);
      setClientContact(project.clientContact || '');
      setSiteId(project.siteId || '');
      setSiteMapping(project.siteMapping || project.siteId || '');
      setStartDate(project.startDate);
      setEndDate(project.endDate);
      setStatus(project.status);
      setDescription(project.description || '');
    } else {
      setName('');
      setClient('');
      setClientContact('');
      setSiteId('');
      setSiteMapping('');
      setStartDate('');
      setEndDate('');
      setStatus('Planning');
      setDescription('');
    }
    setErrorStatus('');
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSiteMapping = siteMapping.trim() || siteId;
    if (!name.trim() || !client.trim() || !startDate || !endDate || !finalSiteMapping || !clientContact.trim()) {
      setErrorStatus('All required fields (including Client Contact and Site Mapping) must be completed.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorStatus('Start Date cannot be after End Date.');
      return;
    }

    try {
      if (project) {
        projectService.updateProject({
          ...project,
          name: name.trim(),
          client: client.trim(),
          clientContact: clientContact.trim(),
          siteId: finalSiteMapping,
          siteMapping: finalSiteMapping,
          startDate,
          endDate,
          status,
          description: description.trim()
        });
      } else {
        await projectService.addProject({
          name: name.trim(),
          client: client.trim(),
          clientContact: clientContact.trim(),
          siteId: finalSiteMapping,
          siteMapping: finalSiteMapping,
          startDate,
          endDate,
          status,
          description: description.trim()
        });
      }
      onSuccess();
    } catch (err: any) {
      setErrorStatus(err.message || 'An error occurred while saving the project.');
    }
  };

  return {
    name,
    setName,
    client,
    setClient,
    clientContact,
    setClientContact,
    siteId,
    setSiteId,
    siteMapping,
    setSiteMapping,
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
