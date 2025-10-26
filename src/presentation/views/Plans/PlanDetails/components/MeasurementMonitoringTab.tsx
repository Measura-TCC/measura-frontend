import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/presentation/components/primitives";
import { useMeasurementCycles } from "@/core/hooks/measurementPlans";
import type { MeasurementPlanResponseDto } from "@/core/types/plans";
import { CycleAccordion } from "./CycleAccordion";
import { CreateCycleModal } from "./CreateCycleModal";
import { AddMeasurementDataModal } from "./AddMeasurementDataModal";
import { MeasurementChart } from "./MeasurementChart";

interface MeasurementMonitoringTabProps {
  planId: string;
  plan: MeasurementPlanResponseDto;
}

export const MeasurementMonitoringTab: React.FC<MeasurementMonitoringTabProps> = ({
  planId,
  plan,
}) => {
  const { t } = useTranslation("plans");
  const { cycles, isLoading } = useMeasurementCycles({ planId, withMeasurements: true });
  const [isCreateCycleModalOpen, setIsCreateCycleModalOpen] = useState(false);
  const [isAddMeasurementModalOpen, setIsAddMeasurementModalOpen] = useState(false);

  const cyclesData = cycles as any[];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle>{t("monitoring.title")}</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={() => setIsCreateCycleModalOpen(true)}
                className="flex-1 sm:flex-none"
              >
                {t("monitoring.createCycle")}
              </Button>
              <Button
                onClick={() => setIsAddMeasurementModalOpen(true)}
                disabled={cyclesData.length === 0}
                className="flex-1 sm:flex-none"
              >
                {t("monitoring.addMeasurement")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : cyclesData.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {t("monitoring.noCycles")}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {t("monitoring.noCyclesDescription")}
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsCreateCycleModalOpen(true)}>
                  {t("monitoring.createFirstCycle")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cyclesData.map((cycleData) => (
                <CycleAccordion
                  key={cycleData.cycle._id}
                  cycleData={cycleData}
                  planId={planId}
                  plan={plan}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && cyclesData.length > 0 && (
        <MeasurementChart cyclesData={cyclesData} />
      )}

      <CreateCycleModal
        isOpen={isCreateCycleModalOpen}
        onClose={() => setIsCreateCycleModalOpen(false)}
        planId={planId}
      />

      <AddMeasurementDataModal
        isOpen={isAddMeasurementModalOpen}
        onClose={() => setIsAddMeasurementModalOpen(false)}
        plan={plan}
        planId={planId}
        cycles={cyclesData.map((c) => c.cycle)}
      />
    </>
  );
};
