import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  AlertCircle, 
  ChevronRight, 
  Trash2, 
  Calendar, 
  UsersRound, 
  HardHat, 
  Package, 
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  FolderOpen,
  CheckSquare
} from 'lucide-react';
import { useDPR } from '../hooks/useDPR';
import { useAuth } from '@/src/context/AuthContext';
import { UserRole } from '@/src/types';
import DPREntryPage from './DPREntryPage';
import { DPR } from '../types';

export default function DPRListPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN;

  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    dprs,
    activities,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDPRs,

    // Draft State manager
    activeTab,
    setActiveTab,
    date,
    setDate,
    workProgress,
    setWorkProgress,
    labours,
    setLabours,
    materials,
    setMaterials,
    machines,
    setMachines,
    remarks,
    setRemarks,

    prepareNewDPRDraft,
    loadDPRDraft,
    handleSaveDraft,
    handleDeleteDPR,
    reload
  } = useDPR();

  // Dialog & View State
  const [activeDPRId, setActiveDPRId] = useState<string | null>(null); // 'new' or dpr.id or null
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Current selected project
  const currentProject = projects.find(p => p.id === selectedProjectId);

  // Stats calculation
  const totalLogs = dprs.length;
  const submittedLogs = dprs.filter(d => d.status === 'Submitted').length;
  
  // Total workers logged on modern entries
  const activeWorkersLoggedInList = dprs.reduce((sum, d) => {
    const dSum = (d.labours || []).reduce((s, l) => s + l.count, 0);
    return sum + dSum;
  }, 0);

  // Total machines active count
  const activeMachinesInList = dprs.reduce((sum, d) => {
    return sum + (d.machines || []).length;
  }, 0);

  // Triggering the DPR Creation
  const handleStartNewDPR = () => {
    // Check if a DPR already exists for this project and date
    const alreadyExists = dprs.some(d => d.date === targetDate);
    if (alreadyExists) {
      if (!window.confirm(`A Daily Progress Report already exists for ${targetDate}. Do you want to compile another one?`)) {
        return;
      }
    }
    prepareNewDPRDraft(targetDate);
    setActiveDPRId('new');
    setShowDatePicker(false);
  };

  const handleEditDPR = (dpr: DPR) => {
    loadDPRDraft(dpr);
    setActiveDPRId(dpr.id);
  };

  const handleSaveResult = (status: 'Pending' | 'Submitted') => {
    handleSaveDraft(status, activeDPRId === 'new' ? undefined : activeDPRId || undefined);
    setActiveDPRId(null);
  };

  // If we are currently entering/editing a DPR, render that subview directly
  if (activeDPRId) {
    const editingDPR = activeDPRId === 'new' ? undefined : dprs.find(d => d.id === activeDPRId);
    return (
      <DPREntryPage
        project={currentProject}
        date={date}
        initialStatus={editingDPR?.status || 'Pending'}
        initialWorkProgress={workProgress}
        initialLabours={labours}
        initialMaterials={materials}
        initialMachines={machines}
        initialRemarks={remarks}
        onBack={() => setActiveDPRId(null)}
        onSave={handleSaveResult}

        // Binders
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        workProgress={workProgress}
        setWorkProgress={setWorkProgress}
        labours={labours}
        setLabours={setLabours}
        materials={materials}
        setMaterials={setMaterials}
        machines={machines}
        setMachines={setMachines}
        remarks={remarks}
        setRemarks={setRemarks}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
      
      {/* 1. HEADER CONTROL */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">Daily Progress Reports (DPR)</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">
              Field Construction LogBook, Labour registries & material dockets
            </p>
          </div>
        </div>

        {/* Create button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project dropdown selection */}
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-slate-50 border border-slate-150 rounded-xl py-2 px-3.5 pr-8 text-[10px] font-black uppercase tracking-wider text-slate-805 outline-none transition-all cursor-pointer select-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            disabled={!selectedProjectId}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Fill Daily DPR
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEWS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-650 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Aggregated Logs</p>
            <p className="text-base font-black text-slate-900 mt-1">{totalLogs} Entries</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-650 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Submitted & Sealed</p>
            <p className="text-base font-black text-slate-900 mt-1">{submittedLogs} Saved</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-650 rounded-xl flex items-center justify-center">
            <UsersRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Roster Manpower</p>
            <p className="text-base font-black text-slate-900 mt-1">{activeWorkersLoggedInList} Personnel</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-650 rounded-xl flex items-center justify-center">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Active Equipments</p>
            <p className="text-base font-black text-slate-900 mt-1">{activeMachinesInList} Registered</p>
          </div>
        </div>

      </div>

      {/* 3. DATE PICKER DIALOG OR INPUT FLYOUT */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase">Start New Progress Report</h3>
              <button 
                onClick={() => setShowDatePicker(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Select Report Calendar Date
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl p-3 text-xs font-bold outline-none text-slate-800 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartNewDPR}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
              >
                Confirm & Start Daily Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FILTER CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reports by date, supervisor remarks..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:bg-slate-100 outline-none transition-all"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 p-1 rounded-xl">
          {['ALL', 'Submitted', 'Pending'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status 
                  ? 'bg-slate-900 text-white font-black italic' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 5. LIST OF PREVIOUS DPR RECORDS */}
      <div className="space-y-4">
        {filteredDPRs.length > 0 ? (
          filteredDPRs.map((dpr) => {
            const workersCount = (dpr.labours || []).reduce((acc, l) => acc + l.count, 0);
            const machCount = (dpr.machines || []).length;
            const matCount = (dpr.materials || []).length;
            const progressCount = (dpr.workProgress || []).filter(item => item.completedQty > 0).length;

            return (
              <div 
                key={dpr.id}
                className="bg-white p-5 rounded-2xl border border-slate-105 shadow-3xs flex flex-col sm:flex-row self-stretch items-stretch sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3 flex-grow text-left">
                  
                  {/* Status, Date */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-slate-800">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {dpr.date}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      dpr.status === 'Submitted'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100/50'
                        : 'bg-amber-50 text-amber-800 border border-amber-100/50'
                    }`}>
                      {dpr.status}
                    </span>
                  </div>

                  {/* Summary Indicators */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-650 rounded-lg text-[10px] font-black uppercase border border-slate-100">
                      <UsersRound className="w-3.5 h-3.5 text-slate-400" />
                      {workersCount} Workers
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-650 rounded-lg text-[10px] font-black uppercase border border-slate-100">
                      <HardHat className="w-3.5 h-3.5 text-slate-400" />
                      {machCount} Machines
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-650 rounded-lg text-[10px] font-black uppercase border border-slate-100">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      {matCount} Materials
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-650 rounded-lg text-[10px] font-black uppercase border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {progressCount} Activities Processed
                    </span>
                  </div>

                  {/* Remarks preview */}
                  <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed truncate max-w-xl">
                    "{dpr.remarks || 'No remarks recorded.'}"
                  </p>

                </div>

                {/* Operations links */}
                <div className="flex items-center gap-2 self-center sm:self-auto shrink-0 justify-end">
                  <button
                    type="button"
                    onClick={() => handleEditDPR(dpr)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-in duration-100 cursor-pointer text-slate-600"
                  >
                    {dpr.status === 'Submitted' ? 'Inspect Logs' : 'Modify Draft'}{' '}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {(!dpr.status || dpr.status === 'Pending' || isAdmin) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this Daily Progress Report? This is irreversible.')) {
                          handleDeleteDPR(dpr.id);
                        }
                      }}
                      className="p-2 sm:p-2.5 border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 rounded-xl transition-all cursor-pointer shrink-0"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-slate-50/50 border border-dashed border-slate-200 py-12 rounded-2xl flex flex-col justify-center text-center items-center gap-2">
            <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">No matching Daily Progress Reports.</span>
            <p className="text-[9px] text-slate-400 normal-case font-bold max-w-sm leading-normal">
              Ensure you have selected a project that has active activities configured in the WBS execution planner. Then click [Fill Daily DPR] above to begin.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
