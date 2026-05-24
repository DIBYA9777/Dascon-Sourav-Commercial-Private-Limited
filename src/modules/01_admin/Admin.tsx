import { Layout, CheckSquare, Layers } from 'lucide-react';

export default function AdminView() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Admin Workspace</h2>
        <p className="text-slate-500 font-medium mt-1">Authorized for Module Management & Cross-Site Operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-blue-600">
          <Layout className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">Module Access</h3>
          <p className="text-slate-500 mt-2">You are assigned to the <strong>Purchase</strong> and <strong>Inventory</strong> modules with full administrative rights.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-600">
          <Layers className="w-10 h-10 text-emerald-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">Site Coverage</h3>
          <p className="text-slate-500 mt-2">Managing All Sites/Branches of <strong>Dascon Saurav</strong>.</p>
        </div>
      </div>
    </div>
  );
}
