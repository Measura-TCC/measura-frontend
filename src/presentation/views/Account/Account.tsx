"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "@/core/hooks/account";
import { useDecodeRole } from "@/core/hooks/common/useDecodeRole";
import type {
  AccountTab,
  ProfileFormData,
  PasswordFormData,
} from "@/core/types/account";
import { UserRole } from "@/core/types";
import {
  AccountTabs,
  ProfileTab,
  SecurityTab,
  PreferencesTab,
} from "./components";

export const AccountView: React.FC = () => {
  const { t } = useTranslation("account");
  const {
    user,
    statistics,

    isLoadingUser,
    isUpdatingProfile,
    isUpdatingPassword,

    userError,

    canUpdateProfile,
    canChangePassword,
    hasOrganization,

    profileForm,
    passwordForm,
    profileErrors,
    passwordErrors,

    updateProfile,
    updatePassword,
    refreshData,

    formatDate,
    getAccountStatus,
  } = useAccount();

  const decodedRole = useDecodeRole((user?.role as UserRole) || UserRole.USER);
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");

  const handleTabChange = (tab: AccountTab) => {
    setActiveTab(tab);
  };

  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const handleUpdatePassword = async (data: PasswordFormData) => {
    try {
      await updatePassword(data);
    } catch (error) {
      console.error("Password update error:", error);
    }
  };

  const renderTabContent = () => {
    const tabComponents = {
      profile: (
        <ProfileTab
          user={user}
          statistics={statistics}
          decodedRole={decodedRole}
          canUpdateProfile={canUpdateProfile}
          isUpdatingProfile={isUpdatingProfile}
          profileForm={profileForm}
          profileErrors={profileErrors}
          onUpdateProfile={handleUpdateProfile}
          formatDate={formatDate}
          getAccountStatus={getAccountStatus}
        />
      ),
      security: (
        <SecurityTab
          canChangePassword={canChangePassword}
          isUpdatingPassword={isUpdatingPassword}
          passwordForm={passwordForm}
          passwordErrors={passwordErrors}
          onUpdatePassword={handleUpdatePassword}
        />
      ),
      preferences: <PreferencesTab hasOrganization={hasOrganization} />,
    } as const;

    return tabComponents[activeTab as keyof typeof tabComponents] || null;
  };

  if (userError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t("error.loadingTitle")}
          </h2>
          <p className="text-red-600 mb-4">{t("error.loadingMessage")}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {t("error.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingUser && !user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-background-secondary rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-background-secondary rounded w-1/2"></div>
          </div>
          <div className="animate-pulse bg-background-secondary h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-default mb-2">{t("title")}</h1>
        <p className="text-muted">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        <AccountTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          canChangePassword={canChangePassword}
        />

        {renderTabContent()}
      </div>
    </div>
  );
};
