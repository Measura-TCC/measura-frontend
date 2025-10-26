"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table } from "@/presentation/components/primitives";
import type { Column } from "@/presentation/components/primitives";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const removeRequirement = (id: string) => {
    const newSelected = new Set(selectedIds);
    newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  const handleConfirm = () => {
    const selectedRequirements = requirements.filter((r) =>
      selectedIds.has(r._id)
    );
    onConfirm(selectedRequirements);
  };

  // Pagination
  const totalPages = Math.ceil(requirements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequirements = requirements.slice(startIndex, endIndex);

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

      {/* Empty State */}
      {requirements.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-border">
          <p className="text-lg font-medium text-default mb-2">
            {t("importForms.emptyStates.noRequirementsFound")}
          </p>
          <p className="text-sm text-muted">
            {t("importForms.emptyStates.noRequirementsDescription")}
          </p>
        </div>
      )}

      {/* Requirements Table */}
      {requirements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-default">
              {t("importForms.preview.importRequirements")}
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAll}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                {selectedIds.size === requirements.length
                  ? t("importForms.preview.deselectAll")
                  : t("importForms.preview.selectAll")}
              </button>
              <p className="text-sm text-secondary">
                {t("importForms.preview.selectedCount", {
                  count: selectedIds.size,
                  total: requirements.length,
                })}
              </p>
            </div>
          </div>

          <Table
            columns={[
              {
                key: "select",
                label: (
                  <input
                    type="checkbox"
                    checked={selectedIds.size === requirements.length}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                ) as any,
                render: (req: ImportedRequirement) => (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(req._id)}
                    onChange={() => toggleRequirement(req._id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                ),
              },
              {
                key: "name",
                label: t("importForms.manual.requirementTitle"),
                render: (req: ImportedRequirement) => (
                  <div className="font-medium text-default">{req.title}</div>
                ),
              },
              {
                key: "description",
                label: t("importForms.manual.description"),
                render: (req: ImportedRequirement) => (
                  <div className="text-sm text-secondary max-w-md line-clamp-2">
                    {req.description || "-"}
                  </div>
                ),
                hideOnMobile: true,
              },
              {
                key: "source",
                label: t("importForms.preview.source"),
                render: (req: ImportedRequirement) => (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {req.source}
                    </span>
                    {req.sourceReference && (
                      req.sourceMetadata?.externalUrl ? (
                        <a
                          href={req.sourceMetadata.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline font-mono"
                        >
                          {req.sourceReference}
                        </a>
                      ) : (
                        <span className="text-xs font-mono text-secondary">
                          {req.sourceReference}
                        </span>
                      )
                    )}
                  </div>
                ),
              },
              {
                key: "actions",
                label: t("importForms.preview.edit"),
                render: (req: ImportedRequirement) => (
                  <button
                    onClick={() => removeRequirement(req._id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    disabled={isAdding}
                  >
                    {t("importForms.preview.remove")}
                  </button>
                ),
              },
            ]}
            data={paginatedRequirements}
            getRowKey={(req) => req._id}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-secondary">
                {t("importForms.preview.showing", {
                  start: startIndex + 1,
                  end: Math.min(endIndex, requirements.length),
                  total: requirements.length,
                })}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="secondary"
                  size="sm"
                >
                  {t("importForms.preview.previous")}
                </Button>
                <span className="flex items-center px-3 text-sm text-secondary">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  size="sm"
                >
                  {t("importForms.preview.next")}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} variant="secondary" disabled={isAdding}>
          {requirements.length === 0 ? t("importForms.preview.back") : t("importForms.preview.cancel")}
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
