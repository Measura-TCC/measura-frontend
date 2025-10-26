import { useTranslation } from "react-i18next";
import type { OrganizationTab } from "@/core/types/organization";
import { Tabs } from "@/presentation/components/primitives";
import { canManageOrganization } from "@/core/utils/permissions";

interface OrganizationTabsProps {
  activeTab: OrganizationTab;
  onTabChange: (tab: OrganizationTab) => void;
  userRole?: string;
}

export const OrganizationTabs: React.FC<OrganizationTabsProps> = ({
  activeTab,
  onTabChange,
  userRole,
}) => {
  const { t } = useTranslation("organization");

  const allTabs = [
    {
      id: "overview" as OrganizationTab,
      label: t("tabs.overview"),
    },
    {
      id: "members" as OrganizationTab,
      label: t("tabs.members"),
    },
    {
      id: "invitations" as OrganizationTab,
      label: t("tabs.invitations"),
    },
    {
      id: "integrations" as OrganizationTab,
      label: t("tabs.integrations"),
    },
    {
      id: "settings" as OrganizationTab,
      label: t("tabs.settings"),
    },
  ];

  const tabs = canManageOrganization(userRole)
    ? allTabs
    : allTabs.filter((tab) => tab.id === "overview" || tab.id === "settings");

  return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />;
};
