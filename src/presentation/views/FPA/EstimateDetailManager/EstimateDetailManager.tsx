"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  useEstimate,
  useEstimateOverview,
} from "@/core/hooks/fpa/estimates/useEstimate";
import {
  useALIComponents,
  useAIEComponents,
  useEIComponents,
  useEOComponents,
  useEQComponents,
  useComponentActions,
} from "@/core/hooks/fpa/components/useComponents";
import { ExportDropdown } from "@/presentation/views/FPA/common/ExportDropdown";
import {
  EstimateOverviewTab,
  ComponentsTab,
  CostsTab,
  GSCTab,
  CalculationsTab,
} from "./tabs";

type Tab = "overview" | "components" | "costs" | "gsc" | "calculations";
type ComponentType = "ALI" | "EI" | "EO" | "EQ" | "AIE";

interface EstimateDetailManagerProps {
  estimateId: string;
}

export const EstimateDetailManager = ({
  estimateId,
}: EstimateDetailManagerProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedComponentType, setSelectedComponentType] =
    useState<ComponentType | null>(null);

  const { estimate, error, isLoadingEstimate, mutateEstimate } = useEstimate({
    id: estimateId,
  });

  const {
    estimateOverview,
    error: overviewError,
    isLoadingEstimateOverview,
    mutateEstimateOverview,
  } = useEstimateOverview({
    id: estimateId,
  });

  const {
    components: aliComponents,
    isLoading: isLoadingALI,
    mutateComponents: mutateALI,
  } = useALIComponents(estimateId);
  const {
    components: aieComponents,
    isLoading: isLoadingAIE,
    mutateComponents: mutateAIE,
  } = useAIEComponents(estimateId);
  const {
    components: eiComponents,
    isLoading: isLoadingEI,
    mutateComponents: mutateEI,
  } = useEIComponents(estimateId);
  const {
    components: eoComponents,
    isLoading: isLoadingEO,
    mutateComponents: mutateEO,
  } = useEOComponents(estimateId);
  const {
    components: eqComponents,
    isLoading: isLoadingEQ,
    mutateComponents: mutateEQ,
  } = useEQComponents(estimateId);

  const {
    deleteALIComponent,
    deleteAIEComponent,
    deleteEIComponent,
    deleteEOComponent,
    deleteEQComponent,
  } = useComponentActions();

  if (error || overviewError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t("errors.loadingTitle")}
          </h2>
          <p className="text-red-600 mb-4">{t("errors.loadingMessage")}</p>
          <button
            onClick={() => router.push("/fpa")}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {t("actions.cancel")}
          </button>
        </div>
      </div>
    );
  }

  if (
    (isLoadingEstimate || !estimate) &&
    (isLoadingEstimateOverview || !estimateOverview)
  ) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-background-secondary rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-background-secondary rounded w-1/2 mb-6"></div>
          </div>
          <div className="animate-pulse bg-background-secondary h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const currentData = estimateOverview || estimate;
  if (!currentData) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: "bg-background-secondary text-muted border-border",
      IN_PROGRESS: "bg-primary/10 text-primary border-primary/20",
      FINALIZED: "bg-green-50 text-green-700 border-green-200",
      ARCHIVED: "bg-background-secondary text-muted border-border",
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  const handleComponentAdded = () => {
    setSelectedComponentType(null);
    mutateALI();
    mutateAIE();
    mutateEI();
    mutateEO();
    mutateEQ();
    mutateEstimate();
    mutateEstimateOverview();
  };

  const handleDeleteComponent = async (
    componentId: string,
    componentType: ComponentType
  ) => {
    try {
      switch (componentType) {
        case "ALI":
          await deleteALIComponent(estimateId, componentId);
          mutateALI();
          break;
        case "AIE":
          await deleteAIEComponent(estimateId, componentId);
          mutateAIE();
          break;
        case "EI":
          await deleteEIComponent(estimateId, componentId);
          mutateEI();
          break;
        case "EO":
          await deleteEOComponent(estimateId, componentId);
          mutateEO();
          break;
        case "EQ":
          await deleteEQComponent(estimateId, componentId);
          mutateEQ();
          break;
      }
      mutateEstimate();
      mutateEstimateOverview();
    } catch (error) {
      console.error("Failed to delete component:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/fpa")}
              className="p-2 text-muted hover:text-secondary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-default">
                {currentData.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ExportDropdown
              estimateId={estimateId}
              estimateName={currentData.name}
            />
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                currentData.status
              )}`}
            >
              {t(`status.${currentData.status.toLowerCase()}`)}
            </span>
            <span className="text-sm text-muted">v{currentData.version}</span>
          </div>
        </div>
        <p className="text-secondary mt-2">{currentData.description}</p>
      </div>

      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: t("detailTabs.overview") },
            { id: "components", label: t("detailTabs.components") },
            { id: "costs", label: t("detailTabs.costs") },
            { id: "gsc", label: t("detailTabs.gsc") },
            { id: "calculations", label: t("detailTabs.calculations") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-secondary hover:border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "overview" && (
        <EstimateOverviewTab
          estimateOverview={estimateOverview}
          isLoadingEstimateOverview={isLoadingEstimateOverview}
          overviewError={overviewError}
        />
      )}

      {activeTab === "components" && (
        <ComponentsTab
          estimateId={estimateId}
          selectedComponentType={selectedComponentType}
          setSelectedComponentType={setSelectedComponentType}
          aliComponents={aliComponents || []}
          aieComponents={aieComponents || []}
          eiComponents={eiComponents || []}
          eoComponents={eoComponents || []}
          eqComponents={eqComponents || []}
          isLoadingALI={isLoadingALI}
          isLoadingAIE={isLoadingAIE}
          isLoadingEI={isLoadingEI}
          isLoadingEO={isLoadingEO}
          isLoadingEQ={isLoadingEQ}
          onDeleteComponent={handleDeleteComponent}
          onComponentAdded={handleComponentAdded}
        />
      )}

      {activeTab === "costs" && estimateOverview && (
        <CostsTab estimateOverview={estimateOverview} />
      )}

      {activeTab === "gsc" && estimateOverview && (
        <GSCTab
          estimateOverview={estimateOverview}
          onUpdate={() => {
            mutateEstimate();
            mutateEstimateOverview();
          }}
        />
      )}

      {activeTab === "calculations" && estimateOverview && (
        <CalculationsTab estimateOverview={estimateOverview} />
      )}
    </div>
  );
};
