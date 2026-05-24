import React from 'react';
import { Search } from 'lucide-react';
import { KNOWN_SITES } from '../services/projectService';

interface ProjectFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  siteFilter: string;
  setSiteFilter: (val: string) => void;
  clientFilter: string;
  setClientFilter: (val: string) => void;
  clients: string[];
}

export default function ProjectFilterBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  siteFilter,
  setSiteFilter,
  clientFilter,
  setClientFilter,
  clients
}: ProjectFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-grow">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, client, code..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:bg-slate-100 outline-none transition-all text-slate-800"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-slate-800 cursor-pointer appearance-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-slate-400 pointer-events-none">▼</span>
        </div>

        {/* Client Filter */}
        <div className="relative">
          <select 
            value={clientFilter}
            onChange={e => setClientFilter(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-slate-800 cursor-pointer appearance-none"
          >
            <option value="ALL">All Clients</option>
            {clients.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-slate-400 pointer-events-none">▼</span>
        </div>

        {/* Site Filter */}
        <div className="relative">
          <select 
            value={siteFilter}
            onChange={e => setSiteFilter(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-slate-800 cursor-pointer appearance-none"
          >
            <option value="ALL">All Sites</option>
            {KNOWN_SITES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-slate-400 pointer-events-none">▼</span>
        </div>
      </div>
    </div>
  );
}
