import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface ModulePlaceholderProps {
  name: string;
  module?: string;
  icon?: React.ReactNode;
}

export default function ModulePlaceholder({ name, module, icon }: ModulePlaceholderProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-100 rounded-[3rem] relative overflow-hidden">
      <div className="absolute top-10 right-10 opacity-[0.03] scale-[5] select-none pointer-events-none font-black italic uppercase">
        {module || name}
      </div>
      
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner italic">
        {icon || <LayoutGrid className="w-12 h-12" />}
      </div>
      
      <div className="text-center space-y-3 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{name} System</h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Module under construction / Development Hub</p>
      </div>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl px-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-2 rounded-2xl bg-slate-50 relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-600/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
