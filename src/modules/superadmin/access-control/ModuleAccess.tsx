import React, { useState } from 'react';
import { Shield, LayoutGrid, Box, Users, CreditCard, HardHat, CheckCircle2, ChevronRight, Lock, Unlock } from 'lucide-react';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';

import { useAuth } from '@/src/context/AuthContext.tsx';
import { ERP_MODULES } from '@/src/constants/erpModules.ts';
import { 
  ShoppingCart, 
  Package, 
  Users as HrIcon, 
  Cpu, 
  Construction, 
  Factory, 
  Calculator, 
  Mail as MailIcon, 
  Briefcase 
} from 'lucide-react';

const MODULE_ICONS: Record<string, any> = {
  purchase: ShoppingCart,
  inventory: Package,
  hr: HrIcon,
  machinery: Cpu,
  project: Construction,
  production: Factory,
  accounts: Calculator,
  correspondence: MailIcon,
  tender: Briefcase,
};

export default function ModuleAccess() {
  const [selectedUser, setSelectedUser] = useState('Rahul Sharma');
  const [permissions, setPermissions] = useState<Record<string, string[]>>({
    'Rahul Sharma': ['purchase', 'inventory', 'hr', 'accounts'],
  });

  const [sectionPermissions, setSectionPermissions] = useState<Record<string, string[]>>({
     'Rahul Sharma': ['Req', 'Indent', 'MIN', 'Stock'],
  });

  const toggleModule = (userId: string, moduleId: string) => {
    setPermissions(prev => {
      const current = prev[userId] || [];
      if (current.includes(moduleId)) return { ...prev, [userId]: current.filter(id => id !== moduleId) };
      return { ...prev, [userId]: [...current, moduleId] };
    });
  };

  const toggleSection = (userId: string, section: string) => {
    setSectionPermissions(prev => {
        const current = prev[userId] || [];
        if (current.includes(section)) return { ...prev, [userId]: current.filter(id => id !== section) };
        return { ...prev, [userId]: [...current, section] };
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Resource Entitlement</h2>
           <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-1 italic">Strategic Allocation Control Matrix</p>
        </div>
        <Button className="rounded-2xl py-6 px-10 font-black shadow-xl shadow-blue-100">
           COMMIT MASTER CHANGES
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Staff Hierarchy</h3>
           {['Rahul Sharma', 'Anita Verma', 'Suresh Kumar', 'Amit Singh'].map(user => (
             <button
                key={user}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left px-6 py-5 rounded-[2rem] text-sm font-black transition-all flex items-center justify-between group ${
                    selectedUser === user ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white text-slate-500 border-2 border-slate-50 hover:border-slate-100 hover:bg-slate-50'
                }`}
             >
                {user}
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedUser === user ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
             </button>
           ))}
        </div>

        <div className="lg:col-span-3">
           <div className="bg-white rounded-[3rem] border-2 border-slate-50 p-10 shadow-sm space-y-10">
              <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center font-black text-xl italic shadow-inner">
                       {selectedUser.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{selectedUser} Authority</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Resource Entitlement Matrix</p>
                    </div>
                 </div>
                 <Badge variant="info" className="px-6 py-2 rounded-2xl italic font-black">{permissions[selectedUser]?.length || 0} MODULES SYNCED</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {ERP_MODULES.map(mod => {
                    const isActive = permissions[selectedUser]?.includes(mod.id);
                    const Icon = MODULE_ICONS[mod.id] || LayoutGrid;
                    return (
                        <div key={mod.id} className="space-y-4">
                            <label className={`flex items-center justify-between p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all ${
                                isActive ? 'border-blue-600 bg-blue-50/10 shadow-lg shadow-blue-500/5' : 'border-slate-50 bg-slate-50/30 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                            }`}>
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl bg-white shadow-inner border border-slate-50 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <span className={`font-black text-lg uppercase italic tracking-tighter ${isActive ? 'text-blue-900' : 'text-slate-400'}`}>{mod.name}</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest mt-1 italic">{isActive ? 'Authorization Active' : 'Access Restricted'}</p>
                                    </div>
                                </div>
                                <div onClick={(e) => { e.preventDefault(); toggleModule(selectedUser, mod.id); }} className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center border-2 transition-all ${
                                    isActive ? 'bg-blue-600 border-blue-600 text-white shadow-xl rotate-0' : 'bg-slate-100 border-slate-200 text-slate-300 -rotate-12'
                                }`}>
                                    {isActive ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                </div>
                            </label>

                            {isActive && (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pl-4">
                                    {mod.sections.map(sec => {
                                        const isSecActive = sectionPermissions[selectedUser]?.includes(sec.id);
                                        return (
                                            <button
                                                key={sec.id}
                                                onClick={() => toggleSection(selectedUser, sec.id)}
                                                className={`text-[10px] font-black px-4 py-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2 text-left ${
                                                    isSecActive ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-100 bg-white text-slate-400 hover:border-blue-200'
                                                }`}
                                            >
                                                <span className="truncate">{sec.name.toUpperCase()}</span>
                                                {isSecActive && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
