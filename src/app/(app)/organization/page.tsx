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
import { CreateOrganizationForm } from "@/presentation/views/Organizations/components/CreateOrganizationForm";
import { OrganizationWizard } from "@/presentation/views/Organizations/components/OrganizationWizard";

export default function OrganizationPage() {
  const { t } = useTranslation("organization");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardControls, setWizardControls] = useState<{
    next: () => void;
    prev: () => void;
    submit: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    currentStep: number;
    totalSteps: number;
    isSubmitting: boolean;
    canGoNext: boolean;
    canSubmit: boolean;
  } | null>(null);
  const {
    userOrganization,
    isLoadingUserOrganization,
    mutateUserOrganization,
  } = useUserOrganization();
  const mission = userOrganization?.mission ?? t("mock.mission");
  const vision = userOrganization?.vision ?? t("mock.vision");
  const values = userOrganization?.values ?? t("mock.values");
  const strategicObjectives =
    userOrganization?.strategicObjectives ?? t("mock.strategicObjectives");

  const handleOrganizationCreated = async () => {
    setShowCreateForm(false);
    await mutateUserOrganization();
  };
  const handleWizardSuccess = async () => {
    setShowWizard(false);
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

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("mission")}
                </label>
                <p className="text-secondary whitespace-pre-line">{mission}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("vision")}
                </label>
                <p className="text-secondary whitespace-pre-line">{vision}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("values")}
                </label>
                <p className="text-secondary whitespace-pre-line">{values}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("strategicObjectives")}
                </label>
                <p className="text-secondary whitespace-pre-line">
                  {strategicObjectives}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="primary" onClick={() => setShowWizard(true)}>
                  {t("manageOrganization")}
                </Button>
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
        !showWizard && !showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BuildingIcon className="w-5 h-5 text-primary" />
                {t("noOrganizationFound")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-secondary">{t("noOrganizationMessage")}</p>
              <Button onClick={() => { setShowCreateForm(true); setShowWizard(true); }}>
                <PlusIcon className="w-4 h-4 mr-2" />
                {t("createOrganization")}
              </Button>
            </CardContent>
          </Card>
        )
      )}

      {(showCreateForm || showWizard) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {showWizard ? t("manageOrganization") : t("createNewOrganization")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showWizard ? (
              <OrganizationWizard
                mode={userOrganization ? "edit" : "create"}
                initialData={
                  userOrganization
                    ? {
                        id: userOrganization._id,
                        name: userOrganization.name,
                        description: userOrganization.description,
                        website: userOrganization.website,
                        industry: userOrganization.industry,
                        mission: userOrganization.mission,
                        vision: userOrganization.vision,
                        values: userOrganization.values,
                        strategicObjectives: userOrganization.strategicObjectives,
                      }
                    : undefined
                }
                onCancel={() => {
                  setShowWizard(false);
                  setShowCreateForm(false);
                }}
                onSuccess={handleWizardSuccess}
                hideFooter
                onControls={(c) => setWizardControls(c)}
              />
            ) : (
              <CreateOrganizationForm onSuccess={handleOrganizationCreated} />
            )}
          </CardContent>
        </Card>
      )}

      {showWizard && wizardControls && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setShowWizard(false); setShowCreateForm(false); }}>
              {t("cancel")}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={wizardControls.prev} disabled={wizardControls.isFirstStep}>
              {t("previous")}
            </Button>
            <Button
              variant="primary"
              onClick={() => wizardControls.isLastStep ? wizardControls.submit() : wizardControls.next()}
              isLoading={wizardControls.isSubmitting}
              disabled={wizardControls.isLastStep ? !wizardControls.canSubmit : !wizardControls.canGoNext}
            >
              {wizardControls.isLastStep ? (userOrganization ? t("save") : t("createOrganization")) : t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
