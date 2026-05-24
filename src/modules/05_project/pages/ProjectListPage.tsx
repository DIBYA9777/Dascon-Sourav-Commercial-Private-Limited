import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Archive 
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import ProjectTable from '../components/ProjectTable';
import ProjectCard from '../components/ProjectCard';
import ProjectFilterBar from '../components/ProjectFilterBar';
import ProjectDetailPage from './ProjectDetailPage';
import ProjectFormPage from './ProjectFormPage';
import { Project } from '../types';

export default function ProjectListPage() {
  const {
    filteredProjects,
    paginatedProjects,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    siteFilter,
    setSiteFilter,
    clientFilter,
    setClientFilter,
    currentPage,
    setCurrentPage,
    sortField,
    sortDirection,
    handleSort,
    totalPages,
    toggleDeactivate,
    loadData,
    stats,
    clients
  } = useProjects();

  // Navigation states
  const [view, setView] = useState<'LIST' | 'FORM' | 'DETAIL'>('LIST');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleOpenAdd = () => {
    setSelectedProject(null);
    setView('FORM');
  };

  const handleOpenEdit = (proj: Project) => {
    setSelectedProject(proj);
    setView('FORM');
  };

  const handleOpenDetail = (proj: Project) => {
    setSelectedProject(proj);
    setView('DETAIL');
  };

  const handleFormSuccess = () => {
    setView('LIST');
    loadData();
  };

  if (view === 'FORM') {
    return (
      <ProjectFormPage 
        project={selectedProject} 
        onCancel={() => setView('LIST')} 
        onSuccess={handleFormSuccess} 
      />
    );
  }

  if (view === 'DETAIL' && selectedProject) {
    return (
      <ProjectDetailPage 
        project={selectedProject} 
        onBack={() => setView('LIST')} 
        onEdit={() => setView('FORM')} 
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
      {/* PAGE INTRO HEADER */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">Project Master</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">
              Enterprise Project Directory and Core Master Database
            </p>
          </div>
        </div>
      </div>

      {/* STATS DECK */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none">Total Projects</p>
            <p className="text-xl font-black text-slate-900 leading-none mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none">Active</p>
            <p className="text-xl font-black text-slate-900 leading-none mt-1">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none">Planning</p>
            <p className="text-xl font-black text-slate-900 leading-none mt-1">{stats.planning}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none">Archived</p>
            <p className="text-xl font-black text-slate-900 leading-none mt-1">{stats.archived}</p>
          </div>
        </div>
      </div>

      {/* FILTER BAR ROW with inline Add button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex-grow">
          <ProjectFilterBar 
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            siteFilter={siteFilter}
            setSiteFilter={setSiteFilter}
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            clients={clients}
          />
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 px-4 text-xs font-black tracking-tight uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shrink-0 h-[46px] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* DISCOVERY LIST */}
      <div className="bg-slate-50/20 rounded-2xl">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
          <ProjectTable 
            projects={paginatedProjects}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={handleOpenDetail}
            onEdit={handleOpenEdit}
            onToggleDeactivate={toggleDeactivate}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* MOBILE CARDS */}
        <div className="block md:hidden bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {paginatedProjects.length > 0 ? (
            paginatedProjects.map((proj) => (
              <ProjectCard 
                key={proj.id}
                project={proj}
                onView={() => handleOpenDetail(proj)}
                onEdit={() => handleOpenEdit(proj)}
                onToggleDeactivate={() => toggleDeactivate(proj)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-bold leading-relaxed">
              No matching projects registered. Please add a new project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
