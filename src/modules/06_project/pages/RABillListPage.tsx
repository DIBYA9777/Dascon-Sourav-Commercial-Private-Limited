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
  Building2,
  Percent
} from 'lucide-react';
import { useRABills } from '../hooks/useRABills';
import { useRABillForm } from '../hooks/useRABillForm';
import { useAuth } from '@/src/context/AuthContext';
import { UserRole } from '@/src/types';
import RABillStatusBadge from '../components/RABillStatusBadge';
import RABillTable from '../components/RABillTable';
import RABillDetailPage from './RABillDetailPage';
import { RABill } from '../types';

export default function RABillListPage() {
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
  } = useRABills();

  // Navigation and inspecting details
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [inspectingBill, setInspectingBill] = useState<RABill | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const currentProject = projects.find(p => p.id === selectedProjectId);

  // Switch to detail view
  const handleInspectBill = (bill: RABill) => {
    setInspectingBill(bill);
    setView('DETAIL');
  };

  const handleBackToList = () => {
    setView('LIST');
    setInspectingBill(null);
  };

  const handleUpdateAndSync = (updated: RABill) => {
    handleUpdateBill(updated);
    setInspectingBill(updated);
  };

  // Safe callback of form
  const handleFormSave = (payload: any) => {
    handleCreateBill(payload);
  };

  if (view === 'DETAIL' && inspectingBill) {
    return (
      <RABillDetailPage 
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
          <div className="w-11 h-11 bg-sky-50 border border-sky-100/40 text-sky-600 rounded-xl flex items-center justify-center font-bold">
            <FileText className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black text-slate-900 uppercase">Running Account (RA) Bills</h1>
              <span className="flex items-center gap-0.5 text-[8px] bg-sky-50 text-sky-700 font-black uppercase px-1.5 py-0.5 rounded border border-sky-100">
                <Sparkles className="w-2 h-2 text-sky-500" /> CLIENT BILLING
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">
              Generate work progress claims and manage corporate client invoices
            </p>
          </div>
        </div>

        {/* Dynamic Project Yard Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="project-yard-rabills" className="text-[10px] font-black uppercase text-slate-550 tracking-wider hidden sm:block shrink-0">
            Project Yard:
          </label>
          <select 
            id="project-yard-rabills"
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
              id="search-rabills"
              type="text" 
              placeholder="Search by Bill No, Client or item description..." 
              value={search}
              aria-label="Search client RA bills"
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-100/50 rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:bg-slate-100/80 outline-none transition-all placeholder:text-slate-440"
            />
          </div>

          {/* Filtering choice */}
          <div className="flex items-center gap-1.5 shrink-0">
            <label htmlFor="status-filter-rabills" className="text-[10px] font-black uppercase text-slate-550 tracking-wider">Status:</label>
            <select 
              id="status-filter-rabills"
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-100/40 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-705 min-w-[124px] cursor-pointer hover:bg-slate-100/55 transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Passed / Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Raise RA Bill trigger */}
        <button 
          onClick={() => {
            setIsSubmitOpen(true);
          }}
          className="bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-4 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-sky-300" />
          Raise New Client RA Bill
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
                  Client / Agency Name
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Date of Submission
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">
                  Subtotal (₹)
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">
                  Tax / GST (₹)
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">
                  Grand Total (₹)
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
                      {bill.clientName}
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-500 font-medium">
                      {bill.date}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-600 text-right font-bold">
                      ₹{bill.subtotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-400 text-right">
                      ₹{bill.gstAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono font-black text-slate-900 text-right">
                      ₹{bill.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <RABillStatusBadge status={bill.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectBill(bill);
                        }}
                        className="p-1 px-2.5 text-[8px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 border border-slate-200"
                      >
                        <Eye className="w-3 h-3" /> View Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <h3 className="text-xs font-black uppercase text-slate-800 mt-4 tracking-wider">No RA Client Bills</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase max-w-xs mx-auto leading-normal font-bold">
                      No raised running account progress invoices are registered for the selected project code.
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

      {/* 5. POPUP / CREATE RA CLIENT BILL MODAL */}
      {isSubmitOpen && (
        <RABillFormModal
          projectId={selectedProjectId}
          currentProjectName={currentProject?.name || ''}
          currentClientName={currentProject?.client || ''}
          onClose={() => setIsSubmitOpen(false)}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}

// Inline Form Component to handle separate states nicely
interface RABillFormModalProps {
  projectId: string;
  currentProjectName: string;
  currentClientName: string;
  onClose: () => void;
  onSave: (payload: any) => void;
}

function RABillFormModal({
  projectId,
  currentProjectName,
  currentClientName,
  onClose,
  onSave
}: RABillFormModalProps) {
  const {
    clientName,
    setClientName,
    date,
    setDate,
    remarks,
    setRemarks,
    gstRate,
    setGstRate,
    items,
    subtotal,
    gstAmount,
    grandTotal,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleSubmit
  } = useRABillForm({
    projectId,
    onSave,
    onClose
  });

  // Automatically initialize field based on current project client name if available
  React.useEffect(() => {
    if (currentClientName && !clientName) {
      setClientName(currentClientName);
    }
  }, [currentClientName]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-55 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 p-6 relative my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <h3 className="text-xs font-black uppercase text-slate-950 tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Plus className="w-4 h-4 text-sky-500" /> Raise New Running Account (RA) Bill
          </h3>
          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide mt-1">
            Contract Scope: <span className="text-slate-600 normal-case font-black text-[10px]">{currentProjectName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col overflow-hidden text-left">
          <div className="overflow-y-auto pr-1 space-y-4 flex-1">
            {/* Primary Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col md:col-span-2">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-sky-500" /> Client Organisation / Agency Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Public Works Department (PWD)"
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold tracking-tight rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-sky-500" /> Billing Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-850 text-[10px] font-bold tracking-tight rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Editable Bill Items Table */}
            <div>
              <RABillTable
                items={items}
                isEditable={true}
                onUpdateItem={handleUpdateItem}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            {/* Dynamic GST Settings & Remarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Client Invoice Remarks & Scope Descriptions
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Provide details about certified chainages, slab completed percentages..."
                    className="bg-slate-50 border border-slate-200 text-slate-850 text-[10px] font-bold tracking-tight rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all h-20 resize-none"
                  />
                </div>
              </div>

              {/* Taxation panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Percent className="w-2.5 h-2.5 text-slate-400" /> Standard GST Configuration
                  </span>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      value={gstRate}
                      onChange={e => setGstRate(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-10 bg-white border border-slate-300 text-slate-800 text-[10px] font-black text-center rounded px-1 py-0.5 focus:outline-none"
                    />
                    <span className="text-[10px] font-black text-slate-400">%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 font-mono text-left">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase">Gross Work Subtotal</span>
                    <span className="text-xs font-bold text-slate-650">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase">GST Amount ({gstRate}%)</span>
                    <span className="text-xs font-bold text-slate-650">₹{gstAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between mt-3">
                  <span className="text-[8px] font-black uppercase text-slate-300">Total Net Receivable:</span>
                  <span className="text-xs font-black text-emerald-400 flex items-center">
                    <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                    {grandTotal.toLocaleString()}
                  </span>
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
              Confirm & Raise RA Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
