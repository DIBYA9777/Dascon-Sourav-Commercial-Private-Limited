import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Calendar, 
  Building2, 
  User, 
  Layout, 
  HelpCircle,
  Save,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { Project, ActivityPlan, ExecutionTypeConfig } from '../types';

export const KNOWN_CONTRACTORS = [
  'ABC Constructions',
  'BuildCorp Engineering Solutions',
  'Shiva Infra Projects Ltd',
  'Apex Bridge Works',
  'Vanguard Excavation Group'
];

export default function ExecutionTypePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  const [activities, setActivities] = useState<ActivityPlan[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState('');

  // Form configurations
  const [execType, setExecType] = useState<'Self' | 'Contractor'>('Self');
  const [contractorName, setContractorName] = useState(KNOWN_CONTRACTORS[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Internal team description (Self-execution)
  const [internalLead, setInternalLead] = useState('Senior Engineer Rajesh Kumar');
  const [crewCount, setCrewCount] = useState('14 Technicians & Labours');

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      const acts = projectService.getActivities().filter(a => a.projectId === selectedProjectId);
      setActivities(acts);
      if (acts.length > 0) {
        setSelectedActivityId(acts[0].id);
      } else {
        setSelectedActivityId('');
      }
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId && selectedActivityId) {
      // Load current execution configuration if exists
      const config = projectService.getExecutionConfigs().find(
        c => c.projectId === selectedProjectId && c.activityId === selectedActivityId
      );

      if (config) {
        setExecType(config.type);
        if (config.type === 'Contractor') {
          setContractorName(config.contractorName || KNOWN_CONTRACTORS[0]);
          setStartDate(config.contractStartDate || '');
          setEndDate(config.contractEndDate || '');
        }
      } else {
        // Fallbacks
        setExecType('Self');
        setContractorName(KNOWN_CONTRACTORS[0]);
        setStartDate('');
        setEndDate('');
      }
    }
  }, [selectedProjectId, selectedActivityId]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityId) return;

    projectService.setExecutionType({
      projectId: selectedProjectId,
      activityId: selectedActivityId,
      type: execType,
      contractorName: execType === 'Contractor' ? contractorName : undefined,
      contractStartDate: execType === 'Contractor' ? startDate : undefined,
      contractEndDate: execType === 'Contractor' ? endDate : undefined
    });

    setSaveStatus('Execution Strategy Mapped Successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const currentActivityObj = activities.find(a => a.id === selectedActivityId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER CARDS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase">Execution Type Selection</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Determine if tasks are executed by Internal Crew (Self) or Outsource Contractor teams</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden sm:block">Select Project Context:</label>
          <select 
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-4 text-xs font-black outline-none cursor-pointer"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SELECT OPERATIONS CONDUIT */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-xs">
          <h2 className="text-xs font-black text-slate-850 uppercase tracking-tight flex items-center gap-1.5 border-b border-sidebar-50 pb-2">
            <Layout className="w-4 h-4 text-blue-500" /> Choose Planning Activity
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Proposed Activities list</label>
              {activities.length > 0 ? (
                <div className="space-y-2">
                  {activities.map(act => (
                    <div 
                      key={act.id}
                      onClick={() => setSelectedActivityId(act.id)}
                      className={`p-3 rounded-xl cursor-pointer border transition-all ${
                        selectedActivityId === act.id 
                          ? 'bg-blue-50 border-blue-200 text-blue-900 font-extrabold' 
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <p className="text-xs font-black uppercase">{act.activityName}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Timeline: {act.startDate} to {act.endDate}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 font-semibold italic p-4 bg-slate-50 rounded-xl text-center">
                  No active planning nodes exist for this project. Please configure Planning sheets first.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* DETAILED FORM FOR STRATEGY DESIGN */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <h2 className="text-xs font-black text-slate-850 uppercase tracking-tight flex items-center gap-1.5 border-b border-slate-50 pb-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Execution Strategy Form
          </h2>

          {selectedActivityId ? (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              {saveStatus && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-black text-emerald-700 uppercase tracking-wide">
                  {saveStatus}
                </div>
              )}

              {/* RADIO BUTTON SELECTOR */}
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Execution Type Category</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    execType === 'Self' 
                      ? 'border-slate-900 bg-slate-900 text-white' 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 shrink-0 text-amber-500" />
                      <div>
                        <p className="text-xs font-black uppercase">Self-execute</p>
                        <p className="text-[9px] opacity-75">Execute via internal workforce</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="execType" 
                      value="Self" 
                      checked={execType === 'Self'}
                      onChange={() => setExecType('Self')}
                      className="accent-slate-900 h-4 w-4 shrink-0" 
                    />
                  </label>

                  <label className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    execType === 'Contractor' 
                      ? 'border-slate-900 bg-slate-900 text-white' 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 shrink-0 text-blue-500" />
                      <div>
                        <p className="text-xs font-black uppercase">Contractor Outsource</p>
                        <p className="text-[9px] opacity-75">Sub-contract to trusted vendors</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="execType" 
                      value="Contractor" 
                      checked={execType === 'Contractor'}
                      onChange={() => setExecType('Contractor')}
                      className="accent-slate-900 h-4 w-4 shrink-0" 
                    />
                  </label>
                </div>
              </div>

              {/* DYNAMIC FIELD CONDITIONAL VIEW */}
              {execType === 'Self' ? (
                <div className="space-y-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Supervisor / Lead</label>
                    <input 
                      type="text" 
                      value={internalLead}
                      onChange={e => setInternalLead(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Allocation Details</label>
                    <input 
                      type="text" 
                      value={crewCount}
                      onChange={e => setCrewCount(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Subcontractor Entity *</label>
                    <select 
                      value={contractorName}
                      onChange={e => setContractorName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-800"
                    >
                      {KNOWN_CONTRACTORS.map(con => (
                        <option key={con} value={con}>{con}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Proposed Start Date *</label>
                      <input 
                        type="date"
                        required
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Proposed End Date *</label>
                      <input 
                        type="date"
                        required
                        value={endDate}
                        onChange={e => setEndValueHandler(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full p-4 text-xs font-black uppercase text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Commit Execution Plan
              </button>
            </form>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs italic font-semibold leading-relaxed border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              Please choose a specific activity from the left-hand column to define its execution strategy.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function setEndValueHandler(val: string) {
    setEndDate(val);
  }
}
