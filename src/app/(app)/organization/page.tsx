"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { BuildingIcon, PlusIcon } from "@/presentation/assets/icons";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { CreateOrganizationForm } from "../../../components/organizations/CreateOrganizationForm";

export default function OrganizationPage() {
  const { t } = useTranslation("organization");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const {
    userOrganization,
    isLoadingUserOrganization,
    mutateUserOrganization,
  } = useUserOrganization();

  const handleOrganizationCreated = async () => {
    setShowCreateForm(false);
    await mutateUserOrganization();
  };

  if (isLoadingUserOrganization) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
          <p className="text-muted mt-1">{t("loadingMessage")}</p>
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
        <p className="text-muted mt-1">{t("subtitle")}</p>
      </div>

      {userOrganization ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BuildingIcon className="w-5 h-5 text-primary" />
                {t("organizationDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("name")}
                </label>
                <p className="text-default font-semibold">
                  {userOrganization.name}
                </p>
              </div>

              {userOrganization.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("description")}
                  </label>
                  <p className="text-secondary">
                    {userOrganization.description}
                  </p>
                </div>
              )}

              {userOrganization.industry && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("industry")}
                  </label>
                  <p className="text-secondary">{userOrganization.industry}</p>
                </div>
              )}

              {userOrganization.website && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("website")}
                  </label>
                  <a
                    href={userOrganization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {userOrganization.website}
                  </a>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("created")}
                </label>
                <p className="text-muted text-sm">
                  {new Date(userOrganization.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("organizationStatistics")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t("totalProjects")}</span>
                <span className="font-semibold text-default">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t("activeEstimates")}</span>
                <span className="font-semibold text-default">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">{t("teamMembers")}</span>
                <span className="font-semibold text-default">-</span>
              </div>
              <div className="text-xs text-muted mt-4">
                {t("statisticsNote")}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuildingIcon className="w-5 h-5 text-primary" />
              {t("noOrganizationFound")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-secondary">{t("noOrganizationMessage")}</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("createOrganization")}
            </Button>
          </CardContent>
        </Card>
      )}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t("createNewOrganization")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateOrganizationForm onSuccess={handleOrganizationCreated} />
            <div className="mt-4">
              <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                {t("cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
