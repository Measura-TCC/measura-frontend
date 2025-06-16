"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { EstimateOverviewCard } from "./EstimateOverviewCard";
import { useEstimatesOverviews } from "@/core/hooks/fpa/estimates/useEstimate";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";

interface EstimatesDashboardProps {
  projectId?: string;
}

export const EstimatesDashboard = ({ projectId }: EstimatesDashboardProps) => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<
    "name" | "created" | "updated" | "points"
  >("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();
  const { estimatesOverviews, isLoadingEstimatesOverviews, error } =
    useEstimatesOverviews(projectId ? { projectId } : undefined);

  const filteredAndSortedEstimates = useMemo(() => {
    if (!estimatesOverviews) return [];

    const filtered = estimatesOverviews.filter((estimate) => {
      const matchesSearch =
        estimate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        estimate.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        estimate.project?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || estimate.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "created":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "updated":
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case "points":
          aValue = a.adjustedFunctionPoints ?? a.unadjustedFunctionPoints ?? 0;
          bValue = b.adjustedFunctionPoints ?? b.unadjustedFunctionPoints ?? 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [estimatesOverviews, searchQuery, statusFilter, sortBy, sortOrder]);

  const statistics = useMemo(() => {
    if (!estimatesOverviews)
      return { total: 0, draft: 0, inProgress: 0, finalized: 0, archived: 0 };

    return {
      total: estimatesOverviews.length,
      draft: estimatesOverviews.filter((e) => e.status === "DRAFT").length,
      inProgress: estimatesOverviews.filter((e) => e.status === "IN_PROGRESS")
        .length,
      finalized: estimatesOverviews.filter((e) => e.status === "FINALIZED")
        .length,
      archived: estimatesOverviews.filter((e) => e.status === "ARCHIVED")
        .length,
    };
  }, [estimatesOverviews]);

  const handleCreateEstimate = () => {
    if (!userOrganization) {
      router.push("/organization");
      return;
    }
    router.push("/fpa");
  };

  if (isLoadingUserOrganization || isLoadingEstimatesOverviews) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("estimatesDashboard.errorTitle")}
          </h3>
          <p className="text-gray-600">
            {t("estimatesDashboard.errorMessage")}
          </p>
        </div>
      </div>
    );
  }

  if (!userOrganization) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-amber-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("organizationRequired")}
          </h3>
          <p className="text-gray-600 mb-4">
            {t("organizationRequiredDescription")}
          </p>
          <button
            onClick={() => router.push("/organization")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {t("createOrganization")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-1">{t("subtitle")}</p>
        </div>
        <button
          onClick={handleCreateEstimate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>{t("createNew")}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">{t("totalEstimates")}</p>
          <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            {t("estimatesDashboard.draft")}
          </p>
          <p className="text-2xl font-bold text-gray-600">{statistics.draft}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            {t("estimatesDashboard.inProgress")}
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {statistics.inProgress}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            {t("estimatesDashboard.finalized")}
          </p>
          <p className="text-2xl font-bold text-green-600">
            {statistics.finalized}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            {t("estimatesDashboard.archived")}
          </p>
          <p className="text-2xl font-bold text-red-600">
            {statistics.archived}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("estimatesDashboard.search")}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("estimatesDashboard.searchPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("estimatesDashboard.status")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="ALL">{t("estimatesDashboard.allStatuses")}</option>
              <option value="DRAFT">{t("estimatesDashboard.draft")}</option>
              <option value="IN_PROGRESS">
                {t("estimatesDashboard.inProgress")}
              </option>
              <option value="FINALIZED">
                {t("estimatesDashboard.finalized")}
              </option>
              <option value="ARCHIVED">
                {t("estimatesDashboard.archived")}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("estimatesDashboard.sortBy")}
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "name" | "created" | "updated" | "points"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="updated">
                {t("estimatesDashboard.lastUpdated")}
              </option>
              <option value="created">
                {t("estimatesDashboard.createdDate")}
              </option>
              <option value="name">{t("estimatesDashboard.name")}</option>
              <option value="points">
                {t("estimatesDashboard.functionPoints")}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("estimatesDashboard.order")}
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="desc">{t("estimatesDashboard.descending")}</option>
              <option value="asc">{t("estimatesDashboard.ascending")}</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedEstimates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || statusFilter !== "ALL"
              ? t("estimatesDashboard.noEstimatesFound")
              : t("noEstimatesYet")}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== "ALL"
              ? t("estimatesDashboard.adjustFilters")
              : t("noEstimatesDescription")}
          </p>
          {!searchQuery && statusFilter === "ALL" && (
            <button
              onClick={handleCreateEstimate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {t("createFirstEstimate")}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEstimates.map((estimate) => (
            <EstimateOverviewCard key={estimate._id} estimate={estimate} />
          ))}
        </div>
      )}
    </div>
  );
};
