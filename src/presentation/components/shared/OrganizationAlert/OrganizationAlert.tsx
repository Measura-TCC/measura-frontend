"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/presentation/components/primitives";
import { PlusIcon, BuildingIcon } from "@/presentation/assets/icons";
import { canManageOrganization } from "@/core/utils/permissions";

interface OrganizationAlertProps {
  hasOrganization: boolean;
  translationNamespace?: string;
  onCreateClick?: () => void;
  userRole?: string;
}

export const OrganizationAlert: React.FC<OrganizationAlertProps> = ({
  hasOrganization,
  translationNamespace = "organization",
  onCreateClick,
  userRole,
}) => {
  const { t } = useTranslation(translationNamespace);
  const router = useRouter();
  const canManage = canManageOrganization(userRole);

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

  const description = canManage
    ? t("organizationRequiredMessage")
    : t("organizationRequiredUserMessage");

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BuildingIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
              {t("organizationRequired")}
            </h3>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300">{description}</p>
          {canManage && (
            <div>
              <Button
                onClick={handleCreateClick}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                {t("createOrganization")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
