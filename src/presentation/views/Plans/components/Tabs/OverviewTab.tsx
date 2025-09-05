"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/primitives";

export const OverviewTab = ({ totalPlans, activePlans, completedPlans }: { totalPlans: number; activePlans: number; completedPlans: number }) => {
  const { t } = useTranslation("plans");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("statistics")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-secondary">{t("totalPlans")}</span>
            <span className="font-semibold text-default">{totalPlans}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">{t("status.active")}</span>
            <span className="font-semibold text-default">{activePlans}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">{t("status.completed")}</span>
            <span className="font-semibold text-default">{completedPlans}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

