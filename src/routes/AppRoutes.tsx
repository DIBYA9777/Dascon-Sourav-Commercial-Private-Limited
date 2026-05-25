import { Routes, Route, Navigate } from 'react-router-dom';
import React, { lazy } from 'react';
import MainLayout from '@/src/components/MainLayout.tsx';
import Login from '@/src/pages/Login.tsx';
import { PrivateRoute, SuperAdminRoute, AdminRoute } from '@/src/guards/RoleGuard.tsx';
import ModulePlaceholder from '@/src/components/ModulePlaceholder.tsx';

const Dashboard = lazy(() => import('@/src/pages/Dashboard.tsx'));
const Profile = lazy(() => import('@/src/pages/Profile.tsx'));

// SUPER ADMIN ONLY
const UserList = lazy(() => import('@/src/modules/superadmin/user-management/UserList.tsx'));
const CreateUser = lazy(() => import('@/src/modules/superadmin/user-management/CreateUser.tsx'));
const ModuleAccess = lazy(() => import('@/src/modules/superadmin/access-control/ModuleAccess.tsx'));

// CUSTOM PROJECT MANAGEMENT ROUTES
const ProjectListPage = lazy(() => import('@/src/modules/06_project/pages/ProjectListPage.tsx'));
const WBSPage = lazy(() => import('@/src/modules/06_project/pages/WBSPage.tsx'));
const BOQPage = lazy(() => import('@/src/modules/06_project/pages/BOQPage.tsx'));
const PlanningPage = lazy(() => import('@/src/modules/06_project/pages/PlanningPage.tsx'));
const ExecutionTypePage = lazy(() => import('@/src/modules/06_project/pages/ExecutionTypePage.tsx'));
const WorkOrderListPage = lazy(() => import('@/src/modules/06_project/pages/WorkOrderListPage.tsx'));
const DPRListPage = lazy(() => import('@/src/modules/06_project/pages/DPRListPage.tsx'));
const PlannedVsAchievedPage = lazy(() => import('@/src/modules/06_project/pages/PlannedVsAchievedPage.tsx'));
const SCBillListPage = lazy(() => import('@/src/modules/06_project/pages/SCBillListPage.tsx'));
const RABillListPage = lazy(() => import('@/src/modules/06_project/pages/RABillListPage.tsx'));
const ACPostingListPage = lazy(() => import('@/src/modules/06_project/pages/ACPostingListPage.tsx'));

// DYNAMIC ERP MODULES
const ModuleDashboard = lazy(() => import('@/src/pages/ModuleDashboard.tsx'));

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
