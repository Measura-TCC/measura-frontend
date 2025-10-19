"use client";

import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { BuildingIcon } from "@/presentation/assets/icons";

interface Organization {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  createdAt: string;
  mission?: string;
  vision?: string;
  values?: string;
  strategicObjectives?: string;
  objectives?: Array<{ _id?: string; title: string }>;
}

interface OverviewTabProps {
  organization: Organization;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ organization }) => {
  const { t } = useTranslation("organization");

  const mission = organization.mission ?? t("mock.mission");
  const vision = organization.vision ?? t("mock.vision");
  const values = organization.values ?? t("mock.values");
  const objectives = organization.objectives || [];
  const strategicObjectives =
    organization.strategicObjectives ?? t("mock.strategicObjectives");

  return (
    <div className="space-y-6">
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
              <p className="text-secondary text-sm">{organization.name}</p>
            </div>

            {organization.industry && (
              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("industry")}
                </label>
                <p className="text-secondary text-sm">
                  {organization.industry}
                </p>
              </div>
            )}

            <div>
              <label className="text-md font-medium text-gray-700">
                {t("created")}
              </label>
              <p className="text-secondary text-sm">
                {new Date(organization.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {organization.website && (
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-md font-medium text-gray-700">
                  {t("website")}
                </label>
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block truncate text-sm"
                >
                  {organization.website}
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {organization.description && (
              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("description")}
                </label>
                <p className="text-secondary text-sm">
                  {organization.description}
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
              <p className="text-secondary text-sm whitespace-pre-line">
                {vision}
              </p>
            </div>

            <div>
              <label className="text-md font-medium text-gray-700">
                {t("values")}
              </label>
              <p className="text-secondary text-sm whitespace-pre-line">
                {values}
              </p>
            </div>

            <div>
              <label className="text-md font-medium text-gray-700">
                {t("strategicObjectives")}
              </label>
              <div className="text-secondary text-sm  mt-2">
                {objectives.length > 0 ? (
                  <div className="space-y-2">
                    {objectives.map((objective, index) => (
                      <div
                        key={objective._id || index}
                        className="flex items-start gap-2"
                      >
                        <span className="text-primary font-semibold">
                          {index + 1})
                        </span>
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
        </CardContent>
      </Card>

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
          <div className="text-xs text-muted mt-4">{t("statisticsNote")}</div>
        </CardContent>
      </Card>
    </div>
  );
};
