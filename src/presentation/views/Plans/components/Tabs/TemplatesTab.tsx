"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/primitives";

export const TemplatesTab = ({ onApplyTemplate }: { onApplyTemplate?: (templateId: string) => void }) => {
  const { t } = useTranslation("plans");
  const templates = [
    { id: "quality", title: t("qualityAssurance"), desc: t("qualityDescription") },
    { id: "productivity", title: t("productivityAnalysis"), desc: t("productivityDescription") },
    { id: "performance", title: t("projectPerformance"), desc: t("performanceDescription") },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("planTemplates")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="p-3 border border-border rounded-lg cursor-pointer hover:bg-background-secondary" onClick={() => onApplyTemplate?.(tpl.id)}>
            <h4 className="font-medium text-default text-sm">{tpl.title}</h4>
            <p className="text-xs text-muted mt-1">{tpl.desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

