import { ShieldCheck, Building2, MapPin } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { UserRole } from '@/src/types.ts';

const AccessInfo = ({ title, desc, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function SuperAdminView() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Super Admin Portal</h2>
          <p className="text-slate-500 font-medium">Global Management & Enterprise Oversight</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AccessInfo 
          title="Consolidated Companies" 
          desc="Manage legal entities and organizational structures across the entire enterprise."
          icon={Building2}
        />
        <AccessInfo 
          title="All Site Operations" 
          desc="Omnipresent access to all site/plant/project data and live metrics."
          icon={MapPin}
        />
        <AccessInfo 
          title="Master Security" 
          desc="Control system-wide permissions, roles, and administrative audits."
          icon={ShieldCheck}
        />
      </div>

      <div className="bg-blue-900 text-white p-8 rounded-3xl overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Enterprise Summary</h3>
          <p className="text-blue-200 max-w-md">As a Super Admin, you have full visibility. System health is optimal across 8 companies and 24 active sites.</p>
          <div className="flex gap-8 mt-8">
             <div>
                <p className="text-blue-300 text-xs font-bold uppercase mb-1">Users</p>
                <p className="text-3xl font-black">1.2k</p>
             </div>
             <div>
                <p className="text-blue-300 text-xs font-bold uppercase mb-1">Live Projects</p>
                <p className="text-3xl font-black">24</p>
             </div>
             <div>
                <p className="text-blue-300 text-xs font-bold uppercase mb-1">Uptime</p>
                <p className="text-3xl font-black">99.9%</p>
             </div>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
}
