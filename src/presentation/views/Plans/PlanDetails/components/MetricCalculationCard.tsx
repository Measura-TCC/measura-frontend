import { useTranslation } from "react-i18next";
import { Card } from "@/presentation/components/primitives";
import { useMetricCalculation } from "@/core/hooks/measurementPlans/useMetricCalculation";

interface MetricCalculationCardProps {
  organizationId: string;
  planId: string;
  cycleId: string;
  metricId: string;
  metricName: string;
  metricFormula: string;
}

export const MetricCalculationCard: React.FC<MetricCalculationCardProps> = ({
  organizationId,
  planId,
  cycleId,
  metricId,
  metricName,
  metricFormula,
}) => {
  const { t } = useTranslation("plans");
  const { calculation, error, isCalculating, isRevalidating } = useMetricCalculation({
    organizationId,
    planId,
    cycleId,
    metricId,
  });

  if (error) {
    const isUndefinedSymbol = error.includes("Undefined symbol") || error.includes("undefined symbol");
    const isMissingMeasurement = error.includes("not found") || error.includes("Missing measurement data") || isUndefinedSymbol;

    // Extract missing acronyms from error message
    // Pattern: "Missing measurement data for: TRS, TIN"
    const missingAcronymsMatch = error.match(/Missing measurement data for: ([A-Z0-9_, ]+)/);
    const missingAcronyms = missingAcronymsMatch
      ? missingAcronymsMatch[1].split(',').map((a: string) => a.trim())
      : [];

    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg relative">
        {/* Auto-revalidating indicator */}
        {isRevalidating && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title={t("formulas.autoRefreshing")} />
          </div>
        )}

        <div className="flex items-start gap-2 mb-2">
          <span className="text-red-600 dark:text-red-400 text-sm">✕</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
              {metricName}
            </p>
            <p className="text-xs font-mono text-red-600 dark:text-red-400 mb-2">
              {metricFormula}
            </p>
          </div>
        </div>

        {missingAcronyms.length > 0 ? (
          <>
            <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">
              {t("formulas.missingMeasurements")}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {missingAcronyms.map((acronym: string) => (
                <span
                  key={acronym}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700"
                >
                  {acronym}
                </span>
              ))}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              💡 {t("formulas.addMissingMeasurements")}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-red-600 dark:text-red-300 mb-2">{error}</p>
            {isMissingMeasurement && (
              <p className="text-xs text-red-500 dark:text-red-400">
                💡 {t("formulas.checkMeasurementAcronyms")}
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  if (!calculation) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden relative">
      {/* Auto-revalidating indicator */}
      {isRevalidating && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded-full">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-blue-700 dark:text-blue-300">{t("formulas.updating")}</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {metricName}
            </h4>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">
              {metricFormula}
            </p>
          </div>
        </div>

        {calculation.calculatedValue !== null ? (
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {calculation.calculatedValue.toFixed(4)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t("formulas.calculated")}
              </span>
            </div>

            {Object.keys(calculation.variables).length > 0 && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t("formulas.variables")}
                </p>
                <div className="space-y-1">
                  {Object.entries(calculation.variables).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="font-mono text-gray-600 dark:text-gray-400">
                        {key}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  {t("formulas.divisionByZero")}
                </p>
                {Object.keys(calculation.variables).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(calculation.variables).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="font-mono text-yellow-700 dark:text-yellow-400">
                          {key}
                        </span>
                        <span className="font-semibold text-yellow-900 dark:text-yellow-200">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
