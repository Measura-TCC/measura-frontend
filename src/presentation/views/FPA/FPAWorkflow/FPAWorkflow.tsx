"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { useOrganizations } from "@/core/hooks/organizations";
import { EstimatesDashboard } from "./EstimatesDashboard";
import { CreateProjectForm } from "../../Projects/components/CreateProjectForm";
import { OrganizationAlert } from "@/presentation/components/shared/OrganizationAlert";
import { NoProjectsAlert } from "@/presentation/components/shared/NoProjectsAlert";
import { CreateEstimateForm } from "./components/CreateEstimateForm";
import { CreateGSCForm } from "./components/CreateGSCForm";
import { ProjectConfigurationForm } from "./components/ProjectConfigurationForm";
import { RequirementImportView } from "./RequirementImport/RequirementImportView";
import type { EstimateResponse } from "@/core/services/fpa/estimates";
import { Button, Tabs, Stepper } from "@/presentation/components/primitives";
import { useEstimateActions } from "@/core/hooks/fpa/estimates/useEstimate";
import {
  useFPAWorkflowStore,
  type Step,
  type EstimateFormData,
} from "@/core/hooks/fpa/useFPAWorkflowStore";
import { useRequirementsStore } from "@/core/hooks/fpa/useRequirementsStore";
import { estimateService } from "@/core/services/estimateService";

type Tab = "new" | "created";

