import React, { useState, useEffect, useMemo } from 'react';
import { ACPosting, Project } from '../types';
import { acPostingService } from '../services/acPostingService';
import { projectService } from '../services/projectService';

export function useACPosting() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [postings, setPostings] = useState<ACPosting[]>([]);

  // Search and advanced query parameters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [referenceFilter, setReferenceFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync projects
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  // Sync postings when project selections shift
  useEffect(() => {
    if (selectedProjectId) {
      loadPostings();
      setCurrentPage(1);
    }
  }, [selectedProjectId]);

  const loadPostings = () => {
    const data = acPostingService.getPostings(selectedProjectId);
    setPostings(data);
  };

  const filteredPostings = useMemo(() => {
    return postings.filter(p => {
      const matchesSearch = 
        p.referenceNo.toLowerCase().includes(search.toLowerCase()) ||
        (p.remarks || '').toLowerCase().includes(search.toLowerCase()) ||
        p.items.some(item => 
          item.accountName.toLowerCase().includes(search.toLowerCase()) ||
          item.accountCode.toLowerCase().includes(search.toLowerCase())
        );

      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesReference = referenceFilter === 'ALL' || p.referenceType === referenceFilter;

      return matchesSearch && matchesStatus && matchesReference;
    });
  }, [postings, search, statusFilter, referenceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPostings.length / itemsPerPage));
  const paginatedPostings = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredPostings.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredPostings, currentPage]);

  const handlePost = (id: string) => {
    acPostingService.postEntry(id);
    loadPostings();
  };

  const handleUnpost = (id: string) => {
    acPostingService.unpostEntry(id);
    loadPostings();
  };

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    postings,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    referenceFilter,
    setReferenceFilter,
    filteredPostings,
    paginatedPostings,
    currentPage,
    setCurrentPage,
    totalPages,
    handlePost,
    handleUnpost,
    reload: loadPostings
  };
}
