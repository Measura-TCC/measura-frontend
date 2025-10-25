import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/presentation/components/primitives";
import { MeasurementPlanStatus, MeasurementPlanResponseDto } from "@/core/types/plans";
import type { Project } from "@/core/schemas/projects";

interface PlanDetailsCardProps {
  plan: MeasurementPlanResponseDto;
  isEditing: boolean;
  editForm: {
    planName: string;
    associatedProject: string;
    planResponsible: string;
    status: MeasurementPlanStatus;
  };
  onEditFormChange: (field: string, value: string | MeasurementPlanStatus) => void;
  getProjectName: (projectId: string) => string;
  projects: Project[];
}

export const PlanDetailsCard: React.FC<PlanDetailsCardProps> = ({
  plan,
  isEditing,
  editForm,
  onEditFormChange,
  getProjectName,
  projects,
}) => {
  const { t } = useTranslation("plans");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "active":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "draft":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("planDetails.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("planDetails.status")}
              </label>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}
              >
                {t(`status.${plan.status}`)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("planDetails.project")}
              </label>
              <p className="text-gray-900 dark:text-gray-100">{getProjectName(plan.associatedProject)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("created")}
              </label>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("updated")}
              </label>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(plan.updatedAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("forms.planName")}
              </label>
              <Input
                type="text"
                value={editForm.planName}
                onChange={(e) => onEditFormChange("planName", e.target.value)}
                placeholder={t("forms.planNamePlaceholder")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("planDetails.project")}
                </label>
                <select
                  value={editForm.associatedProject}
                  onChange={(e) => onEditFormChange("associatedProject", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">{t("forms.selectProject")}</option>
                  {projects?.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("forms.planResponsible")}
                </label>
                <Input
                  type="text"
                  value={editForm.planResponsible}
                  onChange={(e) => onEditFormChange("planResponsible", e.target.value)}
                  placeholder={t("forms.planResponsiblePlaceholder")}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("planDetails.status")}
              </label>
              <select
                value={editForm.status}
                onChange={(e) => onEditFormChange("status", e.target.value as MeasurementPlanStatus)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value={MeasurementPlanStatus.DRAFT}>
                  {t(`status.${MeasurementPlanStatus.DRAFT}`)}
                </option>
                <option value={MeasurementPlanStatus.ACTIVE}>
                  {t(`status.${MeasurementPlanStatus.ACTIVE}`)}
                </option>
                <option value={MeasurementPlanStatus.COMPLETED}>
                  {t(`status.${MeasurementPlanStatus.COMPLETED}`)}
                </option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("created")}
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("updated")}
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(plan.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};