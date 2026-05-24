import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit,
  Layers, 
  ChevronRight, 
  AlertCircle,
  Inbox,
  Sparkles
} from 'lucide-react';
import { usePlanning } from '../hooks/usePlanning';
import PlanningHeader from '../components/PlanningHeader';
import PlanningTabs from '../components/PlanningTabs';
import MaterialPlanTab from '../components/MaterialPlanTab';
import LabourPlanTab from '../components/LabourPlanTab';
import MachinePlanTab from '../components/MachinePlanTab';
import PlanningFormPage from './PlanningFormPage';
import { ActivityPlan } from '../types';

export default function PlanningPage() {
  const {
    projects,
    selectedProjectId,
    currentProject,
    activities,
    activePlanId,
    activeTab,
    currentPlan,
    setSelectedProjectId,
    setActivePlanId,
    setActiveTab,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleAddResource,
    handleDeleteResource
  } = usePlanning();

  const [view, setView] = useState<'LIST' | 'ADD' | 'EDIT'>('LIST');
  const [editingActivity, setEditingActivity] = useState<ActivityPlan | null>(null);

  if (view === 'ADD') {
    return (
      <PlanningFormPage 
        onBack={() => setView('LIST')}
        onSubmit={(newAct) => {
          handleAddActivity(newAct);
          setView('LIST');
        }}
      />
    );
  }

  if (view === 'EDIT' && editingActivity) {
    return (
      <PlanningFormPage 
        onBack={() => {
          setView('LIST');
          setEditingActivity(null);
        }}
        initialData={editingActivity}
        onSubmit={(updatedFields) => {
          handleUpdateActivity({
            ...editingActivity,
            ...updatedFields
          });
          setView('LIST');
          setEditingActivity(null);
        }}
      />
    );
  }

  // Calculate resources item count for tabs counter
  const materialsCount = currentPlan?.materials?.length || 0;
  const laboursCount = currentPlan?.labours?.length || 0;
  const machineriesCount = currentPlan?.machineries?.length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <PlanningHeader 
        project={currentProject} 
        activityPlan={currentPlan}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
      />

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COMPACT SLATE INDEX */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50/50 pb-3">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              Activity Slate
            </h2>
            <button 
              type="button"
              onClick={() => setView('ADD')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 border border-amber-600/10 text-[9px] font-black uppercase tracking-wider px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
            >
              <Plus className="w-3.5 h-3.5" /> Log Activity
            </button>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-none">
            {activities.length > 0 ? (
              activities.map(act => {
                const isActive = act.id === activePlanId;
                return (
                  <div 
                    key={act.id}
                    onClick={() => setActivePlanId(act.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center justify-between group ${
                      isActive 
                        ? 'bg-indigo-50/85 text-indigo-950 border-indigo-250 shadow-sm shadow-indigo-100/40' 
                        : 'bg-slate-50 hover:bg-slate-100/50 text-slate-700 border-slate-100/40'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <h4 className="text-xs font-black uppercase tracking-tight truncate max-w-[180px]">
                        {act.activityName}
                      </h4>
                      <p className={`text-[9px] font-bold ${isActive ? 'text-indigo-600' : 'text-slate-400'} font-mono`}>
                        {act.startDate} / {act.endDate}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingActivity(act);
                          setView('EDIT');
                        }}
                        className={`p-1 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100 ${
                          isActive ? 'text-indigo-400 hover:text-amber-600 hover:bg-indigo-100/40' : 'text-slate-350 hover:text-amber-600'
                        }`}
                        title="Edit Activity"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteActivity(act.id);
                        }}
                        className={`p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100 ${
                          isActive ? 'text-indigo-400 hover:text-rose-600 hover:bg-indigo-100/40' : 'text-slate-350 hover:text-rose-600'
                        }`}
                        title="Delete Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? 'text-indigo-600' : 'text-slate-350'}`} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center bg-slate-50/40 border border-dashed border-slate-200/50 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-300" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">No activities registered</h3>
                <p className="text-[9px] text-slate-400 font-bold leading-relaxed max-w-[180px] mx-auto uppercase">
                  Please trigger "Log Activity" button to specify road or drain work targets.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT METRIC DETAILS FORM & RESOURCES CONFIGURATION */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm p-6 min-h-[540px] flex flex-col justify-between">
          {currentPlan ? (
            <div className="space-y-6 flex-grow animate-in fade-in duration-200">
              {/* RESOURCE PLANNING THREE TABS */}
              <div className="space-y-6">
                <PlanningTabs 
                  activeTab={activeTab}
                  onChangeTab={setActiveTab}
                  materialCount={materialsCount}
                  labourCount={laboursCount}
                  machineCount={machineriesCount}
                />

                {/* ACTIVE RESOURCE VIEW LIST (Material / Labour / Machine) */}
                <div className="pt-2">
                  {activeTab === 'material' && (
                    <MaterialPlanTab 
                      items={currentPlan.materials || []}
                      onAdd={(name, qty) => handleAddResource('material', name, qty)}
                      onDelete={(itemId) => handleDeleteResource('material', itemId)}
                    />
                  )}

                  {activeTab === 'labour' && (
                    <LabourPlanTab 
                      items={currentPlan.labours || []}
                      onAdd={(name, qty) => handleAddResource('labour', name, qty)}
                      onDelete={(itemId) => handleDeleteResource('labour', itemId)}
                    />
                  )}

                  {activeTab === 'machine' && (
                    <MachinePlanTab 
                      items={currentPlan.machineries || []}
                      onAdd={(name, qty) => handleAddResource('machine', name, qty)}
                      onDelete={(itemId) => handleDeleteResource('machine', itemId)}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center py-20 bg-slate-50/50 w-full rounded-2xl border border-dashed border-slate-150 p-6 max-w-md">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-pulse" />
              <h3 className="text-xs font-black uppercase text-slate-800 mt-4 tracking-tight">Active Work Scope Modeling</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase max-w-xs mx-auto leading-relaxed">
                Click on any activity element on the left list, or append a fresh one to layout base material catalogs, team sizes and machinery metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
