import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getTranslatedActivities } from "@/presentation/views/Overview/utils/mockActivities";

interface OverviewStatistics {
  totalEstimates: number;
  activeGoals: number;
  completedPlans: number;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  userName: string;
  createdAt: Date;
}

export const useOverview = () => {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const [activities] = useState<Activity[]>(() => getTranslatedActivities(t));
  const [statistics] = useState<OverviewStatistics>({
    totalEstimates: 12,
    activeGoals: 8,
    completedPlans: 5,
  });
  const [isLoadingActivities] = useState(false);
  const [isLoadingStatistics] = useState(false);

  const handleCreateOrganization = useCallback(() => {
    router.push("/organization");
  }, [router]);

  const handleNewFPAEstimate = useCallback(() => {
    router.push("/fpa");
  }, [router]);

  const handleNewMeasurementPlan = useCallback(() => {
    router.push("/plans");
  }, [router]);

  return {
    activities,
    statistics,
    isLoadingActivities,
    isLoadingStatistics,
    handleCreateOrganization,
    handleNewFPAEstimate,
    handleNewMeasurementPlan,
  };
};
