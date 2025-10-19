"use client";

import { useTranslation } from "react-i18next";
import { Tabs } from "@/presentation/components/primitives";

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

  const tabs = [
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

  return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />;
};
