import { useTranslation } from "react-i18next";
import type { AccountTab } from "@/core/types/account";
import { Tabs } from "@/presentation/components/primitives";

interface AccountTabsProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
  canChangePassword: boolean;
}

export const AccountTabs: React.FC<AccountTabsProps> = ({
  activeTab,
  onTabChange,
  canChangePassword,
}) => {
  const { t } = useTranslation("account");

  const tabs = [
    {
      id: "profile" as AccountTab,
      label: t("tabs.profile"),
      disabled: false,
    },
    {
      id: "security" as AccountTab,
      label: t("tabs.security"),
      disabled: !canChangePassword,
    },
    {
      id: "preferences" as AccountTab,
      label: t("tabs.preferences"),
      disabled: false,
    },
  ];

  return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />;
};
