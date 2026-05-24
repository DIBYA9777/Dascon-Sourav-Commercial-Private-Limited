import React from 'react';
import { useProgressReport } from '../hooks/useProgressReport';
import ProgressHeader from '../components/ProgressHeader';
import ProgressSummaryCards from '../components/ProgressSummaryCards';
import ProgressBarChart from '../components/ProgressBarChart';
import ProgressTable from '../components/ProgressTable';
import { LayoutDashboard, AlertCircle, RefreshCw } from 'lucide-react';

export default function PlannedVsAchievedPage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    periods,
    selectedPeriod,
    setSelectedPeriod,
    dashboardData,
    loading,
    refreshData
  } = useProgressReport();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-96 gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-650 animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Re-stacking progress reports...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Filters */}
      <ProgressHeader
        projects={projects}
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
        periods={periods}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onRefresh={refreshData}
      />

      {selectedProjectId ? (
        <>
          {/* 2. Key Indicator Metrics */}
          <ProgressSummaryCards
            plannedProgress={dashboardData.plannedProgress}
            achievedProgress={dashboardData.achievedProgress}
            overallProgressPercent={dashboardData.overallProgressPercent}
            delayDays={dashboardData.delayDays}
          />

          {/* 3. Graphical Comparison Chart */}
          <ProgressBarChart activityData={dashboardData.activityData} />

          {/* 4. Tabular Breakdowns */}
          <ProgressTable activityData={dashboardData.activityData} />
        </>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 py-12 rounded-2xl flex flex-col justify-center text-center items-center gap-2">
          <AlertCircle className="w-8 h-8 text-slate-350 mx-auto" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            No Active Projects found
          </span>
          <p className="text-[9px] text-slate-400 max-w-xs leading-normal">
            There are currently no active projects created containing planning details or scheduled activities. Add active ones in Project Master.
          </p>
        </div>
      )}
    </div>
  );
}
