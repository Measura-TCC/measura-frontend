import { useTranslation } from "react-i18next";
import type { MeasurementPlan } from "@/core/types/plans";

interface PlanGQMStructureProps {
  plan: MeasurementPlan;
  className?: string;
}

export const PlanGQMStructure: React.FC<PlanGQMStructureProps> = ({
  plan,
  className = "",
}) => {
  const { t } = useTranslation("plans");

  // Count totals
  const totalObjectives = plan.objectives.length;
  const totalQuestions = plan.objectives.reduce(
    (sum, obj) => sum + obj.questions.length,
    0
  );
  const totalMetrics = plan.objectives.reduce(
    (sum, obj) =>
      sum + obj.questions.reduce((qSum, q) => qSum + q.metrics.length, 0),
    0
  );
  const totalMeasurements = plan.objectives.reduce(
    (sum, obj) =>
      sum +
      obj.questions.reduce(
        (qSum, q) =>
          qSum + q.metrics.reduce((mSum, m) => mSum + m.measurements.length, 0),
        0
      ),
    0
  );

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 text-primary">
        Estrutura GQM
      </h3>

      {/* Objectives */}
      <div className="space-y-4">
        {plan.objectives.map((objective, objIndex) => (
          <div
            key={objIndex}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  O{objIndex + 1}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <strong>Objetivo:</strong>{" "}
                  {t(objective.objectiveTitle) || objective.objectiveTitle}
                </div>

                {/* Questions */}
                <div className="ml-4 mt-3 space-y-3">
                  {objective.questions.map((question, qIndex) => (
                    <div key={qIndex}>
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            Q{qIndex + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-700 dark:text-gray-200">
                            <strong>Questão:</strong>{" "}
                            {t(question.questionText) || question.questionText}
                          </div>

                          {/* Metrics */}
                          <div className="ml-4 mt-2 space-y-2">
                            {question.metrics.map((metric, mIndex) => (
                              <div key={mIndex} className="flex items-start gap-2">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                    M{mIndex + 1}
                                  </span>
                                </div>
                                <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                                  <strong>Métrica:</strong>{" "}
                                  {t(metric.metricName) || metric.metricName}{" "}
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({metric.metricMnemonic || "N/A"})
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 text-center border border-purple-100 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalObjectives}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Objetivos</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            {totalQuestions}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Questões</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 text-center border border-green-100 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalMetrics}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Métricas</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center border border-blue-100 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalMeasurements}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Medidas</div>
        </div>
      </div>
    </div>
  );
};
