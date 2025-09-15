import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
} from "@/presentation/components/primitives";
import { useMeasurementPlan, useMeasurementPlans } from "@/core/hooks/measurementPlans";
import { useMeasurementPlanExport } from "@/core/hooks/measurementPlans";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { ExportFormat, MeasurementPlanStatus } from "@/core/types/plans";
import { PlanVisualization } from "../components/PlanVisualization";
import {
  PlanContentManager,
  PlanHeader,
  PlanDetailsCard,
  PlanProgressCard,
  PlanStatisticsCard,
} from "./components";

interface PlanDetailsProps {
  planId: string;
}

export const PlanDetailsView: React.FC<PlanDetailsProps> = ({ planId }) => {
  const { t } = useTranslation("plans");
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    planName: "",
    associatedProject: "",
    planResponsible: "",
    status: MeasurementPlanStatus.DRAFT,
  });

  const { plan, planError, isLoadingPlan } = useMeasurementPlan({ planId });
  const { deletePlan, updatePlan, isUpdatingPlan, operationError, clearError } = useMeasurementPlans();
  const { projects } = useProjects();
  const exportHook = useMeasurementPlanExport({ planId });

  const getProjectName = (projectId: string): string => {
    const project = projects?.find(p => p._id === projectId);
    return project?.name || projectId;
  };

  const handleExport = async (format: ExportFormat) => {
    if (!plan) return;

    setIsExporting(true);
    try {
      await exportHook.exportAndDownload(format);
    } catch (error) {
      console.error(`Failed to export as ${format}:`, error);
      alert(`Failed to export plan as ${format}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!plan) return;

    if (confirm(t("planDetails.confirmDelete", { planName: plan.planName }))) {
      try {
        await deletePlan(planId);
        router.push("/plans");
      } catch (error) {
        // Error is already handled by the hook
        console.error("Failed to delete plan:", error);
      }
    }
  };

  const handleEditToggle = () => {
    if (!plan) return;

    if (!isEditing) {
      setEditForm({
        planName: plan.planName,
        associatedProject: plan.associatedProject,
        planResponsible: plan.planResponsible,
        status: plan.status,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = async () => {
    if (!plan) return;

    try {
      await updatePlan(planId, {
        planName: editForm.planName !== plan.planName ? editForm.planName : undefined,
        associatedProject: editForm.associatedProject !== plan.associatedProject ? editForm.associatedProject : undefined,
        planResponsible: editForm.planResponsible !== plan.planResponsible ? editForm.planResponsible : undefined,
        status: editForm.status !== plan.status ? editForm.status : undefined,
      });
      setIsEditing(false);
    } catch (error) {
      // Error is already handled by the hook
      console.error("Failed to update plan:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      planName: "",
      associatedProject: "",
      planResponsible: "",
      status: MeasurementPlanStatus.DRAFT,
    });
  };

  const handleEditFormChange = (field: string, value: string | MeasurementPlanStatus) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (isLoadingPlan) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
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

  if (planError || !plan) {
    return (
      <div className="space-y-6">
        <PlanHeader
          planName={t("planDetails.notFound")}
          planResponsible=""
          isEditing={false}
          isUpdatingPlan={false}
          isExporting={false}
          onEditToggle={() => {}}
          onSaveEdit={() => Promise.resolve()}
          onCancelEdit={() => {}}
          onExport={() => {}}
          onDelete={() => {}}
        />
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600 mb-2">
              {t("planDetails.planNotFound")}
            </h3>
            <p className="text-gray-500">
              {planError?.message || t("planDetails.planLoadError")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header with responsive design */}
      <PlanHeader
        planName={plan.planName}
        planResponsible={plan.planResponsible}
        isEditing={isEditing}
        isUpdatingPlan={isUpdatingPlan}
        isExporting={isExporting}
        onEditToggle={handleEditToggle}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onExport={handleExport}
        onDelete={handleDelete}
      />

      {/* Error Alert */}
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

      {/* Main Content with responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Plan Details Card */}
          <PlanDetailsCard
            plan={plan}
            isEditing={isEditing}
            editForm={editForm}
            onEditFormChange={handleEditFormChange}
            getProjectName={getProjectName}
            projects={projects || []}
          />

          {/* Dual Mode Content: Visualization vs Edit */}
          {!isEditing ? (
            <div className="space-y-4">
              <PlanVisualization
                plan={plan}
                projects={projects || []}
                showNavigation={true}
              />
            </div>
          ) : (
            <PlanContentManager
              plan={plan}
              onUpdatePlan={updatePlan}
              isReadOnly={false}
            />
          )}
        </div>

        {/* Responsive Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          <PlanProgressCard progress={plan.progress} />
          <PlanStatisticsCard
            objectivesCount={plan.objectivesCount}
            questionsCount={plan.questionsCount}
            metricsCount={plan.metricsCount}
            measurementsCount={plan.measurementsCount}
          />
        </div>
      </div>
    </div>
  );
};