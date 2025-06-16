import { useMemo } from "react";

export interface ComponentDetail {
  _id: string;
  type: "ALI" | "AIE" | "EI" | "EO" | "EQ";
  functionPoints: number;
  complexity: "LOW" | "MEDIUM" | "HIGH";
}

export interface ProjectConfig {
  averageDailyWorkingHours: number;
  teamSize: number;
  hourlyRateBRL: number;
  productivityFactor: number;
  generalSystemCharacteristics?: number[];
}

export interface FPACalculations {
  pfna: number;
  ni: number;
  fa: number;
  pfa: number;

  effortHours: number;
  durationDays: number;
  durationWeeks: number;
  durationMonths: number;

  totalCost: number;
  costPerFunctionPoint: number;
  costPerPerson: number;
  hoursPerPerson: number;

  componentBreakdown: {
    ali: { count: number; points: number; percentage: number };
    aie: { count: number; points: number; percentage: number };
    ei: { count: number; points: number; percentage: number };
    eo: { count: number; points: number; percentage: number };
    eq: { count: number; points: number; percentage: number };
    total: { count: number; points: number };
  };

  complexityBreakdown: {
    low: { count: number; points: number; percentage: number };
    medium: { count: number; points: number; percentage: number };
    high: { count: number; points: number; percentage: number };
  };

  phaseBreakdown: {
    analysis: { hours: number; percentage: number };
    design: { hours: number; percentage: number };
    development: { hours: number; percentage: number };
    testing: { hours: number; percentage: number };
    deployment: { hours: number; percentage: number };
  };

  costBreakdown: {
    development: number;
    management: number;
    infrastructure: number;
    contingency: number;
    total: number;
  };

  productivityMetrics: {
    hoursPerFunctionPoint: number;
    functionPointsPerDay: number;
    functionPointsPerPersonMonth: number;
    teamEfficiency: number;
    industryComparison: {
      productivityRating: "LOW" | "AVERAGE" | "HIGH";
      benchmarkHoursPerFP: number;
      performanceIndex: number;
    };
  };

  riskAnalysis: {
    overallRisk: "LOW" | "MEDIUM" | "HIGH";
    factors: {
      teamSize: { risk: "LOW" | "MEDIUM" | "HIGH"; reason: string };
      projectDuration: { risk: "LOW" | "MEDIUM" | "HIGH"; reason: string };
      complexity: { risk: "LOW" | "MEDIUM" | "HIGH"; reason: string };
      productivity: { risk: "LOW" | "MEDIUM" | "HIGH"; reason: string };
    };
    recommendations: string[];
  };
}

