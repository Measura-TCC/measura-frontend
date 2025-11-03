import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/presentation/components/primitives";
import { Tabs } from "@/presentation/components/primitives/Tabs/Tabs";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import { useOrganizations } from "@/core/hooks/organizations";
import type {
  CycleWithData,
  MeasurementPlanResponseDto,
} from "@/core/types/plans";

interface MetricCalculationsChartProps {
  planId: string;
  plan: MeasurementPlanResponseDto;
  cyclesData: CycleWithData[];
}

interface CalculationDataPoint {
  cycleName: string;
  cycleDate: string;
  [metricName: string]: string | number | null;
}

export const MetricCalculationsChart: React.FC<
  MetricCalculationsChartProps
> = ({ planId, plan, cyclesData }) => {
  const { t } = useTranslation("plans");
  const { userOrganization } = useOrganizations({
    fetchUserOrganization: true,
  });
  const [calculations, setCalculations] = useState<
    Record<string, Record<string, number | null>>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCycleIds, setSelectedCycleIds] = useState<string[]>(["all"]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const nonEmptyCyclesData = useMemo(() => {
    return cyclesData.filter((cd) => cd.measurements.length > 0);
  }, [cyclesData]);

  const metricsWithFormulas = useMemo(() => {
    const metrics: Array<{
      metricId: string;
      metricName: string;
      metricFormula: string;
    }> = [];
    plan.objectives?.forEach((obj) => {
      obj.questions?.forEach((q) => {
        q.metrics?.forEach((m) => {
          if (m.metricFormula && m.metricFormula.trim() !== "") {
            metrics.push({
              metricId: m._id || "",
              metricName: m.metricName,
              metricFormula: m.metricFormula,
            });
          }
        });
      });
    });
    return metrics;
  }, [plan]);

  useEffect(() => {
    const fetchCalculations = async () => {
      if (
        !userOrganization?._id ||
        metricsWithFormulas.length === 0 ||
        nonEmptyCyclesData.length === 0
      ) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const results: Record<string, Record<string, number | null>> = {};

      for (const cycle of nonEmptyCyclesData) {
        results[cycle.cycle._id] = {};

        for (const metric of metricsWithFormulas) {
          try {
            const result = await measurementPlanService.calculateMetric({
              organizationId: userOrganization._id,
              planId,
              cycleId: cycle.cycle._id,
              metricId: metric.metricId,
            });
            results[cycle.cycle._id][metric.metricName] =
              result.calculatedValue;
          } catch (error) {
            results[cycle.cycle._id][metric.metricName] = null;
          }
        }
      }

      setCalculations(results);
      setIsLoading(false);
    };

    fetchCalculations();
  }, [userOrganization?._id, planId, metricsWithFormulas, nonEmptyCyclesData]);

  const handleCycleToggle = (cycleId: string) => {
    if (cycleId === "all") {
      setSelectedCycleIds(["all"]);
    } else {
      // If "all" is selected, unselect "all" and select all cycles except this one
      if (selectedCycleIds.includes("all")) {
        const allCycleIds = nonEmptyCyclesData
          .map((cd) => cd.cycle._id)
          .filter((id) => id !== cycleId);
        if (allCycleIds.length > 0) {
          setSelectedCycleIds(allCycleIds);
        }
        // If it would be empty, do nothing
      } else if (selectedCycleIds.includes(cycleId)) {
        // If this cycle is already selected, unselect it (only if not the last one)
        const filtered = selectedCycleIds.filter((id) => id !== cycleId);
        if (filtered.length > 0) {
          setSelectedCycleIds(filtered);
        }
        // If it would be empty, do nothing (keep at least one selected)
      } else {
        // Add this cycle to selection
        const newSelection = [...selectedCycleIds, cycleId];
        // Check if all cycles are now selected
        const allCycleIds = nonEmptyCyclesData.map((cd) => cd.cycle._id);
        if (newSelection.length === allCycleIds.length) {
          setSelectedCycleIds(["all"]);
        } else {
          setSelectedCycleIds(newSelection);
        }
      }
    }
  };

  const isAllSelected = selectedCycleIds.includes("all");
  const isValidSelection = isAllSelected || selectedCycleIds.length >= 2;
  const isOnlyOneCycleSelected =
    !isAllSelected && selectedCycleIds.length === 1;

  const filteredCyclesData = useMemo(() => {
    if (isAllSelected) {
      return nonEmptyCyclesData;
    }
    return nonEmptyCyclesData.filter((cd) =>
      selectedCycleIds.includes(cd.cycle._id)
    );
  }, [nonEmptyCyclesData, selectedCycleIds, isAllSelected]);

  const chartData: CalculationDataPoint[] = useMemo(() => {
    return filteredCyclesData.map((cycleData) => {
      const dataPoint: CalculationDataPoint = {
        cycleName: cycleData.cycle.cycleName,
        cycleDate: new Date(cycleData.cycle.startDate).toLocaleDateString(
          "pt-BR"
        ),
      };

      metricsWithFormulas.forEach((metric) => {
        const value = calculations[cycleData.cycle._id]?.[metric.metricName];
        dataPoint[metric.metricName] = value ?? null;
      });

      return dataPoint;
    });
  }, [filteredCyclesData, metricsWithFormulas, calculations]);

  const colors = useMemo(() => {
    const colorPalette = [
      "#8b5cf6", // purple
      "#10b981", // green
      "#f59e0b", // amber
      "#ef4444", // red
      "#6366f1", // indigo
      "#ec4899", // pink
      "#14b8a6", // teal
    ];
    const colorMap: Record<string, string> = {};
    metricsWithFormulas.forEach((metric, index) => {
      colorMap[metric.metricName] = colorPalette[index % colorPalette.length];
    });
    return colorMap;
  }, [metricsWithFormulas]);

  // Set initial selected metric
  useEffect(() => {
    if (selectedMetric === null && metricsWithFormulas.length > 0) {
      setSelectedMetric("all");
    }
  }, [selectedMetric, metricsWithFormulas]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".cycle-selector")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const filteredMetrics = useMemo(() => {
    if (!selectedMetric || selectedMetric === "all") return metricsWithFormulas;
    return metricsWithFormulas.filter((m) => m.metricName === selectedMetric);
  }, [metricsWithFormulas, selectedMetric]);

  if (metricsWithFormulas.length === 0 || nonEmptyCyclesData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle>{t("formulas.calculationsTrends")}</CardTitle>
          {cyclesData.length > 1 && (
            <div className="relative cycle-selector">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t("monitoring.filterByCycle")}:
              </label>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer min-w-[200px] flex items-center justify-between"
              >
                <span>
                  {isAllSelected
                    ? t("monitoring.allCycles")
                    : t("monitoring.cyclesSelected", {
                        count: selectedCycleIds.length,
                      })}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
                  <label className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={() => handleCycleToggle("all")}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                      style={{ accentColor: "var(--primary)" }}
                    />
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {t("monitoring.allCycles")}
                    </span>
                  </label>
                  <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  {cyclesData.map((cd) => {
                    const isEmpty = cd.measurements.length === 0;
                    const isCycleSelected = selectedCycleIds.includes(
                      cd.cycle._id
                    );
                    const isLastSelected =
                      isOnlyOneCycleSelected && isCycleSelected;
                    const isChecked = isAllSelected || isCycleSelected;
                    return (
                      <div key={cd.cycle._id} className="relative group">
                        <label
                          className={`flex items-center px-3 py-2 ${
                            !isEmpty && !isLastSelected
                              ? "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              !isEmpty &&
                              !isLastSelected &&
                              handleCycleToggle(cd.cycle._id)
                            }
                            disabled={isEmpty || isLastSelected}
                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ accentColor: "var(--primary)" }}
                          />
                          <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            {cd.cycle.cycleName}
                          </span>
                        </label>
                        {isEmpty && (
                          <div className="absolute left-0 top-full mt-1 w-48 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-2 px-3 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 ease-in-out">
                            {t("monitoring.cycleHasNoMeasurements")}
                            <div className="absolute bottom-full left-4 -mb-1 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                          </div>
                        )}
                        {isLastSelected && (
                          <div className="absolute left-0 top-full mt-1 w-48 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-2 px-3 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 ease-in-out">
                            {t("monitoring.cannotUnselectLastCycle")}
                            <div className="absolute bottom-full left-4 -mb-1 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isValidSelection && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4 min-h-[200px] flex items-center justify-center">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              {t("monitoring.selectAtLeastTwoCycles")}
            </p>
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : isValidSelection ? (
          <>
            {metricsWithFormulas.length > 1 && (
              <Tabs
                tabs={[
                  { id: "all", label: t("monitoring.allMetrics") || "All" },
                  ...metricsWithFormulas.map((metric) => ({
                    id: metric.metricName,
                    label: metric.metricName,
                  })),
                ]}
                activeTab={selectedMetric || "all"}
                onTabChange={(tab) => setSelectedMetric(tab)}
                className="mb-6"
              />
            )}

            <div className="h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 50, right: 30, left: 20, bottom: 60 }}
                >
                  <defs>
                    {metricsWithFormulas.map((metric) => (
                      <linearGradient
                        key={`gradient-${metric.metricId}`}
                        id={`color-${metric.metricId}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={colors[metric.metricName]}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={colors[metric.metricName]}
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="cycleName"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    label={{
                      value: t("monitoring.value"),
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#6b7280" },
                    }}
                  />
                  <Tooltip
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
                    formatter={(value: any) => {
                      if (value === null)
                        return [t("formulas.divisionByZero"), ""];
                      return [
                        typeof value === "number" ? value.toFixed(4) : value,
                        "",
                      ];
                    }}
                  />
                  {filteredMetrics.length > 1 && (
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{
                        paddingBottom: "20px",
                      }}
                      content={(props) => {
                        const { payload } = props;
                        return (
                          <div className="hidden sm:flex flex-wrap justify-center gap-4 pb-4">
                            {payload?.map((entry, index) => (
                              <div
                                key={`legend-${index}`}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {entry.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }}
                    />
                  )}
                  {filteredMetrics.map((metric) => (
                    <Area
                      key={metric.metricId}
                      type="monotone"
                      dataKey={metric.metricName}
                      stroke={colors[metric.metricName]}
                      fill={`url(#color-${metric.metricId})`}
                      strokeWidth={2}
                      dot={{ r: 4, fill: colors[metric.metricName] }}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {selectedMetric && selectedMetric !== "all" && (
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <div
                    className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: colors[selectedMetric] }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {selectedMetric}
                    </h4>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1">
                      {
                        metricsWithFormulas.find(
                          (m) => m.metricName === selectedMetric
                        )?.metricFormula
                      }
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {filteredCyclesData.length}{" "}
                      {t("monitoring.measurementsInCycle")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {selectedMetric === "all" && (
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t("formulas.metricsLegend")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {metricsWithFormulas.map((metric) => (
                    <div
                      key={metric.metricId}
                      className="flex items-start gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: colors[metric.metricName] }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {metric.metricName}
                        </p>
                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
                          {metric.metricFormula}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};
