"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useOrganizations } from "@/core/hooks/organizations";
import { useMeasurementPlans } from "@/core/hooks/measurementPlans";
import { useProjects } from "@/core/hooks/projects/useProjects";
import {
  PlanTab,
  MeasurementPlanStatus,
} from "@/core/types/plans";
import { PlansTabs, PlansPageHeader, OrganizationAlert, PlansFilters } from "./components";
import { DocumentIcon } from "@/presentation/assets/icons";
import { NewPlanTab, CreatedPlansTab } from "./components/Tabs";

export const PlansView = () => {
  const { t } = useTranslation("plans");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userOrganization, isLoadingUserOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { projects, isLoadingProjects } = useProjects();
  const [activeTab, setActiveTab] = useState<PlanTab>("newPlan");

  useEffect(() => {
    const tabParam = searchParams.get("tab") as PlanTab;
    if (tabParam && ["newPlan", "createdPlans"].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    const projectParam = searchParams.get("project");
    if (projectParam) {
      setProjectFilter(projectParam);
      setActiveTab("newPlan");
    }
  }, [searchParams]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MeasurementPlanStatus | undefined>();
  const [projectFilter, setProjectFilter] = useState<string | undefined>();

  const plansHook = useMeasurementPlans({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    status: statusFilter,
    projectId: projectFilter,
  });

  const {
    plans,
    pagination,
    statistics,
    isLoadingPlans,
    isCreatingPlan,
    plansError,
    canCreatePlan,
    hasOrganization,
    formatDate,
    getStatusColor,
    operationError,
    clearError,
  } = plansHook;

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (status: MeasurementPlanStatus | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleProjectChange = (projectId: string | undefined) => {
    setProjectFilter(projectId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter(undefined);
    setProjectFilter(undefined);
    setCurrentPage(1);
  };


  const componentMap = {
    newPlan: (
      <NewPlanTab
        statistics={statistics}
        canCreatePlan={canCreatePlan}
        isCreatingPlan={isCreatingPlan}
      />
    ),
    createdPlans: (
      <CreatedPlansTab
        plans={plans}
        isLoadingPlans={isLoadingPlans}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        projects={projects || []}
        pagination={pagination}
        onViewPlan={(planId) => {
          router.push(`/plans/${planId}`);
        }}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
        onPageSizeChange={(pageSize) => {
          setPageSize(pageSize);
          setCurrentPage(1); // Reset to first page when changing page size
        }}
      />
    ),
  };

  if (isLoadingUserOrganization) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          </div>
          <div className="space-y-6">
            <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="space-y-6">
        <PlansPageHeader
          organizationName={userOrganization?.name}
          hasOrganization={hasOrganization}
          isLoadingOrganization={isLoadingUserOrganization}
        />
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-default mb-2">
            Error loading plans
          </h3>
          <p className="text-secondary">{plansError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlansPageHeader
        organizationName={userOrganization?.name}
        hasOrganization={hasOrganization}
        isLoadingOrganization={isLoadingUserOrganization}
      />

      <OrganizationAlert hasOrganization={hasOrganization} />

      {hasOrganization && !isLoadingProjects && (!projects || projects.length === 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="text-center space-y-4">
            <div className="text-blue-500 mb-4">
              <DocumentIcon className="w-12 h-12 mx-auto" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-900">
                {t("noProjectsTitle")}
              </h3>
              <p className="text-blue-700 mt-1">
                {t("noProjectsDescription")}
              </p>
            </div>
            <button
              onClick={() => router.push("/projects")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              {t("goToProjects")}
            </button>
          </div>
        </div>
      )}

      {operationError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Operation Failed</h3>
                <p className="text-sm text-red-700 mt-1">{operationError}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <PlansTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasOrganization={hasOrganization}
      />

      {activeTab === "createdPlans" && hasOrganization && (
        <PlansFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          projectFilter={projectFilter}
          projects={projects?.map(p => ({ id: p._id, name: p.name })) || []}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onProjectChange={handleProjectChange}
          onClearFilters={handleClearFilters}
          isLoading={isLoadingPlans}
        />
      )}

      {componentMap[activeTab]}
    </div>
  );
};
