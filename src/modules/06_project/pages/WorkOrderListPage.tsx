import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useWorkOrders } from '../hooks/useWorkOrders';
import { useAuth } from '@/src/context/AuthContext';
import { UserRole } from '@/src/types';
import WorkOrderCard from '../components/WorkOrderCard';
import WorkOrderForm from '../components/WorkOrderForm';
import WorkOrderDetailPage from './WorkOrderDetailPage';
import { WorkOrder } from '../types';

export default function WorkOrderListPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN;

  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    activities,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    paginatedWorkOrders,
    currentPage,
    setCurrentPage,
    totalPages,
    handleCreateWorkOrder,
    handleUpdateWorkOrder,
    handleDeleteWorkOrder,
    handleApproveWorkOrder
  } = useWorkOrders();

  // Navigation and detail state
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [inspectingWO, setInspectingWO] = useState<WorkOrder | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentProject = projects.find(p => p.id === selectedProjectId);

  // Switch to detail view
  const handleInspectWO = (wo: WorkOrder) => {
    setInspectingWO(wo);
    setView('DETAIL');
  };

  const handleBackToList = () => {
    setView('LIST');
    setInspectingWO(null);
  };

  const handleUpdateAndSync = (updated: WorkOrder) => {
    handleUpdateWorkOrder(updated);
    setInspectingWO(updated);
  };

  if (view === 'DETAIL' && inspectingWO) {
    return (
      <WorkOrderDetailPage 
        workOrder={inspectingWO}
        project={currentProject}
        isAdmin={isAdmin}
        activities={activities}
        onBack={handleBackToList}
        onUpdate={handleUpdateAndSync}
        onDelete={handleDeleteWorkOrder}
        onApprove={handleApproveWorkOrder}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
      {/* 1. COMPACT INTERACTIVE HEADER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-3xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-rose-50 border border-rose-100/40 text-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black text-slate-900 uppercase">Work Order System</h1>
              <span className="flex items-center gap-0.5 text-[8px] bg-indigo-50 text-indigo-700 font-black uppercase px-1.5 py-0.5 rounded border border-indigo-100">
                <Sparkles className="w-2 h-2 text-indigo-500" /> CONTRACTS
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">
              Authorize subcontractor budgets and project labor scopes
            </p>
          </div>
        </div>

        {/* Dynamic Project Workspace Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden sm:block shrink-0">
            Project Workspace:
          </label>
          <select 
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="w-full md:w-auto min-w-0 max-w-full md:max-w-[320px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-3 text-xs font-black outline-none cursor-pointer transition-colors truncate"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>[{p.code}] {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. ADVANCED CRITERIA FILTERS & TRIGGERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          {/* Text Input Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by WO No, Contractor or linked Activity..." 
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-100/50 rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:bg-slate-100/80 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filtering choice */}
          <select 
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-100/40 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-700 min-w-[124px] cursor-pointer hover:bg-slate-100/55 transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Create budget trigger */}
        <button 
          onClick={() => {
            setErrorMessage('');
            setIsCreateOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-4 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Work Order
        </button>
      </div>

      {/* 3. RESPONSIVE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedWorkOrders.length > 0 ? (
          paginatedWorkOrders.map(wo => (
            <WorkOrderCard 
              key={wo.id}
              workOrder={wo}
              isAdmin={isAdmin}
              onInspect={handleInspectWO}
              onDelete={handleDeleteWorkOrder}
            />
          ))
        ) : (
          <div className="col-span-full py-16 bg-white border border-dashed border-slate-200/80 rounded-[2rem] text-center max-w-md mx-auto w-full px-6">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-xs font-black uppercase text-slate-800 mt-4 tracking-wider">No Work Orders Found</h3>
            <p className="text-[11px] text-slate-400 font-bold mt-1.5 uppercase leading-normal">
              No registered contracts match the criteria, or budget outsourcing has not been initiated for this project workspace.
            </p>
          </div>
        )}
      </div>

      {/* 4. SOLID PAGINATION BAR */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-100 px-4 py-3 rounded-2xl shadow-3xs">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. POPUP / CREATE DRAFT WORK ORDER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/45 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border-4 border-white p-6 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsCreateOpen(false)} 
              className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-500" /> Draft Authoritative Contract
            </h3>

            {errorMessage && (
              <div className="mb-4 p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-[10px] font-black text-rose-600 uppercase">
                {errorMessage}
              </div>
            )}

            <WorkOrderForm 
              activities={activities}
              onCancel={() => setIsCreateOpen(false)}
              onSubmit={(formData) => {
                const results = handleCreateWorkOrder({
                  ...formData,
                  projectId: selectedProjectId
                });
                if (results) {
                  setIsCreateOpen(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
