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
import { useOrganizations } from "@/core/hooks/organizations";
import { CreateOrganizationForm } from "@/presentation/views/Organization/components/CreateOrganizationForm";
import { InviteUserModal } from "@/presentation/views/Organization/components/InviteUserModal";
import { OrganizationInvitationsSection } from "@/presentation/views/Organization/components/OrganizationInvitationsSection";
import { OrganizationMembersSection } from "@/presentation/views/Organization/components/OrganizationMembersSection";
import { LeaveOrganizationModal } from "@/presentation/views/Organization/components/LeaveOrganizationModal";
import { OrganizationTabs } from "@/presentation/views/Organization/components/OrganizationTabs";
import { OverviewTab } from "@/presentation/views/Organization/components/OverviewTab";
import { SettingsTab } from "@/presentation/views/Organization/components/SettingsTab";
import { IntegrationsTab } from "@/presentation/views/Organization/components/IntegrationsTab";
import { useAuthStore } from "@/core/hooks/auth/useAuth";
import type { OrganizationTab } from "@/core/types/organization";

export const OrganizationView: React.FC = () => {
  const { t } = useTranslation("organization");
  const { user } = useAuthStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState<OrganizationTab>("overview");
  const {
    userOrganization,
    isLoadingUserOrganization,
    mutateUserOrganization,
  } = useOrganizations({ fetchUserOrganization: true });

  const handleOrganizationCreated = async () => {
    setShowCreateForm(false);
    await mutateUserOrganization();
  };
  const handleWizardSuccess = async () => {
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <OrganizationTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <Button variant="primary" onClick={() => setShowInviteModal(true)} size="sm">
              {t("invitations.inviteMember")}
            </Button>
          </div>

          {activeTab === "overview" && (
            <OverviewTab organization={userOrganization} />
          )}

          {activeTab === "members" && user && (
            <OrganizationMembersSection
              organizationId={userOrganization._id}
              userRole={user.role || "user"}
              isOwner={userOrganization.createdBy === user.id}
            />
          )}

          {activeTab === "invitations" && (
            <OrganizationInvitationsSection organizationId={userOrganization._id} />
          )}

          {activeTab === "integrations" && (
            <IntegrationsTab
              organization={userOrganization}
              onRefresh={mutateUserOrganization}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              organization={userOrganization}
              onWizardSuccess={handleWizardSuccess}
              onLeaveOrganization={() => setShowLeaveModal(true)}
            />
          )}
        </div>
      ) : (
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
              <Button onClick={() => setShowCreateForm(true)}>
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
            <CardTitle>{t("createNewOrganization")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateOrganizationForm onSuccess={handleOrganizationCreated} />
          </CardContent>
        </Card>
      )}

      {showInviteModal && (
        <InviteUserModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          organizationId={userOrganization?._id}
        />
      )}

      {showLeaveModal && (
        <LeaveOrganizationModal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
        />
      )}

    </div>
  );
};
