"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EstimatesDashboard } from "./EstimatesDashboard";
import { CreateEstimateForm } from "./CreateEstimateForm";
import { CreateProjectForm } from "../projects/CreateProjectForm";
import { CreateOrganizationForm } from "../organizations/CreateOrganizationForm";
import { CreateGSCForm } from "./CreateGSCForm";
import { CreateALIForm } from "./CreateALIForm";
import { CreateEIForm } from "./CreateEIForm";
import { CreateEOForm } from "./CreateEOForm";
import { CreateEQForm } from "./CreateEQForm";
import { CreateAIEForm } from "./CreateAIEForm";
import {
  useEstimateActions,
  useEstimate,
} from "@/core/hooks/fpa/estimates/useEstimate";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import type { EstimateResponse } from "@/core/services/fpa/estimates";
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

  if (isLoadingUserOrganization) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("workflow.loading")}</p>
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("workflow.organizationRequiredTitle")}
          </h3>
          <p className="text-gray-600 mb-4">
            {t("workflow.organizationRequiredText")}
          </p>
          <CreateOrganizationForm />
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

  const handleGSCCompleted = () => {
    setCurrentStep(5);
  };

  const handleCalculateFP = async () => {
    if (!state.createdEstimate) return;

    try {
      await calculateFunctionPoints({ estimateId: state.createdEstimate._id });
      setCalculationComplete(true);
    } catch (error) {}
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
      return <EstimatesDashboard />;
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          {[
            { number: 1, name: t("workflow.step1Title").replace("1. ", "") },
            { number: 2, name: t("workflow.step2Title").replace("2. ", "") },
            { number: 3, name: t("workflow.step3Title").replace("3. ", "") },
            { number: 4, name: t("workflow.step4Title").replace("4. ", "") },
            { number: 5, name: t("workflow.step5Title").replace("5. ", "") },
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
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-gray-300 text-gray-500"
                  } ${
                    state.currentStep === step.number
                      ? "ring-4 ring-indigo-100"
                      : ""
                  } ${
                    canNavigateToStep(step.number as Step)
                      ? "cursor-pointer hover:scale-110"
                      : "cursor-not-allowed"
                  }`}
                >
                  {step.number}
                </div>
                {index < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      state.currentStep > step.number
                        ? "bg-indigo-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-medium ${
                    state.currentStep === step.number
                      ? "text-indigo-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {state.currentStep === 1 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("workflow.step1Title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("workflow.step1Description")}
            </p>

            {isLoadingProjects ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t("workflow.loading")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {projects && projects.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("workflow.selectExistingProject")}
                    </label>
                    <select
                      value={state.selectedProjectId || ""}
                      onChange={(e) =>
                        setSelectedProjectId(e.target.value || null)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">{t("workflow.chooseProject")}</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    {state.selectedProjectId && (
                      <button
                        onClick={handleProjectSelected}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        {t("workflow.nextCreateEstimate")}
                      </button>
                    )}
                  </div>
                )}

                {!state.selectedProjectId && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("workflow.step2Title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("workflow.step2Description")}
            </p>
            <CreateEstimateForm
              projectId={state.selectedProjectId}
              onSuccess={handleEstimateCreated}
            />
          </div>
        )}

        {state.currentStep === 3 && state.createdEstimate && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("workflow.step3Title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("workflow.step3Description")}
            </p>

            {currentEstimateData && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3">
                  {t("workflow.addedComponents")}
                </h3>
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {(currentEstimateData as EstimateWithArrays)
                        .internalLogicalFiles?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">ALI/ILF</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {(currentEstimateData as EstimateWithArrays)
                        .externalInterfaceFiles?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">AIE/EIF</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {(currentEstimateData as EstimateWithArrays)
                        .externalInputs?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">EI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {(currentEstimateData as EstimateWithArrays)
                        .externalOutputs?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">EO</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {(currentEstimateData as EstimateWithArrays)
                        .externalQueries?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">EQ</div>
                  </div>
                </div>
                {currentEstimateData && (
                  <div className="mt-3 text-center text-sm text-gray-600">
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
                    label: t("workflow.components.addALI"),
                    desc: t("workflow.components.aliDescription"),
                  },
                  {
                    type: "EI" as ComponentType,
                    label: t("workflow.components.addEI"),
                    desc: t("workflow.components.eiDescription"),
                  },
                  {
                    type: "EO" as ComponentType,
                    label: t("workflow.components.addEO"),
                    desc: t("workflow.components.eoDescription"),
                  },
                  {
                    type: "EQ" as ComponentType,
                    label: t("workflow.components.addEQ"),
                    desc: t("workflow.components.eqDescription"),
                  },
                  {
                    type: "AIE" as ComponentType,
                    label: t("workflow.components.addAIE"),
                    desc: t("workflow.components.aieDescription"),
                  },
                ].map(({ type, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedComponentType(type)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{label}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <button
                    onClick={() => setSelectedComponentType(null)}
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                  >
                    {t("workflow.backToComponentTypes")}
                  </button>
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

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {t("workflow.nextGSC")}
              </button>
            </div>
          </div>
        )}

        {state.currentStep === 4 && state.createdEstimate && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("workflow.step4Title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("workflow.step4Description")}
            </p>
            <CreateGSCForm onSuccess={handleGSCCompleted} />
          </div>
        )}

        {state.currentStep === 5 && state.createdEstimate && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("workflow.step5Title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("workflow.step5Description")}
            </p>

            {!state.isCalculationComplete ? (
              <div className="text-center py-8">
                <button
                  onClick={handleCalculateFP}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-lg font-medium"
                >
                  {t("workflow.calculateFP")}
                </button>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("workflow.completionTitle")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("workflow.completionDescription")}
                </p>
                <div className="space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    {t("workflow.createNewEstimate")}
                  </button>
                  <button
                    onClick={() => setActiveTab("created")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    {t("workflow.viewAllEstimates")}
                  </button>
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
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-600 mt-1">{t("subtitle")}</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("new")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "new"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {t("tabs.newEstimate")}
          </button>
          <button
            onClick={() => setActiveTab("created")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "created"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {t("tabs.createdEstimates")}
          </button>
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
};
