"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/utils";
import {
  Dropdown,
  DropdownItem,
} from "@/presentation/components/primitives/Dropdown/Dropdown";
import { languages } from "@/presentation/components/common/LanguageSwitcher/utils/languageData";
import { GlobeIcon } from "@/presentation/assets/icons";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>(i18n.language);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
  };

  const dropdownItems: DropdownItem[] = languages.map((lang) => ({
    id: lang.code,
    label: (
      <div className="flex items-center">
        <span className="mr-2">{lang.flag}</span>
        <span>{lang.name}</span>
      </div>
    ),
    onClick: () => handleLanguageChange(lang.code),
  }));

  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  return (
    <Dropdown
      trigger={
        <button
          className={cn(
            "inline-flex items-center justify-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium",
            "border border-border bg-background text-secondary hover:bg-background-secondary hover:text-default",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          )}
          aria-label="Select language"
        >
          <span>{currentLanguage?.flag}</span>
          <span>{currentLanguage?.code.toUpperCase()}</span>
          <GlobeIcon className="h-4 w-4 text-tertiary" />
        </button>
      }
      items={dropdownItems}
      align="right"
      dropdownClassName="w-40"
    />
  );
}
