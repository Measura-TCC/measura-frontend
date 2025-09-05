"use client";

import { useTranslation } from "react-i18next";

export const PlansPageHeader = ({
  organizationName,
  hasOrganization,
  isLoadingOrganization,
}: {
  organizationName?: string;
  hasOrganization?: boolean;
  isLoadingOrganization?: boolean;
}) => {
  const { t } = useTranslation("plans");
  return (
    <div>
      <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
      <p className="text-muted mt-1">{t("subtitle")}</p>
      {isLoadingOrganization ? (
        <div className="text-xs text-muted mt-1">Loading organization...</div>
      ) : hasOrganization ? (
        organizationName ? (
          <div className="text-xs text-secondary mt-1">{organizationName}</div>
        ) : null
      ) : null}
    </div>
  );
};

