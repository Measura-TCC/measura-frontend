"use client";

import {
  useFPACalculations,
  ComponentDetail,
  ProjectConfig,
} from "@/core/hooks/fpa/calculations/useFPACalculations";

interface EstimateOverview {
  _id: string;
  name: string;
  description?: string;
  project: { name: string };
  status: string;
  averageDailyWorkingHours: number;
  teamSize: number;
  hourlyRateBRL: number;
  productivityFactor: number;
  generalSystemCharacteristics?: number[];
  createdAt: string;
  updatedAt: string;
}

interface EnhancedOverviewProps {
  estimate: EstimateOverview;
  components: ComponentDetail[];
}

export const EnhancedOverview = ({
  estimate,
  components,
}: EnhancedOverviewProps) => {
  const projectConfig: ProjectConfig = {
    averageDailyWorkingHours: estimate.averageDailyWorkingHours,
    teamSize: estimate.teamSize,
    hourlyRateBRL: estimate.hourlyRateBRL,
    productivityFactor: estimate.productivityFactor,
    generalSystemCharacteristics: estimate.generalSystemCharacteristics,
  };

  const calculations = useFPACalculations(components, projectConfig);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FINALIZED":
        return "bg-green-100 text-green-800 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DRAFT":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "ARCHIVED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "bg-green-50 text-green-700 border-green-200";
      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getProductivityColor = (rating: string) => {
    switch (rating) {
      case "HIGH":
        return "bg-green-100 text-green-800";
      case "LOW":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {estimate.name}
            </h1>
            <p className="text-gray-600">{estimate.project.name}</p>
            {estimate.description && (
              <p className="text-gray-500 mt-1">{estimate.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                estimate.status
              )}`}
            >
              {estimate.status}
            </span>
            <span className="text-sm text-gray-500">
              Updated {formatDate(estimate.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-sm font-medium text-blue-700 mb-1">
            Function Points
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-1">
            {calculations.pfa.toFixed(1)}
          </div>
          <div className="text-xs text-blue-600">
            {calculations.pfna} PFNA × {calculations.fa.toFixed(2)} FA
          </div>
          <div className="text-xs text-blue-500 mt-1">
            Adjustment: {calculations.ni} TDI
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-sm font-medium text-green-700 mb-1">
            Total Effort
          </div>
          <div className="text-3xl font-bold text-green-900 mb-1">
            {calculations.effortHours.toFixed(0)}h
          </div>
          <div className="text-xs text-green-600">
            {calculations.durationDays.toFixed(1)} days
          </div>
          <div className="text-xs text-green-500 mt-1">
            {calculations.durationMonths.toFixed(1)} months
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-sm font-medium text-yellow-700 mb-1">
            Total Cost
          </div>
          <div className="text-3xl font-bold text-yellow-900 mb-1">
            {formatCurrency(calculations.totalCost)}
          </div>
          <div className="text-xs text-yellow-600">
            {formatCurrency(calculations.costPerFunctionPoint)}/FP
          </div>
          <div className="text-xs text-yellow-500 mt-1">
            {formatCurrency(calculations.costPerPerson)}/person
          </div>
        </div>

        <div
          className={`border rounded-lg p-6 text-center ${getRiskColor(
            calculations.riskAnalysis.overallRisk
          )}`}
        >
          <div className="text-sm font-medium mb-1">Project Risk</div>
          <div className="text-3xl font-bold mb-1">
            {calculations.riskAnalysis.overallRisk}
          </div>
          <div className="text-xs">
            {calculations.riskAnalysis.recommendations.length} recommendations
          </div>
          <div className="text-xs mt-1">Team: {estimate.teamSize} people</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Component Distribution</h2>
          <div className="space-y-3">
            {Object.entries(calculations.componentBreakdown).map(
              ([type, data]) =>
                type !== "total" && (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {data.count} components
                      </div>
                      <div className="text-xs text-gray-500">
                        {data.points} FP{" "}
                        {"percentage" in data &&
                          `(${data.percentage.toFixed(1)}%)`}
                      </div>
                    </div>
                  </div>
                )
            )}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>
                  {calculations.componentBreakdown.total.count} components
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Complexity Analysis</h2>
          <div className="space-y-3">
            {Object.entries(calculations.complexityBreakdown).map(
              ([complexity, data]) => (
                <div
                  key={complexity}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        complexity === "high"
                          ? "bg-red-500"
                          : complexity === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {complexity} Complexity
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {data.count} components
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.points} FP{" "}
                      {"percentage" in data &&
                        `(${data.percentage.toFixed(1)}%)`}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Project Configuration</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Team Size</dt>
              <dd className="text-sm font-medium text-gray-900">
                {estimate.teamSize} people
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Daily Hours</dt>
              <dd className="text-sm font-medium text-gray-900">
                {estimate.averageDailyWorkingHours}h
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Hourly Rate</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatCurrency(estimate.hourlyRateBRL)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Productivity</dt>
              <dd className="text-sm font-medium text-gray-900">
                {estimate.productivityFactor}h/FP
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Daily Capacity</dt>
              <dd className="text-sm font-medium text-gray-900">
                {(
                  estimate.teamSize * estimate.averageDailyWorkingHours
                ).toFixed(0)}
                h
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Productivity Metrics</h2>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getProductivityColor(
                calculations.productivityMetrics.industryComparison
                  .productivityRating
              )}`}
            >
              {
                calculations.productivityMetrics.industryComparison
                  .productivityRating
              }{" "}
              Performance
            </span>
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {calculations.productivityMetrics.hoursPerFunctionPoint.toFixed(
                  1
                )}
              </div>
              <div className="text-xs text-gray-600">
                Hours per Function Point
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {calculations.productivityMetrics.functionPointsPerDay.toFixed(
                    1
                  )}
                </div>
                <div className="text-xs text-gray-600">FP/Day</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">
                  {(
                    calculations.productivityMetrics.teamEfficiency * 100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-xs text-gray-600">Efficiency</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Project Phases</h2>
          <div className="space-y-3">
            {Object.entries(calculations.phaseBreakdown).map(
              ([phase, data]) => (
                <div key={phase} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {phase}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {data.hours.toFixed(0)}h
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.percentage}%
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">
          Risk Analysis & Recommendations
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-3">
              {Object.entries(calculations.riskAnalysis.factors).map(
                ([factor, data]) => (
                  <div
                    key={factor}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600 capitalize">
                      {factor.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getRiskColor(
                          data.risk
                        )}`}
                      >
                        {data.risk}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Recommendations</h3>
            {calculations.riskAnalysis.recommendations.length > 0 ? (
              <ul className="space-y-2">
                {calculations.riskAnalysis.recommendations.map(
                  (recommendation, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-start"
                    >
                      <span className="text-indigo-500 mr-2 mt-1">•</span>
                      <span>{recommendation}</span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-sm text-green-600 italic">
                No specific recommendations - project parameters are within
                acceptable ranges.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Cost Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(calculations.costBreakdown).map(
            ([category, cost]) =>
              category !== "total" && (
                <div key={category} className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(cost)}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {category}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((cost / calculations.costBreakdown.total) * 100).toFixed(
                      1
                    )}
                    %
                  </div>
                </div>
              )
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(calculations.costBreakdown.total)}
          </div>
          <div className="text-sm text-gray-600">Total Project Cost</div>
        </div>
      </div>
    </div>
  );
};
