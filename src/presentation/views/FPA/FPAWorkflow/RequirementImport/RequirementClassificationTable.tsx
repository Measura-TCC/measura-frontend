"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRequirementsStore } from "@/core/hooks/fpa/useRequirementsStore";
import { usePagination } from "@/core/hooks";
import type { ComponentType, Requirement } from "@/core/types/fpa";
import { Button, Table, Pagination, type Column } from "@/presentation/components/primitives";
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
  const requirements = useRequirementsStore((state) => state.requirements);
  const classifyRequirement = useRequirementsStore((state) => state.classifyRequirement);
  const updateRequirementFpaData = useRequirementsStore((state) => state.updateRequirementFpaData);

  const getUnclassified = () => requirements.filter((r) => !r.componentType);

  const [modalRequirement, setModalRequirement] = useState<Requirement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const unclassified = getUnclassified();

  const filtered = useMemo(() => {
    return requirements.filter(
      (req) =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requirements, searchTerm]);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({ data: filtered, initialItemsPerPage: 10 });

  const componentTypes: ComponentType[] = ["ALI", "AIE", "EI", "EO", "EQ"];

  const classified = requirements.filter((r) => r.componentType).length;

  const columns: Column<Requirement>[] = [
    {
      key: "title",
      label: t("requirementClassification.requirementTitle"),
      render: (req) => (
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
      ),
    },
    {
      key: "source",
      label: t("requirementClassification.requirementSource"),
      hideOnMobile: true,
      render: (req) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          {req.source}
        </span>
      ),
    },
    {
      key: "componentType",
      label: t("requirementClassification.componentType"),
      render: (req) => (
        <select
          value={req.componentType || ""}
          onChange={(e) =>
            classifyRequirement(
              req._id,
              e.target.value as ComponentType
            )
          }
          className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-sm w-full md:w-auto md:min-w-[140px] md:max-w-[180px]"
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
      ),
    },
    {
      key: "actions",
      label: t("requirementClassification.actions"),
      render: (req) => (
        <span
          className="inline-block relative group/tooltip w-full md:w-auto"
          data-tooltip={!req.componentType ? t("requirementClassification.mustClassifyFirst", "You must classify the requirement before filling the fields") : undefined}
        >
          <Button
            onClick={() => req.componentType && setModalRequirement(req)}
            variant={req.componentId ? "secondary" : "primary"}
            size="sm"
            disabled={!req.componentType}
            className={`${req.componentId ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-300" : ""} whitespace-nowrap ${!req.componentType ? 'pointer-events-none' : ''} w-full md:w-auto`}
          >
            {req.componentId ? (
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
          {!req.componentType && (
            <span className="opacity-0 group-hover/tooltip:opacity-100 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap pointer-events-none shadow-lg transition-opacity duration-200 ease-in-out">
              {t("requirementClassification.mustClassifyFirst", "You must classify the requirement before filling the fields")}
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></span>
            </span>
          )}
        </span>
      ),
    },
  ];

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
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">{t("requirementClassification.itemsPerPage")}</label>
            <label className="text-sm text-gray-600 whitespace-nowrap sm:hidden">{t("requirementClassification.itemsPerPageShort")}</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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

      <div className="border rounded-lg overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <Table
            columns={columns}
            data={paginatedData}
            getRowKey={(req) => req._id}
            emptyMessage={t("requirementClassification.noRequirements", "No requirements found")}
          />
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
          totalItems={filtered.length}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t">
        <p className="text-sm text-gray-600 text-center sm:text-left">
          {unclassified.length > 0
            ? t("requirementClassification.requirementsNeedClassification", { count: unclassified.length })
            : requirements.some(r => !r.componentId)
            ? t("requirementClassification.requirementsNeedData", {
                count: requirements.filter(r => !r.componentId).length
              })
            : t("requirementClassification.allComplete")}
        </p>
        <Button
          onClick={onProceed}
          disabled={unclassified.length > 0 || requirements.some(r => !r.componentId)}
          variant="primary"
          className="w-full sm:w-auto whitespace-normal text-center"
        >
          {t("requirementImport.nextToGSC")}
        </Button>
      </div>

      {modalRequirement && (
        <RequirementFPAModal
          requirement={modalRequirement}
          isOpen={!!modalRequirement}
          onClose={() => setModalRequirement(null)}
          onSave={updateRequirementFpaData}
        />
      )}
    </div>
  );
};
