"use client";

import { useState } from "react";
import { useFPA } from "@/core/hooks/fpa/useFPA";
import type { FPATab } from "./common/FPATabs";
import { FPATabs, FPAPageHeader, OrganizationAlert } from "./common";
import { OverviewTab, EstimatesTab, ReferenceTab } from "./common/Tabs";
import { Estimate } from "@/core/types/fpa";

export const FPAView: React.FC = () => {
  const {
    estimates,
    statistics,
    functionTypes,
    complexityLevels,

    isLoadingEstimates,
    isCreatingEstimate,

    canCreateEstimate,
    hasOrganization,

    estimateForm,
    formErrors,

    createEstimate,
    deleteEstimate,
    duplicateEstimate,

    formatDate,
    getStatusColor,
  } = useFPA();

  const [activeTab, setActiveTab] = useState<FPATab>("overview");

  const handleTabChange = (tab: FPATab) => {
    setActiveTab(tab);
  };

  const handleEditEstimate = (estimate: Estimate) => {
    console.log("Edit estimate:", estimate);
  };

  const renderTabContent = () => {
    const tabComponents = {
      overview: (
        <OverviewTab
          statistics={statistics}
          canCreateEstimate={canCreateEstimate}
          isCreatingEstimate={isCreatingEstimate}
          estimateForm={estimateForm}
          formErrors={formErrors}
          onCreateEstimate={createEstimate}
        />
      ),
      estimates: (
        <EstimatesTab
          estimates={estimates}
          isLoadingEstimates={isLoadingEstimates}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          onEditEstimate={handleEditEstimate}
          onDeleteEstimate={deleteEstimate}
          onDuplicateEstimate={duplicateEstimate}
        />
      ),
      reference: (
        <ReferenceTab
          functionTypes={functionTypes}
          complexityLevels={complexityLevels}
        />
      ),
    } as const;

    return tabComponents[activeTab as keyof typeof tabComponents] || null;
  };

  if (isLoadingEstimates && !estimates) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-background-secondary rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-background-secondary rounded w-1/2"></div>
        </div>
        <div className="animate-pulse bg-background-secondary h-64 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FPAPageHeader
        organizationName="Current Organization"
        hasOrganization={hasOrganization}
        isLoadingOrganization={false}
      />

      <OrganizationAlert hasOrganization={hasOrganization} />

      <div className="space-y-6">
        <FPATabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasOrganization={hasOrganization}
        />

        {renderTabContent()}
      </div>
    </div>
  );
};
