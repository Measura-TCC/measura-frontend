"use client";

import { useTranslation } from "react-i18next";

type TabKey = "overview" | "plans" | "templates" | "gqm";

export const PlansTabs = ({
  activeTab,
  onTabChange,
  hasOrganization,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  hasOrganization?: boolean;
}) => {
  const { t } = useTranslation("plans");
  const tabs: { key: TabKey; label: string; disabled?: boolean }[] = [
    { key: "overview", label: t("tabs.overview") },
    { key: "plans", label: t("tabs.plans") },
    { key: "templates", label: t("tabs.templates") },
    { key: "gqm", label: t("tabs.gqm"), disabled: !hasOrganization },
  ];

  return (
    <div className="flex gap-2 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => !tab.disabled && onTabChange(tab.key)}
          className={[
            "px-3 py-2 text-sm -mb-px border-b-2",
            activeTab === tab.key
              ? "border-primary text-primary"
              : "border-transparent text-secondary hover:text-default",
            tab.disabled ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

