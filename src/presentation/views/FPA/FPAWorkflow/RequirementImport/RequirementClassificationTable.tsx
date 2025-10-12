"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRequirements } from "@/core/hooks/fpa";
import type { ComponentType, Requirement } from "@/core/types/fpa";
import { Button } from "@/presentation/components/primitives";
import { RequirementFPAModal } from "./RequirementFPAModal";

interface RequirementClassificationTableProps {
  onProceed?: () => void;
  onBack?: () => void;
}

export const RequirementClassificationTable = ({
  onProceed,
  onBack,
}: RequirementClassificationTableProps = {}) => {
  const { t } = useTranslation("fpa");
  const {
    requirements,
    classifyRequirement,
    getUnclassified,
    updateRequirementFpaData,
  } = useRequirements();

  const [modalRequirement, setModalRequirement] = useState<Requirement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const unclassified = getUnclassified();

  const filtered = useMemo(() => {
    return requirements.filter(
      (req) =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requirements, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequirements = filtered.slice(startIndex, endIndex);

  const handleSaveFpaData = (requirementId: string, fpaData: Record<string, unknown>) => {
    updateRequirementFpaData(requirementId, fpaData);
  };

  const componentTypes: ComponentType[] = ["ALI", "AIE", "EI", "EO", "EQ"];

  const classified = requirements.filter((r) => r.componentType).length;

  console.log('[RequirementClassificationTable] Requirements:', requirements);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <input
          type="text"
          placeholder={t("requirementClassification.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">{t("requirementClassification.itemsPerPage")}</label>
            <label className="text-sm text-gray-600 whitespace-nowrap sm:hidden">{t("requirementClassification.itemsPerPageShort")}</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {filtered.length} {filtered.length === 1 ? t("requirementClassification.requirement") : t("requirementClassification.requirements")}
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("requirementClassification.requirementTitle")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  {t("requirementClassification.requirementSource")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("requirementClassification.componentType")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("requirementClassification.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRequirements.map((req) => (
                <tr key={req.id}>
                  <td className="px-3 sm:px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {req.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-md">
                        {req.description}
                      </p>
                      <span className="md:hidden inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 mt-1">
                        {req.source}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 hidden md:table-cell">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {req.source}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3">
                    <select
                      value={req.componentType || ""}
                      onChange={(e) =>
                        classifyRequirement(
                          req.id,
                          e.target.value as ComponentType
                        )
                      }
                      className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-sm w-auto min-w-[140px] max-w-[180px]"
                    >
                      <option value="">
                        {t("requirementClassification.unclassified")}
                      </option>
                      {componentTypes.map((type) => (
                        <option key={type} value={type}>
                          {t(`componentTypes.${type}_short`)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 sm:px-6 py-3">
                    {req.componentType && (
                      <Button
                        onClick={() => setModalRequirement(req)}
                        variant={req.fpaData ? "secondary" : "primary"}
                        size="sm"
                        className={`${req.fpaData ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-300" : ""} whitespace-nowrap`}
                      >
                        {req.fpaData ? (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline">{t("requirementClassification.editFields")}</span>
                            <span className="sm:hidden">{t("requirementClassification.edit")}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="hidden sm:inline">{t("requirementClassification.fillFields")}</span>
                            <span className="sm:hidden">{t("requirementClassification.fill")}</span>
                          </>
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-gray-50 px-3 sm:px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
              {t("requirementClassification.showing", {
                start: startIndex + 1,
                end: Math.min(endIndex, filtered.length),
                total: filtered.length,
              })}
            </div>
            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[44px] h-[44px] sm:h-auto flex items-center justify-center"
                aria-label={t("requirementClassification.previousPage")}
              >
                <span className="hidden sm:inline">{t("requirementClassification.previous")}</span>
                <svg className="sm:hidden w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-1">
                {(() => {
                  const maxVisible = 5;
                  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

                  if (totalPages <= maxVisible) {
                    return pages.map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-1.5 sm:py-1 border rounded-md text-xs sm:text-sm font-medium cursor-pointer min-w-[44px] h-[44px] sm:h-auto flex items-center justify-center ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ));
                  }

                  let visiblePages: (number | string)[] = [];
                  if (currentPage <= 3) {
                    visiblePages = [1, 2, 3, 4, '...', totalPages];
                  } else if (currentPage >= totalPages - 2) {
                    visiblePages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                  } else {
                    visiblePages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                  }

                  return visiblePages.map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm text-gray-500 flex items-center">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`px-2 sm:px-3 py-1.5 sm:py-1 border rounded-md text-xs sm:text-sm font-medium cursor-pointer min-w-[44px] h-[44px] sm:h-auto flex items-center justify-center ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[44px] h-[44px] sm:h-auto flex items-center justify-center"
                aria-label={t("requirementClassification.nextPage")}
              >
                <span className="hidden sm:inline">{t("requirementClassification.next")}</span>
                <svg className="sm:hidden w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t">
        <p className="text-sm text-gray-600 text-center sm:text-left">
          {unclassified.length > 0
            ? t("requirementClassification.requirementsNeedClassification", { count: unclassified.length })
            : requirements.some(r => !r.fpaData)
            ? t("requirementClassification.requirementsNeedData", {
                count: requirements.filter(r => !r.fpaData).length
              })
            : t("requirementClassification.allComplete")}
        </p>
        <Button
          onClick={onProceed}
          disabled={unclassified.length > 0 || requirements.some(r => !r.fpaData)}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {t("requirementImport.nextToGSC")}
        </Button>
      </div>

      {modalRequirement && (
        <RequirementFPAModal
          requirement={modalRequirement}
          isOpen={!!modalRequirement}
          onClose={() => setModalRequirement(null)}
          onSave={handleSaveFpaData}
        />
      )}
    </div>
  );
};
