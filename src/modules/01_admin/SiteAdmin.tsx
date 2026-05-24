import { Home, HardHat, FileCheck } from 'lucide-react';

export default function SiteAdminView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Site Administrator</h2>
            <p className="text-slate-500 text-sm">Managing: <strong>Site NH44 - Section 1</strong></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            Branch/Site Rights
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            As a Site Admin, you have complete rights for this specific site. 
            All modules (Purchase, Inventory, HR, Machinery) are accessible for site NH44.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            Full Form Access
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            All forms within enabled modules for this site are at your disposal.
            You handle local approvals for MR, attendance, and log book entries.
          </p>
        </div>
      </div>
    </div>
  );
}
