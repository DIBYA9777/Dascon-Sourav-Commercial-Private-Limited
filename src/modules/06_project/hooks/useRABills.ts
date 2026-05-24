import { useState, useEffect, useMemo } from 'react';
import { RABill, Project } from '../types';
import { raBillService } from '../services/raBillService';
import { projectService } from '../services/projectService';

export function useRABills() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [bills, setBills] = useState<RABill[]>([]);

  // Filtering / Search States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load projects on mount
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  // Sync client bills when project selection changes
  useEffect(() => {
    if (selectedProjectId) {
      loadBills();
      setCurrentPage(1);
    }
  }, [selectedProjectId]);

  const loadBills = () => {
    const data = raBillService.getBills(selectedProjectId);
    setBills(data);
  };

  // Filter bills in memory
  const filteredBills = useMemo(() => {
    return bills.filter(b => {
      const matchesSearch = 
        b.clientName.toLowerCase().includes(search.toLowerCase()) ||
        b.billNo.toLowerCase().includes(search.toLowerCase()) ||
        (b.remarks || '').toLowerCase().includes(search.toLowerCase()) ||
        b.items.some(it => it.description.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bills, search, statusFilter]);

  // Handle Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBills.length / itemsPerPage));
  const paginatedBills = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredBills.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredBills, currentPage]);

  const handleCreateBill = (billData: Omit<RABill, 'id' | 'billNo' | 'status' | 'createdAt'>) => {
    const fresh = raBillService.createBill(billData);
    loadBills();
    return fresh;
  };

  const handleUpdateBill = (updated: RABill) => {
    raBillService.updateBill(updated);
    loadBills();
  };

  const handleApproveBill = (id: string, status: any, remarks?: string) => {
    raBillService.approveBill(id, status, remarks);
    loadBills();
  };

  const handleDeleteBill = (id: string) => {
    raBillService.deleteBill(id);
    loadBills();
  };

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    bills,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredBills,
    paginatedBills,
    currentPage,
    setCurrentPage,
    totalPages,
    handleCreateBill,
    handleUpdateBill,
    handleApproveBill,
    handleDeleteBill,
    reload: loadBills
  };
}
