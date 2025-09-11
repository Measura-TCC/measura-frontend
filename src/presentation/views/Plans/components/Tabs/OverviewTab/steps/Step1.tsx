import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";
import type { GoalForm } from "../utils/types";
import { purposeOptions } from "../utils/stepData";

interface PlanFormData {
  name: string;
  description: string;
  type: string;
  owner: string;
}

interface Step1Props {
  planForm: UseFormReturn<PlanFormData>;
  formErrors: Record<string, { message?: string }>;
  canCreatePlan: boolean;
  goalForm: GoalForm;
  setGoalForm: React.Dispatch<React.SetStateAction<GoalForm>>;
  onNext: () => void;
}

export const Step1: React.FC<Step1Props> = ({
  planForm,
  formErrors,
  canCreatePlan,
  goalForm,
  setGoalForm,
  onNext,
}) => {
  const { t } = useTranslation("plans");
  const { register } = planForm;

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
              {t("forms.planName")}
            </label>
            <Input
              {...register("name")}
              placeholder={t("forms.planNamePlaceholder")}
              disabled={!canCreatePlan}
            />
            {formErrors.name && (
              <p className="text-sm text-red-600">
                {formErrors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-default">
              {t("forms.owner")}
            </label>
            <Input
              {...register("owner")}
              placeholder={t("forms.ownerPlaceholder")}
              disabled={!canCreatePlan}
            />
            {formErrors.owner && (
              <p className="text-sm text-red-600">
                {formErrors.owner.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-default">
            {t("forms.description")}
          </label>
          <textarea
            {...register("description")}
            placeholder={t("forms.descriptionPlaceholder")}
            disabled={!canCreatePlan}
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
          />
          {formErrors.description && (
            <p className="text-sm text-red-600">
              {formErrors.description.message}
            </p>
          )}
        </div>

        <div className="border-t border-border pt-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("goalForm.purpose")}
              </label>
              <select
                value={goalForm.purpose}
                onChange={(e) => setGoalForm(prev => ({...prev, purpose: e.target.value}))}
                disabled={!canCreatePlan}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
              >
                <option value="">{t("goalForm.selectPurpose")}</option>
                {purposeOptions.map(purpose => (
                  <option key={purpose} value={purpose}>
                    {t(purpose)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("goalForm.issue")}
              </label>
              <textarea
                value={goalForm.issue}
                onChange={(e) => setGoalForm(prev => ({...prev, issue: e.target.value}))}
                placeholder={t("goalForm.issuePlaceholder")}
                disabled={!canCreatePlan}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("goalForm.viewpoint")}
              </label>
              <textarea
                value={goalForm.viewpoint}
                onChange={(e) => setGoalForm(prev => ({...prev, viewpoint: e.target.value}))}
                placeholder={t("goalForm.viewpointPlaceholder")}
                disabled={!canCreatePlan}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("goalForm.context")}
              </label>
              <textarea
                value={goalForm.context}
                onChange={(e) => setGoalForm(prev => ({...prev, context: e.target.value}))}
                placeholder={t("goalForm.contextPlaceholder")}
                disabled={!canCreatePlan}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={onNext}
          disabled={!canCreatePlan}
          variant="primary"
          className="w-full md:w-auto"
        >
          {t("workflow.nextObjectives")}
        </Button>
      </CardContent>
    </Card>
  );
};