import { useTranslation } from "react-i18next";
import { PlanTab } from "@/core/types/plans";
import { Button } from "@/presentation/components/primitives/Button/Button";

interface PlansTabsProps {
  activeTab: PlanTab;
  onTabChange: (tab: PlanTab) => void;
  hasOrganization: boolean;
}

export const PlansTabs: React.FC<PlansTabsProps> = ({
  activeTab,
  onTabChange,
  hasOrganization,
}) => {
  const { t } = useTranslation("plans");

  const tabConfig = [
    {
      id: "overview" as PlanTab,
      label: t("tabs.overview"),
      disabled: false,
    },
    {
      id: "plans" as PlanTab,
      label: t("tabs.plans"),
      disabled: !hasOrganization,
    },
    {
      id: "templates" as PlanTab,
      label: t("tabs.templates"),
      disabled: false,
    },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-dark-border mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabConfig.map(({ id, label, disabled }) => (
          <Button
            key={id}
            onClick={() => !disabled && onTabChange(id)}
            disabled={disabled}
            variant="ghost"
            size="sm"
            className={`${
              activeTab === id
                ? "border-theme-dark text-theme-dark dark:border-theme-medium dark:text-theme-medium"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-dark-secondary dark:hover:text-dark-primary hover:border-gray-300 dark:hover:border-theme-medium"
            } ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            {label}
          </Button>
        ))}
      </nav>
    </div>
  );
};
