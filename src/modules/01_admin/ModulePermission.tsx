import { useState } from 'react';
import { Shield, Save, CheckCircle2, LayoutGrid, Box, Users, CreditCard, HardHat } from 'lucide-react';
import { Button } from '@/src/components/Button.tsx';
import { Badge } from '@/src/components/Badge.tsx';

const MODULE_LIST = [
  { id: 'admin', name: 'Administration', icon: Shield, color: 'text-blue-600' },
  { id: 'purchase', name: 'Purchase', icon: Box, color: 'text-emerald-600' },
  { id: 'inventory', name: 'Inventory', icon: LayoutGrid, color: 'text-amber-600' },
  { id: 'hr', name: 'Human Resources', icon: Users, color: 'text-rose-600' },
  { id: 'accounts', name: 'Accounts', icon: CreditCard, color: 'text-indigo-600' },
  { id: 'machinery', name: 'Machinery', icon: HardHat, color: 'text-slate-600' },
];

export default function ModulePermission() {
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [permissions, setPermissions] = useState<Record<string, string[]>>({
    ADMIN: ['admin', 'purchase', 'inventory'],
    USER: ['purchase'],
  });

  const togglePermission = (moduleId: string) => {
    setPermissions(prev => {
      const current = prev[selectedRole] || [];
      if (current.includes(moduleId)) {
        return { ...prev, [selectedRole]: current.filter(id => id !== moduleId) };
      }
      return { ...prev, [selectedRole]: [...current, moduleId] };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Module Access Rights</h2>
          <p className="text-slate-500 text-sm">Define high-level module availability for system roles</p>
        </div>
        <Button className="shadow-lg shadow-blue-100">
          <Save className="h-4 w-4 mr-2" />
          Update Permissions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">System Roles</h3>
          {['SUPER_ADMIN', 'ADMIN', 'HO_USER', 'SITE_ADMIN', 'USER'].map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                selectedRole === role 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 -translate-y-0.5' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                  {selectedRole.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight">{selectedRole.replace('_', ' ')} Rights</h3>
                  <p className="text-xs text-slate-400 font-medium">Select modules this role can access</p>
                </div>
              </div>
              <Badge variant="info" className="px-4 py-1.5 rounded-full">{permissions[selectedRole]?.length || 0} Modules Active</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MODULE_LIST.map(module => {
                const isActive = permissions[selectedRole]?.includes(module.id);
                const Icon = module.icon;
                return (
                  <label 
                    key={module.id} 
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isActive 
                        ? 'border-blue-600 bg-blue-50/30' 
                        : 'border-slate-100 bg-slate-50/50 grayscale opacity-60 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-white shadow-sm ${isActive ? module.color : 'text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 text-base">{module.name}</span>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                          {isActive ? 'Full Module Access' : 'No Access'}
                        </p>
                      </div>
                    </div>
                    <div 
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                        isActive 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-slate-200'
                      }`}
                      onClick={() => togglePermission(module.id)}
                    >
                      {isActive && <CheckCircle2 className="w-4 h-4" />}
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isActive}
                        readOnly
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
