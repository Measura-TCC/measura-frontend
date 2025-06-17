"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { EstimateOverviewCard } from "../common/EstimateOverviewCard";
import { useEstimatesOverviews } from "@/core/hooks/fpa/estimates/useEstimate";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import {
  ExclamationIcon,
  OfficeIcon,
  PlusIcon,
  ClipboardIcon,
} from "@/presentation/assets/icons";

interface EstimatesDashboardProps {
  projectId?: string;
  onCreateNew?: () => void;
}

export const EstimatesDashboard = ({
  projectId,
  onCreateNew,
}: EstimatesDashboardProps) => {
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
    if (onCreateNew) {
      onCreateNew();
    } else {
      router.push("/fpa");
    }
  };

  if (isLoadingUserOrganization || isLoadingEstimatesOverviews) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-background-secondary rounded-md w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-background-secondary rounded-lg"
              ></div>
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
            <ExclamationIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-default mb-2">
            {t("estimatesDashboard.errorTitle")}
          </h3>
          <p className="text-secondary">
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
            <OfficeIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-default mb-2">
            {t("organizationRequired")}
          </h3>
          <p className="text-secondary mb-4">
            {t("organizationRequiredDescription")}
          </p>
          <button
            onClick={() => router.push("/organization")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
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
          <h1 className="text-2xl font-bold text-default">{t("title")}</h1>
          <p className="text-secondary mt-1">{t("subtitle")}</p>
        </div>
        <button
          onClick={handleCreateEstimate}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center space-x-2 hover:cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          <span>{t("createNew")}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-background p-4 rounded-lg border border-border">
          <p className="text-sm text-secondary">{t("totalEstimates")}</p>
          <p className="text-2xl font-bold text-default">{statistics.total}</p>
        </div>
        <div className="bg-background p-4 rounded-lg border border-border">
          <p className="text-sm text-secondary">
            {t("estimatesDashboard.draft")}
          </p>
          <p className="text-2xl font-bold text-secondary">
            {statistics.draft}
          </p>
        </div>
        <div className="bg-background p-4 rounded-lg border border-border">
          <p className="text-sm text-secondary">
            {t("estimatesDashboard.inProgress")}
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {statistics.inProgress}
          </p>
        </div>
        <div className="bg-background p-4 rounded-lg border border-border">
          <p className="text-sm text-secondary">
            {t("estimatesDashboard.finalized")}
          </p>
          <p className="text-2xl font-bold text-green-600">
            {statistics.finalized}
          </p>
        </div>
        <div className="bg-background p-4 rounded-lg border border-border">
          <p className="text-sm text-secondary">
            {t("estimatesDashboard.archived")}
          </p>
          <p className="text-2xl font-bold text-red-600">
            {statistics.archived}
          </p>
        </div>
      </div>

      <div className="bg-background p-4 rounded-lg border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-default mb-1">
              {t("estimatesDashboard.search")}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("estimatesDashboard.searchPlaceholder")}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-default mb-1">
              {t("estimatesDashboard.status")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
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
            <label className="block text-sm font-medium text-default mb-1">
              {t("estimatesDashboard.sortBy")}
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "name" | "created" | "updated" | "points"
                )
              }
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
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
            <label className="block text-sm font-medium text-default mb-1">
              {t("estimatesDashboard.order")}
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-default"
            >
              <option value="desc">{t("estimatesDashboard.descending")}</option>
              <option value="asc">{t("estimatesDashboard.ascending")}</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedEstimates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted mb-4">
            <ClipboardIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-default mb-2">
            {searchQuery || statusFilter !== "ALL"
              ? t("estimatesDashboard.noEstimatesFound")
              : t("estimatesDashboard.noEstimates")}
          </h3>
          <p className="text-secondary mb-4">
            {searchQuery || statusFilter !== "ALL"
              ? t("estimatesDashboard.noEstimatesFoundDescription")
              : t("estimatesDashboard.noEstimatesDescription")}
          </p>
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
