import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowUpDown, Eye, Edit3, Archive } from 'lucide-react';
import { Project } from '../types';
import ProjectCodeBadge from './ProjectCodeBadge';
import ProjectStatusBadge from './ProjectStatusBadge';

interface ProjectTableProps {
  projects: Project[];
  sortField: keyof Project | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Project) => void;
  onView: (p: Project) => void;
  onEdit: (p: Project) => void;
  onToggleDeactivate: (p: Project) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProjectTable({
  projects,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onToggleDeactivate,
  currentPage,
  totalPages,
  onPageChange
}: ProjectTableProps) {
  const renderSortIcon = (field: keyof Project) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline-block" />;
    return (
      <span className="text-2xs font-extrabold text-slate-900 ml-1 inline-block">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/40 border-none">
              <th 
                onClick={() => onSort('code')}
                className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider cursor-pointer hover:text-slate-800 transition-colors"
              >
                Project Code {renderSortIcon('code')}
              </th>
              <th 
                onClick={() => onSort('name')}
                className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider cursor-pointer hover:text-slate-800 transition-colors"
              >
                Project Name {renderSortIcon('name')}
              </th>
              <th 
                onClick={() => onSort('client')}
                className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider cursor-pointer hover:text-slate-800 transition-colors"
              >
                Client Name {renderSortIcon('client')}
              </th>
              <th 
                onClick={() => onSort('startDate')}
                className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider cursor-pointer hover:text-slate-800 transition-colors"
              >
                Date range {renderSortIcon('startDate')}
              </th>
              <th 
                onClick={() => onSort('status')}
                className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider cursor-pointer hover:text-slate-800 transition-colors"
              >
                Status {renderSortIcon('status')}
              </th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/30">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-4">
                    <ProjectCodeBadge code={proj.code} />
                  </td>
                  <td className="p-4 font-black text-slate-800 text-xs text-left">
                     {proj.name}
                  </td>
                  <td className="p-4 text-slate-500 font-bold text-xs">{proj.client}</td>
                  <td className="p-4 font-bold text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-350" />
                      <span>{proj.startDate}</span> ~ <span>{proj.endDate}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <ProjectStatusBadge status={proj.status} />
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(proj);
                        }}
                        title="View Project detail"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50/70 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(proj);
                        }}
                        title="Edit Project details"
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleDeactivate(proj);
                        }}
                        title={proj.status === 'Archived' ? 'Activate Project' : 'Archive Project'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          proj.status === 'Archived'
                            ? 'text-emerald-500 hover:bg-emerald-50/70 hover:text-emerald-700'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50/70'
                        }`}
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400 text-xs font-bold leading-relaxed">
                  No matching projects registered. Please add a new project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-4 bg-slate-50/50 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border border-slate-150 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white border border-slate-150 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
