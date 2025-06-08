"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTranslation } from "react-i18next";
import { cn } from "@/core/utils";
import {
  getFilteredNavigation,
  isActiveNavigation,
} from "@/core/utils/navigation";
import { UserRole } from "@/core/types";
import { Button } from "@/presentation/components/primitives";
import { useAuth } from "@/core/hooks/auth/useAuth";

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation(["nav", "dashboard", "common"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const translateKey = (key: string): string => {
    switch (key) {
      case "nav.dashboard":
        return t("nav:dashboard");
      case "nav.fpa":
        return t("nav:fpa");
      case "nav.gqm":
        return t("nav:gqm");
      case "nav.plans":
        return t("nav:plans");
      case "nav.docs":
        return t("nav:docs");
      default:
        return key;
    }
  };

  const filteredNavigation = getFilteredNavigation(
    user?.role as UserRole,
    translateKey
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-3 left-4 z-50 lg:hidden bg-background border border-border"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </Button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-opacity-50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-background transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto custom-scrollbar">
          <nav className="flex-1 space-y-1 p-4">
            <div className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = isActiveNavigation(pathname, item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn("sidebar-nav-item", isActive && "active")}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted">
              <p>
                {t("dashboard:currentRole")}: {user?.role || "Guest"}
              </p>
              <p>
                {t("common:user")}: {user?.username || "Anonymous"}
              </p>
              <p>Version: 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
