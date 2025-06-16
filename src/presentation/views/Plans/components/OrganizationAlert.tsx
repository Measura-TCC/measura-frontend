import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Button,
} from "@/presentation/components/primitives";
import { PlusIcon, BuildingIcon } from "@/presentation/assets/icons";

interface OrganizationAlertProps {
  hasOrganization: boolean;
}

export const OrganizationAlert: React.FC<OrganizationAlertProps> = ({
  hasOrganization,
}) => {
  const { t } = useTranslation("plans");
  const router = useRouter();

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
              {t("organizationRequiredDescription")}
            </p>
          </div>
          <Button
            onClick={() => router.push("/organization")}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("createOrganization")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
