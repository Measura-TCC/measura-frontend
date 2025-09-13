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
  ];

  return (
    <div className="border-b border-border mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabConfig.map(({ id, label, disabled }) => (
          <Button
            key={id}
            onClick={() => !disabled && onTabChange(id)}
            disabled={disabled}
            variant="ghost"
            size="sm"
            className={`py-2 px-1 border-b-2 font-medium text-sm rounded-none ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-secondary hover:border-border"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {label}
          </Button>
        ))}
      </nav>
    </div>
  );
};
