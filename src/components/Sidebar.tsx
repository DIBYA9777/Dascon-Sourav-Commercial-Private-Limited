import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Building2, 
  Users, 
  ShoppingCart, 
  Package, 
  UsersRound, 
  Truck, 
  Folders, 
  Factory, 
  Calculator, 
  Mail, 
  FileText,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  HardHat,
  Trophy,
  X,
  ShieldAlert,
  LogOut,
  Settings2,
  Trello,
  Settings,
  Receipt,
  Coins,
  BookOpen
} from 'lucide-react';
import { cn } from '@/src/lib/utils.ts';
import { UserRole } from '@/src/types.ts';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { LogoWithText } from './Logo.tsx';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles?: UserRole[];
  moduleId?: string;
}

const SidebarItem = ({ to, icon, label, roles, moduleId }: SidebarItemProps) => {
  const { user } = useAuth();
  
  if (roles && user && !roles.includes(user.role as UserRole)) {
     // If user is not in required roles, hide it
     // However, if it's a specific module and they have permission, maybe show it?
     // Actually, roles are for specific system pages.
     return null;
  }

  // Module level permission check for non-admins
  if (moduleId && user && user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN) {
    if (!user.modulePermissions?.includes(moduleId)) return null;
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-black transition-all group tracking-tight',
          isActive
            ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 italic'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 uppercase'
        )
      }
    >
      <div className="flex-shrink-0 transition-transform group-hover:scale-110">{icon}</div>
      <span className="flex-grow">{label}</span>
      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
    </NavLink>
  );
};