export const FPAWorkflow = () => {
  const { t } = useTranslation("fpa");
  const { requireOrganization, userOrganization, isLoadingUserOrganization } =
    useOrganizations({ fetchUserOrganization: true });
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("new");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryPage, setSummaryPage] = useState<1 | 2 | 3 | 4>(1);

  const currentStep = useFPAWorkflowStore((state) => state.currentStep);
  const selectedProjectId = useFPAWorkflowStore(
    (state) => state.selectedProjectId
  );
  const estimateFormData = useFPAWorkflowStore(
    (state) => state.estimateFormData
  );
  const generalSystemCharacteristics = useFPAWorkflowStore(
    (state) => state.generalSystemCharacteristics
  );
  const createdEstimate = useFPAWorkflowStore((state) => state.createdEstimate);
  const isCalculationComplete = useFPAWorkflowStore(
    (state) => state.isCalculationComplete
  );
  const setCurrentStep = useFPAWorkflowStore((state) => state.setCurrentStep);
  const setSelectedProjectId = useFPAWorkflowStore(
    (state) => state.setSelectedProjectId
  );
  const setEstimateFormData = useFPAWorkflowStore(
    (state) => state.setEstimateFormData
  );
  const setGeneralSystemCharacteristics = useFPAWorkflowStore(
    (state) => state.setGeneralSystemCharacteristics
  );
  const setCreatedEstimate = useFPAWorkflowStore(
    (state) => state.setCreatedEstimate
  );
  const setCalculationComplete = useFPAWorkflowStore(
    (state) => state.setCalculationComplete
  );
  const resetWorkflow = useFPAWorkflowStore((state) => state.resetWorkflow);
  const canNavigateToStep = useFPAWorkflowStore(
    (state) => state.canNavigateToStep
  );

  const requirements = useRequirementsStore((state) => state.requirements);
  const resetRequirements = useRequirementsStore(
    (state) => state.resetRequirements
  );

  const { projects, isLoadingProjects } = useProjects();
  const { calculateFunctionPoints } = useEstimateActions();

  useEffect(() => {
    const tabParam = searchParams.get("tab") as Tab;
    if (tabParam && ["new", "created"].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    const projectParam = searchParams.get("project");
    if (projectParam) {
      setSelectedProjectId(projectParam);
      setActiveTab("new");
    }
  }, [searchParams, setSelectedProjectId]);

  if (isLoadingUserOrganization) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary">{t("workflow.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userOrganization) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-default">
            {t("title")}
          </h1>
          <p className="text-muted mt-1">{t("subtitle")}</p>
        </div>
        <OrganizationAlert hasOrganization={false} translationNamespace="fpa" />
      </div>
    );
  }

  if (
    !isLoadingProjects &&
    userOrganization &&
    (!projects || projects.length === 0)
  ) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-default">
            {t("title")}
          </h1>
          <p className="text-muted mt-1">{t("subtitle")}</p>
        </div>
        <NoProjectsAlert translationNamespace="fpa" />
      </div>
    );
  }

  const handleCancel = () => {
    resetWorkflow();
    resetRequirements();
    setSummaryPage(1);
    setTimeout(() => {
      setActiveTab("new");
    }, 50);
  };

  const handleEstimateFormSubmit = (data: EstimateFormData) => {
    setEstimateFormData(data);
    setCurrentStep(3);
  };

  const handleGSCCompleted = (gsc: number[]) => {
    setGeneralSystemCharacteristics(gsc);
    setCurrentStep(5);
  };

  const handleProjectConfigSubmit = (configData: {
    teamSize: number;
    hourlyRateBRL: number;
    productivityFactor: number;
    averageDailyWorkingHours: number;
  }) => {
    if (!estimateFormData) return;

    setEstimateFormData({
      ...estimateFormData,
      ...configData,
    });

    // Ensure we clear any previous estimate before showing summary
    setCreatedEstimate(null);
    setCalculationComplete(false);
    setCurrentStep(6);
  };

  const handleCreateAndCalculate = async () => {
    if (!selectedProjectId || !estimateFormData) return;

    setIsSubmitting(true);
    try {
      requireOrganization();

      const transformedRequirements = requirements
        .filter((req) => req.componentType && req.componentId)
        .map((req) => ({
          title: req.title,
          description: req.description,
          source: req.source,
          sourceReference: req.sourceReference,
          componentType: req.componentType!,
          fpaData: {
            name: (req as any).name || req.title,
            description: (req as any).description || req.description || "",
            primaryIntent: (req as any).primaryIntent || "",
            ...(req.componentType === "ALI" || req.componentType === "AIE"
              ? {
                  recordElementTypes: (req as any).recordElementTypes || 1,
                  dataElementTypes: (req as any).dataElementTypes || 1,
                  ...(req.componentType === "AIE" && {
                    externalSystem: (req as any).externalSystem || "",
                  }),
                }
              : {}),
            ...(req.componentType === "EI"
              ? {
                  processingLogic: (req as any).processingLogic || "",
                  fileTypesReferenced: (req as any).fileTypesReferenced || 0,
                  dataElementTypes: (req as any).dataElementTypes || 0,
                }
              : {}),
            ...(req.componentType === "EO"
              ? {
                  derivedData: (req as any).derivedData || false,
                  outputFormat: (req as any).outputFormat || "",
                  fileTypesReferenced: (req as any).fileTypesReferenced || 0,
                  dataElementTypes: (req as any).dataElementTypes || 0,
                }
              : {}),
            ...(req.componentType === "EQ"
              ? {
                  retrievalLogic: (req as any).retrievalLogic || "",
                  fileTypesReferenced: (req as any).fileTypesReferenced || 0,
                  dataElementTypes: (req as any).dataElementTypes || 0,
                }
              : {}),
            notes: (req as any).notes || "",
          },
        }));

      const createData = {
        ...estimateFormData,
        projectId: selectedProjectId,
        requirements: transformedRequirements,
        ...(generalSystemCharacteristics && {
          generalSystemCharacteristics,
        }),
      };

      const estimate = await estimateService.createEstimate(createData as any);
      setCreatedEstimate(estimate);

      // Now calculate function points
      await calculateFunctionPoints({ estimateId: estimate._id });
      setCalculationComplete(true);
    } catch (error) {
      console.error("Failed to create and calculate estimate:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculateFP = async () => {
    if (!createdEstimate) return;

    try {
      await calculateFunctionPoints({ estimateId: createdEstimate._id });
      setCalculationComplete(true);
    } catch {}
  };

  const handleProjectCreated = (project: unknown) => {
    const p = project as { _id: string };
    setSelectedProjectId(p._id);
    setCurrentStep(2);
  };

  const handleProjectSelected = () => {
    setCurrentStep(2);
  };

  const handleStepClick = (step: number) => {
    if (canNavigateToStep(step as Step)) {
      setCurrentStep(step as Step);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "created") {
      return <EstimatesDashboard onCreateNew={() => setActiveTab("new")} />;
    }

    const steps = [
      { number: 1, label: t("workflow.step1Title") },
      { number: 2, label: t("workflow.step2Title") },
      { number: 3, label: t("workflow.step3Title") },
      { number: 4, label: t("workflow.step4Title") },
      { number: 5, label: t("workflow.step5Title") },
      { number: 6, label: t("workflow.step6Title") },
    ];

    return (
      <div className="space-y-8">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          canNavigateTo={(step) => canNavigateToStep(step as Step)}
        />

        {currentStep === 1 && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step1Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step1Description")}
            </p>

            {isLoadingProjects ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-secondary">{t("workflow.loading")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {projects && projects.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-default mb-2">
                      {t("workflow.selectExistingProject")}
                    </label>
                    <select
                      value={selectedProjectId || ""}
                      onChange={(e) =>
                        setSelectedProjectId(e.target.value || null)
                      }
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
                    >
                      <option value="">{t("workflow.chooseProject")}</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    {selectedProjectId && (
                      <Button
                        onClick={handleProjectSelected}
                        variant="primary"
                        size="md"
                        className="mt-4"
                      >
                        {t("workflow.nextCreateEstimate")}
                      </Button>
                    )}
                  </div>
                )}

                {!selectedProjectId && (
                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-medium mb-4 text-default">
                      {t("workflow.createNewProject")}
                    </h3>
                    <CreateProjectForm onSuccess={handleProjectCreated} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && selectedProjectId && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step2Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step2Description")}
            </p>
            <CreateEstimateForm
              projectId={selectedProjectId}
              initialData={estimateFormData || undefined}
              onSuccess={handleEstimateFormSubmit}
              onBack={() => setCurrentStep(1)}
            />
          </div>
        )}

        {currentStep === 3 && estimateFormData && (
          <RequirementImportView onProceed={() => setCurrentStep(4)} />
        )}

        {currentStep === 4 && estimateFormData && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step4Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step4Description")}
            </p>
            <CreateGSCForm
              onSuccess={handleGSCCompleted}
              onBack={() => setCurrentStep(3)}
              initialValues={
                generalSystemCharacteristics
                  ? {
                      dataProcessing: generalSystemCharacteristics[0],
                      performanceRequirements: generalSystemCharacteristics[1],
                      heavilyUsedConfiguration: generalSystemCharacteristics[2],
                      transactionRate: generalSystemCharacteristics[3],
                      onlineDataEntry: generalSystemCharacteristics[4],
                      endUserEfficiency: generalSystemCharacteristics[5],
                      onlineUpdate: generalSystemCharacteristics[6],
                      complexProcessing: generalSystemCharacteristics[7],
                      reusability: generalSystemCharacteristics[8],
                      installationEase: generalSystemCharacteristics[9],
                      operationalEase: generalSystemCharacteristics[10],
                      multipleSites: generalSystemCharacteristics[11],
                      facilitateChange: generalSystemCharacteristics[12],
                      distributedFunctions: generalSystemCharacteristics[13],
                    }
                  : undefined
              }
            />
          </div>
        )}

        {currentStep === 5 && estimateFormData && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step5Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step5Description")}
            </p>

            <ProjectConfigurationForm
              initialData={{
                teamSize: estimateFormData.teamSize,
                hourlyRateBRL: estimateFormData.hourlyRateBRL,
                productivityFactor: estimateFormData.productivityFactor,
                averageDailyWorkingHours:
                  estimateFormData.averageDailyWorkingHours,
              }}
              onSuccess={handleProjectConfigSubmit}
              onBack={() => setCurrentStep(4)}
            />
          </div>
        )}

        {currentStep === 6 && estimateFormData && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step6Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step6Description")}
            </p>

            {!createdEstimate ? (
              <>

                {/* Item 1: Estimate Information */}
                {summaryPage === 1 && (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[200px]">
                      <h3 className="text-lg font-semibold text-default mb-4">
                        {t("workflow.estimateInformation")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-secondary">
                            {t("workflow.estimateName")}:
                          </span>
                          <p className="text-default mt-1">
                            {estimateFormData.name}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-secondary">
                            {t("workflow.estimateCountType")}:
                          </span>
                          <p className="text-default mt-1">
                            {t(`countTypes.${estimateFormData.countType}`)}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-secondary">
                            {t("workflow.estimateDescription")}:
                          </span>
                          <p className="text-default mt-1">
                            {estimateFormData.description}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-secondary">
                            {t("workflow.estimateBoundary")}:
                          </span>
                          <p className="text-default mt-1">
                            {estimateFormData.applicationBoundary}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-secondary">
                            {t("workflow.estimateScope")}:
                          </span>
                          <p className="text-default mt-1">
                            {estimateFormData.countingScope}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Navigation */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        disabled={true}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label={t("workflow.previous")}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-sm text-secondary">
                        {t("workflow.item")} 1 {t("workflow.of")} 4
                      </div>
                      <button
                        onClick={() => setSummaryPage(2)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label={t("workflow.next")}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                {/* Item 2: Requirements Summary */}
                {summaryPage === 2 && (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[200px]">
                      <h3 className="text-lg font-semibold text-default mb-4">
                        {t("workflow.requirementsSummary")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-secondary">
                            {t("workflow.totalRequirements")}:
                          </span>
                          <p className="text-default mt-1">
                            {requirements.length}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-secondary">
                            {t("workflow.classifiedRequirements")}:
                          </span>
                          <p className="text-default mt-1">
                            {requirements.filter((r) => r.componentType).length}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-secondary">
                            {t("workflow.requirementsByType")}:
                          </span>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-secondary">
                                {t("componentTypes.ALI_short")}
                              </span>
                              <span className="text-lg font-semibold text-default">
                                {
                                  requirements.filter(
                                    (r) => r.componentType === "ALI"
                                  ).length
                                }
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-secondary">
                                {t("componentTypes.AIE_short")}
                              </span>
                              <span className="text-lg font-semibold text-default">
                                {
                                  requirements.filter(
                                    (r) => r.componentType === "AIE"
                                  ).length
                                }
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-secondary">
                                {t("componentTypes.EI_short")}
                              </span>
                              <span className="text-lg font-semibold text-default">
                                {
                                  requirements.filter(
                                    (r) => r.componentType === "EI"
                                  ).length
                                }
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-secondary">
                                {t("componentTypes.EO_short")}
                              </span>
                              <span className="text-lg font-semibold text-default">
                                {
                                  requirements.filter(
                                    (r) => r.componentType === "EO"
                                  ).length
                                }
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-secondary">
                                {t("componentTypes.EQ_short")}
                              </span>
                              <span className="text-lg font-semibold text-default">
                                {
                                  requirements.filter(
                                    (r) => r.componentType === "EQ"
                                  ).length
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Navigation */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        onClick={() => setSummaryPage(1)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label={t("workflow.previous")}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-sm text-secondary">
                        {t("workflow.item")} 2 {t("workflow.of")} 4
                      </div>
                      <button
                        onClick={() => setSummaryPage(3)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label={t("workflow.next")}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                {/* Item 3: GSC Summary */}
                {summaryPage === 3 && (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[200px]">
                      <h3 className="text-lg font-semibold text-default mb-4">
                        {t("workflow.gscSummary")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-secondary">
                            {t("workflow.gscDefined")}:
                          </span>
                          <p className="text-default mt-1">
                            {generalSystemCharacteristics
                              ? t("workflow.yes")
                              : t("workflow.no")}
                          </p>
                        </div>
                        {generalSystemCharacteristics && (
                          <div>
                            <span className="font-medium text-secondary">
                              {t("workflow.gscInfluence")}:
                            </span>
                            <p className="text-default mt-1">
                              {generalSystemCharacteristics.reduce(
                                (a, b) => a + b,
                                0
                              )}{" "}
                              / 70
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow Navigation */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        onClick={() => setSummaryPage(2)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label={t("workflow.previous")}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-sm text-secondary">
                        {t("workflow.item")} 3 {t("workflow.of")} 4
                      </div>
                      <button
                        onClick={() => setSummaryPage(4)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label={t("workflow.next")}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                {/* Item 4: Project Configuration */}
                {summaryPage === 4 && (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[200px]">
                      <h3 className="text-lg font-semibold text-default mb-4">
                        {t("workflow.configurationSummary")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-secondary">
                            {t("estimateForm.teamSize")}:
                          </span>
                          <p className="text-default mt-1">
                            {estimateFormData.teamSize || 1}{" "}
                            {t("estimateForm.people")}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-secondary">
                            {t("estimateForm.hourlyRate")}:
                          </span>
                          <p className="text-default mt-1">
                            R$ {estimateFormData.hourlyRateBRL || 150}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-secondary">
                            {t("estimateForm.productivityFactor")}:
                          </span>
                          <p className="text-default mt-1">
                            {estimateFormData.productivityFactor || 10} h/PF
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-secondary">
                            {t("estimateForm.dailyWorkingHours")}:
                          </span>
                          <p className="text-default mt-1">
                            {estimateFormData.averageDailyWorkingHours || 8}h
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Navigation */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        onClick={() => setSummaryPage(3)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label={t("workflow.previous")}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-sm text-secondary">
                        {t("workflow.item")} 4 {t("workflow.of")} 4
                      </div>
                      <button
                        disabled={true}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label={t("workflow.next")}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                {/* Bottom Action Buttons */}
                <div className="flex justify-end items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => setCurrentStep(5)}
                    variant="secondary"
                    size="md"
                  >
                    Voltar
                  </Button>

                  <Button
                    onClick={handleCreateAndCalculate}
                    variant="primary"
                    size="md"
                    disabled={
                      isSubmitting ||
                      requirements.filter(
                        (r) => r.componentType && r.componentId
                      ).length === 0
                    }
                  >
                    {isSubmitting
                      ? "Calculando..."
                      : "Calcular PF"}
                  </Button>
                </div>
              </>
            ) : !isCalculationComplete ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-secondary">Calculando pontos de função...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-green-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-default mb-2">
                  {t("workflow.completionTitle")}
                </h3>
                <p className="text-secondary mb-6">
                  {t("workflow.completionDescription")}
                </p>
                <div className="space-x-4">
                  <Button onClick={handleCancel} variant="primary" size="md">
                    {t("workflow.createNewEstimate")}
                  </Button>
                  <Button
                    onClick={() => setActiveTab("created")}
                    variant="secondary"
                    size="md"
                  >
                    {t("workflow.viewAllEstimates")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-[20px]">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-default">
          {t("title")}
        </h1>
        <p className="text-secondary mt-1">{t("subtitle")}</p>
      </div>

      <Tabs
        tabs={[
          { id: "new" as Tab, label: t("tabs.newEstimate") },
          { id: "created" as Tab, label: t("tabs.createdEstimates") },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderTabContent()}
    </div>
  );
};
