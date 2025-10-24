import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { Tabs } from "@/presentation/components/primitives";
import type { CycleWithData } from "@/core/types/plans";

interface MeasurementChartProps {
  cyclesData: CycleWithData[];
}

export const MeasurementChart: React.FC<MeasurementChartProps> = ({ cyclesData }) => {
  const { t } = useTranslation("plans");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<string>("all");

  // Transform data for chart - group measurements by metric name
  const chartData = cyclesData.flatMap((cycleData) =>
    cycleData.measurements.map((measurement) => ({
      cycleId: cycleData.cycle._id,
      cycleName: cycleData.cycle.cycleName,
      date: new Date(measurement.date).toLocaleDateString('pt-BR'),
      fullDate: measurement.date,
      metricName: measurement.metricName,
      measurementName: measurement.measurementDefinitionName,
      value: measurement.value,
    }))
  ).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  // Get unique cycles
  const uniqueCycles = cyclesData.map(cd => ({
    id: cd.cycle._id,
    name: cd.cycle.cycleName
  }));

  // Get unique metrics for different bar colors
  const uniqueMetrics = Array.from(new Set(chartData.map(d => d.metricName)));

  // Count measurements per metric
  const metricCounts: Record<string, number> = {};
  uniqueMetrics.forEach(metric => {
    metricCounts[metric] = chartData.filter(d => d.metricName === metric).length;
  });

  // Define colors for different metrics
  const colors: Record<string, string> = {};
  const colorPalette = [
    "#8b5cf6", // purple
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#6366f1", // indigo
    "#ec4899", // pink
    "#14b8a6", // teal
  ];

  uniqueMetrics.forEach((metric, index) => {
    colors[metric] = colorPalette[index % colorPalette.length];
  });

  // Set initial selected metric
  if (selectedMetric === null && uniqueMetrics.length > 0) {
    setSelectedMetric(uniqueMetrics[0]);
  }

  // Filter data by selected metric and cycle
  const filteredChartData = chartData.filter(d => {
    const matchesMetric = selectedMetric ? d.metricName === selectedMetric : true;
    const matchesCycle = selectedCycle === "all" ? true : d.cycleId === selectedCycle;
    return matchesMetric && matchesCycle;
  });

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-background rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-default">
          {t("monitoring.measurementTrends")}
        </h3>

        {/* Cycle Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="cycle-filter" className="text-sm text-secondary whitespace-nowrap">
            {t("monitoring.filterByCycle")}:
          </label>
          <select
            id="cycle-filter"
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-default focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">{t("monitoring.allCycles")}</option>
            {uniqueCycles.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Tabs */}
      <Tabs
        tabs={uniqueMetrics.map((metricName) => ({
          id: metricName,
          label: `${metricName} (${metricCounts[metricName]})`,
        }))}
        activeTab={selectedMetric || uniqueMetrics[0]}
        onTabChange={(tab) => setSelectedMetric(tab)}
        className="mb-6"
      />

      {/* Chart for selected metric */}
      {selectedMetric && (
        <>
          {filteredChartData.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h4 className="text-lg font-medium text-default mb-2">
                {t("monitoring.noDataForMetric")}
              </h4>
              <p className="text-sm text-secondary max-w-md">
                {selectedCycle === "all"
                  ? t("monitoring.noDataForMetricDescription")
                  : t("monitoring.noDataForMetricInCycle")}
              </p>
            </div>
          ) : (
            <>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    style={{ cursor: "pointer" }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
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
                        position: 'insideLeft',
                        style: { fill: '#6b7280' }
                      }}
                      allowDecimals={false}
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
                    />
                    <Bar
                      dataKey="value"
                      fill={colors[selectedMetric]}
                      name={selectedMetric}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Metric details */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: colors[selectedMetric] }}
                    />
                    <div>
                      <h4 className="text-base font-semibold text-default">{selectedMetric}</h4>
                      <p className="text-sm text-secondary">
                        {filteredChartData.length} {t("monitoring.measurementsInCycle")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-secondary">{t("monitoring.latestValue")}</p>
                    <p className="text-2xl font-bold text-primary">
                      {filteredChartData[filteredChartData.length - 1]?.value || 0}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
