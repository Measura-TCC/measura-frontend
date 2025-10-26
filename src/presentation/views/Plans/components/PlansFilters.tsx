import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Dropdown,
} from "@/presentation/components/primitives";
import type { DropdownItem } from "@/presentation/components/primitives";
import {
  SearchIcon,
  MenuIcon,
  XIcon,
} from "@/presentation/assets/icons";
import { MeasurementPlanStatus } from "@/core/types/plans";

interface PlansFiltersProps {
  searchQuery?: string;
  statusFilter?: MeasurementPlanStatus;
  projectFilter?: string;
  projects?: Array<{ id: string; name: string; }>;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: MeasurementPlanStatus | undefined) => void;
  onProjectChange: (projectId: string | undefined) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const PlansFilters: React.FC<PlansFiltersProps> = ({
  searchQuery = "",
  statusFilter,
  projectFilter,
  projects = [],
  onSearchChange,
  onStatusChange,
  onProjectChange,
  onClearFilters,
  isLoading = false,
}) => {
  const { t } = useTranslation("plans");
  const [searchInput, setSearchInput] = useState(searchQuery);

  const statusOptions: DropdownItem[] = [
    { id: "all", label: t("allStatuses") },
    { id: MeasurementPlanStatus.DRAFT, label: t(`status.${MeasurementPlanStatus.DRAFT}`) },
    { id: MeasurementPlanStatus.APPROVED, label: t(`status.${MeasurementPlanStatus.APPROVED}`) },
    { id: MeasurementPlanStatus.REJECTED, label: t(`status.${MeasurementPlanStatus.REJECTED}`) },
    { id: MeasurementPlanStatus.FINISHED, label: t(`status.${MeasurementPlanStatus.FINISHED}`) },
  ];

  const projectOptions: DropdownItem[] = [
    { id: "all", label: t("allProjects") },
    ...projects.map(project => ({ id: project.id, label: project.name })),
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput.trim());
  };

  const handleStatusSelect = (item: DropdownItem) => {
    if (item.id === "all") {
      onStatusChange(undefined);
    } else {
      onStatusChange(item.id as MeasurementPlanStatus);
    }
  };

  const handleProjectSelect = (item: DropdownItem) => {
    if (item.id === "all") {
      onProjectChange(undefined);
    } else {
      onProjectChange(item.id);
    }
  };

  const hasActiveFilters = searchQuery || statusFilter || projectFilter;

  const selectedStatusLabel = statusFilter
    ? t(`status.${statusFilter}`)
    : t("allStatuses");

  const selectedProjectLabel = projectFilter
    ? projects.find(p => p.id === projectFilter)?.name || t("unknownProject")
    : t("allProjects");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-end">
        {/* Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("searchPlans")}
          </label>
          <form onSubmit={handleSearchSubmit} className="flex">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("searchPlansPlaceholder")}
                className="!pl-10"
                style={{ paddingLeft: '2.5rem' }}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="ml-2"
              disabled={isLoading}
            >
              {t("search")}
            </Button>
          </form>
        </div>

        {/* Status Filter */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("filterByStatus")}
          </label>
          <Dropdown
            trigger={
              <Button variant="ghost" className="w-full justify-between border border-gray-300 dark:border-gray-600">
                <span className="flex items-center">
                  <MenuIcon className="h-4 w-4 mr-2" />
                  {selectedStatusLabel}
                </span>
                <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            }
            items={statusOptions.map(option => ({
              ...option,
              onClick: () => handleStatusSelect(option),
            }))}
            align="left"
          />
        </div>

        {/* Project Filter */}
        {projects.length > 0 && (
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("filterByProject")}
            </label>
            <Dropdown
              trigger={
                <Button variant="ghost" className="w-full justify-between border border-gray-300 dark:border-gray-600">
                  <span className="flex items-center">
                    <MenuIcon className="h-4 w-4 mr-2" />
                    <span className="truncate">{selectedProjectLabel}</span>
                  </span>
                  <svg className="h-4 w-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              }
              items={projectOptions.map(option => ({
                ...option,
                onClick: () => handleProjectSelect(option),
              }))}
              align="left"
            />
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              disabled={isLoading}
            >
              <XIcon className="h-4 w-4 mr-1" />
              {t("clearFilters")}
            </Button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("activeFilters")}:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                {t("search")}: &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            )}

            {statusFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                {t("planDetails.status")}: {t(`status.${statusFilter}`)}
                <button
                  onClick={() => onStatusChange(undefined)}
                  className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            )}

            {projectFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                {t("project")}: {projects.find(p => p.id === projectFilter)?.name || t("unknownProject")}
                <button
                  onClick={() => onProjectChange(undefined)}
                  className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};