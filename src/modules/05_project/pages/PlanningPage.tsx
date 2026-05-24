import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Calendar, 
  Users, 
  HardHat, 
  Cpu, 
  Boxes, 
  Clock, 
  CheckCircle2, 
  Layers,
  Sparkles,
  ChevronRight,
  X 
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { Project, ActivityPlan, ResourcePlanItem } from '../types';

export default function PlanningPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // Activities list
  const [activities, setActivities] = useState<ActivityPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  // Tab state: 'material' | 'labour' | 'machine'
  const [activeTab, setActiveTab] = useState<'material' | 'labour' | 'machine'>('material');

  // Popup form state
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);

  // New Activity Fields
  const [newName, setNewName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [plannedQty, setPlannedQty] = useState<number>(1000);
  const [qtyUnit, setQtyUnit] = useState('Mtr');
  const [workers, setWorkers] = useState<number>(15);
  const [equipment, setEquipment] = useState('');

  // New Resource Fields
  const [resName, setResName] = useState('');
  const [resQty, setResQty] = useState('');

  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setSelectedProjectId(list[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadActivities();
    }
  }, [selectedProjectId]);

  const loadActivities = () => {
    const list = projectService.getActivities().filter(a => a.projectId === selectedProjectId);
    setActivities(list);
    if (list.length > 0) {
      setActivePlanId(list[0].id);
    } else {
      setActivePlanId(null);
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !startDate || !endDate) return;

    const added = projectService.addActivity({
      projectId: selectedProjectId,
      activityName: newName.trim(),
      startDate,
      endDate,
      plannedQty: Number(plannedQty),
      unit: qtyUnit,
      workers: Number(workers),
      equipment,
      materials: [
        { id: `r-${Date.now()}-1`, name: 'Sand (River Sand)', qty: '20 tons' }
      ],
      labours: [
        { id: `l-${Date.now()}-1`, name: 'Skilled Mason', qty: '4 roles' }
      ],
      machineries: [
        { id: `m-${Date.now()}-1`, name: 'Concrete Mixer 10/7', qty: '1 unit' }
      ]
    });

    setIsActivityFormOpen(false);
    loadActivities();
    setActivePlanId(added.id);

    // Reset fields
    setNewName('');
    setStartDate('');
    setEndDate('');
    setPlannedQty(1000);
    setQtyUnit('Mtr');
    setWorkers(15);
    setEquipment('');
  };

  const handleAddResourceItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlanId || !resName.trim() || !resQty.trim()) return;

    const allActivities = projectService.getActivities();
    const idx = allActivities.findIndex(a => a.id === activePlanId);
    if (idx !== -1) {
      const act = allActivities[idx];
      const newItem: ResourcePlanItem = {
        id: `res-${Date.now()}`,
        name: resName.trim(),
        qty: resQty.trim()
      };

      if (activeTab === 'material') {
        act.materials = [...act.materials, newItem];
      } else if (activeTab === 'labour') {
        act.labours = [...act.labours, newItem];
      } else {
        act.machineries = [...act.machineries, newItem];
      }

      projectService.saveActivities(allActivities);
      loadActivities();
    }

    setIsResourceFormOpen(false);
    setResName('');
    setResQty('');
  };

  const handleDeleteResourceItem = (itemId: string) => {
    const allActivities = projectService.getActivities();
    const idx = allActivities.findIndex(a => a.id === activePlanId);
    if (idx !== -1) {
      const act = allActivities[idx];

      if (activeTab === 'material') {
        act.materials = act.materials.filter(i => i.id !== itemId);
      } else if (activeTab === 'labour') {
        act.labours = act.labours.filter(i => i.id !== itemId);
      } else {
        act.machineries = act.machineries.filter(i => i.id !== itemId);
      }

      projectService.saveActivities(allActivities);
      loadActivities();
    }
  };

  const currentPlan = activities.find(a => a.id === activePlanId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER ROW WITH PROJECT CHOICE */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase">Activity Planning Center</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Plan material lists, labor limits, and machinery durations</p>
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

      {/* TWO COLUMNS SCREEN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVITY INDEX */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              Activity Slate
            </h2>
            <button 
              onClick={() => setIsActivityFormOpen(true)}
              className="bg-slate-900 hover:bg-slate-850 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Activity
            </button>
          </div>

          <div className="space-y-2 max-h-[450px] overflow-y-auto scrollbar-none">
            {activities.length > 0 ? (
              activities.map(act => {
                const isActive = act.id === activePlanId;
                return (
                  <div 
                    key={act.id}
                    onClick={() => setActivePlanId(act.id)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between group ${
                      isActive 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-slate-50 hover:bg-slate-100/50 text-slate-700 border-slate-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-tight truncate max-w-[200px]">
                        {act.activityName}
                      </h4>
                      <p className={`text-[9px] font-bold ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                        {act.startDate} ~ {act.endDate}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? 'text-indigo-400' : 'text-slate-350'}`} />
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs italic font-bold">
                No custom plans created. Use "Add Activity" above.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE PLAN ANALYSIS CONTAINER */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-xs min-h-[500px] flex flex-col justify-between">
          {currentPlan ? (
            <div className="space-y-6 flex-grow">
              {/* PLAN KPI SUB-SUMMARY */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase">{currentPlan.activityName}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] text-slate-400 font-extrabold uppercase">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {currentPlan.startDate} to {currentPlan.endDate}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-black">Plan Qty: {currentPlan.plannedQty} {currentPlan.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl font-bold flex items-center gap-1.5 border border-slate-100">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{currentPlan.workers} workers onsite</span>
                  </div>
                </div>
              </div>

              {/* RESOURCE PLANNING THREE TABS */}
              <div className="space-y-4">
                <div className="flex border-b border-slate-100 gap-1 mt-2">
                  <button 
                    onClick={() => setActiveTab('material')}
                    className={`pb-2.5 px-4 text-2xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                      activeTab === 'material' 
                        ? 'border-slate-900 text-slate-900' 
                        : 'border-transparent text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    Material requirements
                  </button>
                  <button 
                    onClick={() => setActiveTab('labour')}
                    className={`pb-2.5 px-4 text-2xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                      activeTab === 'labour' 
                        ? 'border-slate-900 text-slate-900' 
                        : 'border-transparent text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5" />
                    Labour requirements
                  </button>
                  <button 
                    onClick={() => setActiveTab('machine')}
                    className={`pb-2.5 px-4 text-2xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                      activeTab === 'machine' 
                        ? 'border-slate-900 text-slate-900' 
                        : 'border-transparent text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Machinery requirements
                  </button>
                </div>

                {/* CURRENT ACTIVE PLAN SHEET */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                      Baseline list for this category
                    </p>
                    <button 
                      onClick={() => setIsResourceFormOpen(true)}
                      className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Append Node
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* List loop */}
                    {(activeTab === 'material' ? currentPlan.materials : 
                      activeTab === 'labour' ? currentPlan.labours : 
                      currentPlan.machineries).map(res => (
                      <div key={res.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800 uppercase">{res.name}</p>
                          <p className="text-[10px] font-extrabold text-indigo-650 text-indigo-505 font-mono">Needed: {res.qty}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteResourceItem(res.id)}
                          className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center py-20 bg-slate-50/50 w-full rounded-2xl border border-dashed border-slate-150 p-6">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-pulse" />
              <h3 className="text-xs font-black uppercase text-slate-800 mt-4">Draft New Plan Parameters</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">Please insert or select an Activity Node on the left panel to begin resource modeling.</p>
            </div>
          )}
        </div>
      </div>

      {/* POPUP / CREATE ACTIVITY FORM */}
      {isActivityFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border-4 border-white p-6 relative">
            <button onClick={() => setIsActivityFormOpen(false)} className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-blue-500" /> Plan New Activity Node
            </h3>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Activity Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Subgrade Compaction or Culvert box structure"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Start date *</label>
                  <input 
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan End date *</label>
                  <input 
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Planned Qty *</label>
                  <input 
                    type="number"
                    required
                    value={plannedQty}
                    onChange={e => setPlannedQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">UOM</label>
                  <select 
                    value={qtyUnit}
                    onChange={e => setQtyUnit(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  >
                    <option value="Mtr">Metres (Mtr)</option>
                    <option value="Sqm">Square Metres (Sqm)</option>
                    <option value="Cum">Cubic Metres (Cum)</option>
                    <option value="Nos">Numbers (Nos)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Required Workers</label>
                  <input 
                    type="number"
                    value={workers}
                    onChange={e => setWorkers(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Equipment</label>
                  <input 
                    type="text"
                    value={equipment}
                    placeholder="e.g. Excavator: 2, Mixer: 1"
                    onChange={e => setEquipment(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-950 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest">
                Save Activity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP / ADD RESOURCE ITEM FORM */}
      {isResourceFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl border-4 border-white p-6 relative">
            <button onClick={() => setIsResourceFormOpen(false)} className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-black uppercase text-slate-950 mb-4 tracking-wider flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-500" /> Insert {activeTab.toUpperCase()} Node
            </h3>
            <form onSubmit={handleAddResourceItem} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Name / Title</label>
                <input 
                  type="text"
                  required
                  placeholder={activeTab === 'material' ? 'e.g. Portland Cement' : activeTab === 'labour' ? 'e.g. Structural Mason' : 'e.g. Dump Truck, Bulldozer'}
                  value={resName}
                  onChange={e => setResName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity / Allocation</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 10 tons, 4 roles, 2 units"
                  value={resQty}
                  onChange={e => setResQty(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>

              <button type="submit" className="w-full bg-slate-950 text-white font-black text-2xs uppercase py-3.5 rounded-xl block tracking-widest">
                Save Node
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
