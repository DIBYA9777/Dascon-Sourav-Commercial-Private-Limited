import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, LayoutGrid } from 'lucide-react';
import { useBOQ } from '../hooks/useBOQ';
import { useBOQItems } from '../hooks/useBOQItems';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import BOQHeader from '../components/BOQHeader';
import BOQItemTable from '../components/BOQItemTable';
import BOQAddItemForm from '../components/BOQAddItemForm';
import BOQTotalBar from '../components/BOQTotalBar';

interface BOQDetailPageProps {
  projectId: string;
  onBack: () => void;
}

export default function BOQDetailPage({ projectId, onBack }: BOQDetailPageProps) {
  const { currentBOQ, updateBOQStatus, saveBOQ } = useBOQ(projectId);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const proj = projectService.getProjectById(projectId);
    if (proj) {
      setProject(proj);
    }
  }, [projectId]);

  const { addItem, updateItem, deleteItem } = useBOQItems(currentBOQ, saveBOQ);

  if (!currentBOQ) {
    return (
      <div className="p-12 text-center bg-white border border-slate-100 rounded-2xl max-w-lg mx-auto mt-10">
        <p className="text-xs font-black text-rose-500 uppercase leading-relaxed animate-pulse">Constructing Draft Baseline...</p>
      </div>
    );
  }

  const isLocked = currentBOQ.status === 'Approved';

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
      {/* BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <button 
          type="button"
          onClick={onBack}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl py-2 px-3 text-[10px] font-black tracking-tight uppercase flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to BOQ Catalog
        </button>

        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Authorized estimate interface
        </span>
      </div>

      {/* DETAILED DOCUMENT HEADER */}
      <BOQHeader 
        boq={currentBOQ} 
        project={project}
        onStatusChange={updateBOQStatus}
      />

      {/* ITEMS INVENTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 pl-1">
            <LayoutGrid className="w-4 h-4 text-slate-400" /> BOQ Line Specifications
          </h3>
          {isLocked && (
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md uppercase">
              READ-ONLY MODE (VERSION LOCKED)
            </span>
          )}
        </div>

        <BOQItemTable 
          items={currentBOQ.items}
          readonly={isLocked}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />

        {!isLocked && (
          <BOQAddItemForm onAdd={addItem} />
        )}
      </div>

      {/* TOTAL VALUE FOOTER */}
      <BOQTotalBar 
        totalAmount={currentBOQ.totalAmount}
        itemCount={currentBOQ.items.length} 
      />
    </div>
  );
}
