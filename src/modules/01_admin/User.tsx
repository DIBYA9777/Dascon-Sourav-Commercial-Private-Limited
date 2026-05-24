import { User as UserIcon, CheckCircle, Clock } from 'lucide-react';

export default function UserView() {
  return (
    <div className="space-y-8">
      <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
        <div className="flex items-center gap-4 mb-6">
           <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
              <UserIcon className="w-5 h-5 text-slate-600" />
           </div>
           <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active User Workspace</h2>
              <p className="text-slate-500 text-xs font-medium italic">Assigned Rights View</p>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
              <div className="flex items-center gap-3">
                 <CheckCircle className="w-4 h-4 text-emerald-500" />
                 <span className="text-sm font-bold text-slate-700">Assigned Site:</span>
              </div>
              <span className="text-sm text-slate-500">Site A - Store Alpha</span>
           </div>
           
           <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
              <div className="flex items-center gap-3">
                 <Clock className="w-4 h-4 text-blue-500" />
                 <span className="text-sm font-bold text-slate-700">Assigned Module:</span>
              </div>
              <span className="text-sm text-slate-500">Inventory Management</span>
           </div>
        </div>
      </div>
    </div>
  );
}
