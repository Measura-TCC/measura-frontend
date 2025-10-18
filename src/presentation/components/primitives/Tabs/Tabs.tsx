import React from "react";

export interface Tab<T extends string = string> {
  id: T;
  label: string;
  disabled?: boolean;
}

export type TabVariant = "default" | "modal";

export interface TabsProps<T extends string = string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  variant?: TabVariant;
  className?: string;
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  className = "",
}: TabsProps<T>) {
  const isModal = variant === "modal";

  const getTabClassName = (tab: Tab<T>) => {
    const isActive = activeTab === tab.id;
    const isDisabled = tab.disabled;

    if (isModal) {
      return `px-4 py-2 ${
        isActive
          ? "border-b-2 border-primary text-primary"
          : "text-gray-600"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`;
    }

    return `whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors hover:cursor-pointer ${
      isActive
        ? "border-primary text-primary"
        : "border-transparent text-muted hover:text-secondary hover:border-border"
    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`;
  };

  const handleTabClick = (tab: Tab<T>) => {
    if (!tab.disabled) {
      onTabChange(tab.id);
    }
  };

  const containerClassName = isModal
    ? `flex border-b ${className}`
    : `border-b border-gray-200 dark:border-dark-border mb-6 ${className}`;

  const navClassName = isModal ? "" : "-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto";

  return (
    <div className={containerClassName}>
      <nav className={navClassName}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab)}
            disabled={tab.disabled}
            className={getTabClassName(tab)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
