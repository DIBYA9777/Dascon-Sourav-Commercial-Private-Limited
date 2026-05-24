import React from 'react';
import { Project } from '../types';
import { useProjectForm } from '../hooks/useProjectForm';
import { KNOWN_SITES } from '../services/projectService';

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const {
    name,
    setName,
    client,
    setClient,
    siteId,
    setSiteId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    description,
    setDescription,
    errorStatus,
    handleSubmit
  } = useProjectForm({ 
    project, 
    onSuccess 
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorStatus && (
        <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-left">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-wide leading-relaxed">
            {errorStatus}
          </p>
        </div>
      )}

      <div className="space-y-1 text-left">
        <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          Project Name *
        </label>
        <input 
          type="text"
          required
          placeholder="e.g. Kolkata Highway Extension"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-4 outline-none focus:border-blue-500 font-bold text-slate-800 placeholder:text-slate-300 text-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div className="space-y-1">
          <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Client Name *
          </label>
          <input 
            type="text"
            required
            placeholder="e.g. NHAI or PWD"
            value={client}
            onChange={e => setClient(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-4 outline-none focus:border-blue-500 font-bold text-slate-800 placeholder:text-slate-300 text-xs"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Linked Site Location *
          </label>
          <select 
            value={siteId}
            onChange={e => setSiteId(e.target.value)}
            required
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-4 outline-none text-xs font-bold text-slate-800 cursor-pointer"
          >
            <option value="">Select Location *</option>
            {KNOWN_SITES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div className="space-y-1">
          <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Start Date *
          </label>
          <input 
            type="date"
            required
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-4 outline-none focus:border-blue-500 font-bold text-slate-800 text-xs cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            End Date *
          </label>
          <input 
            type="date"
            required
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-4 outline-none focus:border-blue-500 font-bold text-slate-800 text-xs cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-1 text-left">
        <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          Workflow Status
        </label>
        <select 
          value={status}
          onChange={e => setStatus(e.target.value as Project['status'])}
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2 px-4 outline-none focus:border-blue-500 font-bold text-slate-800 text-xs cursor-pointer"
        >
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <div className="space-y-1 text-left">
        <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          Description / Project Scope
        </label>
        <textarea 
          rows={3}
          placeholder="Briefly state key scope matrices, layers, chainage configurations, or technical definitions..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl p-3 outline-none focus:border-blue-500 font-bold text-slate-800 placeholder:text-slate-300 text-xs resize-none text-left"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 text-xs rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 uppercase tracking-wider transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="flex-1 py-2.5 text-xs rounded-xl font-black bg-slate-900 text-white uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md"
        >
          {project ? 'Save updates' : 'Register Project'}
        </button>
      </div>
    </form>
  );
}
