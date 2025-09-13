import type {
  Objective,
  Question,
  Metric,
  Measurement,
} from "@/core/types/plans";

export const availableObjectives: Objective[] = [
  { objectiveTitle: "objectives.increaseFunctionalValueCadence", questions: [] }, // HPF
  { objectiveTitle: "objectives.reduceTimeToDeliverValue", questions: [] }, // LTC
  { objectiveTitle: "objectives.accelerateRecoveryAfterFailures", questions: [] }, // MTTR
  { objectiveTitle: "objectives.increaseStabilityOfChanges", questions: [] }, // CFR
];

export const availableQuestions: Question[] = [
  {
    questionText: "questions.howManyFunctionPointsPerPeriod",
    metrics: [],
  }, // HPF
  {
    questionText: "questions.howLongCommitToProduction",
    metrics: [],
  }, // LTC
  {
    questionText: "questions.howLongToRestoreService",
    metrics: [],
  }, // MTTR
  {
    questionText: "questions.whatFractionDeploysFailure",
    metrics: [],
  }, // CFR
];

export const availableMetrics: Metric[] = [
  {
    metricName: "metrics.productivityHhPF",
    metricDescription: "metrics.descriptions.productivityHhPF",
    metricMnemonic: "HPF",
    metricFormula: "HhPF = sum(ESF_H) / nullif(sum(PFD), 0)",
    metricControlRange: [0, 200],
    analysisProcedure: "analysis.procedures.productivityHhPF",
    analysisFrequency: "analysis.frequency.perIteration",
    analysisResponsible: "analysis.responsible.productivityTeam",
    measurements: [
      {
        measurementEntity: "metrics.measurementEntities.worklog",
        measurementAcronym: "ESF",
        measurementProperties: "measurements.properties.worklog",
        measurementUnit: "units.hoursDecimals",
        measurementScale: "scales.continuous",
        measurementProcedure: "measurements.procedures.worklog",
        measurementFrequency: "measurements.frequency.continuousIteration",
        measurementResponsible: "measurements.responsible.timesheetERP",
      },
      {
        measurementEntity: "metrics.measurementEntities.deliveredFunctionPoints",
        measurementAcronym: "PFD",
        measurementProperties: "measurements.properties.deliveredFunctionPoints",
        measurementUnit: "units.functionPoints",
        measurementScale: "scales.discrete",
        measurementProcedure: "measurements.procedures.deliveredFunctionPoints",
        measurementFrequency: "measurements.frequency.perIteration",
        measurementResponsible: "measurements.responsible.pfMeasurementTeam",
      },
    ],
  },
  {
    metricName: "metrics.leadTimeForChanges",
    metricDescription: "metrics.descriptions.leadTimeForChanges",
    metricMnemonic: "LTC",
    metricFormula: "median((TPD - TCM) / 3600) # hours",
    metricControlRange: [0, 168],
    analysisProcedure: "analysis.procedures.leadTimeForChanges",
    analysisFrequency: "analysis.frequency.weekly",
    analysisResponsible: "analysis.responsible.productivityTeam",
    measurements: [
      {
        measurementEntity: "metrics.measurementEntities.deploymentToProduction",
        measurementAcronym: "TPD",
        measurementProperties: "measurements.properties.deploymentToProduction",
        measurementUnit: "units.msEpochUTC",
        measurementScale: "scales.continuous",
        measurementProcedure: "measurements.procedures.deploymentToProduction",
        measurementFrequency: "measurements.frequency.perDeploy",
        measurementResponsible: "measurements.responsible.measurementAnalyst",
      },
      {
        measurementEntity: "metrics.measurementEntities.commit",
        measurementAcronym: "TCM",
        measurementProperties: "measurements.properties.commit",
        measurementUnit: "units.msEpochUTC",
        measurementScale: "scales.continuous",
        measurementProcedure: "measurements.procedures.commit",
        measurementFrequency: "measurements.frequency.perCommit",
        measurementResponsible: "measurements.responsible.measurementAnalyst",
      },
    ],
  },
  {
    metricName: "metrics.meanTimeToRestore",
    metricDescription: "metrics.descriptions.meanTimeToRestore",
    metricMnemonic: "MTTR",
    metricFormula: "median((TRS - TIN) / 3600) # hours",
    metricControlRange: [0, 24],
    analysisProcedure: "analysis.procedures.meanTimeToRestore",
    analysisFrequency: "analysis.frequency.monthly",
    analysisResponsible: "analysis.responsible.productivityTeam",
    measurements: [
      {
        measurementEntity: "metrics.measurementEntities.incidentStart",
        measurementAcronym: "TIN",
        measurementProperties: "measurements.properties.incidentStart",
        measurementUnit: "units.msEpochUTC",
        measurementScale: "scales.continuous",
        measurementProcedure: "measurements.procedures.incidentStart",
        measurementFrequency: "measurements.frequency.perIncident",
        measurementResponsible: "measurements.responsible.measurementAnalyst",
      },
      {
        measurementEntity: "metrics.measurementEntities.serviceRestoration",
        measurementAcronym: "TRS",
        measurementProperties: "measurements.properties.serviceRestoration",
        measurementUnit: "units.msEpochUTC",
        measurementScale: "scales.continuous",
        measurementProcedure: "measurements.procedures.serviceRestoration",
        measurementFrequency: "measurements.frequency.perIncident",
        measurementResponsible: "measurements.responsible.measurementAnalyst",
      },
    ],
  },
  {
    metricName: "metrics.changeFailureRate",
    metricDescription: "metrics.descriptions.changeFailureRate",
    metricMnemonic: "CFR",
    metricFormula: "CFR(%) = (sum(DPF) / nullif(sum(DPT), 0)) * 100",
    metricControlRange: [0, 100],
    analysisProcedure: "analysis.procedures.changeFailureRate",
    analysisFrequency: "analysis.frequency.monthlyRelease",
    analysisResponsible: "analysis.responsible.productivityTeam",
    measurements: [
      {
        measurementEntity: "metrics.measurementEntities.deployFailure",
        measurementAcronym: "DPF",
        measurementProperties: "measurements.properties.deployFailure",
        measurementUnit: "units.countPerFailedDeploy",
        measurementScale: "scales.discrete",
        measurementProcedure: "measurements.procedures.deployFailure",
        measurementFrequency: "measurements.frequency.perDeployIncident",
        measurementResponsible: "measurements.responsible.measurementAnalyst",
      },
      {
        measurementEntity: "metrics.measurementEntities.deployTotal",
        measurementAcronym: "DPT",
        measurementProperties: "measurements.properties.deployTotal",
        measurementUnit: "units.countPerDeploy",
        measurementScale: "scales.discrete",
        measurementProcedure: "measurements.procedures.deployTotal",
        measurementFrequency: "measurements.frequency.perDeploy",
        measurementResponsible: "measurements.responsible.measurementAnalyst",
      },
    ],
  },
];

