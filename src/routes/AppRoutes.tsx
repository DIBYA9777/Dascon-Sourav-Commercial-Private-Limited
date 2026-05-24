import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/src/components/MainLayout.tsx';
import Login from '@/src/pages/Login.tsx';
import Dashboard from '@/src/pages/Dashboard.tsx';
import { PrivateRoute, SuperAdminRoute, AdminRoute } from '@/src/guards/RoleGuard.tsx';
import UserList from '@/src/modules/superadmin/user-management/UserList.tsx';
import CreateUser from '@/src/modules/superadmin/user-management/CreateUser.tsx';
import ModuleAccess from '@/src/modules/superadmin/access-control/ModuleAccess.tsx';
import ModulePlaceholder from '@/src/components/ModulePlaceholder.tsx';
import Profile from '@/src/pages/Profile.tsx';
import ModuleDashboard from '@/src/pages/ModuleDashboard.tsx';

// Project Management Module Custom Pages
import { 
  ProjectListPage, 
  WBSPage, 
  BOQPage, 
  PlanningPage, 
  ExecutionTypePage, 
  WorkOrderListPage,
  DPRListPage,
  PlannedVsAchievedPage,
  SCBillListPage,
  RABillListPage,
  ACPostingListPage
} from '@/src/modules/06_project';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* SUPER ADMIN ONLY */}
          <Route element={<SuperAdminRoute />}>
            <Route path="/superadmin/dashboard" element={<Dashboard />} />
            <Route path="/superadmin/user-management" element={<UserList />} />
            <Route path="/superadmin/user-management/create" element={<CreateUser />} />
            <Route path="/superadmin/access-control" element={<ModuleAccess />} />
          </Route>
 
          {/* ADMIN & SUPER ADMIN */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<CreateUser />} />
          </Route>
 
          {/* CUSTOM PROJECT MANAGEMENT ROUTES */}
          <Route path="/project/project-master" element={<ProjectListPage />} />
          <Route path="/project/wbs" element={<WBSPage />} />
          <Route path="/project/boq" element={<BOQPage />} />
          <Route path="/project/planning" element={<PlanningPage />} />
          <Route path="/project/execution-type" element={<ExecutionTypePage />} />
          <Route path="/project/work-order" element={<WorkOrderListPage />} />
          <Route path="/project/dpr" element={<DPRListPage />} />
          <Route path="/project/planned-vs-achieved" element={<PlannedVsAchievedPage />} />
          <Route path="/project/sub-contractor-bill" element={<SCBillListPage />} />
          <Route path="/project/running-account-bill" element={<RABillListPage />} />
          <Route path="/project/ac-posting" element={<ACPostingListPage />} />


          {/* DYNAMIC ERP MODULES */}
          <Route path="/:module" element={<ModuleDashboard />} />
          <Route path="/:module/:submodule" element={<ModulePlaceholder name="Module Action" module="ERP-SYS" />} />
          
          <Route path="/unauthorized" element={<div className="p-10 text-center font-black text-rose-500 italic">GATEWAY DENIED: INSUFFICIENT CLEARANCE</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Route>
    </Routes>
  );
}
