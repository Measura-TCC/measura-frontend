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
import { CreateOrganizationForm } from "@/presentation/views/Organization/components/CreateOrganizationForm";
import { OrganizationWizard } from "@/presentation/views/Organization/components/OrganizationWizard";

export const OrganizationView: React.FC = () => {
  const { t } = useTranslation("organization");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const {
    userOrganization,
    isLoadingUserOrganization,
    mutateUserOrganization,
  } = useUserOrganization();
  const mission = userOrganization?.mission ?? t("mock.mission");
  const vision = userOrganization?.vision ?? t("mock.vision");
  const values = userOrganization?.values ?? t("mock.values");
  const objectives = userOrganization?.objectives || [];
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
        <div className="space-y-6">
          {!showWizard ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BuildingIcon className="w-5 h-5 text-primary" />
                  {t("organizationDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-md font-medium text-gray-700">
                      {t("name")}
                    </label>
                    <p className="text-secondary text-sm">{userOrganization.name}</p>
                  </div>

                  {userOrganization.industry && (
                    <div>
                      <label className="text-md font-medium text-gray-700">
                        {t("industry")}
                      </label>
                      <p className="text-secondary text-sm">
                        {userOrganization.industry}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-md font-medium text-gray-700">
                      {t("created")}
                    </label>
                    <p className="text-secondary text-sm">
                      {new Date(userOrganization.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {userOrganization.website && (
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="text-md font-medium text-gray-700">
                        {t("website")}
                      </label>
                      <a
                        href={userOrganization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block truncate text-sm"
                      >
                        {userOrganization.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Full-width text sections */}
                <div className="space-y-4">
                  {userOrganization.description && (
                    <div>
                      <label className="text-md font-medium text-gray-700">
                        {t("description")}
                      </label>
                      <p className="text-secondary text-sm">
                        {userOrganization.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-md font-medium text-gray-700">
                      {t("mission")}
                    </label>
                    <p className="text-secondary text-sm whitespace-pre-line">
                      {mission}
                    </p>
                  </div>

                  <div>
                    <label className="text-md font-medium text-gray-700">
                      {t("vision")}
                    </label>
                    <p className="text-secondary text-sm whitespace-pre-line">{vision}</p>
                  </div>

                  <div>
                    <label className="text-md font-medium text-gray-700">
                      {t("values")}
                    </label>
                    <p className="text-secondary text-sm whitespace-pre-line">{values}</p>
                  </div>

                  <div>
                    <label className="text-md font-medium text-gray-700">
                      {t("strategicObjectives")}
                    </label>
                    <div className="text-secondary text-sm">
                      {objectives.length > 0 ? (
                        <div className="space-y-2">
                          {objectives.map((objective, index) => (
                            <div key={objective._id || index} className="flex items-start gap-2">
                              <span className="text-primary font-semibold">{index + 1})</span>
                              <span>{objective.title}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="whitespace-pre-line">
                          <style jsx>{`
                            .strategic-objectives {
                              counter-reset: objective-counter;
                            }
                            .strategic-objectives p {
                              margin: 0;
                              padding: 0;
                            }
                            .strategic-objectives .objective-item {
                              counter-increment: objective-counter;
                              position: relative;
                              padding-left: 1.5rem;
                              margin-bottom: 0.5rem;
                              display: block;
                            }
                            .strategic-objectives .objective-item::before {
                              content: counter(objective-counter) ")";
                              position: absolute;
                              left: 0;
                              font-weight: 600;
                              color: #8b5cf6;
                            }
                          `}</style>
                          <div className="strategic-objectives">
                            {strategicObjectives.split("\n").map(
                              (objective, index) =>
                                objective.trim() && (
                                  <span key={index} className="objective-item">
                                    {objective.replace(/^\d+\)\s*/, "")}
                                  </span>
                                )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="primary" onClick={() => setShowWizard(true)}>
                    {t("manageOrganization")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("manageOrganization")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrganizationWizard
                  mode="edit"
                  initialData={{
                    id: userOrganization._id,
                    name: userOrganization.name,
                    description: userOrganization.description,
                    website: userOrganization.website,
                    industry: userOrganization.industry,
                    mission: userOrganization.mission,
                    vision: userOrganization.vision,
                    values: userOrganization.values,
                    strategicObjectives: userOrganization.strategicObjectives,
                  }}
                  onCancel={() => setShowWizard(false)}
                  onSuccess={handleWizardSuccess}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t("organizationStatistics")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("totalProjects")}
                </label>
                <p className="text-secondary text-sm">-</p>
              </div>
              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("activeEstimates")}
                </label>
                <p className="text-secondary text-sm">-</p>
              </div>
              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("teamMembers")}
                </label>
                <p className="text-secondary text-sm">-</p>
              </div>
              <div className="text-xs text-muted mt-4">
                {t("statisticsNote")}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        !showWizard &&
        !showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BuildingIcon className="w-5 h-5 text-primary" />
                {t("noOrganizationFound")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-secondary">{t("noOrganizationMessage")}</p>
              <Button
                onClick={() => {
                  setShowCreateForm(true);
                  setShowWizard(true);
                }}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                {t("createOrganization")}
              </Button>
            </CardContent>
          </Card>
        )
      )}

      {showCreateForm && !userOrganization && (
        <Card>
          <CardHeader>
            <CardTitle>
              {t("createNewOrganization")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateOrganizationForm onSuccess={handleOrganizationCreated} />
          </CardContent>
        </Card>
      )}

    </div>
  );
};
