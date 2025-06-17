"use client";

import { useTranslation } from "react-i18next";

export type FPATab = "overview" | "estimates" | "reference";

interface FPATabsProps {
  activeTab: FPATab;
  onTabChange: (tab: FPATab) => void;
  hasOrganization: boolean;
}

export const FPATabs: React.FC<FPATabsProps> = ({
  activeTab,
  onTabChange,
  hasOrganization,
}) => {
  const { t } = useTranslation("fpa");

  const tabConfig = [
    {
      id: "overview" as FPATab,
      label: t("tabs.overview"),
      disabled: false,
    },
    {
      id: "estimates" as FPATab,
      label: t("tabs.estimates"),
      disabled: !hasOrganization,
    },
    {
      id: "reference" as FPATab,
      label: t("tabs.reference"),
      disabled: false,
    },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-dark-border mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabConfig.map(({ id, label, disabled }) => (
          <button
            key={id}
            onClick={() => !disabled && onTabChange(id)}
            disabled={disabled}
            className={`${
              activeTab === id
                ? "border-theme-dark text-theme-dark dark:border-theme-medium dark:text-theme-medium"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-dark-secondary dark:hover:text-dark-primary hover:border-gray-300 dark:hover:border-theme-medium"
            } ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};
