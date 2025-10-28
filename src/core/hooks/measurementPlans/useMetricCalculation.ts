import useSWR from "swr";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import type { MetricCalculationResult } from "@/core/types/plans";

interface UseMetricCalculationParams {
  organizationId: string;
  planId: string;
  cycleId: string;
  metricId: string;
  enabled?: boolean;
}

/**
 * Hook for fetching metric calculations with auto-revalidation
 *
 * Auto-revalidates on:
 * - Window focus (when user returns to tab)
 * - Network reconnect
 * - Every 30 seconds (polling)
 *
 * This ensures calculations are always up-to-date when measurements change
 */
export function useMetricCalculation({
  organizationId,
  planId,
  cycleId,
  metricId,
  enabled = true,
}: UseMetricCalculationParams) {
  const key = enabled
    ? `/api/organizations/${organizationId}/measurement-plans/${planId}/cycles/${cycleId}/metrics/${metricId}/calculate`
    : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<MetricCalculationResult>(
    key,
    async () => {
      return measurementPlanService.calculateMetric({
        organizationId,
        planId,
        cycleId,
        metricId,
      });
    },
    {
      // Revalidate when window regains focus
      revalidateOnFocus: true,

      // Revalidate when network reconnects
      revalidateOnReconnect: true,

      // Poll every 30 seconds to catch measurement changes
      refreshInterval: 30000,

      // Don't revalidate on mount if we have cached data
      revalidateOnMount: true,

      // Keep previous data while revalidating
      keepPreviousData: true,

      // Retry on error (with exponential backoff)
      errorRetryCount: 3,
      errorRetryInterval: 5000,

      // Deduplicate requests within 2 seconds
      dedupingInterval: 2000,
    }
  );

  return {
    calculation: data ?? null,
    error: error?.response?.data?.message || error?.message || (error ? "Failed to calculate metric" : null),
    isCalculating: isLoading,
    isRevalidating: isValidating,
    recalculate: mutate, // Manual trigger if needed
  };
}
