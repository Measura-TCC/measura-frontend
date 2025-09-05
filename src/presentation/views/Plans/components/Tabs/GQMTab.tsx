"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ObjectiveQuestionMetricSelector } from "../ObjectiveQuestionMetricSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/primitives";

export const GQMTab = () => {
  const { t } = useTranslation("plans");
  const [selection, setSelection] = useState<any>(null);

  return (
    <div className="space-y-4">
      <ObjectiveQuestionMetricSelector onSelectionComplete={(sel) => setSelection(sel)} onCancel={() => setSelection(null)} />

      {selection && (
        <Card>
          <CardHeader>
            <CardTitle>{t("gqm.currentSelection")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-default">
              <div><span className="text-secondary">{t("gqm.objective")}:</span> {selection.objective?.name}</div>
              <div><span className="text-secondary">{t("gqm.question")}:</span> {selection.question?.text}</div>
              <div><span className="text-secondary">{t("gqm.metric")}:</span> {selection.metric?.name} ({selection.metric?.unit})</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

