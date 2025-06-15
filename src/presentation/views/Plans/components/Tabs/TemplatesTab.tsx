import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { DocumentIcon } from "@/presentation/assets/icons";
import { PlanTemplate } from "@/core/types/plans";

interface TemplatesTabProps {
  templates: PlanTemplate[];
  canCreatePlan: boolean;
  onApplyTemplate: (template: PlanTemplate) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  templates,
  canCreatePlan,
  onApplyTemplate,
}) => {
  const { t } = useTranslation("plans");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DocumentIcon className="w-5 h-5 text-primary" />
          {t("planTemplates")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 border border-border rounded-lg transition-colors ${
              canCreatePlan
                ? "cursor-pointer hover:bg-background-secondary hover:border-primary/20"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={() => canCreatePlan && onApplyTemplate(template)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-default text-sm">
                {template.name}
              </h4>
              <span className="px-2 py-1 bg-background-secondary text-xs rounded capitalize">
                {t(`types.${template.type}`)}
              </span>
            </div>
            <p className="text-xs text-muted mb-3">{template.description}</p>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-secondary font-medium">
                  {t("duration")}:
                </span>
                <span className="ml-1 text-muted">
                  {template.estimatedDuration} {t("days")}
                </span>
              </div>
              <div>
                <span className="text-secondary font-medium">
                  {t("goals")}:
                </span>
                <span className="ml-1 text-muted">{template.goalsCount}</span>
              </div>
              <div>
                <span className="text-secondary font-medium">
                  {t("metrics")}:
                </span>
                <span className="ml-1 text-muted">{template.metricsCount}</span>
              </div>
            </div>
            {canCreatePlan && (
              <div className="mt-3 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyTemplate(template);
                  }}
                  className="w-full"
                >
                  {t("useTemplate")}
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
