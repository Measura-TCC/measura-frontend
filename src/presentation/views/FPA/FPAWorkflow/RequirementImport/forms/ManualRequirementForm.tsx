"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table } from "@/presentation/components/primitives";
import { Pagination } from "@/presentation/components/primitives/Pagination/Pagination";
import { usePagination } from "@/core/hooks/usePagination";
import type { Requirement } from "@/core/types/fpa";
import { BulkRequirementModal } from "../BulkRequirementModal";

interface ManualRequirementFormProps {
  requirements: Requirement[];
  addRequirement: (requirement: { title: string; description?: string; source: 'manual' }) => void;
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'manual' }>) => void;
  removeRequirement?: (requirementId: string) => void;
}

export const ManualRequirementForm = ({ requirements, addRequirement, addRequirements, removeRequirement }: ManualRequirementFormProps) => {
  const { t } = useTranslation("fpa");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedRequirements,
    startIndex,
    endIndex,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({ data: requirements, initialItemsPerPage: 5 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRequirement({
      title: title.trim(),
      description: description.trim() || undefined,
      source: "manual",
    });

    setTitle("");
    setDescription("");
  };

  const handleBulkSubmit = (bulkRequirements: Array<{ title: string; description?: string; source: 'manual' }>) => {
    addRequirements(bulkRequirements);
  };

  return (
    <>
      <BulkRequirementModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleBulkSubmit}
      />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-default whitespace-normal">
              {t("importForms.manual.title")}
            </h3>
            <Button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              variant="secondary"
              className="text-sm shrink-0"
            >
              {t("importForms.manual.addMultiple", "Add Multiple")}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            {t("importForms.manual.requirementTitle")} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("importForms.manual.titlePlaceholder")}
            className="w-full px-3 py-2 border border-border bg-background text-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:invalid:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            {t("importForms.manual.description")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("importForms.manual.descriptionPlaceholder")}
            rows={4}
            className="w-full px-3 py-2 border border-border bg-background text-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

            <Button type="submit" variant="primary">
              {t("importForms.manual.addAnother")}
            </Button>
          </form>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("requirementImport.allRequirements", "All Requirements")} ({requirements.length})
            </h4>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap hidden sm:inline">
                {t("requirementClassification.itemsPerPage")}
              </label>
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap sm:hidden">
                {t("requirementClassification.itemsPerPageShort")}
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {requirements.length > 0 ? (
              <Table
                  columns={[
                    {
                      key: "title",
                      label: t("requirementImport.requirementTitle"),
                      render: (req: Requirement) => (
                        <div className="font-medium text-default">{req.title}</div>
                      ),
                    },
                    {
                      key: "description",
                      label: t("requirementImport.description"),
                      render: (req: Requirement) => (
                        <div className="text-sm text-secondary max-w-md line-clamp-2">
                          {req.description || "-"}
                        </div>
                      ),
                      hideOnMobile: true,
                    },
                    {
                      key: "source",
                      label: t("requirementImport.source"),
                      render: (req: Requirement) => (
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            {req.source}
                          </span>
                          {req.sourceReference && (
                            <div className="text-xs text-secondary mt-1 font-mono">
                              {req.sourceReference}
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: "actions",
                      label: t("actions.edit"),
                      render: (req: Requirement) => (
                        removeRequirement && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(req._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium cursor-pointer"
                            title={t("actions.delete", "Delete")}
                          >
                            {t("actions.remove", { defaultValue: "Remove" })}
                          </button>
                        )
                      ),
                    },
                  ]}
                  data={paginatedRequirements}
                  getRowKey={(req) => req._id}
                />
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("importForms.manual.noRequirementsYet", "Nenhum requisito adicionado ainda")}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {t("importForms.manual.addRequirementsToSee", "Adicione requisitos para vê-los aqui")}
                </p>
              </div>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={requirements.length}
          />
        </div>
      </div>
    </>
  );
};
