import type { TFunction } from "i18next";
import type { Objective } from "./types";
import type { CreateObjectiveDto, CreateQuestionDto, CreateMetricDto, CreateMeasurementDto } from "@/core/types/plans";

export const translateObjectiveForAPI = (objective: Objective, t: TFunction): CreateObjectiveDto => {
  return {
    objectiveTitle: t(objective.objectiveTitle),
    questions: objective.questions.map(question => ({
      questionText: t(question.questionText),
      metrics: question.metrics.map(metric => ({
        metricName: t(metric.metricName),
        metricDescription: t(metric.metricDescription || ""),
        metricMnemonic: metric.metricMnemonic || "",
        metricFormula: metric.metricFormula || "",
        metricControlRange: (metric.metricControlRange && metric.metricControlRange.length >= 2)
          ? [metric.metricControlRange[0], metric.metricControlRange[1]] as [number, number]
          : [0, 100] as [number, number],
        analysisProcedure: t(metric.analysisProcedure || ""),
        analysisFrequency: t(metric.analysisFrequency || ""),
        analysisResponsible: metric.analysisResponsible ? t(metric.analysisResponsible) : undefined,
        measurements: metric.measurements.map(measurement => ({
          measurementEntity: t(measurement.measurementEntity),
          measurementAcronym: measurement.measurementAcronym,
          measurementProperties: t(measurement.measurementProperties || ""),
          measurementUnit: t(measurement.measurementUnit || ""),
          measurementScale: t(measurement.measurementScale || ""),
          measurementProcedure: t(measurement.measurementProcedure || ""),
          measurementFrequency: t(measurement.measurementFrequency || ""),
          measurementResponsible: measurement.measurementResponsible ? t(measurement.measurementResponsible) : undefined,
        }))
      }))
    }))
  };
};

export const validatePlanData = (planData: {
  planName: string;
  associatedProject: string;
  planResponsible: string;
  objectives: CreateObjectiveDto[];
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!planData.planName?.trim()) {
    errors.push("Plan name is required");
  } else if (planData.planName.length > 255) {
    errors.push("Plan name must not exceed 255 characters");
  }

  if (!planData.associatedProject?.trim()) {
    errors.push("Associated project is required");
  }

  if (!planData.planResponsible?.trim()) {
    errors.push("Plan responsible is required");
  }

  if (planData.objectives.length === 0) {
    errors.push("At least one objective is required");
  }

  // Validate translated objectives structure
  planData.objectives.forEach((objective, objIndex) => {
    if (objective.objectiveTitle.length > 255) {
      errors.push(`Objective ${objIndex + 1} title must not exceed 255 characters`);
    }

    objective.questions?.forEach((question, qIndex) => {
      if (question.questionText.length > 500) {
        errors.push(`Question ${qIndex + 1} in objective ${objIndex + 1} must not exceed 500 characters`);
      }

      question.metrics?.forEach((metric, mIndex) => {
        if (metric.metricMnemonic && metric.metricMnemonic.length > 10) {
          errors.push(`Metric ${mIndex + 1} mnemonic must not exceed 10 characters`);
        }

        metric.measurements.forEach((measurement, measIndex) => {
          if (measurement.measurementEntity.length > 50) {
            errors.push(`Measurement ${measIndex + 1} entity in metric ${mIndex + 1} must not exceed 50 characters`);
          }
        });
      });
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};