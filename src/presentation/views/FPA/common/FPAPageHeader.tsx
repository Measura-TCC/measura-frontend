"use client";

import { useTranslation } from "react-i18next";
import { BuildingIcon } from "@/presentation/assets/icons";

interface FPAPageHeaderProps {
  organizationName?: string;
  hasOrganization: boolean;
  isLoadingOrganization: boolean;
}

export const FPAPageHeader: React.FC<FPAPageHeaderProps> = ({
  organizationName,
  hasOrganization,
  isLoadingOrganization,
}) => {
  const { t } = useTranslation("fpa");

  if (isLoadingOrganization) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse h-8 bg-background-secondary rounded w-1/3"></div>
        <div className="animate-pulse h-4 bg-background-secondary rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-default">{t("title")}</h1>
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
