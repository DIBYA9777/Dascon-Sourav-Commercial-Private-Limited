import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  IndianRupee,
  Eye,
  Calendar,
  Layers
} from 'lucide-react';
import { useSCBills } from '../hooks/useSCBills';
import { useSCBillForm } from '../hooks/useSCBillForm';
import { useAuth } from '@/src/context/AuthContext';
import { UserRole } from '@/src/types';
import SCBillStatusBadge from '../components/SCBillStatusBadge';
import SCBillTable from '../components/SCBillTable';
import SCBillDetailPage from './SCBillDetailPage';
import { SCBill } from '../types';

export default function SCBillListPage() {
  const { user } = useAuth();
  const userRole = user?.role;

  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    paginatedBills,
    currentPage,
    setCurrentPage,
    totalPages,
    handleCreateBill,
    handleUpdateBill,
    handleApproveBill,
    handleDeleteBill
  } = useSCBills();

  // Navigation and detail state
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [inspectingBill, setInspectingBill] = useState<SCBill | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const currentProject = projects.find(p => p.id === selectedProjectId);

  // Switch to detail view
  const handleInspectBill = (bill: SCBill) => {
    setInspectingBill(bill);
    setView('DETAIL');
  };

  const handleBackToList = () => {
    setView('LIST');
    setInspectingBill(null);
  };

  const handleUpdateAndSync = (updated: SCBill) => {
    handleUpdateBill(updated);
    setInspectingBill(updated);
  };

  // Safe callback of form
  const handleFormSave = (payload: any) => {
    handleCreateBill(payload);
  };

  if (view === 'DETAIL' && inspectingBill) {
    return (
      <SCBillDetailPage 
        bill={inspectingBill}
        project={currentProject}
        userRole={userRole}
        onBack={handleBackToList}
        onUpdate={handleUpdateAndSync}
        onDelete={(id) => {
          handleDeleteBill(id);
          handleBackToList();
        }}
        onApprove={handleApproveBill}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
      {/* 1. COMPACT INTERACTIVE HEADER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-50 border border-amber-100/40 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black text-slate-900 uppercase">Sub-Contractor Billing</h1>
              <span className="flex items-center gap-0.5 text-[8px] bg-emerald-50 text-emerald-700 font-black uppercase px-1.5 py-0.5 rounded border border-emerald-100">
                <Sparkles className="w-2 h-2 text-emerald-500" /> PAYOUTS & VALUATION
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">
              Raise, review, and certify completed sub-contractor activities
            </p>
          </div>
        </div>

        {/* Dynamic Project Workspace Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="project-workspace-scbills" className="text-[10px] font-black uppercase text-slate-550 tracking-wider hidden sm:block shrink-0">
            Project Workspace:
          </label>
          <select 
            id="project-workspace-scbills"
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
              id="search-scbills"
              type="text" 
              placeholder="Search by Bill No, Contractor or remarks..." 
              value={search}
              aria-label="Search contractor bills"
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-100/50 rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:bg-slate-100/80 outline-none transition-all placeholder:text-slate-440"
            />
          </div>

          {/* Filtering choice */}
          <div className="flex items-center gap-1.5 shrink-0">
            <label htmlFor="status-filter-scbills" className="text-[10px] font-black uppercase text-slate-550 tracking-wider">Status:</label>
            <select 
              id="status-filter-scbills"
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-100/40 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-705 min-w-[124px] cursor-pointer hover:bg-slate-100/55 transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Passed / Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Create Bill trigger */}
        <button 
          onClick={() => {
            setIsSubmitOpen(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 px-4 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          Submit Contractor Bill
        </button>
      </div>

      {/* 3. RESPONSIVE LISTS/TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Bill No
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Contractor Name
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Submission Date
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">
                  Total Amount (₹)
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBills.length > 0 ? (
                paginatedBills.map(bill => (
                  <tr 
                    key={bill.id} 
                    onClick={() => handleInspectBill(bill)}
                    className="hover:bg-slate-50/70 border-b border-slate-100 cursor-pointer transition-all duration-150 font-sans"
                  >
                    <td className="px-6 py-4 text-[10px] font-bold text-indigo-650 uppercase tracking-tight">
                      {bill.billNo}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-extrabold text-slate-800">
                      {bill.contractorName}
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-500 font-medium">
                      {bill.date}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono font-black text-slate-900 text-right">
                      ₹{bill.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <SCBillStatusBadge status={bill.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectBill(bill);
                        }}
                        className="p-1 px-2.5 text-[8px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 border border-slate-250/20"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <h3 className="text-xs font-black uppercase text-slate-800 mt-4 tracking-wider">No Bills Found</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase max-w-xs mx-auto leading-normal font-bold">
                      No raised contractor bills are configured matching the specifications or search criteria in this project yard.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {/* 5. POPUP / CREATE BILL MODAL */}
      {isSubmitOpen && (
        <ModalFormWrapper
          projectId={selectedProjectId}
          currentProjectName={currentProject?.name || ''}
          onClose={() => setIsSubmitOpen(false)}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}

// Inline Form Component to handle separate states nicely
interface ModalFormWrapperProps {
  projectId: string;
  currentProjectName: string;
  onClose: () => void;
  onSave: (payload: any) => void;
}

function ModalFormWrapper({
  projectId,
  currentProjectName,
  onClose,
  onSave
}: ModalFormWrapperProps) {
  const {
    contractorName,
    setContractorName,
    date,
    setDate,
    remarks,
    setRemarks,
    items,
    totalAmount,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleSubmit
  } = useSCBillForm({
    projectId,
    onSave,
    onClose
  });

  return (
    <div className="fixed inset-0 bg-slate-900/45 z-55 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 p-6 relative my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <h3 className="text-xs font-black uppercase text-slate-950 tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-500" /> Raise New Sub-Contractor Bill
          </h3>
          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide mt-1">
            Project: <span className="text-slate-600 normal-case font-black text-[10px]">{currentProjectName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col overflow-hidden text-left">
          <div className="overflow-y-auto pr-1 space-y-4 flex-1">
            {/* Primary Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Contractor Name *
                </label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  placeholder="e.g. ABC Constructions"
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold tracking-tight rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Bill Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-850 text-[10px] font-bold tracking-tight rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Editable Bill Items Table */}
            <div>
              <SCBillTable
                items={items}
                isEditable={true}
                onUpdateItem={handleUpdateItem}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            {/* Total Indicator & Comments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Additional Details & Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Include any certification summaries, physical verification reference details..."
                  className="bg-slate-50 border border-slate-200 text-slate-850 text-[10px] font-bold tracking-tight rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all h-20 resize-none"
                />
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between border border-slate-950">
                <div className="flex flex-col">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Calculated Total (₹)
                  </span>
                  <span className="text-base font-black text-white font-mono flex items-center mt-1">
                    <IndianRupee className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="bg-indigo-950/50 border border-indigo-900/65 px-2.5 py-1 rounded text-[8px] font-black uppercase text-indigo-400">
                  Dynamic Sync
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[9px] font-black uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-850 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              Raise Bill Submission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
