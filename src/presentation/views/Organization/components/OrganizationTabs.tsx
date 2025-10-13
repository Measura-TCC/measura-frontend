import { useTranslation } from "react-i18next";
import type { OrganizationTab } from "@/core/types/organization";

interface OrganizationTabsProps {
  activeTab: OrganizationTab;
  onTabChange: (tab: OrganizationTab) => void;
}

export const OrganizationTabs: React.FC<OrganizationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation("organization");

  const tabConfig = [
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
      id: "settings" as OrganizationTab,
      label: t("tabs.settings"),
    },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-dark-border mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabConfig.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={` hover:cursor-pointer ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-secondary hover:border-border"
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};
