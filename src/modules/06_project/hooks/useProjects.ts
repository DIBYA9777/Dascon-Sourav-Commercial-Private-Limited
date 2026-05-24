import { useState, useEffect, useMemo, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [clientFilter, setClientFilter] = useState('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting
  const [sortField, setSortField] = useState<keyof Project | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadData = useCallback(() => {
    setProjects(projectService.getProjects());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get unique clients for client filter
  const clients = useMemo(() => {
    const allClients = projects.map(p => p.client);
    return Array.from(new Set(allClients));
  }, [projects]);

  const handleSort = useCallback((field: keyof Project) => {
    setSortField(prevField => {
      if (prevField === field) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortDirection('asc');
      }
      return field;
    });
    setCurrentPage(1);
  }, []);

  const toggleDeactivate = useCallback((proj: Project) => {
    const nextStatus = proj.status === 'Archived' ? 'Active' : 'Archived';
    projectService.updateProject({
      ...proj,
      status: nextStatus
    });
    loadData();
  }, [loadData]);

  // Filter listings
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.client.toLowerCase().includes(search.toLowerCase()) || 
                            p.code.toLowerCase().includes(search.toLowerCase()) ||
                            (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
                            
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesSite = siteFilter === 'ALL' || p.siteId === siteFilter;
      const matchesClient = clientFilter === 'ALL' || p.client === clientFilter;
      return matchesSearch && matchesStatus && matchesSite && matchesClient;
    });
  }, [projects, search, statusFilter, siteFilter, clientFilter]);

  // Sort listing
  const sortedProjects = useMemo(() => {
    if (!sortField) return filteredProjects;

    const sorted = [...filteredProjects].sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB);
      }
      return valA > valB ? 1 : -1;
    });

    return sortDirection === 'desc' ? sorted.reverse() : sorted;
  }, [filteredProjects, sortField, sortDirection]);

  // Paginated listing
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage) || 1;

  const stats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'Active').length,
      planning: projects.filter(p => p.status === 'Planning').length,
      archived: projects.filter(p => p.status === 'Archived').length
    };
  }, [projects]);

  return {
    projects,
    filteredProjects,
    sortedProjects,
    paginatedProjects,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    siteFilter,
    setSiteFilter,
    clientFilter,
    setClientFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortField,
    sortDirection,
    handleSort,
    totalPages,
    toggleDeactivate,
    loadData,
    stats,
    clients
  };
}
