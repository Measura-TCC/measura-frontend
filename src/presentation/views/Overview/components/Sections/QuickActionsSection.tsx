import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { ChartIcon, PlusIcon } from "@/presentation/assets/icons";

interface QuickActionsSectionProps {
  hasOrganization: boolean;
  onNewFPAEstimate: () => void;
  onNewMeasurementPlan: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  hasOrganization,
  onNewFPAEstimate,
  onNewMeasurementPlan,
}) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartIcon className="w-5 h-5 text-primary" />
          {t("quickActions")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={onNewFPAEstimate}
          disabled={!hasOrganization}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {t("newFPAEstimate")}
        </Button>
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={onNewMeasurementPlan}
          disabled={!hasOrganization}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {t("newMeasurementPlan")}
        </Button>
      </CardContent>
    </Card>
  );
};
