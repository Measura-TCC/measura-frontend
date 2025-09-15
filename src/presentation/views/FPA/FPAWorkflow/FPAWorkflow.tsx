"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { useOrganization } from "@/core/hooks/organizations/useOrganization";
import { EstimatesDashboard } from "./EstimatesDashboard";
import { CreateProjectForm } from "../../Projects/components/CreateProjectForm";
import { CreateOrganizationForm } from "../../Organization/components/CreateOrganizationForm";
import { CreateEstimateForm } from "./components/CreateEstimateForm";
import { CreateGSCForm } from "./components/CreateGSCForm";
import { CreateProjectConfigurationForm } from "./components/CreateProjectConfigurationForm";
import { CreateALIForm } from "./components/CreateALIForm";
import { CreateEIForm } from "./components/CreateEIForm";
import { CreateEOForm } from "./components/CreateEOForm";
import { CreateEQForm } from "./components/CreateEQForm";
import { CreateAIEForm } from "./components/CreateAIEForm";
import type { EstimateResponse } from "@/core/services/fpa/estimates";
import { OfficeIcon, PlusIcon, DocumentIcon } from "@/presentation/assets/icons";
import { Button } from "@/presentation/components/primitives/Button/Button";
import {
  useEstimateActions,
  useEstimate,
} from "@/core/hooks/fpa/estimates/useEstimate";
import { estimateService } from "@/core/services/estimateService";
import {
  useWorkflowState,
  type ComponentType,
  type Step,
} from "@/core/hooks/fpa/useWorkflowState";

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
  const { requireOrganization } = useOrganization();
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

  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-amber-500 mb-4">
            <OfficeIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-default mb-2">
            {t("workflow.organizationRequiredTitle")}
          </h3>
          <p className="text-secondary mb-4">
            {t("workflow.organizationRequiredText")}
          </p>
          <CreateOrganizationForm />
        </div>
      </div>
    );
  }

  if (!isLoadingProjects && userOrganization && (!projects || projects.length === 0)) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-blue-500 mb-4">
            <DocumentIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-default mb-2">
            {t("noProjectsTitle")}
          </h3>
          <p className="text-secondary mb-4">
            {t("noProjectsDescription")}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/projects")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              {t("goToProjects")}
            </button>
          </div>
        </div>
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

  const handleStepClick = (step: Step) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
      setSelectedComponentType(null);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "created") {
      return <EstimatesDashboard onCreateNew={() => setActiveTab("new")} />;
    }

    return (
      <div className="space-y-8">
        <div className="block md:hidden">
          <div className="px-4">
            <div className="grid grid-cols-6 gap-1">
              {[
                {
                  number: 1,
                  name: t("workflow.step1Title").replace("1. ", ""),
                },
                {
                  number: 2,
                  name: t("workflow.step2Title").replace("2. ", ""),
                },
                {
                  number: 3,
                  name: t("workflow.step3Title").replace("3. ", ""),
                },
                {
                  number: 4,
                  name: t("workflow.step4Title").replace("4. ", ""),
                },
                {
                  number: 5,
                  name: t("workflow.step5Title").replace("5. ", ""),
                },
                {
                  number: 6,
                  name: t("workflow.step6Title").replace("6. ", ""),
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                >
                  <div
                    onClick={() => handleStepClick(step.number as Step)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all mb-1 ${
                      state.currentStep >= step.number
                        ? "bg-primary border-primary text-white"
                        : canNavigateToStep(step.number as Step)
                        ? "border-primary/50 text-primary/70 bg-primary/10"
                        : "border-gray-300 text-gray-400 bg-gray-100"
                    } ${
                      state.currentStep === step.number
                        ? "ring-2 ring-primary/20"
                        : ""
                    } ${
                      canNavigateToStep(step.number as Step)
                        ? "cursor-pointer hover:scale-105 hover:shadow-md"
                        : "cursor-not-allowed opacity-60"
                    }`}
                    title={
                      !canNavigateToStep(step.number as Step)
                        ? "Complete a etapa anterior para desbloquear"
                        : ""
                    }
                  >
                    <span className="text-xs font-medium">{step.number}</span>
                  </div>
                  <p
                    className={`text-[10px] font-medium text-center leading-tight ${
                      state.currentStep === step.number
                        ? "text-primary"
                        : canNavigateToStep(step.number as Step)
                        ? "text-primary/70"
                        : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between">
          {[
            { number: 1, name: t("workflow.step1Title").replace("1. ", "") },
            { number: 2, name: t("workflow.step2Title").replace("2. ", "") },
            { number: 3, name: t("workflow.step3Title").replace("3. ", "") },
            { number: 4, name: t("workflow.step4Title").replace("4. ", "") },
            { number: 5, name: t("workflow.step5Title").replace("5. ", "") },
            { number: 6, name: t("workflow.step6Title").replace("6. ", "") },
          ].map((step, index) => (
            <div
              key={step.number}
              className="flex flex-col items-center flex-1"
            >
              <div className="flex items-center w-full">
                <div
                  onClick={() => handleStepClick(step.number as Step)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    state.currentStep >= step.number
                      ? "bg-primary border-primary text-white"
                      : canNavigateToStep(step.number as Step)
                      ? "border-primary/50 text-primary/70 bg-primary/10"
                      : "border-gray-300 text-gray-400 bg-gray-100"
                  } ${
                    state.currentStep === step.number
                      ? "ring-4 ring-primary/20"
                      : ""
                  } ${
                    canNavigateToStep(step.number as Step)
                      ? "cursor-pointer hover:scale-110 hover:shadow-md"
                      : "cursor-not-allowed opacity-60"
                  }`}
                  title={
                    !canNavigateToStep(step.number as Step)
                      ? "Complete a etapa anterior para desbloquear"
                      : ""
                  }
                >
                  {step.number}
                </div>
                {index < 5 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      state.currentStep > step.number
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-medium ${
                    state.currentStep === step.number
                      ? "text-primary"
                      : canNavigateToStep(step.number as Step)
                      ? "text-primary/70"
                      : "text-gray-400"
                  }`}
                >
                  {step.name}
                </p>
              </div>
            </div>
          ))}
        </div>

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
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-default">
              {t("workflow.step3Title")}
            </h2>
            <p className="text-secondary mb-6">
              {t("workflow.step3Description")}
            </p>

            {currentEstimateData && (
              <div className="mb-6 p-4 bg-background-secondary rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-default">
                  {t("workflow.addedComponents")}
                </h3>
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {(currentEstimateData as EstimateWithArrays)
                        .internalLogicalFiles?.length || 0}
                    </div>
                    <div className="text-sm text-secondary">
                      {t("workflow.components.aliLabel")}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {(currentEstimateData as EstimateWithArrays)
                        .externalInterfaceFiles?.length || 0}
                    </div>
                    <div className="text-sm text-secondary">
                      {t("workflow.components.aieLabel")}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {(currentEstimateData as EstimateWithArrays)
                        .externalInputs?.length || 0}
                    </div>
                    <div className="text-sm text-secondary">
                      {t("workflow.components.eiLabel")}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {(currentEstimateData as EstimateWithArrays)
                        .externalOutputs?.length || 0}
                    </div>
                    <div className="text-sm text-secondary">
                      {t("workflow.components.eoLabel")}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {(currentEstimateData as EstimateWithArrays)
                        .externalQueries?.length || 0}
                    </div>
                    <div className="text-sm text-secondary">
                      {t("workflow.components.eqLabel")}
                    </div>
                  </div>
                </div>
                {currentEstimateData && (
                  <div className="mt-3 text-center text-sm text-secondary">
                    {t("workflow.totalComponents", {
                      count:
                        ((currentEstimateData as EstimateWithArrays)
                          .internalLogicalFiles?.length || 0) +
                        ((currentEstimateData as EstimateWithArrays)
                          .externalInterfaceFiles?.length || 0) +
                        ((currentEstimateData as EstimateWithArrays)
                          .externalInputs?.length || 0) +
                        ((currentEstimateData as EstimateWithArrays)
                          .externalOutputs?.length || 0) +
                        ((currentEstimateData as EstimateWithArrays)
                          .externalQueries?.length || 0),
                    })}
                  </div>
                )}
              </div>
            )}

            {!state.selectedComponentType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    type: "ALI" as ComponentType,
                    label: t("workflow.components.aliLabel"),
                    desc: t("workflow.components.aliDescription"),
                  },
                  {
                    type: "EI" as ComponentType,
                    label: t("workflow.components.eiLabel"),
                    desc: t("workflow.components.eiDescription"),
                  },
                  {
                    type: "EO" as ComponentType,
                    label: t("workflow.components.eoLabel"),
                    desc: t("workflow.components.eoDescription"),
                  },
                  {
                    type: "EQ" as ComponentType,
                    label: t("workflow.components.eqLabel"),
                    desc: t("workflow.components.eqDescription"),
                  },
                  {
                    type: "AIE" as ComponentType,
                    label: t("workflow.components.aieLabel"),
                    desc: t("workflow.components.aieDescription"),
                  },
                ].map(({ type, label, desc }) => (
                  <Button
                    key={type}
                    onClick={() => setSelectedComponentType(type)}
                    variant="ghost"
                    size="md"
                    className="p-4 border border-border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-default">{label}</h3>
                        <PlusIcon className="w-4 h-4" />
                      </div>
                      <p className="text-sm text-secondary text-center">
                        {desc}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <Button
                    onClick={() => setSelectedComponentType(null)}
                    variant="secondary"
                    size="md"
                    className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
                  >
                    {t("workflow.backToComponentTypes")}
                  </Button>
                </div>
                {state.selectedComponentType === "ALI" && (
                  <CreateALIForm
                    estimateId={state.createdEstimate._id}
                    onSuccess={handleComponentAdded}
                  />
                )}
                {state.selectedComponentType === "EI" && (
                  <CreateEIForm
                    estimateId={state.createdEstimate._id}
                    onSuccess={handleComponentAdded}
                  />
                )}
                {state.selectedComponentType === "EO" && (
                  <CreateEOForm
                    estimateId={state.createdEstimate._id}
                    onSuccess={handleComponentAdded}
                  />
                )}
                {state.selectedComponentType === "EQ" && (
                  <CreateEQForm
                    estimateId={state.createdEstimate._id}
                    onSuccess={handleComponentAdded}
                  />
                )}
                {state.selectedComponentType === "AIE" && (
                  <CreateAIEForm
                    estimateId={state.createdEstimate._id}
                    onSuccess={handleComponentAdded}
                  />
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-border">
              <Button
                onClick={() => setCurrentStep(4)}
                variant="primary"
                size="md"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                {t("workflow.nextGSC")}
              </Button>
            </div>
          </div>
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-default">{t("title")}</h1>
        <p className="text-secondary mt-1">{t("subtitle")}</p>
      </div>

      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8">
          <Button
            onClick={() => setActiveTab("new")}
            variant="ghost"
            size="sm"
            className={`py-2 px-1 border-b-2 font-medium text-sm  rounded-none${
              activeTab === "new"
                ? "border-primary text-primary rounded-none"
                : "border-transparent text-muted hover:text-secondary hover:border-border rounded-none"
            }`}
          >
            {t("tabs.newEstimate")}
          </Button>
          <Button
            onClick={() => setActiveTab("created")}
            variant="ghost"
            size="sm"
            className={`py-2 px-1 border-b-2 font-medium text-sm rounded-none ${
              activeTab === "created"
                ? "border-primary text-primary rounded-none"
                : "border-transparent text-muted hover:text-secondary hover:border-border rounded-none"
            }`}
          >
            {t("tabs.createdEstimates")}
          </Button>
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
};
