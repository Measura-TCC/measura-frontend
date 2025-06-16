"use client";

import { useRouter } from "next/navigation";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { useOverview } from "@/core/hooks/overview/useOverview";
import {
  OverviewPageHeader,
  OrganizationAlert,
  DashboardSection,
  QuickActionsSection,
  StatisticsSection,
  OrganizationSection,
  RoleSection,
  ActivitySection,
} from "./components";

interface OverviewViewProps {
  user: {
    name: string;
    role: string;
  };
}

export const OverviewView: React.FC<OverviewViewProps> = ({ user }) => {
  const router = useRouter();
  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();
  const overviewHook = useOverview();

  const {
    activities,
    statistics,
    isLoadingActivities,
    isLoadingStatistics,
    handleCreateOrganization,
    handleNewFPAEstimate,
    handleNewMeasurementPlan,
  } = overviewHook;

  if (isLoadingUserOrganization) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverviewPageHeader
        user={user}
        organizationName={userOrganization?.name}
        organizationDescription={userOrganization?.description}
        hasOrganization={!!userOrganization}
        isLoadingOrganization={isLoadingUserOrganization}
      />

      <OrganizationAlert
        hasOrganization={!!userOrganization}
        onCreateOrganization={handleCreateOrganization}
      />

      <DashboardSection>
        <QuickActionsSection
          hasOrganization={!!userOrganization}
          onNewFPAEstimate={handleNewFPAEstimate}
          onNewMeasurementPlan={handleNewMeasurementPlan}
        />

        <StatisticsSection
          statistics={statistics}
          isLoadingStatistics={isLoadingStatistics}
        />

        <OrganizationSection
          userOrganization={userOrganization}
          isLoadingUserOrganization={isLoadingUserOrganization}
          onCreateOrganization={handleCreateOrganization}
          onManageOrganization={() => router.push("/organization")}
        />

        <RoleSection user={user} />
      </DashboardSection>

      <ActivitySection
        activities={activities}
        isLoadingActivities={isLoadingActivities}
      />
    </div>
  );
};
