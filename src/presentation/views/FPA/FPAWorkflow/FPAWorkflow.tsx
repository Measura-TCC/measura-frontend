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
import { CreateProjectConfigurationForm } from "./components/CreateProjectConfigurationForm";
import { CreateALIForm } from "./components/CreateALIForm";
import { CreateEIForm } from "./components/CreateEIForm";
import { CreateEOForm } from "./components/CreateEOForm";
import { CreateEQForm } from "./components/CreateEQForm";
import { CreateAIEForm } from "./components/CreateAIEForm";
import { RequirementImportView } from "./RequirementImport/RequirementImportView";
import type { EstimateResponse } from "@/core/services/fpa/estimates";
import { PlusIcon, DocumentIcon } from "@/presentation/assets/icons";
import { Button, Tabs, Stepper } from "@/presentation/components/primitives";
import {
  useEstimateActions,
  useEstimate,
} from "@/core/hooks/fpa/estimates/useEstimate";
import { estimateService } from "@/core/services/estimateService";
import { useWorkflowState, type Step } from "@/core/hooks/fpa/useWorkflowState";
import type { ComponentType } from "@/core/types/fpa";

type Tab = "new" | "created";

interface EstimateWithArrays {
  internalLogicalFiles?: unknown[];
  externalInterfaceFiles?: unknown[];
  externalInputs?: unknown[];
  externalOutputs?: unknown[];
  externalQueries?: unknown[];
}

export const FPAWorkflow = () => {
  const { t } = useTranslation("fpa");
  const { requireOrganization, userOrganization, isLoadingUserOrganization } =
    useOrganizations({ fetchUserOrganization: true });
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("new");

  const {
    state,
    setCurrentStep,
    setSelectedProjectId,
    setCreatedEstimate,
    setCalculationComplete,
    setSelectedComponentType,
    resetWorkflow,
    canNavigateToStep,
  } = useWorkflowState();
  const { projects, isLoadingProjects } = useProjects();
  const { calculateFunctionPoints } = useEstimateActions();

  const { estimate: currentEstimateData, mutateEstimate } = useEstimate({
    id: state.createdEstimate?._id || "",
  });

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
    setActiveTab("new");
  };

  const handleEstimateCreated = (estimate: unknown) => {
    const estimateResponse = estimate as EstimateResponse;
    setCreatedEstimate(estimateResponse);
    setCurrentStep(3);
  };

  const handleGSCCompleted = async (generalSystemCharacteristics: number[]) => {
    if (!state.createdEstimate) return;

    try {
      requireOrganization();
      await estimateService.updateEstimate({
        id: state.createdEstimate._id,
        data: { generalSystemCharacteristics },
      });
      mutateEstimate();
      setCurrentStep(5);
    } catch (error) {
      console.error("Failed to save GSC data:", error);
    }
  };

  const handleProjectConfigCompleted = () => {
    setCurrentStep(6);
  };

  const handleCalculateFP = async () => {
    if (!state.createdEstimate) return;

    try {
      await calculateFunctionPoints({ estimateId: state.createdEstimate._id });
      setCalculationComplete(true);
    } catch {
      // TODO: Error handling can be added here if needed
    }
  };

  const handleComponentAdded = () => {
    setSelectedComponentType(null);
    mutateEstimate();
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
      setSelectedComponentType(null);
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
          currentStep={state.currentStep}
          onStepClick={handleStepClick}
          canNavigateTo={(step) => canNavigateToStep(step as Step)}
        />

        {state.currentStep === 1 && (
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
                      value={state.selectedProjectId || ""}
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
                    {state.selectedProjectId && (
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

                {!state.selectedProjectId && (
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

        {state.currentStep === 2 && state.selectedProjectId && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step2Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step2Description")}
            </p>
            <CreateEstimateForm
              projectId={state.selectedProjectId}
              onSuccess={handleEstimateCreated}
            />
          </div>
        )}

        {state.currentStep === 3 && state.createdEstimate && (
          <RequirementImportView onProceed={() => setCurrentStep(4)} />
        )}

        {state.currentStep === 4 && state.createdEstimate && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step4Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step4Description")}
            </p>
            <CreateGSCForm onSuccess={handleGSCCompleted} />
          </div>
        )}

        {state.currentStep === 5 && state.createdEstimate && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step5Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step5Description")}
            </p>
            <CreateProjectConfigurationForm
              estimateId={state.createdEstimate._id}
              onSuccess={handleProjectConfigCompleted}
            />
          </div>
        )}

        {state.currentStep === 6 && state.createdEstimate && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step6Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step6Description")}
            </p>

            {!state.isCalculationComplete ? (
              <div className="text-center py-8">
                <Button
                  onClick={handleCalculateFP}
                  variant="primary"
                  size="lg"
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-lg font-medium"
                >
                  {t("workflow.calculateFP")}
                </Button>
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
                  <Button
                    onClick={handleCancel}
                    variant="primary"
                    size="md"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    {t("workflow.createNewEstimate")}
                  </Button>
                  <Button
                    onClick={() => setActiveTab("created")}
                    variant="secondary"
                    size="md"
                    className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
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
