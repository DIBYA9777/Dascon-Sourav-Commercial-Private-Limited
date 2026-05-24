import React, { useState } from 'react';
import { 
  Calculator, 
  Search, 
  ChevronRight, 
  FileText, 
  AlertCircle, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { useBOQ } from '../hooks/useBOQ';
import BOQStatusBadge from '../components/BOQStatusBadge';

interface BOQListPageProps {
  onSelectProject: (projectId: string) => void;
}

export default function BOQListPage({ onSelectProject }: BOQListPageProps) {
  const { projects, boqs } = useBOQ();
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter(p => {
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
           p.code.toLowerCase().includes(search.toLowerCase()) ||
           p.client.toLowerCase().includes(search.toLowerCase());
  });

  const boqCount = boqs.length;
  const approvedBOQCount = boqs.filter(b => b.status === 'Approved').length;
  const totalBOQValuation = boqs.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">Bill of Quantities (BOQ) Catalog</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">
              Project Estimates, Material Baselining and Commercial Approvals
            </p>
          </div>
        </div>
      </div>

      {/* VALUE KPIs CARD DECK */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider leading-none">Total BOQ Drafts</p>
            <p className="text-lg font-black text-slate-900 mt-1">{boqCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider leading-none">Approved Baselines</p>
            <p className="text-lg font-black text-slate-900 mt-1">{approvedBOQCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider leading-none">Aggregated Estimates</p>
            <p className="text-lg font-black text-slate-900 mt-1 font-mono">₹{totalBOQValuation.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search estimates by code, project desc, client..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:bg-slate-100 outline-none transition-all"
          />
        </div>
      </div>

      {/* PROJECTS BOQ BASES TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/40 border-none">
                <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-32">Proj Code</th>
                <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Project Description</th>
                <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Client Info</th>
                <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-32">Status</th>
                <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-24">Version</th>
                <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-44 text-right">Agg Value (₹)</th>
                <th className="p-4 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 w-36 text-center">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/30">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(proj => {
                  const linkedBOQ = boqs.find(b => b.projectId === proj.id);
                  return (
                    <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-black text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">
                          {proj.code}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-800 text-xs uppercase max-w-xs truncate">
                        {proj.name}
                      </td>
                      <td className="p-4 text-slate-500 font-extrabold text-xs uppercase">
                        {proj.client}
                      </td>
                      <td className="p-4">
                        {linkedBOQ ? (
                          <BOQStatusBadge status={linkedBOQ.status} />
                        ) : (
                          <span className="inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded text-rose-500 bg-rose-50 border border-rose-100 leading-none">
                            Uninitialized
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-xs text-slate-600">
                        {linkedBOQ ? `v${linkedBOQ.version}.0` : '—'}
                      </td>
                      <td className="p-4 font-black text-xs text-slate-900 font-mono text-right">
                        {linkedBOQ ? `₹${linkedBOQ.totalAmount.toLocaleString('en-IN')}` : '₹0'}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => onSelectProject(proj.id)}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight py-2 px-3 rounded-lg cursor-pointer ${
                            linkedBOQ 
                              ? 'bg-slate-900 text-white hover:bg-slate-800' 
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                          }`}
                        >
                          {linkedBOQ ? 'Configure' : 'Initialize'} 
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <h3 className="text-slate-800 font-black text-xs uppercase mt-3">No matching projects</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1 font-sans">Please add projects in the Project Master tab before adding BOQ estimates.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
