import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { PlanTab } from "@/core/types/plans";
import { Tabs } from "@/presentation/components/primitives";

interface PlansTabsProps {
  activeTab: PlanTab;
  onTabChange: (tab: PlanTab) => void;
  hasOrganization: boolean;
  hasProjects: boolean;
}

export const PlansTabs: React.FC<PlansTabsProps> = ({
  activeTab,
  onTabChange,
  hasOrganization,
  hasProjects,
}) => {
  const { t } = useTranslation("plans");
  const router = useRouter();

  const handleTabChange = (tab: PlanTab) => {
    onTabChange(tab);
    router.push(`/plans?tab=${tab}`, { scroll: false });
  };

  const tabs = [
    {
      id: "newPlan" as PlanTab,
      label: t("tabs.newPlan"),
      disabled: !hasOrganization || !hasProjects,
    },
    {
      id: "createdPlans" as PlanTab,
      label: t("tabs.createdPlans"),
      disabled: !hasOrganization || !hasProjects,
    },
  ];

  return (
    <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
  );
};
