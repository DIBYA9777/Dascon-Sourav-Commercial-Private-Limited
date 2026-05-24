import { Map, Briefcase, FormInput } from 'lucide-react';

export default function HOUserView() {
  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 p-8 rounded-3xl text-white">
        <h2 className="text-3xl font-black tracking-tight">Head Office Command</h2>
        <p className="text-indigo-100 mt-2">Site Management & Module Coordination for assigned domains.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <Map className="w-8 h-8 text-indigo-600 mb-3" />
          <h4 className="font-bold text-slate-900">Site Rights</h4>
          <p className="text-xs text-slate-500 mt-1">Access to all branches of assigned company divisions.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <Briefcase className="w-8 h-8 text-indigo-600 mb-3" />
          <h4 className="font-bold text-slate-900">Module Access</h4>
          <p className="text-xs text-slate-500 mt-1">Assigned Rights: Purchase, HR Coordination, Correspondence.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <FormInput className="w-8 h-8 text-indigo-600 mb-3" />
          <h4 className="font-bold text-slate-900">Form Control</h4>
          <p className="text-xs text-slate-500 mt-1">Limited to specific management and approval forms.</p>
        </div>
      </div>
    </div>
  );
}
