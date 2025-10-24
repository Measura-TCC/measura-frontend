"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";

interface ImportedRequirement {
  _id: string;
  title: string;
  description: string;
  source: string;
  sourceReference?: string;
  sourceMetadata?: {
    issueType?: string;
    status?: string;
    priority?: string;
    externalUrl?: string;
    [key: string]: any;
  };
}

interface ImportedRequirementsPreviewProps {
  requirements: ImportedRequirement[];
  imported: number;
  skipped: number;
  failed: number;
  onConfirm: (selectedRequirements: ImportedRequirement[]) => void;
  onCancel: () => void;
  isAdding?: boolean;
}

export const ImportedRequirementsPreview = ({
  requirements,
  imported,
  skipped,
  failed,
  onConfirm,
  onCancel,
  isAdding = false,
}: ImportedRequirementsPreviewProps) => {
  const { t } = useTranslation("fpa");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(requirements.map((r) => r._id))
  );

  const toggleRequirement = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === requirements.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(requirements.map((r) => r._id)));
    }
  };

  const handleConfirm = () => {
    const selectedRequirements = requirements.filter((r) =>
      selectedIds.has(r._id)
    );
    onConfirm(selectedRequirements);
  };

  return (
    <div className="space-y-6">
      {/* Import Summary */}
      <div className="space-y-3">
        {imported > 0 && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md">
            ✓ {t("importForms.preview.successfullyImported", { count: imported })}
          </div>
        )}

        {skipped > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-md text-sm">
            ℹ {t("importForms.preview.skipped", { count: skipped })}
          </div>
        )}

        {failed > 0 && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
            ✗ {t("importForms.preview.failed", { count: failed })}
          </div>
        )}
      </div>

      {/* Requirements Table */}
      {requirements.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-default">
              {t("importForms.preview.reviewRequirements")}
            </h3>
            <p className="text-sm text-secondary">
              {t("importForms.preview.selectedCount", {
                count: selectedIds.size,
                total: requirements.length,
              })}
            </p>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === requirements.length}
                      onChange={toggleAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-default">
                    {t("importForms.preview.reference")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-default">
                    {t("importForms.manual.requirementTitle")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-default">
                    {t("importForms.manual.description")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-default">
                    {t("importForms.preview.metadata")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requirements.map((req) => (
                  <tr
                    key={req._id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      !selectedIds.has(req._id) ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(req._id)}
                        onChange={() => toggleRequirement(req._id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {req.sourceReference && req.sourceMetadata?.externalUrl ? (
                        <a
                          href={req.sourceMetadata.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono"
                        >
                          {req.sourceReference} ↗
                        </a>
                      ) : (
                        <span className="font-mono text-secondary">
                          {req.sourceReference || "-"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-default">
                      {req.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary max-w-md">
                      <div className="line-clamp-2">{req.description || "-"}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary">
                      {req.sourceMetadata && (
                        <div className="space-y-1">
                          {req.sourceMetadata.issueType && (
                            <div>
                              <span className="font-medium">Type:</span>{" "}
                              {req.sourceMetadata.issueType}
                            </div>
                          )}
                          {req.sourceMetadata.status && (
                            <div>
                              <span className="font-medium">Status:</span>{" "}
                              {req.sourceMetadata.status}
                            </div>
                          )}
                          {req.sourceMetadata.priority && (
                            <div>
                              <span className="font-medium">Priority:</span>{" "}
                              {req.sourceMetadata.priority}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} variant="secondary" disabled={isAdding}>
          {t("importForms.preview.cancel")}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="primary"
          disabled={isAdding || selectedIds.size === 0}
        >
          {isAdding
            ? t("requirementImport.importing")
            : t("importForms.preview.addSelected", { count: selectedIds.size })}
        </Button>
      </div>
    </div>
  );
};
