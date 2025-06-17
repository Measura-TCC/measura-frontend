"use client";

import { useState } from "react";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { usePlans } from "@/core/hooks/plans/usePlans";
import {
  PlanTab,
  Plan,
  PlanType,
  GQMGoal,
  GQMQuestion,
  GQMMetric,
} from "@/core/types/plans";
import { PlansTabs, PlansPageHeader, OrganizationAlert } from "./components";
import { OverviewTab, PlansTab, TemplatesTab, GQMTab } from "./components/Tabs";

export const PlansView = () => {
  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();
  const plansHook = usePlans();
  const [activeTab, setActiveTab] = useState<PlanTab>("overview");
  const [selectedPlanForGQM, setSelectedPlanForGQM] = useState<string>("");

  const {
    plans,
    templates,
    statistics,
    isLoadingPlans,
    isCreatingPlan,
    plansError,
    canCreatePlan,
    hasOrganization,
    planForm,
    formErrors,
    createPlan,
    deletePlan,
    duplicatePlan,
    applyTemplate,
    getGQMDataForPlan,
    formatDate,
    getStatusColor,
    getTypeLabel,
  } = plansHook;

  const handleCreateGoal = async (goalData: Partial<GQMGoal>) => {
    console.log("Create goal:", goalData);
  };

  const handleCreateQuestion = async (questionData: Partial<GQMQuestion>) => {
    console.log("Create question:", questionData);
  };

  const handleCreateMetric = async (metricData: Partial<GQMMetric>) => {
    console.log("Create metric:", metricData);
  };

  const handleCompleteStep = async (step: number) => {
    console.log("Complete step:", step);
  };

  const componentMap = {
    overview: (
      <OverviewTab
        statistics={statistics}
        canCreatePlan={canCreatePlan}
        isCreatingPlan={isCreatingPlan}
        planForm={planForm}
        formErrors={formErrors}
        onCreatePlan={createPlan}
      />
    ),
    plans: (
      <PlansTab
        plans={plans}
        isLoadingPlans={isLoadingPlans}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        getTypeLabel={(type: string) => getTypeLabel(type as PlanType)}
        onEditPlan={(plan: Plan) => console.log("Edit plan:", plan)}
        onDeletePlan={deletePlan}
        onDuplicatePlan={duplicatePlan}
        onManageGQM={(plan: Plan) => {
          setSelectedPlanForGQM(plan.id);
          setActiveTab("gqm");
        }}
      />
    ),
    templates: (
      <TemplatesTab
        templates={templates}
        canCreatePlan={canCreatePlan}
        onApplyTemplate={applyTemplate}
      />
    ),
    gqm: (
      <GQMTab
        plans={plans}
        selectedPlanId={selectedPlanForGQM}
        gqmData={getGQMDataForPlan(selectedPlanForGQM)}
        onSelectPlan={setSelectedPlanForGQM}
        onCreateGoal={handleCreateGoal}
        onCreateQuestion={handleCreateQuestion}
        onCreateMetric={handleCreateMetric}
        onCompleteStep={handleCompleteStep}
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

      <PlansTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasOrganization={hasOrganization}
      />

      {componentMap[activeTab]}
    </div>
  );
};
