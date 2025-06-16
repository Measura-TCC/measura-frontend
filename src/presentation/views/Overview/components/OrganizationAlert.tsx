import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Button,
} from "@/presentation/components/primitives";
import { BuildingIcon, PlusIcon } from "@/presentation/assets/icons";

interface OrganizationAlertProps {
  hasOrganization: boolean;
  onCreateOrganization: () => void;
}

export const OrganizationAlert: React.FC<OrganizationAlertProps> = ({
  hasOrganization,
  onCreateOrganization,
}) => {
  const { t } = useTranslation("organization");

  if (hasOrganization) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-3">
          <BuildingIcon className="w-6 h-6 text-amber-600" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-900">
              {t("organizationRequired")}
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              {t("organizationRequiredMessage")}
            </p>
          </div>
          <Button onClick={onCreateOrganization} size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("createOrganization")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
