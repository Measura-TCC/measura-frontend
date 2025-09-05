"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, Button, SearchableDropdown, type SearchableDropdownItem } from "@/presentation/components/primitives";
import { getGqmTemplates, getCommonQuestions, getMetricTemplates } from "@/core/utils/gqmItems";

type Objective = ReturnType<typeof getGqmTemplates>[number];

interface SelectionState {
  objective: Objective | null;
  question: { id: string; text: string } | null;
  metric: { id: string; name: string; unit: string; description: string } | null;
}

export const ObjectiveQuestionMetricSelector = ({
  onSelectionComplete,
  onCancel,
}: {
  onSelectionComplete: (selection: SelectionState) => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation(["plans", "gqm"]);
  const [selection, setSelection] = useState<SelectionState>({ objective: null, question: null, metric: null });

  // Build items from i18n-backed helpers
  const objectives = getGqmTemplates((key) => t(key, { ns: "gqm" }));
  const objItems: SearchableDropdownItem[] = objectives.map((o) => ({ id: o.id, label: o.name, value: o.id }));

  const questionsByCat = getCommonQuestions((key) => t(key, { ns: "gqm" }));
  const questionItems: SearchableDropdownItem[] = selection.objective
    ? (questionsByCat.find((q) => q.category === selection.objective!.id)?.questions || []).map((q, i) => ({
        id: `${selection.objective!.id}-q${i}`,
        label: q,
        value: `${selection.objective!.id}-q${i}`,
      }))
    : [];

  const metrics = getMetricTemplates((key) => t(key, { ns: "gqm" }));
  const metricItems: SearchableDropdownItem[] = selection.question
    ? metrics.map((m, i) => ({ id: `m-${i}`, label: `${m.name} (${m.unit})`, value: `m-${i}` }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("gqm.selectMeasurementFocus", { ns: "plans" })}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary text-sm">{t("gqm.selectMeasurementFocusDescription", { ns: "plans" })}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-default block mb-2">{t("gqm.selectObjective", { ns: "plans" })}</label>
            <SearchableDropdown
              items={objItems}
              value={selection.objective?.id}
              onChange={(val) => {
                const obj = objectives.find((o) => o.id === val) || null;
                setSelection({ objective: obj, question: null, metric: null });
              }}
              placeholder={t("gqm.chooseObjective", { ns: "plans" })}
              searchPlaceholder={t("gqm.searchObjectives", { ns: "plans" })}
              emptyMessage={t("gqm.notStarted", { ns: "plans" })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-default block mb-2">{t("gqm.selectQuestion", { ns: "plans" })}</label>
            <SearchableDropdown
              items={questionItems}
              value={selection.question?.id}
              onChange={(val) => {
                if (!val) return setSelection((s) => ({ ...s, question: null, metric: null }));
                const q = questionItems.find((qi) => qi.value === val);
                if (q) setSelection((s) => ({ ...s, question: { id: q.value, text: String(q.label) }, metric: null }));
              }}
              placeholder={t("gqm.chooseQuestion", { ns: "plans" })}
              searchPlaceholder={t("gqm.searchQuestions", { ns: "plans" })}
              emptyMessage={t("gqm.noPlansForGQM", { ns: "plans" })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-default block mb-2">{t("gqm.selectMetric", { ns: "plans" })}</label>
            <SearchableDropdown
              items={metricItems}
              value={selection.metric?.id}
              onChange={(val) => {
                if (!val) return setSelection((s) => ({ ...s, metric: null }));
                const idx = parseInt(val.split("-")[1] || "0", 10);
                const tm = metrics[idx];
                if (tm) setSelection((s) => ({ ...s, metric: { id: val, name: tm.name, unit: tm.unit, description: tm.description } }));
              }}
              placeholder={t("gqm.chooseMetric", { ns: "plans" })}
              searchPlaceholder={t("gqm.searchMetrics", { ns: "plans" })}
              emptyMessage={t("gqm.noPlansForGQM", { ns: "plans" })}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => selection.objective && selection.question && selection.metric && onSelectionComplete(selection)}
            disabled={!selection.objective || !selection.question || !selection.metric}
          >
            {t("gqm.startSelection", { ns: "plans" })}
          </Button>
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

