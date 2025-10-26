"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import { createPortal } from "react-dom";
import type { ImportResultResponse } from "@/core/types/integrations";

interface ImportResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ImportResultResponse | null;
}

export const ImportResultModal = ({ isOpen, onClose, result }: ImportResultModalProps) => {
  const { t } = useTranslation("fpa");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted || !result) return null;

  const { imported, skipped, failed, requirements } = result.data;

  return createPortal(
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="border-b dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold dark:text-white">
            {t("requirementImport.importComplete")}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {imported > 0 && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded">
                ✓ {t("requirementImport.successfullyImported", { count: imported })}
              </div>
            )}

            {skipped > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded">
                ℹ {t("requirementImport.skipped", { count: skipped })}
              </div>
            )}

            {failed > 0 && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                ✗ {t("requirementImport.failed", { count: failed })}
              </div>
            )}
          </div>

          {imported > 0 && requirements.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {t("requirementImport.newRequirements")}:
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {requirements.slice(0, 10).map((req: any) => (
                  <div
                    key={req._id}
                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {req.sourceReference && `${req.sourceReference} - `}
                        {req.title}
                      </p>
                      {req.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {req.description}
                        </p>
                      )}
                    </div>
                    {req.sourceMetadata?.externalUrl && (
                      <a
                        href={req.sourceMetadata.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline text-xs flex-shrink-0"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                ))}
                {requirements.length > 10 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                    {t("requirementImport.andMore", { count: requirements.length - 10 })}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 px-6 py-4 flex justify-end">
          <Button onClick={onClose} variant="primary">
            {t("common.done")}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
