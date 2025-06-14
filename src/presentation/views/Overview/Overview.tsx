"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { PlusIcon, ChartIcon, BuildingIcon } from "@/presentation/assets/icons";
import { formatRelativeTime } from "@/core/utils";
import { useTranslation } from "react-i18next";
import { getTranslatedActivities } from "./utils/mockActivities";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";

interface OverviewViewProps {
  user: {
    name: string;
    role: string;
  };
}

export const OverviewView: React.FC<OverviewViewProps> = ({ user }) => {
  const { t } = useTranslation("dashboard");
  const { t: tOrg } = useTranslation("organization");
  const router = useRouter();
  const [activities] = useState(() => getTranslatedActivities(t));
  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();

  const handleCreateOrganization = () => {
    router.push("/organization");
  };

  const handleNewFPAEstimate = () => {
    if (!userOrganization) {
      router.push("/organization");
      return;
    }
    router.push("/fpa");
  };

  const handleNewMeasurementPlan = () => {
    if (!userOrganization) {
      router.push("/organization");
      return;
    }
    router.push("/plans");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
        <p className="text-muted mt-1">{t("welcome", { name: user?.name })}</p>
        {userOrganization && (
          <p className="text-sm text-secondary mt-1 flex items-center gap-2">
            <BuildingIcon className="w-4 h-4" />
            {userOrganization.name}
            {userOrganization.description &&
              ` - ${userOrganization.description}`}
          </p>
        )}
      </div>

      {/* Organization Warning */}
      {!isLoadingUserOrganization && !userOrganization && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <BuildingIcon className="w-6 h-6 text-amber-600" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-900">
                  {tOrg("organizationRequired")}
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  {tOrg("organizationRequiredMessage")}
                </p>
              </div>
              <Button onClick={handleCreateOrganization} size="sm">
                <PlusIcon className="w-4 h-4 mr-2" />
                {tOrg("createOrganization")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-primary" />
              {t("quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={handleNewFPAEstimate}
              disabled={!userOrganization}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("newFPAEstimate")}
            </Button>
            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={handleNewMeasurementPlan}
              disabled={!userOrganization}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("newMeasurementPlan")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("statistics")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("totalEstimates")}</span>
              <span className="font-semibold text-default">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("activeGoals")}</span>
              <span className="font-semibold text-default">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary">{t("completedPlans")}</span>
              <span className="font-semibold text-default">5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuildingIcon className="w-5 h-5 text-primary" />
              {tOrg("title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUserOrganization ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            ) : userOrganization ? (
              <div className="space-y-2">
                <p className="font-semibold text-default">
                  {userOrganization.name}
                </p>
                {userOrganization.industry && (
                  <p className="text-sm text-secondary">
                    {userOrganization.industry}
                  </p>
                )}
                {userOrganization.website && (
                  <a
                    href={userOrganization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {tOrg("visitWebsite")}
                  </a>
                )}
                <p className="text-xs text-muted">
                  {tOrg("memberSince")}{" "}
                  {new Date(userOrganization.createdAt).toLocaleDateString()}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push("/organization")}
                  className="mt-2"
                >
                  {tOrg("manageOrganization")}
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm text-secondary">
                  {tOrg("noOrganizationAssigned")}
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCreateOrganization}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  {tOrg("createOrganization")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("yourRole")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-secondary">{t("currentRole")}</p>
              <p className="font-semibold text-default capitalize">
                {user?.role}
              </p>
              <p className="text-sm text-muted">
                {user?.role === "admin" && t("role.admin")}
                {user?.role === "manager" && t("role.manager")}
                {user?.role === "analyst" && t("role.analyst")}
                {user?.role === "user" && t("role.user")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("recentActivity")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 pb-4 border-b border-border last:border-b-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-default">
                    {activity.title}
                  </p>
                  <p className="text-sm text-secondary">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted">
                      {activity.userName}
                    </span>
                    <span className="text-xs text-muted">•</span>
                    <span className="text-xs text-muted">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
