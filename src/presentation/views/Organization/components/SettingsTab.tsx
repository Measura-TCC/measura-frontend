"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/presentation/components/primitives";
import { OrganizationWizard } from "./OrganizationWizard";
import { canManageOrganization } from "@/core/utils/permissions";

interface OrganizationObjective {
  _id?: string;
  title: string;
}

interface Organization {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  mission?: string;
  vision?: string;
  values?: string;
  objectives?: OrganizationObjective[];
  strategicObjectives?: string;
}

interface SettingsTabProps {
  organization: Organization;
  onWizardSuccess: () => void;
  onLeaveOrganization: () => void;
  userRole?: string;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  organization,
  onWizardSuccess,
  onLeaveOrganization,
  userRole,
}) => {
  const { t } = useTranslation("organization");
  const [showWizard, setShowWizard] = useState(false);
  const canManage = canManageOrganization(userRole);

  const handleWizardSuccess = async () => {
    setShowWizard(false);
    await onWizardSuccess();
  };

  return (
    <div className="space-y-6">
      {canManage && (
        !showWizard ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("manageOrganization")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {t("subtitle")}
              </p>
              <Button variant="primary" onClick={() => setShowWizard(true)}>
                {t("manageOrganization")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("manageOrganization")}</CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationWizard
                mode="edit"
                initialData={{
                  id: organization._id,
                  name: organization.name,
                  description: organization.description,
                  website: organization.website,
                  industry: organization.industry,
                  mission: organization.mission,
                  vision: organization.vision,
                  values: organization.values,
                  strategicObjectives: organization.objectives
                    ? organization.objectives.map(obj => obj.title).join("\n")
                    : organization.strategicObjectives || "",
                }}
                onCancel={() => setShowWizard(false)}
                onSuccess={handleWizardSuccess}
              />
            </CardContent>
          </Card>
        )
      )}

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            {t("members.dangerZone")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t("members.dangerZoneDescription")}
            </p>
            <Button
              variant="secondary"
              onClick={onLeaveOrganization}
              className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800"
            >
              {t("members.leaveOrganization")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