export const Sidebar = ({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-100 flex flex-col h-full transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        {/* Header - Fixed Height */}
        <div className="p-3 pb-2 shrink-0">
          <div className="flex items-center justify-between mb-4 px-1">
            <LogoWithText />
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 lg:hidden" aria-label="Close sidebar">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-grow overflow-y-auto px-3 scrollbar-none pr-1 -mr-1">
          <nav className="space-y-4 pb-4">
            {/* AUTHORITY SYSTEM */}
            {(user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN) && (
              <div className="space-y-0.5">
                <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5 px-2">
                  <ShieldAlert className="w-2.5 h-2.5 text-rose-500" />
                  Strategic Core
                </h3>
                <SidebarItem to="/superadmin/dashboard" icon={<BarChart3 className="w-3.5 h-3.5" />} label="Control Dashboard" roles={[UserRole.SUPER_ADMIN]} />
                <SidebarItem to="/admin/dashboard" icon={<BarChart3 className="w-3.5 h-3.5" />} label="Admin Dashboard" roles={[UserRole.ADMIN]} />
                <SidebarItem to="/superadmin/user-management" icon={<Users className="w-3.5 h-3.5 text-blue-600" />} label="Identity Registry" roles={[UserRole.SUPER_ADMIN]} />
                <SidebarItem to="/admin/users" icon={<Users className="w-3.5 h-3.5 text-blue-600" />} label="User Onboarding" roles={[UserRole.ADMIN]} />
                <SidebarItem to="/superadmin/access-control" icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />} label="Resource Entitlement" roles={[UserRole.SUPER_ADMIN]} />
              </div>
            )}

            {/* ERP DISCOVERY */}
            <div className="space-y-0.5">
              <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 px-2">Discovery Modules</h3>
              <SidebarItem to="/purchase" icon={<ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />} label="Procurement" moduleId="purchase" />
              <SidebarItem to="/inventory" icon={<Package className="w-3.5 h-3.5 text-amber-600" />} label="Inventory" moduleId="inventory" />
              <SidebarItem to="/hr" icon={<UsersRound className="w-3.5 h-3.5 text-rose-600" />} label="Human Capital" moduleId="hr" />
              <SidebarItem to="/machinery" icon={<HardHat className="w-3.5 h-3.5 text-slate-600" />} label="Machinery" moduleId="machinery" />
              <SidebarItem to="/project" icon={<Trello className="w-3.5 h-3.5 text-blue-600" />} label="Project Mgmt" moduleId="project" />
              {location.pathname.startsWith('/project') && (
                <div className="pl-4 pr-1 py-1 space-y-1 bg-slate-50/70 rounded-xl border border-slate-100/50 my-1 animate-in slide-in-from-top-1 duration-200">
                  <NavLink
                    to="/project/project-master"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <Building2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">Project Master</span>
                  </NavLink>
                  <NavLink
                    to="/project/wbs"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <Trello className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">WBS Structure</span>
                  </NavLink>
                  <NavLink
                    to="/project/boq"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <Calculator className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">BOQ Creation</span>
                  </NavLink>
                  <NavLink
                    to="/project/planning"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="truncate">Planning Module</span>
                  </NavLink>
                  <NavLink
                    to="/project/execution-type"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <ShieldCheck className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate">Execution Type</span>
                  </NavLink>
                  <NavLink
                    to="/project/work-order"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <Briefcase className="w-3 h-3 text-violet-500 shrink-0" />
                    <span className="truncate">Work Orders</span>
                  </NavLink>
                  <NavLink
                    to="/project/dpr"
                    id="sidebar-project-dpr"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <FileText className="w-3 h-3 text-indigo-505 shrink-0" />
                    <span className="truncate">Daily Progress Report</span>
                  </NavLink>
                  <NavLink
                    to="/project/planned-vs-achieved"
                    id="sidebar-project-planned-vs-achieved"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <BarChart3 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">Planned vs Achieved</span>
                  </NavLink>
                  <NavLink
                    to="/project/sub-contractor-bill"
                    id="sidebar-project-sub-contractor-bill"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <Receipt className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">Sub-Contractor Bills</span>
                  </NavLink>
                  <NavLink
                    to="/project/running-account-bill"
                    id="sidebar-project-running-account-bill"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <Coins className="w-3 h-3 text-sky-505 shrink-0" />
                    <span className="truncate">Client RA Bills</span>
                  </NavLink>
                  <NavLink
                    to="/project/ac-posting"
                    id="sidebar-project-ac-posting"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-black transition-all group tracking-tight uppercase',
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs italic'
                          : 'text-slate-500 hover:bg-slate-100/60 hover:text-slate-900'
                      )
                    }
                  >
                    <BookOpen className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">A/C Posting</span>
                  </NavLink>

                </div>
              )}
              <SidebarItem to="/production" icon={<Factory className="w-3.5 h-3.5 text-indigo-600" />} label="Production" moduleId="production" />
              <SidebarItem to="/accounts" icon={<Calculator className="w-3.5 h-3.5 text-violet-600" />} label="Finance" moduleId="accounts" />
              <SidebarItem to="/correspondence" icon={<Mail className="w-3.5 h-3.5 text-sky-600" />} label="Correspondence" moduleId="correspondence" />
              <SidebarItem to="/tender" icon={<Trophy className="w-3.5 h-3.5 text-yellow-600" />} label="Tender" moduleId="tender" />
            </div>
          </nav>
        </div>

        {/* Profile Footer - Fixed at Bottom */}
        <div className="p-3 border-t border-slate-50 shrink-0">
          <div className="bg-slate-900 rounded-xl p-3 shadow-xl">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center font-black text-blue-400 italic text-[10px] shadow-inner">
                 {user?.name.charAt(0)}
               </div>
               <div className="overflow-hidden">
                 <p className="font-black text-white text-[10px] truncate uppercase tracking-tighter italic leading-none mb-0.5">{user?.name}</p>
                 <p className="text-[8px] font-bold text-slate-500 truncate uppercase tracking-wider">{user?.role.replace('_', ' ')}</p>
               </div>
             </div>
             <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest"
             >
                <LogOut className="w-3 h-3" />
                LOGOUT
             </button>
          </div>
        </div>
      </aside>
    </>
  );
};
