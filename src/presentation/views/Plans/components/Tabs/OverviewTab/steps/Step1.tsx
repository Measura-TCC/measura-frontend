import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";
import { useProjects } from "@/core/hooks/projects/useProjects";

interface MeasurementPlanFormData {
  planName: string;
  associatedProject: string;
  planResponsible: string;
}

interface Step1Props {
  measurementPlanForm: MeasurementPlanFormData;
  setMeasurementPlanForm: React.Dispatch<React.SetStateAction<MeasurementPlanFormData>>;
  formErrors: Record<string, { message?: string }>;
  canCreatePlan: boolean;
  onNext: () => void;
}

export const Step1: React.FC<Step1Props> = ({
  measurementPlanForm,
  setMeasurementPlanForm,
  formErrors,
  canCreatePlan,
  onNext,
}) => {
  const { t } = useTranslation("plans");
  const { projects } = useProjects();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step1.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step1.description")}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-default">
              {t("forms.associatedProject")}
            </label>
            <select
              value={measurementPlanForm.associatedProject}
              onChange={(e) => setMeasurementPlanForm((prev: MeasurementPlanFormData) => ({...prev, associatedProject: e.target.value}))}
              disabled={!canCreatePlan}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
            >
              <option value="">{t("forms.selectProject")}</option>
              {projects?.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {formErrors.associatedProject && (
              <p className="text-sm text-red-600">
                {formErrors.associatedProject.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-default">
              {t("forms.planResponsible")}
            </label>
            <Input
              value={measurementPlanForm.planResponsible}
              onChange={(e) => setMeasurementPlanForm((prev: MeasurementPlanFormData) => ({...prev, planResponsible: e.target.value}))}
              placeholder={t("forms.planResponsiblePlaceholder")}
              disabled={!canCreatePlan}
            />
            {formErrors.planResponsible && (
              <p className="text-sm text-red-600">
                {formErrors.planResponsible.message}
              </p>
            )}
          </div>
        </div>


        <Button
          onClick={onNext}
          disabled={
            !canCreatePlan ||
            !measurementPlanForm.associatedProject ||
            !measurementPlanForm.planResponsible
          }
          variant="primary"
          className="w-full md:w-auto"
        >
          {t("workflow.nextObjectives")}
        </Button>
      </CardContent>
    </Card>
  );
};