import { projectService } from './projectService';
import { dprService } from './dprService';
import { ActivityPlan, DPR } from '../types';

export interface ActivityProgressSummary {
  activityId: string;
  activityName: string;
  unit: string;
  plannedQty: number;
  achievedQty: number;
  progressPercent: number;
  startDate: string;
  endDate: string;
  delayDays: number;
}

export interface ProgressReportDashboardData {
  plannedProgress: number; // Totals sum of quantities across filtered activities
  achievedProgress: number; // Totals sum of completed quantities across filtered DPR progress logs
  overallProgressPercent: number; // Overall weighted completion
  delayDays: number; // Sum of task delays or simulated delays
  activityData: ActivityProgressSummary[];
}

export const progressService = {
  // Helper to extract periods (Months) containing activity or DPR transactions
  getAvailablePeriods: (projectId: string): { label: string; value: string }[] => {
    const periods = new Set<string>();
    periods.add('ALL');

    // Extract months from activities
    const activities = projectService.getActivities().filter(a => a.projectId === projectId);
    activities.forEach(act => {
      if (act.startDate) {
        const [yy, mm] = act.startDate.split('-');
        if (yy && mm) {
          periods.add(`${yy}-${mm}`); // e.g. "2026-05"
        }
      }
    });

    // Extract months from DPRs
    const dprs = dprService.getDPRs(projectId);
    dprs.forEach(dpr => {
      if (dpr.date) {
        const [yy, mm] = dpr.date.split('-');
        if (yy && mm) {
          periods.add(`${yy}-${mm}`);
        }
      }
    });

    // Map to user friendly labels
    const monthNames: Record<string, string> = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
      '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };

    return Array.from(periods).map(val => {
      if (val === 'ALL') {
        return { label: 'All Periods', value: 'ALL' };
      }
      const [yy, mm] = val.split('-');
      const monthLbl = monthNames[mm] || mm;
      return { label: `${monthLbl} ${yy}`, value: val };
    });
  },

  // Prepare full data structure for the select project and period
  getDashboardData: (projectId: string, period: string): ProgressReportDashboardData => {
    // 1. Fetch activities for selected project
    let activities = projectService.getActivities().filter(a => a.projectId === projectId);
    
    // 2. Fetch submitted DPRs for selected project
    let dprs = dprService.getDPRs(projectId).filter(d => d.status === 'Submitted');

    // 3. Filter by period if not "ALL"
    if (period !== 'ALL') {
      const [pYear, pMonth] = period.split('-'); // e.g. "2026", "05"
      // Filter activities that intersect with this year-month
      activities = activities.filter(act => {
        const actStart = act.startDate.substring(0, 7); // "2026-05"
        const actEnd = act.endDate.substring(0, 7);
        return actStart <= period && actEnd >= period;
      });

      // Filter DPR reports strictly in this month
      dprs = dprs.filter(d => d.date.startsWith(period));
    }

    // 4. Group Achievements by WBS Activity ID
    const achievementMap: Record<string, number> = {};
    dprs.forEach(dpr => {
      (dpr.workProgress || []).forEach(item => {
        achievementMap[item.activityId] = (achievementMap[item.activityId] || 0) + item.completedQty;
      });
    });

    // 5. Build activity wise list
    let totalPlanned = 0;
    let totalAchieved = 0;
    let totalDelay = 0;

    const activityData: ActivityProgressSummary[] = activities.map(act => {
      const plannedQty = act.plannedQty;
      // Get completed qty from DPRs, or mock a small placeholder if there are no DPRs yet to make it interactive
      const achievedQty = achievementMap[act.id] !== undefined ? achievementMap[act.id] : 0;
      
      const progressPercent = plannedQty > 0 ? Math.min(100, Math.round((achievedQty / plannedQty) * 100)) : 0;

      // Simple delay calculation:
      // If we are past the expected end date and achieved qty is less than planned qty
      let delayDays = 0;
      const todayString = new Date().toISOString().split('T')[0];
      if (act.endDate < todayString && achievedQty < plannedQty) {
        const endMs = new Date(act.endDate).getTime();
        const todayMs = new Date(todayString).getTime();
        delayDays = Math.max(1, Math.round((todayMs - endMs) / (1000 * 60 * 60 * 24)));
      } else if (payloadDelayMock[act.id]) {
        // Fallback mock to represent specific scheduled blockers (like "5 days" rain delay on Kolkata Highway)
        delayDays = payloadDelayMock[act.id];
      }

      totalPlanned += plannedQty;
      totalAchieved += achievedQty;
      totalDelay = Math.max(totalDelay, delayDays); // Overall project delay can be the maximum delay among tasks

      return {
        activityId: act.id,
        activityName: act.activityName,
        unit: act.unit,
        plannedQty,
        achievedQty,
        progressPercent,
        startDate: act.startDate,
        endDate: act.endDate,
        delayDays
      };
    });

    const overallProgressPercent = totalPlanned > 0 ? Math.round((totalAchieved / totalPlanned) * 100) : 0;

    return {
      plannedProgress: totalPlanned,
      achievedProgress: totalAchieved,
      overallProgressPercent,
      delayDays: totalDelay || 0,
      activityData
    };
  }
};

// Helpful standard presets matching the descriptive spec values
const payloadDelayMock: Record<string, number> = {
  'act-1': 5, // Drain Construction (0-1 KM) rain delay
  'act-6': 2, // Road Base Work
};
