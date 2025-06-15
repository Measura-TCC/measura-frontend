import { useTranslation } from "react-i18next";
import { BuildingIcon } from "@/presentation/assets/icons";

interface PlansPageHeaderProps {
  organizationName?: string;
  hasOrganization: boolean;
  isLoadingOrganization: boolean;
}

export const PlansPageHeader: React.FC<PlansPageHeaderProps> = ({
  organizationName,
  hasOrganization,
  isLoadingOrganization,
}) => {
  const { t } = useTranslation("plans");

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
      <p className="text-muted mt-1">{t("subtitle")}</p>
      {hasOrganization && organizationName && (
        <p className="text-sm text-secondary mt-1 flex items-center gap-2">
          <BuildingIcon className="w-4 h-4" />
          {organizationName}
        </p>
      )}
    </div>
  );
};
