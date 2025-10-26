"use client";

import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EstimateOverviewResponse } from "@/core/services/estimateService";
import { EstimateStatusSelector } from "@/presentation/views/FPA/components/EstimateStatusSelector";

interface EnhancedOverviewProps {
  estimateOverview: EstimateOverviewResponse;
}

export const EnhancedOverview: React.FC<EnhancedOverviewProps> = ({
  estimateOverview,
}) => {
  const { t } = useTranslation("fpa");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const translateComplexityLabel = (complexity: string): string => {
    const complexityKey = `charts.labels.complexity.${complexity}`;
    const translated = t(complexityKey);
    return translated !== complexityKey ? translated : complexity;
  };

  const translateComponentLabel = (abbreviation: string): string => {
    const labelMap: Record<string, string> = {
      ALI: t("workflow.components.aliLabel"),
      AIE: t("workflow.components.aieLabel"),
      EI: t("workflow.components.eiLabel"),
      EO: t("workflow.components.eoLabel"),
      EQ: t("workflow.components.eqLabel"),
    };
    return labelMap[abbreviation] || abbreviation;
  };

  const translateCountType = (countType: string): string => {
    const countTypeKey = `countTypes.${countType}`;
    return t(countTypeKey, { defaultValue: countType });
  };

  const getTranslatedProductivityMetrics = () => {
    return [
      {
        metric: t("charts.labels.productivityMetrics.Hours per Function Point"),
        value:
          (estimateOverview as any).productivityMetrics
            ?.hoursPerFunctionPoint || 0,
      },
      {
        metric: t("charts.labels.productivityMetrics.Function Points per Day"),
        value:
          (estimateOverview as any).productivityMetrics?.functionPointsPerDay ||
          0,
      },
      {
        metric: t(
          "charts.labels.productivityMetrics.Function Points per Person-Month"
        ),
        value:
          (estimateOverview as any).productivityMetrics
            ?.functionPointsPerPersonMonth || 0,
      },
    ];
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: "bg-background-secondary text-muted border-border",
      IN_PROGRESS: "bg-primary/10 text-primary border-primary/20",
      FINALIZED: "bg-green-50 text-green-700 border-green-200",
      ARCHIVED: "bg-background-secondary text-muted border-border",
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  const hasCostData =
    ((estimateOverview.costEstimation as any)?.totalCost ||
      estimateOverview.costEstimation?.estimatedTotalCost ||
      0) > 0;

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg border border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="mb-4">
              {estimateOverview.project && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center  gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {t("overview.project")}:
                    <span className="text-blue-700 font-semibold">
                      {estimateOverview.project.name}
                    </span>
                  </div>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-default mb-2">
                {estimateOverview.name}
              </h1>
              {estimateOverview.description && (
                <p className="text-secondary mb-3">
                  {estimateOverview.description}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted">
                {t("overview.createdAt")}:{" "}
                {formatDate(estimateOverview.createdAt)}
              </span>
              <span className="text-muted">•</span>
              <span className="text-muted">
                {t("estimateForm.countType")}:{" "}
                {translateCountType(
                  (estimateOverview as any).countingType ||
                    "DEVELOPMENT_PROJECT"
                )}
              </span>
              {estimateOverview.project && (
                <>
                  <span className="text-muted">•</span>
                  <span className="text-muted">
                    {t("overview.projectCreated")}:{" "}
                    {formatDate(estimateOverview.project.createdAt)}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:items-end gap-2">
            {estimateOverview.id ? (
              <div className="w-48">
                <EstimateStatusSelector
                  estimateId={estimateOverview.id}
                  currentStatus={estimateOverview.status || "draft"}
                />
              </div>
            ) : (
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                  estimateOverview.status || "DRAFT"
                )}`}
              >
                {t(
                  `status.${(estimateOverview.status || "DRAFT").toLowerCase()}`
                )}
              </span>
            )}
            <span className="text-sm text-muted">
              v{estimateOverview.version || 1}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="text-sm font-medium text-primary mb-1">
              {t("overview.adjustedFunctionPoints")}
            </div>
            <div className="text-2xl font-bold text-primary">
              {(estimateOverview as any).functionPointsSummary?.pfa.toFixed(
                2
              ) || 0}
            </div>
            <div className="text-xs text-primary/70 mt-1">
              {(estimateOverview as any).functionPointsSummary?.pfna || 0} PFNA
              ×{" "}
              {(
                (estimateOverview as any).functionPointsSummary
                  ?.adjustmentFactor || 1
              ).toFixed(2)}{" "}
              {t("overview.valueAdjustmentFactor")}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-medium text-green-700 mb-1">
              {t("overview.estimatedEffort")}
            </div>
            <div className="text-2xl font-bold text-green-800">
              {(estimateOverview as any).effortEstimation?.totalHours.toFixed(
                2
              ) || 0}
              h
            </div>
            <div className="text-xs text-green-600 mt-1">
              {(estimateOverview as any).effortEstimation?.durationDays
                ? `${Math.ceil(
                    (estimateOverview as any).effortEstimation.durationDays
                  )} days`
                : "0 days"}
            </div>
          </div>

          {hasCostData && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="text-sm font-medium text-amber-700 mb-1">
                {t("overview.totalCost")}
              </div>
              <div className="text-2xl font-bold text-amber-800">
                {formatCurrency(
                  (estimateOverview.costEstimation as any)?.totalCost ||
                    estimateOverview.costEstimation?.estimatedTotalCost ||
                    0
                )}
              </div>
              <div className="text-xs text-amber-600 mt-1">
                {formatCurrency(
                  (estimateOverview.costEstimation as any)
                    ?.costPerFunctionPoint ||
                    estimateOverview.costEstimation
                      ?.estimatedCostPerFunctionPoint ||
                    0
                )}
                {t("overview.perFunctionPoint")}
              </div>
            </div>
          )}

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-700 mb-1">
              {t("overview.totalComponents")}
            </div>
            <div className="text-2xl font-bold text-purple-800">
              {(estimateOverview as any).functionPointsSummary?.componentCounts
                ?.total?.count || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-default mb-4">
            {t("overview.projectConfiguration")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-secondary mb-1">
                {t("overview.teamSize")}
              </div>
              <div className="font-medium text-default">
                {(estimateOverview as any).projectConfig?.teamSize || 1}{" "}
                {t("overview.people")}
              </div>
            </div>
            <div>
              <div className="text-sm text-secondary mb-1">
                {t("overview.dailyHours")}
              </div>
              <div className="font-medium text-default">
                {(estimateOverview as any).projectConfig
                  ?.averageDailyWorkingHours || 8}
                h/dia
              </div>
            </div>
            <div>
              <div className="text-sm text-secondary mb-1">
                {t("overview.hourlyRate")}
              </div>
              <div className="font-medium text-default">
                {formatCurrency(
                  (estimateOverview as any).projectConfig?.hourlyRateBRL || 0
                )}
                /h
              </div>
            </div>
            <div>
              <div className="text-sm text-secondary mb-1">
                {t("overview.productivity")}
              </div>
              <div className="font-medium text-default">
                {(estimateOverview as any).projectConfig?.productivityFactor ||
                  20}
                h/PF
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-default mb-4">
            {t("overview.componentSummary")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-secondary text-sm">
                {t("components.aliTitle")}
              </span>
              <span className="font-medium text-default">
                {(estimateOverview as any).functionPointsSummary
                  ?.componentCounts?.ali?.count || 0}{" "}
                {t("components.components")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary text-sm">
                {t("components.aieTitle")}
              </span>
              <span className="font-medium text-default">
                {(estimateOverview as any).functionPointsSummary
                  ?.componentCounts?.aie?.count || 0}{" "}
                {t("components.components")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary text-sm">
                {t("components.eiTitle")}
              </span>
              <span className="font-medium text-default">
                {(estimateOverview as any).functionPointsSummary
                  ?.componentCounts?.ei?.count || 0}{" "}
                {t("components.components")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary text-sm">
                {t("components.eoTitle")}
              </span>
              <span className="font-medium text-default">
                {(estimateOverview as any).functionPointsSummary
                  ?.componentCounts?.eo?.count || 0}{" "}
                {t("components.components")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary text-sm">
                {t("components.eqTitle")}
              </span>
              <span className="font-medium text-default">
                {(estimateOverview as any).functionPointsSummary
                  ?.componentCounts?.eq?.count || 0}{" "}
                {t("components.components")}
              </span>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-default">{t("analysis.total")}</span>
                <span className="text-primary">
                  {(estimateOverview as any).functionPointsSummary
                    ?.componentCounts?.total?.count || 0}{" "}
                  {t("components.components")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-base font-semibold text-default mb-3">
              {t("charts.complexityDistribution")}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-lg font-bold text-green-800">
                  {(estimateOverview as any).functionPointsSummary
                    ?.complexityDistribution?.low?.count || 0}
                </div>
                <div className="text-xs text-green-600">
                  {t("complexityLabels.LOW")}
                </div>
              </div>
              <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-lg font-bold text-amber-800">
                  {(estimateOverview as any).functionPointsSummary
                    ?.complexityDistribution?.medium?.count || 0}
                </div>
                <div className="text-xs text-amber-600">
                  {t("complexityLabels.AVERAGE")}
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-lg font-bold text-red-800">
                  {(estimateOverview as any).functionPointsSummary
                    ?.complexityDistribution?.high?.count || 0}
                </div>
                <div className="text-xs text-red-600">
                  {t("complexityLabels.HIGH")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-default mb-4">
            {t("charts.functionPointDistribution")}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ cursor: "pointer" }}>
                <Pie
                  data={Object.entries(
                    (estimateOverview as any).functionPointsSummary
                      ?.componentCounts || {}
                  )
                    .filter(
                      ([key, item]) =>
                        key !== "total" && ((item as any)?.count || 0) > 0
                    )
                    .map(([key, item]) => ({
                      value: (item as any)?.points || 0,
                      abbreviation: key.toUpperCase(),
                      color:
                        key === "ali"
                          ? "#8b5cf6"
                          : key === "aie"
                          ? "#10b981"
                          : key === "ei"
                          ? "#f59e0b"
                          : key === "eo"
                          ? "#ef4444"
                          : "#6366f1",
                    }))}
                  dataKey="value"
                  nameKey="abbreviation"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ abbreviation, value }) =>
                    value > 0
                      ? `${translateComponentLabel(abbreviation)}: ${value}`
                      : null
                  }
                  strokeWidth={2}
                  stroke="#ffffff"
                >
                  {Object.entries(
                    (estimateOverview as any).functionPointsSummary
                      ?.componentCounts || {}
                  )
                    .filter(
                      ([key, item]) =>
                        key !== "total" && ((item as any)?.count || 0) > 0
                    )
                    .map(([key, item], index) => {
                      const color =
                        key === "ali"
                          ? "#8b5cf6"
                          : key === "aie"
                          ? "#10b981"
                          : key === "ei"
                          ? "#f59e0b"
                          : key === "eo"
                          ? "#ef4444"
                          : "#6366f1";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} ${t("calculations.fp")}`,
                    translateComponentLabel(name as string),
                  ]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    color: "#1f2937",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{
                    color: "#1f2937",
                    fontWeight: "500",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Object.entries(
              (estimateOverview as any).functionPointsSummary
                ?.componentCounts || {}
            )
              .filter(([key, item]) => key !== "total")
              .map(([key, item]) => {
                const color =
                  key === "ali"
                    ? "#8b5cf6"
                    : key === "aie"
                    ? "#10b981"
                    : key === "ei"
                    ? "#f59e0b"
                    : key === "eo"
                    ? "#ef4444"
                    : "#6366f1";
                const points = (item as any)?.points || 0;
                return (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className={`${
                        points > 0
                          ? "text-default font-medium"
                          : "text-secondary"
                      }`}
                    >
                      {translateComponentLabel(key.toUpperCase())}: {points}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-background rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-default mb-4">
            {t("charts.complexityDistribution")}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(
                  (estimateOverview as any).functionPointsSummary
                    ?.complexityDistribution || {}
                ).map(([key, item]) => ({
                  complexity: translateComplexityLabel(
                    key === "medium"
                      ? "Average"
                      : key.charAt(0).toUpperCase() + key.slice(1)
                  ),
                  count: (item as any)?.count || 0,
                  fill:
                    key === "low"
                      ? "#10b981"
                      : key === "medium"
                      ? "#f59e0b"
                      : "#ef4444",
                }))}
                style={{ cursor: "pointer" }}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="complexity"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  allowDecimals={false}
                  domain={[0, "dataMax"]}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value} ${t("charts.tooltips.components")}`,
                    t("charts.tooltips.count"),
                  ]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    color: "#1f2937",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{
                    color: "#1f2937",
                    fontWeight: "500",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6">
                  {Object.entries(
                    (estimateOverview as any).functionPointsSummary
                      ?.complexityDistribution || {}
                  ).map(([key, item], index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        key === "low"
                          ? "#10b981"
                          : key === "medium"
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {Object.entries(
              (estimateOverview as any).functionPointsSummary
                ?.complexityDistribution || {}
            ).map(([key, item]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor:
                      key === "low"
                        ? "#10b981"
                        : key === "medium"
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                />
                <span className="text-default font-medium">
                  {translateComplexityLabel(
                    key === "medium"
                      ? "Average"
                      : key.charAt(0).toUpperCase() + key.slice(1)
                  )}
                  : {(item as any)?.count || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-default mb-4">
          {t("overview.productivityMetrics")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getTranslatedProductivityMetrics().map((metric, index) => (
            <div
              key={index}
              className="text-center p-4 bg-background-secondary rounded-lg"
            >
              <div className="text-2xl font-bold text-primary mb-1">
                {typeof metric.value === "number"
                  ? metric.value.toFixed(1)
                  : metric.value}
              </div>
              <div className="text-sm text-secondary mb-2">{metric.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
