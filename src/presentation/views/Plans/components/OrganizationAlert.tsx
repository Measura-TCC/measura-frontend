"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/presentation/components/primitives";

export const OrganizationAlert = ({ hasOrganization }: { hasOrganization?: boolean }) => {
  const { t } = useTranslation("plans");
  if (hasOrganization) return null;
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <div className="text-primary font-medium">{t("organizationRequired")}</div>
        </div>
        <p className="text-sm text-secondary mt-1">{t("organizationRequiredDescription")}</p>
        <div className="mt-2">
          <button className="px-3 py-1.5 text-sm bg-primary text-white rounded">
            {t("createOrganization")}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

