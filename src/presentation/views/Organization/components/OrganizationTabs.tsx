import { useTranslation } from "react-i18next";
import type { OrganizationTab } from "@/core/types/organization";
import { Tabs } from "@/presentation/components/primitives";

interface OrganizationTabsProps {
  activeTab: OrganizationTab;
  onTabChange: (tab: OrganizationTab) => void;
}

export const OrganizationTabs: React.FC<OrganizationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation("organization");

  const tabs = [
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

  return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />;
};
