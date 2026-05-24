import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { useExecutionType } from '../hooks/useExecutionType';
import ExecutionTypeForm from '../components/ExecutionTypeForm';

export default function ExecutionTypePage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    activities,
    selectedActivityId,
    setSelectedActivityId,
    selectedActivity,
    
    // Config states
    type,
    setType,
    contractorName,
    setContractorName,
    contractStartDate,
    setContractStartDate,
    contractEndDate,
    setContractEndDate,
    
    // Internal states
    internalLead,
    setInternalLead,
    crewCount,
    setCrewCount,
    
    saveStatus,
    handleSave
  } = useExecutionType();

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
      
      {/* HEADER BAR & PROJECT CONTEXT SWITCHER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-650 border border-indigo-120 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Execution Strategy Matrix</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">Determine internal workforce alignment or outsourcing paths for planned nodes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden sm:block shrink-0">Project Workspace:</label>
          <select 
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="w-full sm:w-auto min-w-0 max-w-full sm:max-w-[280px] md:max-w-[360px] bg-white hover:bg-slate-50 text-slate-800 border border-slate-250 rounded-xl py-2 px-3 text-xs font-black outline-none shadow-1xs cursor-pointer transition-all truncate"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>[{p.code}] {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* METRIC ROW */}
      {selectedProject && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50/40 p-4 rounded-xl border border-slate-100/50">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Selected Project</p>
            <p className="text-xs font-black text-slate-850 uppercase truncate">{selectedProject.name}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Client Name</p>
            <p className="text-xs font-bold text-slate-600 uppercase truncate">{selectedProject.client}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Identifier</p>
            <div>
              <span className="font-mono font-black text-[10px] px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                {selectedProject.code}
              </span>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-sans">Active Ranges</p>
            <p className="text-xs font-bold text-slate-500 font-mono">
              {selectedProject.startDate} to {selectedProject.endDate}
            </p>
          </div>
        </div>
      )}

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Proposed list */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 border-b border-slate-50/80 pb-3">
            <Layers className="w-4 h-4 text-indigo-500" />
            Proposed Activities
          </h2>

          <div className="space-y-2 max-h-[460px] overflow-y-auto scrollbar-none">
            {activities.length > 0 ? (
              activities.map(act => {
                const isSelected = act.id === selectedActivityId;
                return (
                  <div
                    key={act.id}
                    onClick={() => setSelectedActivityId(act.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/85 text-indigo-950 border-indigo-250 shadow-sm shadow-indigo-100/40'
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-black uppercase text-left">{act.activityName}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/5">
                      <p className={`text-[9px] font-mono uppercase ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                        Target: {act.plannedQty.toLocaleString()} {act.unit}
                      </p>
                      <p className={`text-[9px] font-mono ${isSelected ? 'text-indigo-650' : 'text-slate-400'}`}>
                        {act.startDate} to {act.endDate}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center bg-slate-50/20 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-350" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">No nodes registered</h3>
                <p className="text-[9px] text-slate-400 font-bold max-w-[200px] leading-relaxed mx-auto uppercase">
                  Please configure matching planning sheet nodes before assigning delivery teams.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Execution Strategy details form */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm p-6 min-h-[480px] flex flex-col justify-between">
          {selectedActivity ? (
            <div className="space-y-6 flex-grow animate-in fade-in duration-200">
              <ExecutionTypeForm
                activityName={selectedActivity.activityName}
                type={type}
                onTypeChange={setType}
                
                // Self properties
                internalLead={internalLead}
                onLeadChange={setInternalLead}
                crewCount={crewCount}
                onCrewChange={setCrewCount}
                
                // Contractor properties
                contractorName={contractorName}
                onContractorChange={setContractorName}
                contractStartDate={contractStartDate}
                onStartDateChange={setContractStartDate}
                contractEndDate={contractEndDate}
                onEndDateChange={setContractEndDate}
                
                onSubmit={handleSave}
                saveStatus={saveStatus}
              />
            </div>
          ) : (
            <div className="m-auto text-center py-20 bg-slate-50/50 w-full rounded-2xl border border-dashed border-slate-150 p-6 max-w-sm">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-pulse" />
              <h3 className="text-xs font-black uppercase text-slate-800 mt-4 tracking-tight">Strategy Blueprint</h3>
              <p className="text-[10px] text-slate-450 font-bold mt-1 uppercase leading-relaxed max-w-xs mx-auto">
                Select an active proposed activity on the left-hand column to define its execution team metrics or outsourcing parameters.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
