import type { Objective, Question, Metric } from "./types";

export const availableObjectives: Objective[] = [
  { id: "objective1", name: "objectives.improveQuality" },
  { id: "objective2", name: "objectives.reduceDevelopmentTime" },
  { id: "objective3", name: "objectives.increaseTeamProductivity" },
  { id: "objective4", name: "objectives.decreaseBugQuantity" },
];

export const availableQuestions: Question[] = [
  { id: "question1", name: "questions.defectRateInProduction" },
  { id: "question2", name: "questions.criticalBugFixTime" },
  { id: "question3", name: "questions.averageFeatureDevelopmentTime" },
  { id: "question4", name: "questions.dailyCodeLinesProduced" },
  { id: "question5", name: "questions.automatedTestCoverage" },
  { id: "question6", name: "questions.bugsFoundDuringTesting" },
];

export const availableMetrics: Metric[] = [
  { id: "metric1", name: "metrics.defectsPerRelease", unit: "metrics.units.defects" },
  { id: "metric2", name: "metrics.averageFixTime", unit: "metrics.units.hours" },
  { id: "metric3", name: "metrics.developmentTimePerStoryPoint", unit: "metrics.units.hoursPerSp" },
  { id: "metric4", name: "metrics.codeLinesPerDeveloper", unit: "metrics.units.locPerDev" },
  { id: "metric5", name: "metrics.codeCoveragePercentage", unit: "metrics.units.percentage" },
  { id: "metric6", name: "metrics.bugsPerSprint", unit: "metrics.units.bugs" },
  { id: "metric7", name: "metrics.buildSuccessRate", unit: "metrics.units.percentage" },
  { id: "metric8", name: "metrics.applicationResponseTime", unit: "metrics.units.milliseconds" },
];

export const purposeOptions = [
  "goalForm.purposes.know",
  "goalForm.purposes.analyze", 
  "goalForm.purposes.evaluate",
  "goalForm.purposes.improve",
  "goalForm.purposes.control",
  "goalForm.purposes.monitor",
];

export const steps = [
  {
    number: 1,
    titleKey: "workflow.steps.step1.title",
    descriptionKey: "workflow.steps.step1.description",
  },
  {
    number: 2,
    titleKey: "workflow.steps.step2.title", 
    descriptionKey: "workflow.steps.step2.description",
  },
  {
    number: 3,
    titleKey: "workflow.steps.step3.title",
    descriptionKey: "workflow.steps.step3.description", 
  },
  {
    number: 4,
    titleKey: "workflow.steps.step4.title",
    descriptionKey: "workflow.steps.step4.description",
  },
  {
    number: 5,
    titleKey: "workflow.steps.step5.title",
    descriptionKey: "workflow.steps.step5.description",
  },
];