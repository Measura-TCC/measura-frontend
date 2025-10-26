"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/presentation/components/primitives";
import { PlusIcon, DocumentIcon } from "@/presentation/assets/icons";
import { canManageProjects } from "@/core/utils/permissions";

interface NoProjectsAlertProps {
  translationNamespace?: string;
  onActionClick?: () => void;
  userRole?: string;
}

export const NoProjectsAlert: React.FC<NoProjectsAlertProps> = ({
  translationNamespace = "projects",
  onActionClick,
  userRole,
}) => {
  const { t } = useTranslation(translationNamespace);
  const router = useRouter();
  const canManage = canManageProjects(userRole);

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      router.push("/projects");
    }
  };

  const description = canManage
    ? t("noProjectsDescription")
    : t("noProjectsUserMessage");

  const buttonText = canManage ? t("goToProjects") : t("viewProjects");

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <DocumentIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">
              {t("noProjectsTitle")}
            </h3>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">{description}</p>
          <div>
            <Button
              onClick={handleActionClick}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {canManage && <PlusIcon className="w-4 h-4 mr-2" />}
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
