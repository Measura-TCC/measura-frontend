import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import type { EstimateSummary } from "@/core/schemas/projects";

interface EstimatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimates: EstimateSummary[];
  organizationId: string;
}

export const EstimatesModal: React.FC<EstimatesModalProps> = ({
  isOpen,
  onClose,
  estimates,
  organizationId,
}) => {
  const { t } = useTranslation("projects");
  const router = useRouter();

  const handleEstimateClick = (estimateId: string) => {
    router.push(`/fpa/estimates/${estimateId}`);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "FINALIZED":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "IN_PROGRESS":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 dark:bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-default">
              {t("estimatesModal.title")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

          {estimates.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t("estimatesModal.noEstimates")}
            </p>
          ) : (
            <div className="space-y-3">
              {estimates.map((estimate) => (
                <div
                  key={estimate._id}
                  onClick={() => handleEstimateClick(estimate._id)}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-purple-600 dark:hover:border-purple-500 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-default">{estimate.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        estimate.status
                      )}`}
                    >
                      {estimate.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {estimate.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("estimatesModal.functionPoints")}
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {estimate.adjustedFunctionPoints}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("estimatesModal.estimatedEffort")}
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {estimate.estimatedEffortHours}h
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("estimatesModal.created")}
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(estimate.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button variant="secondary" onClick={onClose}>
              {t("estimatesModal.close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
