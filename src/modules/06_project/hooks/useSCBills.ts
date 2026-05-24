import { useState, useEffect, useMemo } from 'react';
import { SCBill, Project } from '../types';
import { scBillService } from '../services/scBillService';
import { projectService } from '../services/projectService';

export function useSCBills() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [bills, setBills] = useState<SCBill[]>([]);

  // States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load Projects on mount
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  // Reload bills on project select change
  useEffect(() => {
    if (selectedProjectId) {
      loadBills();
      setCurrentPage(1);
    }
  }, [selectedProjectId]);

  const loadBills = () => {
    const data = scBillService.getBills(selectedProjectId);
    setBills(data);
  };

  // Memoized filtered bills
  const filteredBills = useMemo(() => {
    return bills.filter(b => {
      const matchesSearch = 
        b.contractorName.toLowerCase().includes(search.toLowerCase()) ||
        b.billNo.toLowerCase().includes(search.toLowerCase()) ||
        (b.remarks || '').toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bills, search, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBills.length / itemsPerPage));
  const paginatedBills = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredBills.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredBills, currentPage]);

  const handleCreateBill = (billData: Omit<SCBill, 'id' | 'billNo' | 'status' | 'createdAt'>) => {
    const fresh = scBillService.createBill(billData);
    loadBills();
    return fresh;
  };

  const handleUpdateBill = (updated: SCBill) => {
    scBillService.updateBill(updated);
    loadBills();
  };

  const handleApproveBill = (id: string, status: 'Approved' | 'Rejected', remarks?: string) => {
    scBillService.approveBill(id, status, remarks);
    loadBills();
  };

  const handleDeleteBill = (id: string) => {
    scBillService.deleteBill(id);
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
