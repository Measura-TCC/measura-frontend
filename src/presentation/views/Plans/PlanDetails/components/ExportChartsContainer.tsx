import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
import type {
  CycleWithData,
  MeasurementPlanResponseDto,
} from "@/core/types/plans";
import { captureMultipleCharts, type ChartImage } from "@/core/utils/chartCapture";

interface ExportChartsContainerProps {
  planId: string;
  plan: MeasurementPlanResponseDto;
  cyclesData: CycleWithData[];
  calculations: Record<string, Record<string, number | null>>;
  metricsWithFormulas: Array<{
    metricId: string;
    metricName: string;
    metricFormula: string;
  }>;
}

export interface ExportChartsContainerRef {
  captureCharts: () => Promise<ChartImage[]>;
}

interface CalculationDataPoint {
  cycleName: string;
  cycleDate: string;
  [metricName: string]: string | number | null;
}

/**
 * Hidden container that renders charts for export capture
 * This component is rendered off-screen and used to capture chart images
 */
export const ExportChartsContainer = forwardRef<
  ExportChartsContainerRef,
  ExportChartsContainerProps
>(({ planId, plan, cyclesData, calculations, metricsWithFormulas }, ref) => {
  const { t } = useTranslation("plans");
  const chartRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [isCapturing, setIsCapturing] = useState(false);

  const nonEmptyCyclesData = cyclesData.filter(
    (cd) => cd.measurements.length > 0
  );

  const chartData: CalculationDataPoint[] = nonEmptyCyclesData.map(
    (cycleData) => {
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
    }
  );

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
  metricsWithFormulas.forEach((metric, index) => {
    colors[metric.metricName] = colorPalette[index % colorPalette.length];
  });

  useImperativeHandle(ref, () => ({
    captureCharts: async () => {
      setIsCapturing(true);

      try {
        // Wait a bit for rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 500));

        const chartsToCapture: Array<{ id: string; element: HTMLElement }> = [];

        // Capture overview chart (all metrics)
        const overviewChartElement = chartRefs.current.get("overview-chart");
        if (overviewChartElement) {
          chartsToCapture.push({
            id: "metric-calculations-overview",
            element: overviewChartElement,
          });
        }

        // Capture individual metric charts
        metricsWithFormulas.forEach((metric) => {
          const chartElement = chartRefs.current.get(
            `metric-${metric.metricId}`
          );
          if (chartElement) {
            chartsToCapture.push({
              id: `metric-${metric.metricName}`,
              element: chartElement,
            });
          }
        });

        const capturedImages = await captureMultipleCharts(chartsToCapture, {
          scale: 1.5,
          backgroundColor: "#ffffff",
          compress: true,
          quality: 0.5,
        });

        // Log image sizes for debugging
        capturedImages.forEach((img) => {
          const sizeInBytes = Math.round((img.data.length * 3) / 4);
          const sizeInKB = (sizeInBytes / 1024).toFixed(2);
          console.log(`Chart ${img.id}: ${sizeInKB} KB (${img.width}x${img.height})`);
        });

        const totalSize = capturedImages.reduce((sum, img) => {
          return sum + Math.round((img.data.length * 3) / 4);
        }, 0);
        console.log(`Total chart images size: ${(totalSize / 1024).toFixed(2)} KB`);

        return capturedImages;
      } catch (error) {
        console.error("Error capturing charts:", error);
        throw error;
      } finally {
        setIsCapturing(false);
      }
    },
  }));

  if (
    metricsWithFormulas.length === 0 ||
    nonEmptyCyclesData.length === 0 ||
    chartData.length < 2
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        top: "0",
        width: "1200px",
        visibility: isCapturing ? "visible" : "hidden",
      }}
      aria-hidden="true"
    >
      {/* Overview Chart - All Metrics */}
      <div
        ref={(el) => { chartRefs.current.set("overview-chart", el); }}
        style={{
          width: "1200px",
          height: "600px",
          backgroundColor: "#ffffff",
          padding: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#1f2937",
          }}
        >
          {t("formulas.calculationsTrends")}
        </h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              {metricsWithFormulas.map((metric) => (
                <linearGradient
                  key={`gradient-${metric.metricId}`}
                  id={`export-color-${metric.metricId}`}
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
              }}
              formatter={(value: any) => {
                if (value === null) return [t("formulas.divisionByZero"), ""];
                return [
                  typeof value === "number" ? value.toFixed(4) : value,
                  "",
                ];
              }}
            />
            {metricsWithFormulas.length > 1 && (
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  paddingBottom: "20px",
                }}
              />
            )}
            {metricsWithFormulas.map((metric) => (
              <Area
                key={metric.metricId}
                type="monotone"
                dataKey={metric.metricName}
                stroke={colors[metric.metricName]}
                fill={`url(#export-color-${metric.metricId})`}
                strokeWidth={2}
                dot={{ r: 4, fill: colors[metric.metricName] }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Metric Charts */}
      {metricsWithFormulas.map((metric) => (
        <div
          key={metric.metricId}
          ref={(el) => { chartRefs.current.set(`metric-${metric.metricId}`, el); }}
          style={{
            width: "1200px",
            height: "600px",
            backgroundColor: "#ffffff",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "10px",
              color: "#1f2937",
            }}
          >
            {metric.metricName}
          </h3>
          <p
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#6b7280",
              marginBottom: "20px",
            }}
          >
            {metric.metricFormula}
          </p>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient
                  id={`export-single-color-${metric.metricId}`}
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
                }}
                formatter={(value: any) => {
                  if (value === null) return [t("formulas.divisionByZero"), ""];
                  return [
                    typeof value === "number" ? value.toFixed(4) : value,
                    "",
                  ];
                }}
              />
              <Area
                type="monotone"
                dataKey={metric.metricName}
                stroke={colors[metric.metricName]}
                fill={`url(#export-single-color-${metric.metricId})`}
                strokeWidth={2}
                dot={{ r: 4, fill: colors[metric.metricName] }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
});

ExportChartsContainer.displayName = "ExportChartsContainer";
