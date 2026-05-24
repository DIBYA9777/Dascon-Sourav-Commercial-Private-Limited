import React from 'react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { UserRole } from '@/src/types.ts';
import { 
  Building2, 
  ShoppingCart, 
  Package, 
  UsersRound, 
  Truck, 
  Folders, 
  Factory, 
  ShieldCheck,
  ClipboardList,
  Mail,
  Trophy
} from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4"
  >
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();
  
  const getDashboardData = () => {
    switch (user?.role) {
      case UserRole.SUPER_ADMIN:
        return {
          title: "Super Admin Control Center",
          description: "All companies and sites overview",
          stats: [
            { icon: <Building2 />, label: "Total Companies", value: "08", color: "bg-blue-50 text-blue-600" },
            { icon: <Folders />, label: "Active Projects", value: "24", color: "bg-emerald-50 text-emerald-600" },
            { icon: <UsersRound />, label: "Total Workforce", value: "1,240", color: "bg-indigo-50 text-indigo-600" },
            { icon: <ShieldCheck />, label: "Security Alerts", value: "0", color: "bg-red-50 text-red-600" }
          ]
        };
      case UserRole.ADMIN:
        return {
          title: "Administrative Dashboard",
          description: "Module specific operations and site controls",
          stats: [
            { icon: <ShoppingCart />, label: "Pending Approvals", value: "14", color: "bg-amber-50 text-amber-600" },
            { icon: <Package />, label: "Low Stock Items", value: "03", color: "bg-red-50 text-red-600" },
            { icon: <Truck />, label: "In-Transit Goods", value: "09", color: "bg-blue-50 text-blue-600" },
            { icon: <UsersRound />, label: "Attendance %", value: "92%", color: "bg-emerald-50 text-emerald-600" }
          ]
        };
      case UserRole.SITE_ADMIN:
        return {
          title: "Site Manager Dashboard",
          description: "Site NH44 - Section 01 Operations",
          stats: [
            { icon: <ClipboardList />, label: "Daily Progress", value: "78%", color: "bg-blue-50 text-blue-600" },
            { icon: <Factory />, label: "Production Output", value: "450 MT", color: "bg-indigo-50 text-indigo-600" },
            { icon: <Package />, label: "Local Inventory", value: "82", color: "bg-emerald-50 text-emerald-600" },
            { icon: <Mail />, label: "New Letters", value: "02", color: "bg-amber-50 text-amber-600" }
          ]
        };
      case UserRole.HO_USER:
        return {
          title: "Head Office Dashboard",
          description: "Central monitoring of all site modules and permissions",
          stats: [
            { icon: <Building2 />, label: "Monitored Sites", value: "12", color: "bg-blue-50 text-blue-600" },
            { icon: <ShoppingCart />, label: "Audit Requests", value: "08", color: "bg-amber-50 text-amber-600" },
            { icon: <ClipboardList />, label: "Central Workflows", value: "15", color: "bg-indigo-50 text-indigo-600" },
            { icon: <UsersRound />, label: "Employee Queries", value: "04", color: "bg-emerald-50 text-emerald-600" }
          ]
        };
      default:
        return {
          title: "User Workspace",
          description: "Personal tasks and assigned project forms",
          stats: [
            { icon: <ClipboardList />, label: "My Tasks", value: "12", color: "bg-blue-50 text-blue-600" },
            { icon: <Trophy />, label: "Performance Score", value: "9.2", color: "bg-emerald-50 text-emerald-600" },
            { icon: <Mail />, label: "Messages", value: "04", color: "bg-amber-50 text-amber-600" },
            { icon: <ShoppingCart />, label: "My Requests", value: "03", color: "bg-indigo-50 text-indigo-600" }
          ]
        };
    }
  };

  const data = getDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{data.title}</h2>
          <p className="text-slate-500 text-lg mt-1">{data.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-slate-700">System Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, i) => (
          <StatCard key={i} icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity Monitor</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">New Material Requisition MR-2024-08{i}</p>
                  <p className="text-xs text-slate-500 mt-1">Authorized by Site Admin • 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Module Quick Access</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <ShoppingCart />, label: "Purchase", color: "text-blue-600" },
              { icon: <Package />, label: "Inventory", color: "text-emerald-600" },
              { icon: <Truck />, label: "Machinery", color: "text-amber-600" },
              { icon: <UsersRound />, label: "HR Portal", color: "text-indigo-600" },
              { icon: <Folders />, label: "Projects", color: "text-red-600" },
              { icon: <Factory />, label: "Production", color: "text-violet-600" },
            ].map((module, i) => (
              <button key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                <div className={`${module.color} mb-2 group-hover:scale-110 transition-transform`}>{module.icon}</div>
                <span className="text-xs font-bold text-slate-600">{module.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
