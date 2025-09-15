import type { Objective, Question, Metric } from "./types";

export const availableObjectives: Objective[] = [
  {
    objectiveTitle: "Improve Code Quality",
    objectiveDescription: "Enhance the overall quality of the codebase through better practices and tools",
    questions: []
  },
  {
    objectiveTitle: "Increase Test Coverage",
    objectiveDescription: "Improve the test coverage to ensure better reliability",
    questions: []
  },
  {
    objectiveTitle: "Reduce Technical Debt",
    objectiveDescription: "Address and minimize technical debt in the system",
    questions: []
  }
];

export const availableQuestions: Question[] = [
  {
    questionTitle: "What is the current code coverage percentage?",
    questionDescription: "Measure the percentage of code covered by tests",
    metrics: []
  },
  {
    questionTitle: "How many defects are found per release?",
    questionDescription: "Track the number of defects discovered in each release",
    metrics: []
  }
];

export const availableMetrics: Metric[] = [
  {
    metricTitle: "Code Coverage Percentage",
    metricDescription: "Percentage of code covered by automated tests",
    metricType: "percentage"
  },
  {
    metricTitle: "Defect Density",
    metricDescription: "Number of defects per unit of code",
    metricType: "ratio"
  },
  {
    metricTitle: "Lead Time",
    metricDescription: "Time from feature request to deployment",
    metricType: "duration"
  }
];