"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useEstimate } from "@/core/hooks/fpa/estimates/useEstimate";
import {
  useALIComponents,
  useAIEComponents,
  useEIComponents,
  useEOComponents,
  useEQComponents,
  useComponentActions,
} from "@/core/hooks/fpa/components/useComponents";
import {
  useFPACalculations,
  ComponentDetail,
  ProjectConfig,
} from "@/core/hooks/fpa/calculations/useFPACalculations";
import { CreateALIForm } from "./Forms/CreateALIForm";
import { CreateEIForm } from "./Forms/CreateEIForm";
import { CreateEOForm } from "./Forms/CreateEOForm";
import { CreateEQForm } from "./Forms/CreateEQForm";
import { CreateAIEForm } from "./Forms/CreateAIEForm";
import { GSCDisplay } from "./GSCDisplay";
import { ComponentList } from "./ComponentList";
import { ExportDropdown } from "./ExportDropdown";
import { estimateService } from "@/core/services/estimateService";

type Tab = "overview" | "components" | "gsc" | "calculations" | "analysis";
type ComponentType = "ALI" | "EI" | "EO" | "EQ" | "AIE";

interface EstimateDetailManagerProps {
  estimateId: string;
}

interface EstimateWithConfig {
  name: string;
  description?: string;
  project: { _id: string; name: string };
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  applicationBoundary: string;
  countingScope: string;
  countType: string;

  averageDailyWorkingHours: number;
  teamSize: number;
  hourlyRateBRL: number;
  productivityFactor: number;

  unadjustedFunctionPoints: number;
  adjustedFunctionPoints: number;
  valueAdjustmentFactor?: number;
  totalDegreeOfInfluence: number;
  estimatedEffortHours: number;

  generalSystemCharacteristics?: number[];
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

  const allComponents: ComponentDetail[] = [
    ...aliComponents.map((comp) => ({
      ...comp,
      type: "ALI" as const,
      functionPoints: comp.functionPoints || 0,
      complexity: (comp.complexity || "LOW") as "LOW" | "HIGH" | "MEDIUM",
    })),
    ...aieComponents.map((comp) => ({
      ...comp,
      type: "AIE" as const,
      functionPoints: comp.functionPoints || 0,
      complexity: (comp.complexity || "LOW") as "LOW" | "HIGH" | "MEDIUM",
    })),
    ...eiComponents.map((comp) => ({
      ...comp,
      type: "EI" as const,
      functionPoints: comp.functionPoints || 0,
      complexity: (comp.complexity || "LOW") as "LOW" | "HIGH" | "MEDIUM",
    })),
    ...eoComponents.map((comp) => ({
      ...comp,
      type: "EO" as const,
      functionPoints: comp.functionPoints || 0,
      complexity: (comp.complexity || "LOW") as "LOW" | "HIGH" | "MEDIUM",
    })),
    ...eqComponents.map((comp) => ({
      ...comp,
      type: "EQ" as const,
      functionPoints: comp.functionPoints || 0,
      complexity: (comp.complexity || "LOW") as "LOW" | "HIGH" | "MEDIUM",
    })),
  ];

  const projectConfig: ProjectConfig = estimate
    ? {
        averageDailyWorkingHours:
          (estimate as unknown as EstimateWithConfig)
            .averageDailyWorkingHours || 8,
        teamSize: (estimate as unknown as EstimateWithConfig).teamSize || 4,
        hourlyRateBRL:
          (estimate as unknown as EstimateWithConfig).hourlyRateBRL || 150,
        productivityFactor:
          (estimate as unknown as EstimateWithConfig).productivityFactor || 10,
        generalSystemCharacteristics: (
          estimate as unknown as EstimateWithConfig
        ).generalSystemCharacteristics,
      }
    : {
        averageDailyWorkingHours: 8,
        teamSize: 4,
        hourlyRateBRL: 150,
        productivityFactor: 10,
      };

  const calculations = useFPACalculations(allComponents, projectConfig, t);

