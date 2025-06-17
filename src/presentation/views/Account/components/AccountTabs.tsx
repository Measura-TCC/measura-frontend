import { useTranslation } from "react-i18next";
import type { AccountTab } from "@/core/types/account";

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

  const tabConfig = [
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

  return (
    <div className="border-b border-gray-200 dark:border-dark-border mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabConfig.map(({ id, label, disabled }) => (
          <button
            key={id}
            onClick={() => !disabled && onTabChange(id)}
            disabled={disabled}
            className={` hover:cursor-pointer ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-secondary hover:border-border"
            } ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};
