/**
 * Timeline & Delivery Engine
 * Computes calendar duration, Gantt phase schedules, and deadline feasibility.
 */

import { ESTIMATION_CONFIG } from '../../config/estimationConfig.js';

export const calculateProjectTimeline = (totalEffortHours, resourceData, project = {}) => {
  const { workingHours, phases } = ESTIMATION_CONFIG;
  const { totalHeadcount, resources } = resourceData;

  // Active core development engineers (Frontend + Backend + FullStack + QA)
  const coreEngineers = resources
    .filter((r) => r.roleId.includes('dev') || r.roleId.includes('developer') || r.roleId.includes('qa'))
    .reduce((sum, r) => sum + r.quantity, 0) || 2;

  // Team capacity per week accounting for parallel efficiency factor (0.75)
  // 40 hours per week × core engineers × 0.75 efficiency
  const effectiveTeamHoursPerWeek = coreEngineers * workingHours.hoursPerWeek * workingHours.teamEfficiencyFactor;

  // Base calendar weeks for core implementation
  const rawWeeks = totalEffortHours / effectiveTeamHoursPerWeek;

  // Add sequential phase buffers (e.g., initial analysis and final deployment cannot be fully parallelized)
  const sequentialPhaseOverheadWeeks = 2.0;
  const totalWeeks = Math.max(3, Math.round((rawWeeks + sequentialPhaseOverheadWeeks) * 10) / 10);
  const totalMonths = Math.round((totalWeeks / 4.33) * 10) / 10;
  const totalWorkingDays = Math.round(totalWeeks * workingHours.daysPerWeek);
  const totalSprints = Math.ceil(totalWeeks / 2); // 2-week agile sprints

  // Build sequential & overlapping phase schedule
  let currentStartWeek = 0;

  const phaseSchedule = phases.map((phase) => {
    // Hours allocated to this phase based on share
    const phaseHours = Math.round(totalEffortHours * phase.effortShare);

    // Phase duration in weeks
    // Some phases like Design or Testing use dedicated personnel
    let phaseWeeks = Math.max(0.5, Math.round((phaseHours / (workingHours.hoursPerWeek * 1.5)) * 10) / 10);
    if (phase.id === 'backend_dev' || phase.id === 'frontend_dev') {
      phaseWeeks = Math.max(2, Math.round(totalWeeks * 0.65 * 10) / 10);
    }

    const startWeek = currentStartWeek;
    const endWeek = Math.round((startWeek + phaseWeeks) * 10) / 10;

    // Increment start with partial overlap for fast-tracking
    if (phase.id === 'req_analysis') currentStartWeek = 1.0;
    else if (phase.id === 'ui_ux_design') currentStartWeek = 2.0;
    else if (phase.id === 'db_architecture') currentStartWeek = 2.5;
    else if (phase.id === 'backend_dev') currentStartWeek = 3.5;
    else if (phase.id === 'frontend_dev') currentStartWeek = 4.5;
    else if (phase.id === 'integrations') currentStartWeek = Math.max(4.0, totalWeeks - 5.0);
    else if (phase.id === 'qa_testing') currentStartWeek = Math.max(5.0, totalWeeks - 3.5);
    else if (phase.id === 'devops_deployment') currentStartWeek = Math.max(6.0, totalWeeks - 1.5);
    else currentStartWeek = Math.max(6.5, totalWeeks - 1.0);

    return {
      id: phase.id,
      name: phase.name,
      description: phase.description,
      roles: phase.roles,
      hours: phaseHours,
      startWeek: Math.round(startWeek * 10) / 10,
      endWeek: Math.min(totalWeeks, Math.round(endWeek * 10) / 10),
      durationWeeks: phaseWeeks,
      dependencies: phase.dependencies,
    };
  });

  // Deadline Feasibility Check (if user specified requested timeline in project)
  const requestedTimelineInput = (project.requestedTimelineWeeks !== undefined && project.requestedTimelineWeeks !== null && project.requestedTimelineWeeks !== '')
    ? `${project.requestedTimelineWeeks} weeks`
    : (project.requestedTimeline || project.targetDeadline || '');
  let deadlineCheck = null;

  if (requestedTimelineInput) {
    // Parse requested weeks or months
    let requestedWeeks = 0;
    const textLower = requestedTimelineInput.toLowerCase();
    const numbers = textLower.match(/\d+(\.\d+)?/);
    const parsedNum = numbers ? parseFloat(numbers[0]) : 0;

    if (textLower.includes('month')) {
      requestedWeeks = parsedNum * 4.33;
    } else if (textLower.includes('week')) {
      requestedWeeks = parsedNum;
    } else if (textLower.includes('day')) {
      requestedWeeks = parsedNum / 5;
    } else if (parsedNum > 0) {
      // Default assume months if <= 12, else weeks
      requestedWeeks = parsedNum <= 12 ? parsedNum * 4.33 : parsedNum;
    }

    if (requestedWeeks > 0) {
      let status = 'Feasible';
      let message = 'Timeline is feasible within the requested schedule.';
      let isAchievable = true;

      if (totalWeeks > requestedWeeks * 1.15) {
        status = 'Infeasible';
        isAchievable = false;
        message = `Timeline may not be feasible: Requested ${Math.round(requestedWeeks)} weeks is below the minimum required ${totalWeeks} weeks based on feature dependencies and team capacity.`;
      } else if (totalWeeks > requestedWeeks) {
        status = 'Tight';
        isAchievable = true;
        message = `Timeline is tight: Estimated ${totalWeeks} weeks slightly exceeds requested ${Math.round(requestedWeeks)} weeks. Low margin for requirement changes.`;
      } else {
        status = 'Feasible';
        isAchievable = true;
        message = `✓ Timeline is feasible: Estimated duration (${totalWeeks} weeks) fits within requested ${Math.round(requestedWeeks)} weeks.`;
      }

      const gapWeeks = Math.round((totalWeeks - requestedWeeks) * 10) / 10;

      deadlineCheck = {
        hasRequestedTimeline: true,
        requestedText: requestedTimelineInput,
        requestedWeeks: Math.round(requestedWeeks * 10) / 10,
        estimatedWeeks: totalWeeks,
        minimumFeasibleWeeks: totalWeeks,
        isAchievable,
        status, // 'Feasible' | 'Tight' | 'Infeasible'
        gapWeeks,
        message,
        recommendations:
          status === 'Infeasible'
            ? [
                'Increase engineering team size with an additional specialist.',
                'De-scope secondary or Important features to Phase 2.',
                'Prioritize strictly Must-Have features on the critical path.',
              ]
            : status === 'Tight'
            ? [
                'Maintain strict 2-week sprint boundaries.',
                'Freeze UI design specifications before sprint kickoff.',
              ]
            : ['Maintain steady sprint milestones to prevent scope churn.'],
      };
    }
  }

  return {
    totalWeeks,
    totalMonths,
    totalWorkingDays,
    totalSprints,
    effectiveTeamHoursPerWeek: Math.round(effectiveTeamHoursPerWeek),
    phases: phaseSchedule,
    deadlineCheck,
  };
};
