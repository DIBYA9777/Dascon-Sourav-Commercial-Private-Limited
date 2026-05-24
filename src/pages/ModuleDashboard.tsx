import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Cpu, 
  Construction, 
  Factory, 
  Calculator, 
  Mail, 
  Briefcase,
  ChevronRight,
  Search,
  Plus,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { ERP_MODULES } from '@/src/constants/erpModules.ts';
import { UserRole } from '@/src/types.ts';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  purchase: <ShoppingCart className="w-8 h-8 text-blue-600" />,
  inventory: <Package className="w-8 h-8 text-emerald-600" />,
  hr: <Users className="w-8 h-8 text-indigo-600" />,
  machinery: <Cpu className="w-8 h-8 text-rose-600" />,
  project: <Construction className="w-8 h-8 text-amber-600" />,
  production: <Factory className="w-8 h-8 text-cyan-600" />,
  accounts: <Calculator className="w-8 h-8 text-slate-700" />,
  correspondence: <Mail className="w-8 h-8 text-orange-600" />,
  tender: <Briefcase className="w-8 h-8 text-violet-600" />,
};

export default function ModuleDashboard() {
  const { module: moduleKey } = useParams();
  const { user } = useAuth();
  
  const currentModule = ERP_MODULES.find(m => m.id === moduleKey);
  
  if (!currentModule) {
    return <Navigate to="/" />;
  }

  // Permission check
  const isAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN;
  const hasModuleAccess = isAdmin || user?.modulePermissions?.includes(currentModule.id);

  if (!hasModuleAccess) {
    return <Navigate to="/unauthorized" />;
  }

  // Filter sections
  const allowedSections = currentModule.sections.filter(section => 
    isAdmin || user?.sectionPermissions?.includes(section.id)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 italic">
              {MODULE_ICONS[currentModule.id] || <LayoutGrid className="w-8 h-8 text-slate-600" />}
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">{currentModule.name}</h1>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] italic">Authorized Access Console</p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search assigned sub-modules..." 
              className="w-full bg-white border-2 border-slate-100 rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-slate-200">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUBMODULES GRID */}
      {allowedSections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allowedSections.map((sub: any, idx: number) => (
            <Link 
              key={idx} 
              to={`/${moduleKey}/${sub.id}`}
              className="group bg-white p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                  {sub.name}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 truncate max-w-[150px]">
                  ID: {sub.id.toUpperCase()}
                </p>
              </div>
              <div className="bg-slate-50 group-hover:bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm italic text-slate-300">
              <LayoutGrid className="w-8 h-8" />
           </div>
           <div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Sub-Modules Assigned</p>
              <p className="text-xs text-slate-400 mt-1">Please contact Strategic Core to update your Resource Entitlements.</p>
           </div>
        </div>
      )}

      {/* QUICK STATS - Only for modules with content */}
      {allowedSections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl text-white shadow-xl shadow-blue-200">
             <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Module Status</h4>
             <p className="text-3xl font-black italic mt-1">ACTIVE</p>
             <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
               <div className="bg-white w-[100%] h-full" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Records Managed</h4>
             <p className="text-3xl font-black text-slate-900 italic mt-1">0</p>
             <div className="flex items-center gap-1 mt-4 text-xs font-black text-emerald-500 uppercase">
               Live Sync Enabled <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Access Token</h4>
             <p className="text-xl font-black text-slate-900 italic mt-1 uppercase truncate font-mono">
                {user?.userId}
             </p>
             <p className="text-xs font-bold text-slate-400 mt-4 italic uppercase">Security Level: {user?.role.replace('_', ' ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