  if (isLoadingEstimate) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary">Loading estimate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !estimate) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-default mb-2">
            Estimate Not Found
          </h3>
          <p className="text-secondary mb-4">
            The estimate you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <button
            onClick={() => router.push("/fpa")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Back to FPA
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FINALIZED":
        return "bg-green-100 text-green-800 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DRAFT":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "ARCHIVED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "text-green-600 bg-green-50";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50";
      case "HIGH":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleComponentAdded = () => {
    setSelectedComponentType(null);
    mutateEstimate();
    mutateALI();
    mutateAIE();
    mutateEI();
    mutateEO();
    mutateEQ();
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
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
              <h1 className="text-2xl font-bold text-gray-900">
                {estimate.name}
              </h1>
              {estimate.project && (
                <p className="text-gray-600">{estimate.project.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ExportDropdown
              estimateId={estimateId}
              estimateName={estimate.name}
            />
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                estimate.status
              )}`}
            >
              {t(`status.${estimate.status.toLowerCase()}`)}
            </span>
            <span className="text-sm text-gray-500">v{estimate.version}</span>
          </div>
        </div>
        <p className="text-gray-600 mt-2">{estimate.description}</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: t("detailTabs.overview") },
            { id: "components", label: t("detailTabs.components") },
            { id: "gsc", label: t("detailTabs.gsc") },
            { id: "calculations", label: t("detailTabs.calculations") },
            { id: "analysis", label: t("detailTabs.analysis") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-700">
                {t("overview.functionPoints")}
              </div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {calculations.pfa.toFixed(1)} PFA
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {calculations.pfna} PFNA × {calculations.fa.toFixed(2)} FA
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm font-medium text-green-700">
                {t("overview.totalEffort")}
              </div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                {calculations.effortHours.toFixed(0)}h
              </div>
              <div className="text-xs text-green-600 mt-1">
                {calculations.durationDays.toFixed(1)} {t("overview.days")}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm font-medium text-yellow-700">
                {t("overview.totalCost")}
              </div>
              <div className="text-2xl font-bold text-yellow-900 mt-1">
                {formatCurrency(calculations.totalCost)}
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                {formatCurrency(calculations.costPerFunctionPoint)}/FP
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
              <div className="text-sm font-medium text-orange-700">
                {t("overview.projectRisk")}
              </div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  calculations.riskAnalysis.overallRisk === "HIGH"
                    ? "text-red-900"
                    : calculations.riskAnalysis.overallRisk === "MEDIUM"
                    ? "text-orange-900"
                    : "text-green-900"
                }`}
              >
                {t(
                  `analysis.riskLevels.${calculations.riskAnalysis.overallRisk.toLowerCase()}`
                )}
              </div>
              <div className="text-xs text-orange-600 mt-1">
                {calculations.durationMonths.toFixed(1)} {t("overview.months")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("overview.projectConfiguration")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">
                    {t("overview.teamSize")}
                  </div>
                  <div className="font-medium">
                    {projectConfig.teamSize} {t("overview.people")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {t("overview.dailyHours")}
                  </div>
                  <div className="font-medium">
                    {projectConfig.averageDailyWorkingHours}h
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {t("overview.hourlyRate")}
                  </div>
                  <div className="font-medium">
                    R$ {projectConfig.hourlyRateBRL.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {t("overview.productivity")}
                  </div>
                  <div className="font-medium">
                    {projectConfig.productivityFactor}
                    {t("overview.hoursPerFP")}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("overview.componentSummary")}
              </h3>
              <div className="space-y-2">
                {Object.entries(calculations.componentBreakdown).map(
                  ([type, data]) =>
                    type !== "total" && (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {type.toUpperCase()}
                        </span>
                        <span className="font-medium">
                          {data.count} {t("overview.totalComponents")} (
                          {data.points} FP)
                        </span>
                      </div>
                    )
                )}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span>{t("calculations.totalComponents")}</span>
                    <span>
                      {calculations.componentBreakdown.total.count}{" "}
                      {t("overview.totalComponents")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {t("overview.productivityMetrics")}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  calculations.productivityMetrics.industryComparison
                    .productivityRating === "HIGH"
                    ? "bg-green-100 text-green-800"
                    : calculations.productivityMetrics.industryComparison
                        .productivityRating === "LOW"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {calculations.productivityMetrics.industryComparison
                  .productivityRating === "HIGH"
                  ? t("overview.high")
                  : calculations.productivityMetrics.industryComparison
                      .productivityRating === "LOW"
                  ? t("overview.low")
                  : t("overview.average")}{" "}
                {t("overview.performance")}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {calculations.productivityMetrics.hoursPerFunctionPoint.toFixed(
                    1
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {t("overview.hoursPerFP")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {calculations.productivityMetrics.functionPointsPerDay.toFixed(
                    1
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {t("overview.fpPerDay")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {(
                    calculations.productivityMetrics.teamEfficiency * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-sm text-gray-600">
                  {t("overview.teamEfficiency")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "components" && (
        <div className="space-y-6">
          {!selectedComponentType ? (
            <>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("components.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      type: "ALI" as ComponentType,
                      label: t("components.addALIComponents"),
                      desc: t("components.applicationLogicalInternalFiles"),
                    },
                    {
                      type: "EI" as ComponentType,
                      label: t("components.addEIComponents"),
                      desc: t("components.externalInputs"),
                    },
                    {
                      type: "EO" as ComponentType,
                      label: t("components.addEOComponents"),
                      desc: t("components.externalOutputs"),
                    },
                    {
                      type: "EQ" as ComponentType,
                      label: t("components.addEQComponents"),
                      desc: t("components.externalQueries"),
                    },
                    {
                      type: "AIE" as ComponentType,
                      label: t("components.addAIEComponents"),
                      desc: t("components.applicationInterfaceExternalFiles"),
                    },
                  ].map(({ type, label, desc }) => (
                    <button
                      key={type}
                      onClick={() => setSelectedComponentType(type)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">
                        {label}
                      </h3>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComponentList
                  title={t("components.internalLogicalFiles")}
                  components={aliComponents}
                  componentType="ALI"
                  onDelete={(id) => handleDeleteComponent(id, "ALI")}
                  isLoading={isLoadingALI}
                />

                <ComponentList
                  title={t("components.externalInterfaceFiles")}
                  components={aieComponents}
                  componentType="AIE"
                  onDelete={(id) => handleDeleteComponent(id, "AIE")}
                  isLoading={isLoadingAIE}
                />

                <ComponentList
                  title={t("components.externalInputsEI")}
                  components={eiComponents}
                  componentType="EI"
                  onDelete={(id) => handleDeleteComponent(id, "EI")}
                  isLoading={isLoadingEI}
                />

                <ComponentList
                  title={t("components.externalOutputsEO")}
                  components={eoComponents}
                  componentType="EO"
                  onDelete={(id) => handleDeleteComponent(id, "EO")}
                  isLoading={isLoadingEO}
                />

                <ComponentList
                  title={t("components.externalQueriesEQ")}
                  components={eqComponents}
                  componentType="EQ"
                  onDelete={(id) => handleDeleteComponent(id, "EQ")}
                  isLoading={isLoadingEQ}
                />
              </div>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="mb-4">
                <button
                  onClick={() => {
                    setSelectedComponentType(null);
                  }}
                  className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  ← {t("workflow.backToComponentTypes")}
                </button>
              </div>

              {selectedComponentType === "ALI" && (
                <CreateALIForm
                  estimateId={estimateId}
                  onSuccess={handleComponentAdded}
                />
              )}
              {selectedComponentType === "EI" && (
                <CreateEIForm
                  estimateId={estimateId}
                  onSuccess={handleComponentAdded}
                />
              )}
              {selectedComponentType === "EO" && (
                <CreateEOForm
                  estimateId={estimateId}
                  onSuccess={handleComponentAdded}
                />
              )}
              {selectedComponentType === "EQ" && (
                <CreateEQForm
                  estimateId={estimateId}
                  onSuccess={handleComponentAdded}
                />
              )}
              {selectedComponentType === "AIE" && (
                <CreateAIEForm
                  estimateId={estimateId}
                  onSuccess={handleComponentAdded}
                />
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "gsc" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <GSCDisplay
            estimate={estimate}
            onUpdate={async (generalSystemCharacteristics) => {
              try {
                await estimateService.updateEstimate({
                  id: estimate._id,
                  data: { generalSystemCharacteristics },
                });
                mutateEstimate();
              } catch (error) {
                console.error("Failed to update GSC:", error);
              }
            }}
          />
        </div>
      )}

      {activeTab === "calculations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t("calculations.title")}
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("calculations.totalDegreeOfInfluence")}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {estimate.totalDegreeOfInfluence}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("calculations.valueAdjustmentFactor")}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {estimate.valueAdjustmentFactor?.toFixed(3)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("calculations.unadjustedFunctionPoints")}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {estimate.unadjustedFunctionPoints}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  {t("calculations.adjustedFunctionPoints")}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-indigo-600">
                  {estimate.adjustedFunctionPoints}
                </dd>
              </div>
              {estimate.productivityFactor && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("calculations.productivityFactor")}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {estimate.productivityFactor}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t("calculations.componentBreakdown")}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {t("components.internalLogicalFiles")}
                </span>
                <span className="font-medium">
                  {aliComponents.length} {t("components.components")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {t("components.externalInterfaceFiles")}
                </span>
                <span className="font-medium">
                  {aieComponents.length} {t("components.components")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {t("components.externalInputsEI")}
                </span>
                <span className="font-medium">
                  {eiComponents.length} {t("components.components")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {t("components.externalOutputsEO")}
                </span>
                <span className="font-medium">
                  {eoComponents.length} {t("components.components")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {t("components.externalQueriesEQ")}
                </span>
                <span className="font-medium">
                  {eqComponents.length} {t("components.components")}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>{t("calculations.totalComponents")}</span>
                  <span>
                    {aliComponents.length +
                      aieComponents.length +
                      eiComponents.length +
                      eoComponents.length +
                      eqComponents.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analysis" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t("analysis.title")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">
                  {t("analysis.riskFactors")}
                </h4>
                <div className="space-y-3">
                  {Object.entries(calculations.riskAnalysis.factors).map(
                    ([factor, data]) => (
                      <div
                        key={factor}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 capitalize">
                          {t(`analysis.${factor}`) ||
                            factor.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${getRiskColor(
                              data.risk
                            )}`}
                          >
                            {t(
                              `analysis.riskLevels.${data.risk.toLowerCase()}`
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">
                  {t("analysis.recommendations")}
                </h4>
                <ul className="space-y-2">
                  {calculations.riskAnalysis.recommendations.map(
                    (rec, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start"
                      >
                        <span className="text-indigo-500 mr-2">•</span>
                        {rec}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("analysis.phaseBreakdown")}
              </h3>
              <div className="space-y-3">
                {Object.entries(calculations.phaseBreakdown).map(
                  ([phase, data]) => (
                    <div
                      key={phase}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {t(`analysis.${phase}`) || phase}
                      </span>
                      <div className="text-right">
                        <div className="font-medium">
                          {data.hours.toFixed(0)}h
                        </div>
                        <div className="text-xs text-gray-500">
                          {data.percentage}%
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("analysis.costBreakdown")}
              </h3>
              <div className="space-y-3">
                {Object.entries(calculations.costBreakdown).map(
                  ([category, data]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {t(`analysis.${category}`) || category}
                      </span>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(typeof data === "number" ? data : 0)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {category === "total" ? "100%" : ""}
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{t("analysis.total")}</span>
                    <span>{formatCurrency(calculations.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
