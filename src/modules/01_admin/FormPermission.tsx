import { useState } from 'react';
import { FileCode, ShieldAlert, CheckSquare } from 'lucide-react';
import { Button } from '@/src/components/Button.tsx';

export default function FormPermission() {
  const [selectedRole, setSelectedRole] = useState('USER');
  const [selectedModule, setSelectedModule] = useState('PURCHASE');
  
  const forms = [
    { name: 'Material Requisition', id: 'MR' },
    { name: 'Purchase Order', id: 'PO' },
    { name: 'GRN Entry', id: 'GRN' },
    { name: 'Purchase Bill', id: 'BILL' },
  ];

  const roles = ['HO_USER', 'SITE_ADMIN', 'USER'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Form Access Rules</h2>
          <p className="text-slate-500 text-sm">Define CRUD operations at the individual document level</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-100">
           {roles.map(role => (
             <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedRole === role ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
                {role.replace('_', ' ')}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {['ADMINISTRATION', 'PURCHASE', 'INVENTORY', 'ACCOUNTS'].map(mod => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-6 py-4 text-sm font-bold tracking-tight transition-colors ${selectedModule === mod ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {mod}
            </button>
          ))}
        </div>

        <div className="p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forms.map(form => (
                <div key={form.id} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-colors group">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                         <FileCode className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{form.name}</span>
                   </div>
                   <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                         <span className="text-xs font-semibold text-slate-500">View</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                         <span className="text-xs font-semibold text-slate-500">Create</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                         <span className="text-xs font-semibold text-slate-500">Delete</span>
                      </label>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="mt-8 flex justify-end">
              <Button>Save Form Rights</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
