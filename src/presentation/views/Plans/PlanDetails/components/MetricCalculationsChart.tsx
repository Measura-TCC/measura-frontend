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
import { Card, CardHeader, CardTitle, CardContent } from "@/presentation/components/primitives";
import { Tabs } from "@/presentation/components/primitives/Tabs/Tabs";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import { useOrganizations } from "@/core/hooks/organizations";
import type { CycleWithData, MeasurementPlanResponseDto } from "@/core/types/plans";

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

export const MetricCalculationsChart: React.FC<MetricCalculationsChartProps> = ({
  planId,
  plan,
  cyclesData,
}) => {
  const { t } = useTranslation("plans");
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const [calculations, setCalculations] = useState<Record<string, Record<string, number | null>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCycleId, setSelectedCycleId] = useState<string>("all");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const metricsWithFormulas = useMemo(() => {
    const metrics: Array<{ metricId: string; metricName: string; metricFormula: string }> = [];
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
      if (!userOrganization?._id || metricsWithFormulas.length === 0 || cyclesData.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const results: Record<string, Record<string, number | null>> = {};

      for (const cycle of cyclesData) {
        results[cycle.cycle._id] = {};

        for (const metric of metricsWithFormulas) {
          try {
            const result = await measurementPlanService.calculateMetric({
              organizationId: userOrganization._id,
              planId,
              cycleId: cycle.cycle._id,
              metricId: metric.metricId,
            });
            results[cycle.cycle._id][metric.metricName] = result.calculatedValue;
          } catch (error) {
            results[cycle.cycle._id][metric.metricName] = null;
          }
        }
      }

      setCalculations(results);
      setIsLoading(false);
    };

    fetchCalculations();
  }, [userOrganization?._id, planId, metricsWithFormulas, cyclesData]);

  const filteredCyclesData = useMemo(() => {
    if (selectedCycleId === "all") {
      return cyclesData;
    }
    return cyclesData.filter((cd) => cd.cycle._id === selectedCycleId);
  }, [cyclesData, selectedCycleId]);

  const chartData: CalculationDataPoint[] = useMemo(() => {
    return filteredCyclesData.map((cycleData) => {
      const dataPoint: CalculationDataPoint = {
        cycleName: cycleData.cycle.cycleName,
        cycleDate: new Date(cycleData.cycle.startDate).toLocaleDateString("pt-BR"),
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

  const filteredMetrics = useMemo(() => {
    if (!selectedMetric || selectedMetric === "all") return metricsWithFormulas;
    return metricsWithFormulas.filter((m) => m.metricName === selectedMetric);
  }, [metricsWithFormulas, selectedMetric]);

  if (metricsWithFormulas.length === 0 || cyclesData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle>{t("formulas.calculationsTrends")}</CardTitle>
          {cyclesData.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                {t("monitoring.filterByCycle")}:
              </label>
              <select
                value={selectedCycleId}
                onChange={(e) => setSelectedCycleId(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="all">{t("monitoring.allCycles")}</option>
                {cyclesData.map((cd) => (
                  <option key={cd.cycle._id} value={cd.cycle._id}>
                    {cd.cycle.cycleName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Metric Tabs */}
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
                      if (value === null) return [t("formulas.divisionByZero"), ""];
                      return [typeof value === "number" ? value.toFixed(4) : value, ""];
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
                              <div key={`legend-${index}`} className="flex items-center gap-2">
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
                      {metricsWithFormulas.find((m) => m.metricName === selectedMetric)?.metricFormula}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {filteredCyclesData.length} {t("monitoring.measurementsInCycle")}
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
                    <div key={metric.metricId} className="flex items-start gap-2">
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
        )}
      </CardContent>
    </Card>
  );
};
