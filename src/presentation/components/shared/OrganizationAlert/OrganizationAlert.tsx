"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/presentation/components/primitives";
import { PlusIcon, BuildingIcon } from "@/presentation/assets/icons";

interface OrganizationAlertProps {
  hasOrganization: boolean;
  translationNamespace?: string;
  onCreateClick?: () => void;
}

export const OrganizationAlert: React.FC<OrganizationAlertProps> = ({
  hasOrganization,
  translationNamespace = "organization",
  onCreateClick,
}) => {
  const { t } = useTranslation(translationNamespace);
  const router = useRouter();

  if (hasOrganization) {
    return null;
  }

  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      router.push("/organization");
    }
  };

  const descriptionKey = t("organizationRequiredDescription", {
    defaultValue: "",
  });
  const messageKey = t("organizationRequiredMessage", { defaultValue: "" });
  const description = descriptionKey || messageKey;

  return (
    <Card className="border-amber-200 bg-amber-50">
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BuildingIcon className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-900">
              {t("organizationRequired")}
            </h3>
          </div>
          <p className="text-sm text-amber-700">{description}</p>
          <div>
            <Button
              onClick={handleCreateClick}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("createOrganization")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
