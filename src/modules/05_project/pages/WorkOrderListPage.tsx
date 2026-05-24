import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Trash2, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  X, 
  Eye, 
  ChevronDown,
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle,
  XCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { projectService, KNOWN_SITES } from '../services/projectService';
import { KNOWN_CONTRACTORS } from './ExecutionTypePage';
import { Project, WorkOrder, ActivityPlan } from '../types';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { UserRole } from '@/src/types.ts';

export default function WorkOrderListPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN;

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [activities, setActivities] = useState<ActivityPlan[]>([]);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Popup Forms State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailWO, setDetailWO] = useState<WorkOrder | null>(null);

  // Form Fields
  const [contractorName, setContractorName] = useState(KNOWN_CONTRACTORS[0]);
  const [activityName, setActivityName] = useState('');
  const [amount, setAmount] = useState<number>(500000);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scope, setScope] = useState('');
  const [errorStatus, setErrorStatus] = useState('');

  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadWorkOrders();
      loadActivities();
    }
  }, [selectedProjectId]);

  const loadWorkOrders = () => {
    const all = projectService.getWorkOrders().filter(w => w.projectId === selectedProjectId);
    setWorkOrders(all);
  };

  const loadActivities = () => {
    const acts = projectService.getActivities().filter(a => a.projectId === selectedProjectId);
    setActivities(acts);
    if (acts.length > 0) {
      setActivityName(acts[0].activityName);
    } else {
      setActivityName('');
    }
  };

  const handleCreateWOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorName || !activityName || !startDate || !endDate || amount <= 0) {
      setErrorStatus('Please complete all required fields with valid parameters.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorStatus('WO Commencement date cannot be after deadline schedule.');
      return;
    }

    projectService.addWorkOrder({
      projectId: selectedProjectId,
      contractorName,
      activityName,
      amount,
      startDate,
      endDate,
      scope: scope.trim() || 'General excavation and resource deployment as mapped in WBS baseline.'
    });

    setIsFormOpen(false);
    loadWorkOrders();

    // Reset Form
    setContractorName(KNOWN_CONTRACTORS[0]);
    if (activities.length > 0) setActivityName(activities[0].activityName);
    setAmount(500000);
    setStartDate('');
    setEndDate('');
    setScope('');
    setErrorStatus('');
  };

  const handleApproveStatus = (id: string, nextStatus: 'Approved' | 'Rejected') => {
    if (!isAdmin) {
      alert("STRATEGIC CONTROL: Permission denied. Approval acts are reserved for SuperAdmin authority!");
      return;
    }
    projectService.approveWorkOrder(id, nextStatus);
    loadWorkOrders();
    if (detailWO && detailWO.id === id) {
      setDetailWO(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleDeleteWO = (id: string) => {
    const filtered = projectService.getWorkOrders().filter(w => w.id !== id);
    projectService.saveWorkOrders(filtered);
    loadWorkOrders();
  };

  // Filter listings
  const filtered = workOrders.filter(w => {
    const matchesSearch = w.contractorName.toLowerCase().includes(search.toLowerCase()) || 
                          w.activityName.toLowerCase().includes(search.toLowerCase()) || 
                          w.woNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER ROW WITH PROJECT CHOICE */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase">Work Order (WO) System</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Authorize contractor budgets and project labor scopes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden sm:block">Select Project:</label>
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

      {/* FILTER AND ACTION BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by WO No, Contractor, Activity..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:bg-slate-100 outline-none transition-all"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button 
          onClick={() => {
            setErrorStatus('');
            setIsFormOpen(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-4 text-xs font-black tracking-tight uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-slate-150"
        >
          <Plus className="w-4 h-4" />
          Create Work Order
        </button>
      </div>

      {/* LIST DATA SHEETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map(wo => (
            <div 
              key={wo.id}
              className="bg-white rounded-3xl border border-slate-155 p-5 shadow-xs relative flex flex-col justify-between gap-4 hover:shadow-md transition-all border-l-4 overflow-hidden"
              style={{
                borderLeftColor: wo.status === 'Approved' ? '#10b981' : wo.status === 'Rejected' ? '#ef4444' : '#f59e0b'
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    {wo.woNo}
                  </span>
                  <span className={`inline-flex items-center text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    wo.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                    wo.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {wo.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-slate-800 text-xs truncate uppercase leading-tight">{wo.contractorName}</h3>
                  <p className="text-[10px] font-extrabold text-blue-600 uppercase mt-1">Activity: {wo.activityName}</p>
                </div>

                <div className="text-[10px] text-slate-400 font-bold space-y-1 bg-slate-50 p-2.5 rounded-xl">
                  <div className="flex justify-between">
                    <span>Valuation:</span>
                    <span className="font-black text-slate-900 text-xs">₹{wo.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Schedule:</span>
                    <span>{wo.startDate} ~ {wo.endDate}</span>
                  </div>
                </div>
              </div>

              {/* ACTION MATRIX */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <button 
                  onClick={() => {
                    setDetailWO(wo);
                    setIsDetailOpen(true);
                  }}
                  className="text-[10px] text-slate-500 hover:text-slate-900 font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Inspect WO
                </button>

                <div className="flex items-center gap-1">
                  {wo.status === 'Pending' ? (
                    isAdmin ? (
                      <>
                        <button 
                          onClick={() => handleApproveStatus(wo.id, 'Approved')}
                          className="px-2 py-1 bg-emerald-55 border bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase rounded hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleApproveStatus(wo.id, 'Rejected')}
                          className="px-2 py-1 bg-rose-50 text-rose-700 text-[8px] font-black uppercase rounded hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Awaiting Authority
                      </span>
                    )
                  ) : (
                    <button 
                      onClick={() => handleDeleteWO(wo.id)}
                      className="p-1 hover:bg-rose-50 rounded text-slate-300 hover:text-rose-500 transition-colors"
                      title="Remove work order record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 bg-white border border-dashed border-slate-200 rounded-[2rem] text-center max-w-lg mx-auto w-full px-6">
            <AlertCircle className="w-8 h-8 text-slate-350 mx-auto" />
            <h3 className="text-xs font-black uppercase text-slate-800 mt-4">No Work Orders Generated</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Outsourcing budgets have not been registered for this project yet. Use "Create Work Order" to start.
            </p>
          </div>
        )}
      </div>

      {/* POPUP / CREATE DRAFT WORK ORDER */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border-4 border-white p-6 relative">
            <button onClick={() => setIsFormOpen(false)} className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-blue-500" /> Draft Authoritative Contract
            </h3>

            {errorStatus && (
              <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-[10px] font-black text-rose-600 uppercase">
                {errorStatus}
              </div>
            )}

            <form onSubmit={handleCreateWOSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Subcontractor *</label>
                <select 
                  value={contractorName}
                  onChange={e => setContractorName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-850"
                >
                  {KNOWN_CONTRACTORS.map(con => (
                    <option key={con} value={con}>{con}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Activity Node *</label>
                {activities.length > 0 ? (
                  <select 
                    value={activityName}
                    onChange={e => setActivityName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-850"
                  >
                    {activities.map(act => (
                      <option key={act.id} value={act.activityName}>{act.activityName}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Earth excavation and backfill"
                    value={activityName}
                    onChange={e => setActivityName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none text-slate-850"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Commissions Value (₹) *</label>
                  <input 
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Scheduled Timeline *</label>
                  <div className="flex gap-1">
                    <input 
                      type="date"
                      required
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl p-1 text-2xs font-bold outline-none font-mono"
                    />
                    <input 
                      type="date"
                      required
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl p-1 text-2xs font-bold outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Technical Scope of work</label>
                <textarea 
                  rows={2}
                  placeholder="Summarize key labor milestones, soil standards, check lists or machinery demands..."
                  value={scope}
                  onChange={e => setScope(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-slate-950 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest">
                Save Work Order Draft
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED INSPECTION MODAL */}
      {isDetailOpen && detailWO && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border-4 border-white p-6 relative">
            <button onClick={() => setIsDetailOpen(false)} className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between mb-4 border-b border-slate-55 pb-3">
              <div className="space-y-0.5">
                <p className="font-mono font-black text-xs px-2.5 py-1 bg-slate-100 rounded text-slate-700 w-fit">
                  {detailWO.woNo}
                </p>
                <h3 className="text-xs font-black uppercase text-slate-950 mt-1">{detailWO.contractorName}</h3>
              </div>
              <span className={`inline-flex items-center text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                detailWO.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                detailWO.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {detailWO.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Linked Active Site Task</p>
                <p className="text-xs font-extrabold text-blue-700 uppercase mt-0.5">{detailWO.activityName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Commissions Value (INR)</p>
                  <p className="text-sm font-black text-emerald-600 mt-0.5">₹{detailWO.amount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scheduled Duration</p>
                  <p className="text-2xs font-extrabold text-slate-700 mt-0.5 font-mono">{detailWO.startDate} ~ {detailWO.endDate}</p>
                </div>
              </div>

              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Assigned Contract Scope</p>
                <p className="text-xs text-slate-500 font-bold bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed italic mt-1">
                  "{detailWO.scope}"
                </p>
              </div>

              {/* ADMINISTRATIVE ACTIONS PANEL */}
              {detailWO.status === 'Pending' && (
                <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 space-y-3">
                  <div className="flex gap-2 text-[9px] text-amber-800 font-black uppercase leading-tight">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500 animate-bounce" />
                    <span>Awaiting Authority approvals. Administrative actions are documented for compliance.</span>
                  </div>

                  {isAdmin ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproveStatus(detailWO.id, 'Approved')}
                        className="flex-1 py-2 text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all"
                      >
                        Authorize
                      </button>
                      <button 
                        onClick={() => handleApproveStatus(detailWO.id, 'Rejected')}
                        className="flex-1 py-2 text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 justify-center py-1.5 text-[8px] text-slate-400 font-black uppercase tracking-wider">
                      <Lock className="w-3.5 h-3.5" /> Insufficient Strategic clearance
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
