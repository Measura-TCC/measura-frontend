"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/presentation/components/primitives";
import { PlusIcon, DocumentIcon } from "@/presentation/assets/icons";

interface NoProjectsAlertProps {
  translationNamespace?: string;
  onActionClick?: () => void;
}

export const NoProjectsAlert: React.FC<NoProjectsAlertProps> = ({
  translationNamespace = "projects",
  onActionClick,
}) => {
  const { t } = useTranslation(translationNamespace);
  const router = useRouter();

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      router.push("/projects");
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <DocumentIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">
              {t("noProjectsTitle")}
            </h3>
          </div>
          <p className="text-sm text-blue-700">{t("noProjectsDescription")}</p>
          <div>
            <Button
              onClick={handleActionClick}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("goToProjects")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
