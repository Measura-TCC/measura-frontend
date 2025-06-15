import { useTranslation } from "react-i18next";
import { BuildingIcon } from "@/presentation/assets/icons";

interface OverviewPageHeaderProps {
  user: {
    name: string;
    role: string;
  };
  organizationName?: string;
  organizationDescription?: string;
  hasOrganization: boolean;
  isLoadingOrganization: boolean;
}

export const OverviewPageHeader: React.FC<OverviewPageHeaderProps> = ({
  user,
  organizationName,
  organizationDescription,
  hasOrganization,
  isLoadingOrganization,
}) => {
  const { t } = useTranslation("dashboard");

  if (isLoadingOrganization) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
      <p className="text-muted mt-1">{t("welcome", { name: user?.name })}</p>
      {hasOrganization && organizationName && (
        <p className="text-sm text-secondary mt-1 flex items-center gap-2">
          <BuildingIcon className="w-4 h-4" />
          {organizationName}
          {organizationDescription && ` - ${organizationDescription}`}
        </p>
      )}
    </div>
  );
};
