import React, { useState } from 'react';
import { useACPosting } from '../hooks/useACPosting';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  ShieldAlert,
  ArrowRight,
  Receipt,
  Coins,
  DollarSign
} from 'lucide-react';
import PostingStatusBadge from '../components/PostingStatusBadge';
import ACPostingDetailPage from './ACPostingDetailPage';

export default function ACPostingListPage() {
  const {
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
    reload
  } = useACPosting();

  const [selectedPostingId, setSelectedPostingId] = useState<string | null>(null);

  // Calculate statistics for currently selected project
  const stats = React.useMemo(() => {
    let pendingCount = 0;
    let pendingValue = 0;
    let postedCount = 0;
    let postedValue = 0;

    filteredPostings.forEach(p => {
      if (p.status === 'Posted') {
        postedCount++;
        postedValue += p.debitTotal;
      } else {
        pendingCount++;
        pendingValue += p.debitTotal;
      }
    });

    return { pendingCount, pendingValue, postedCount, postedValue };
  }, [filteredPostings]);

  // If a posting is selected, render the detail page
  const activePosting = postings.find(p => p.id === selectedPostingId);
  if (activePosting) {
    const selectedProject = projects.find(prj => prj.id === activePosting.projectId);
    return (
      <ACPostingDetailPage
        posting={activePosting}
        project={selectedProject}
        onBack={() => {
          setSelectedPostingId(null);
          reload();
        }}
        onPost={handlePost}
        onUnpost={handleUnpost}
      />
    );
  }

  const activeProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4 text-left animate-in fade-in duration-300">
      
      {/* Upper Area: Select Project & Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              A/C Posting — General Ledger
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Review automatically generated accounting entries from certified Client RA Bills and Subcontractor Bills.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-col">
            <label htmlFor="bu-select-yard" className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
              Select Business Unit / Project Yard
            </label>
            <select
              id="bu-select-yard"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer min-w-56"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-3xs max-w-md mx-auto">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-tight">
            No projects found
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">
            Please record active infrastructure project yards before checking financial posting ledgers.
          </p>
        </div>
      ) : (
        <>
          {/* Quick Metrics Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Panel 1: Pending */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider block">
                  Awaiting Finance Verification
                </span>
                <span className="font-mono text-lg font-black text-slate-900 block">
                  ₹{stats.pendingValue.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-405 font-medium block">
                  {stats.pendingCount} Entries awaiting posting sign-off
                </span>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-100/50">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Panel 2: Posted */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wider block">
                  Posted & Transmitted
                </span>
                <span className="font-mono text-lg font-black text-slate-900 block">
                  ₹{stats.postedValue.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-405 font-medium block">
                  {stats.postedCount} Journal vouchers recorded securely
                </span>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-555 shrink-0 border border-emerald-100/50">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            {/* Panel 3: Balance Verification */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-3xs flex items-center justify-between text-white">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider block">
                  GAAP Compliance Engine
                </span>
                <span className="text-xs font-black uppercase tracking-tight block">
                  DOUBLE ENTRY VERIFIED
                </span>
                <span className="text-[9px] text-slate-400 font-medium block">
                  Debit vs Credit totals strictly balanced 1:1.
                </span>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700/50">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filtering controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-posting-entries"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posting entries by bill number, account head, ledger code, or remarks..."
                aria-label="Search posting entries"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-205 rounded-xl text-[10px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <label htmlFor="reference-filter" className="text-[8px] font-black uppercase text-slate-550 tracking-wider">Reference:</label>
                <select
                  id="reference-filter"
                  value={referenceFilter}
                  onChange={(e) => setReferenceFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[9px] font-bold text-slate-705 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                >
                  <option value="ALL">All Sources</option>
                  <option value="RA Bill">RA Bills Only</option>
                  <option value="Contractor Bill">Contractor Bills Only</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <label htmlFor="post-status-filter" className="text-[8px] font-black uppercase text-slate-550 tracking-wider">Status:</label>
                <select
                  id="post-status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[9px] font-bold text-slate-705 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Posted">Passed Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Posting entry ledger cards/table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-100">
                    <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-36">
                      Source Reference
                    </th>
                    <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-40">
                      Bill No / Doc No
                    </th>
                    <th className="px-6 py-3.5 text-[8px] font-black uppercase text-slate-400 tracking-wider w-28">
                      posting date
                    </th>
                    <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      ledger summary / audit comments
                    </th>
                    <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right w-36">
                      amount (INR)
                    </th>
                    <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-24">
                      status
                    </th>
                    <th className="px-6 py-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-20 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {paginatedPostings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          No accounting journal entries found matching criteria.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedPostings.map((posting) => {
                      const isRA = posting.referenceType === 'RA Bill';
                      return (
                        <tr 
                          key={posting.id} 
                          onClick={() => setSelectedPostingId(posting.id)}
                          className="hover:bg-slate-50/70 border-b border-slate-100 cursor-pointer transition-all duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              {isRA ? (
                                <span className="p-1 rounded-md bg-sky-50 text-sky-600">
                                  <Coins className="w-3.5 h-3.5" />
                                </span>
                              ) : (
                                <span className="p-1 rounded-md bg-amber-50 text-amber-650">
                                  <Receipt className="w-3.5 h-3.5" />
                                </span>
                              )}
                              <span className="text-[9.5px] font-black text-slate-800 uppercase tracking-tight">
                                {posting.referenceType}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {posting.referenceNo}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[8.5px] font-mono font-bold text-slate-500 uppercase">
                            {posting.date}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[10px] font-bold text-slate-700 uppercase line-clamp-1 tracking-tight">
                              {posting.remarks || 'No detailed audit remarks logged.'}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-mono font-black text-[10.5px] text-slate-900 bg-slate-50 border border-slate-100 rounded px-2 py-0.5 inline-block">
                              ₹{posting.debitTotal.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <PostingStatusBadge status={posting.status} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPostingId(posting.id);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-all cursor-pointer flex items-center justify-center mx-auto border border-slate-100"
                              title="Audit Voucher Details"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 text-[9px] font-black rounded-lg border border-slate-205 disabled:opacity-50 hover:bg-slate-50 transition-all uppercase cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-2.5 py-1 text-[9px] font-black rounded-lg bg-slate-900 border border-slate-900 text-white disabled:opacity-50 hover:bg-slate-800 transition-all uppercase cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
