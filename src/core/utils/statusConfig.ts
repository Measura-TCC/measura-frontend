import type { EstimateStatus } from "@/core/types/fpa";
import { MeasurementPlanStatus } from "@/core/types/plans";

// Estimate Status Configuration
export const ESTIMATE_STATUS_LABELS: Record<EstimateStatus, string> = {
  draft: "Draft",
  finalized: "Finalized",
  archived: "Archived",
} as const;

export const ESTIMATE_STATUS_COLORS: Record<EstimateStatus, string> = {
  draft: "gray",
  finalized: "green",
  archived: "red",
} as const;

// Measurement Plan Status Configuration
export const PLAN_STATUS_LABELS: Record<MeasurementPlanStatus, string> = {
  [MeasurementPlanStatus.DRAFT]: "Draft",
  [MeasurementPlanStatus.APPROVED]: "Approved",
  [MeasurementPlanStatus.REJECTED]: "Rejected",
  [MeasurementPlanStatus.FINISHED]: "Finished",
} as const;

export const PLAN_STATUS_COLORS: Record<MeasurementPlanStatus, string> = {
  [MeasurementPlanStatus.DRAFT]: "gray",
  [MeasurementPlanStatus.APPROVED]: "green",
  [MeasurementPlanStatus.REJECTED]: "red",
  [MeasurementPlanStatus.FINISHED]: "blue",
} as const;

// Plan Status Transitions
export const PLAN_STATUS_TRANSITIONS: Record<MeasurementPlanStatus, MeasurementPlanStatus[]> = {
  [MeasurementPlanStatus.DRAFT]: [MeasurementPlanStatus.APPROVED, MeasurementPlanStatus.REJECTED],
  [MeasurementPlanStatus.APPROVED]: [MeasurementPlanStatus.FINISHED, MeasurementPlanStatus.DRAFT],
  [MeasurementPlanStatus.REJECTED]: [MeasurementPlanStatus.DRAFT],
  [MeasurementPlanStatus.FINISHED]: [], // No transitions allowed
} as const;

/**
 * Check if a status transition is valid for measurement plans
 */
export function canTransitionTo(
  currentStatus: MeasurementPlanStatus,
  newStatus: MeasurementPlanStatus
): boolean {
  return PLAN_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Get available status transitions for a measurement plan
 */
export function getAvailableTransitions(
  currentStatus: MeasurementPlanStatus
): MeasurementPlanStatus[] {
  return PLAN_STATUS_TRANSITIONS[currentStatus] || [];
}

/**
 * Check if a plan can be deleted based on its status
 */
export function canDeletePlan(status: MeasurementPlanStatus): boolean {
  return status === MeasurementPlanStatus.DRAFT || status === MeasurementPlanStatus.REJECTED;
}

/**
 * Check if a plan can be edited based on its status
 */
export function canEditPlan(status: MeasurementPlanStatus): boolean {
  return status !== MeasurementPlanStatus.FINISHED;
}