export const useFPACalculations = (
  components: ComponentDetail[],
  config: ProjectConfig,
  t?: (key: string) => string
): FPACalculations => {
  return useMemo(() => {
    const pfna = components.reduce((sum, comp) => sum + comp.functionPoints, 0);

    const ni =
      config.generalSystemCharacteristics?.reduce((sum, gsc) => sum + gsc, 0) ||
      0;

    const fa = config.generalSystemCharacteristics ? 0.65 + 0.01 * ni : 1;

    const pfa = pfna * fa;

    const effortHours = pfa * config.productivityFactor;

    const durationDays =
      effortHours / (config.teamSize * config.averageDailyWorkingHours);
    const durationWeeks = durationDays / 5;
    const durationMonths = durationDays / 21;

    const totalCost = effortHours * config.hourlyRateBRL;
    const costPerFunctionPoint = pfa > 0 ? totalCost / pfa : 0;
    const costPerPerson = totalCost / config.teamSize;
    const hoursPerPerson = effortHours / config.teamSize;

    const componentCounts = components.reduce(
      (acc, comp) => {
        acc[comp.type.toLowerCase() as keyof typeof acc].count++;
        acc[comp.type.toLowerCase() as keyof typeof acc].points +=
          comp.functionPoints;
        acc.total.count++;
        acc.total.points += comp.functionPoints;
        return acc;
      },
      {
        ali: { count: 0, points: 0, percentage: 0 },
        aie: { count: 0, points: 0, percentage: 0 },
        ei: { count: 0, points: 0, percentage: 0 },
        eo: { count: 0, points: 0, percentage: 0 },
        eq: { count: 0, points: 0, percentage: 0 },
        total: { count: 0, points: 0 },
      }
    );

    Object.keys(componentCounts).forEach((key) => {
      if (key !== "total") {
        const typeCounts = componentCounts[key as keyof typeof componentCounts];
        if (typeof typeCounts === "object" && "percentage" in typeCounts) {
          typeCounts.percentage =
            componentCounts.total.points > 0
              ? (typeCounts.points / componentCounts.total.points) * 100
              : 0;
        }
      }
    });

    const complexityCounts = components.reduce(
      (acc, comp) => {
        const complexity = comp.complexity.toLowerCase() as
          | "low"
          | "medium"
          | "high";
        if (complexity in acc) {
          acc[complexity].count++;
          acc[complexity].points += comp.functionPoints;
        }
        return acc;
      },
      {
        low: { count: 0, points: 0, percentage: 0 },
        medium: { count: 0, points: 0, percentage: 0 },
        high: { count: 0, points: 0, percentage: 0 },
      }
    );

    Object.keys(complexityCounts).forEach((key) => {
      const complexity = complexityCounts[key as keyof typeof complexityCounts];
      complexity.percentage = pfna > 0 ? (complexity.points / pfna) * 100 : 0;
    });

    const developmentHours = effortHours * 0.5;
    const managementHours = effortHours * 0.15;
    const infrastructureHours = effortHours * 0.1;
    const contingencyHours = effortHours * 0.1;

    const phaseBreakdown = {
      analysis: { hours: effortHours * 0.15, percentage: 15 },
      design: { hours: effortHours * 0.2, percentage: 20 },
      development: { hours: effortHours * 0.45, percentage: 45 },
      testing: { hours: effortHours * 0.15, percentage: 15 },
      deployment: { hours: effortHours * 0.05, percentage: 5 },
    };

    const costBreakdown = {
      development: developmentHours * config.hourlyRateBRL,
      management: managementHours * config.hourlyRateBRL,
      infrastructure: infrastructureHours * config.hourlyRateBRL,
      contingency: contingencyHours * config.hourlyRateBRL,
      total: totalCost,
    };

    const benchmarkHoursPerFP = 12;
    const hoursPerFunctionPoint = pfa > 0 ? effortHours / pfa : 0;
    const performanceIndex =
      benchmarkHoursPerFP > 0
        ? (hoursPerFunctionPoint / benchmarkHoursPerFP) * 100
        : 100;

    let productivityRating: "LOW" | "AVERAGE" | "HIGH" = "AVERAGE";
    if (performanceIndex < 80) productivityRating = "HIGH";
    else if (performanceIndex > 120) productivityRating = "LOW";

    const functionPointsPerDay =
      config.averageDailyWorkingHours > 0
        ? config.averageDailyWorkingHours / config.productivityFactor
        : 0;

    const functionPointsPerPersonMonth = functionPointsPerDay * 21;

    const teamEfficiency =
      config.teamSize <= 3
        ? 1
        : config.teamSize <= 6
        ? 0.95
        : config.teamSize <= 10
        ? 0.85
        : 0.75;

    const productivityMetrics = {
      hoursPerFunctionPoint,
      functionPointsPerDay,
      functionPointsPerPersonMonth,
      teamEfficiency,
      industryComparison: {
        productivityRating,
        benchmarkHoursPerFP,
        performanceIndex,
      },
    };

    const teamSizeRisk: "LOW" | "MEDIUM" | "HIGH" =
      config.teamSize > 10 ? "HIGH" : config.teamSize > 6 ? "MEDIUM" : "LOW";
    const durationRisk: "LOW" | "MEDIUM" | "HIGH" =
      durationDays > 365
        ? "HIGH"
        : durationDays > 180
        ? "MEDIUM"
        : durationDays < 10
        ? "HIGH"
        : "LOW";
    const complexityRisk: "LOW" | "MEDIUM" | "HIGH" =
      complexityCounts.high.percentage > 40
        ? "HIGH"
        : complexityCounts.high.percentage > 20
        ? "MEDIUM"
        : "LOW";
    const productivityRisk: "LOW" | "MEDIUM" | "HIGH" =
      config.productivityFactor > 20
        ? "HIGH"
        : config.productivityFactor > 15
        ? "MEDIUM"
        : config.productivityFactor < 5
        ? "HIGH"
        : "LOW";

    const riskFactors = [
      teamSizeRisk,
      durationRisk,
      complexityRisk,
      productivityRisk,
    ];
    const highRiskCount = riskFactors.filter((risk) => risk === "HIGH").length;
    const mediumRiskCount = riskFactors.filter(
      (risk) => risk === "MEDIUM"
    ).length;

    let overallRisk: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (highRiskCount >= 2 || (highRiskCount >= 1 && mediumRiskCount >= 2)) {
      overallRisk = "HIGH";
    } else if (highRiskCount >= 1 || mediumRiskCount >= 2) {
      overallRisk = "MEDIUM";
    }

    const recommendations: string[] = [];
    if (teamSizeRisk === "HIGH")
      recommendations.push(
        t
          ? t("analysis.recommendationsList.breakIntoTeams")
          : "Consider breaking project into smaller teams or phases"
      );
    if (durationRisk === "HIGH")
      recommendations.push(
        t
          ? t("analysis.riskRecommendations.longDuration")
          : "Project duration is very long - consider adding resources or reducing scope"
      );
    if (complexityRisk === "HIGH")
      recommendations.push(
        t
          ? t("analysis.recommendationsList.ensureExpertise")
          : "High complexity components detected - ensure adequate expertise and time allocation"
      );
    if (productivityRisk === "HIGH")
      recommendations.push(
        t
          ? t("analysis.recommendationsList.reviewProductivity")
          : "Productivity factor seems unrealistic - review and adjust estimates"
      );

    const getTeamSizeReason = () => {
      if (config.teamSize > 10) {
        return t
          ? t("analysis.riskReasons.teamSize.veryLarge")
          : "Very large team may have communication issues";
      }
      if (config.teamSize > 6) {
        return t
          ? t("analysis.riskReasons.teamSize.large")
          : "Large team requires coordination overhead";
      }
      return t
        ? t("analysis.riskReasons.teamSize.optimal")
        : "Team size within optimal range";
    };

    const getProjectDurationReason = () => {
      if (durationDays > 365) {
        return t
          ? t("analysis.riskReasons.projectDuration.veryLong")
          : "Very long project increases risks";
      }
      if (durationDays > 180) {
        return t
          ? t("analysis.riskReasons.projectDuration.long")
          : "Long project duration";
      }
      if (durationDays < 10) {
        return t
          ? t("analysis.riskReasons.projectDuration.veryShort")
          : "Very short duration may be unrealistic";
      }
      return t
        ? t("analysis.riskReasons.projectDuration.reasonable")
        : "Project duration within reasonable range";
    };

    const getComplexityReason = () => {
      if (complexityCounts.high.percentage > 40) {
        return t
          ? t("analysis.riskReasons.complexity.highPercentage")
          : "High percentage of complex components";
      }
      if (complexityCounts.high.percentage > 20) {
        return t
          ? t("analysis.riskReasons.complexity.moderate")
          : "Moderate complexity detected";
      }
      return t
        ? t("analysis.riskReasons.complexity.manageable")
        : "Complexity level manageable";
    };

    const getProductivityReason = () => {
      if (config.productivityFactor > 20) {
        return t
          ? t("analysis.riskReasons.productivity.veryLow")
          : "Very low productivity assumption";
      }
      if (config.productivityFactor > 15) {
        return t
          ? t("analysis.riskReasons.productivity.belowAverage")
          : "Below average productivity";
      }
      if (config.productivityFactor < 5) {
        return t
          ? t("analysis.riskReasons.productivity.veryHigh")
          : "Very high productivity assumption may be unrealistic";
      }
      return t
        ? t("analysis.riskReasons.productivity.normal")
        : "Productivity factor within normal range";
    };

    const riskAnalysis = {
      overallRisk,
      factors: {
        teamSize: {
          risk: teamSizeRisk,
          reason: getTeamSizeReason(),
        },
        projectDuration: {
          risk: durationRisk,
          reason: getProjectDurationReason(),
        },
        complexity: {
          risk: complexityRisk,
          reason: getComplexityReason(),
        },
        productivity: {
          risk: productivityRisk,
          reason: getProductivityReason(),
        },
      },
      recommendations,
    };

    return {
      pfna,
      ni,
      fa,
      pfa,
      effortHours,
      durationDays,
      durationWeeks,
      durationMonths,
      totalCost,
      costPerFunctionPoint,
      costPerPerson,
      hoursPerPerson,
      componentBreakdown: componentCounts,
      complexityBreakdown: complexityCounts,
      phaseBreakdown,
      costBreakdown,
      productivityMetrics,
      riskAnalysis,
    };
  }, [components, config, t]);
};
