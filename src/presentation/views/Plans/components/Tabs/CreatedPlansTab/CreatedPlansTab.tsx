import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { DocumentIcon } from "@/presentation/assets/icons";
import {
  MeasurementPlanSummaryDto,
  MeasurementPlanStatus,
} from "@/core/types/plans";
import { usePlanStatus } from "@/core/hooks/measurementPlans";
import { MetricStatusBadge } from "../../MetricStatusBadge";

interface PlanStatusDisplayProps {
  planId: string;
}

const PlanStatusDisplay: React.FC<PlanStatusDisplayProps> = ({ planId }) => {
  const { t } = useTranslation("plans");
  const { status, isLoading } = usePlanStatus({ planId });

  if (isLoading) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">{t("loading")}</span>;
  }

  if (!status) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">-</span>;
  }

  return <MetricStatusBadge status={status.overallStatus} size="sm" />;
};

interface CreatedPlansTabProps {
  plans: MeasurementPlanSummaryDto[] | undefined;
  isLoadingPlans: boolean;
  formatDate: (date: Date | string) => string;
  getStatusColor: (status: MeasurementPlanStatus) => string;
  onViewPlan: (planId: string) => void;
  onEditPlan?: (plan: MeasurementPlanSummaryDto) => void;
  onDeletePlan?: (plan: MeasurementPlanSummaryDto) => void;
  projects?: Array<{ _id: string; name: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const CreatedPlansTab: React.FC<CreatedPlansTabProps> = ({
  plans,
  isLoadingPlans,
  formatDate,
  getStatusColor,
  onViewPlan,
  onEditPlan,
  onDeletePlan,
  projects = [],
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation("plans");
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getProjectName = (projectId: string): string => {
    const project = projects.find((p) => p._id === projectId);
    return project?.name || projectId;
  };

  if (isLoadingPlans) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <DocumentIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-default mb-2">
            {t("noPlan")}
          </h3>
          <p className="text-muted mb-6">{t("createFirstPlan")}</p>
          <Button onClick={() => router.push("/plans?tab=newPlan")}>
            {t("createPlan")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onViewPlan(plan.id)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-2">{plan.planName}</CardTitle>
                <div className="flex items-center flex-wrap gap-2 md:gap-4 text-sm text-muted">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      plan.status
                    )}`}
                  >
                    {t(`status.${plan.status}`)}
                  </span>
                  <span>
                    {t("responsible")}: {plan.planResponsible}
                  </span>
                  <span>
                    {t("project")}: {getProjectName(plan.associatedProject)}
                  </span>
                </div>
              </div>

              {(onEditPlan || onDeletePlan) && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === plan.id ? null : plan.id);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-secondary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {openMenuId === plan.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg z-20 border border-border">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewPlan(plan.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-default hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            {t("actions.view")}
                          </button>
                          {onEditPlan && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditPlan(plan);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-default hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              {t("actions.edit")}
                            </button>
                          )}
                          {onDeletePlan && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeletePlan(plan);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                            >
                              {t("actions.delete")}
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {/* <div>
                <span className="font-medium text-default">
                  {t("progress")}
                </span>
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {plan.progress}%
                    </span>
                  </div>
                </div>
              </div> */}
              <div>
                <span className="font-medium text-default">
                  {t("workflow.objectives")}
                </span>
                <p className="text-secondary">{plan.objectivesCount}</p>
              </div>
              <div>
                <span className="font-medium text-default">
                  {t("workflow.questions")}
                </span>
                <p className="text-secondary">{plan.questionsCount}</p>
              </div>
              <div>
                <span className="font-medium text-default">
                  {t("workflow.metrics")}
                </span>
                <p className="text-secondary">{plan.metricsCount}</p>
              </div>
              <div>
                <span className="font-medium text-default">
                  {t("indicatorStatus.title")}
                </span>
                <div className="mt-1">
                  <PlanStatusDisplay planId={plan.id} />
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 border-t pt-4">
              <div className="flex justify-between">
                <span>
                  {t("created")}: {formatDate(plan.createdAt)}
                </span>
                <span>
                  {t("updated")}: {formatDate(plan.updatedAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>
              {t("showing")} {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              {t("of")} {pagination.total} {t("plans")}
            </span>
            {onPageSizeChange && (
              <div className="flex items-center space-x-2 ml-4">
                <span>{t("rowsPerPage")}</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            )}
          </div>

          {onPageChange && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-2 py-1"
              >
                {t("previous")}
              </Button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum = i + 1;

                    // Adjust page numbers if we're past the first few pages
                    if (pagination.totalPages > 5) {
                      if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pagination.page === pageNum ? "primary" : "ghost"
                        }
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className="px-3 py-1 min-w-[32px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-2 py-1"
              >
                {t("next")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