export const availableMeasurements: Measurement[] = [
  // HPF - Productivity measurements
  {
    measurementEntity: "metrics.measurementEntities.worklog",
    measurementAcronym: "ESF",
    measurementProperties: "measurements.properties.worklog",
    measurementUnit: "units.hoursDecimals",
    measurementScale: "scales.continuous",
    measurementProcedure: "measurements.procedures.worklog",
    measurementFrequency: "measurements.frequency.continuousIteration",
    measurementResponsible: "measurements.responsible.timesheetERP",
  },
  {
    measurementEntity: "metrics.measurementEntities.deliveredFunctionPoints",
    measurementAcronym: "PFD",
    measurementProperties: "measurements.properties.deliveredFunctionPoints",
    measurementUnit: "units.functionPoints",
    measurementScale: "scales.discrete",
    measurementProcedure: "measurements.procedures.deliveredFunctionPoints",
    measurementFrequency: "measurements.frequency.perIteration",
    measurementResponsible: "measurements.responsible.pfMeasurementTeam",
  },
  // LTC - Lead Time for Changes measurements
  {
    measurementEntity: "metrics.measurementEntities.deploymentToProduction",
    measurementAcronym: "TPD",
    measurementProperties: "measurements.properties.deploymentToProduction",
    measurementUnit: "units.msEpochUTC",
    measurementScale: "scales.continuous",
    measurementProcedure: "measurements.procedures.deploymentToProduction",
    measurementFrequency: "measurements.frequency.perDeploy",
    measurementResponsible: "measurements.responsible.measurementAnalyst",
  },
  {
    measurementEntity: "metrics.measurementEntities.commit",
    measurementAcronym: "TCM",
    measurementProperties: "measurements.properties.commit",
    measurementUnit: "units.msEpochUTC",
    measurementScale: "scales.continuous",
    measurementProcedure: "measurements.procedures.commit",
    measurementFrequency: "measurements.frequency.perCommit",
    measurementResponsible: "measurements.responsible.measurementAnalyst",
  },
  // MTTR - Mean Time to Restore measurements
  {
    measurementEntity: "metrics.measurementEntities.incidentStart",
    measurementAcronym: "TIN",
    measurementProperties: "measurements.properties.incidentStart",
    measurementUnit: "units.msEpochUTC",
    measurementScale: "scales.continuous",
    measurementProcedure: "measurements.procedures.incidentStart",
    measurementFrequency: "measurements.frequency.perIncident",
    measurementResponsible: "measurements.responsible.measurementAnalyst",
  },
  {
    measurementEntity: "metrics.measurementEntities.serviceRestoration",
    measurementAcronym: "TRS",
    measurementProperties: "measurements.properties.serviceRestoration",
    measurementUnit: "units.msEpochUTC",
    measurementScale: "scales.continuous",
    measurementProcedure: "measurements.procedures.serviceRestoration",
    measurementFrequency: "measurements.frequency.perIncident",
    measurementResponsible: "measurements.responsible.measurementAnalyst",
  },
  // CFR - Change Failure Rate measurements
  {
    measurementEntity: "metrics.measurementEntities.deployFailure",
    measurementAcronym: "DPF",
    measurementProperties: "measurements.properties.deployFailure",
    measurementUnit: "units.countPerFailedDeploy",
    measurementScale: "scales.discrete",
    measurementProcedure: "measurements.procedures.deployFailure",
    measurementFrequency: "measurements.frequency.perDeployIncident",
    measurementResponsible: "measurements.responsible.measurementAnalyst",
  },
  {
    measurementEntity: "metrics.measurementEntities.deployTotal",
    measurementAcronym: "DPT",
    measurementProperties: "measurements.properties.deployTotal",
    measurementUnit: "units.countPerDeploy",
    measurementScale: "scales.discrete",
    measurementProcedure: "measurements.procedures.deployTotal",
    measurementFrequency: "measurements.frequency.perDeploy",
    measurementResponsible: "measurements.responsible.measurementAnalyst",
  },
];

export const purposeOptions = [
  "goalForm.purposes.know",
  "goalForm.purposes.analyze", 
  "goalForm.purposes.evaluate",
  "goalForm.purposes.improve",
  "goalForm.purposes.control",
  "goalForm.purposes.monitor",
];

export const recommendedObjectives = [
  "objectives.increaseFunctionalValueCadence",
  "objectives.reduceTimeToDeliverValue", 
  "objectives.accelerateRecoveryAfterFailures",
  "objectives.increaseStabilityOfChanges",
  "objectives.improveCustomerSatisfaction",
  "objectives.reduceMaintenanceCost",
  "objectives.enhanceSystemPerformance",
  "objectives.increaseCodeReusability",
];

export const recommendedQuestions = [
  "questions.howManyFunctionPointsPerPeriod",
  "questions.howLongCommitToProduction",
  "questions.howLongToRestoreService",
  "questions.whatFractionDeploysFailure",
];

export const recommendedMetrics = [
  "metrics.productivityHhPF",
  "metrics.leadTimeForChanges",
  "metrics.meanTimeToRestore",
  "metrics.changeFailureRate",
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