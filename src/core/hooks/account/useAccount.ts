import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/core/hooks/auth";
import { useOrganizations } from "@/core/hooks/organizations";
import { userService } from "@/core/services";
import { createPasswordSchema } from "@/core/schemas/auth";
import type { User } from "@/core/types";
import type {
  ProfileFormData,
  PasswordFormData,
  UpdateProfileRequest,
  AccountStatistics,
} from "@/core/types/account";

const createUpdateProfileSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(3, t("validation.usernameMinLength")),
    email: z.string().email(t("validation.emailInvalid")),
  });

const createUpdatePasswordSchema = (
  tAccount: (key: string) => string,
  tValidation: (key: string) => string
) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, tAccount("validation.currentPasswordRequired")),
      newPassword: createPasswordSchema(tValidation),
      confirmPassword: z
        .string()
        .min(1, tAccount("validation.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: tAccount("validation.passwordsDontMatch"),
      path: ["confirmPassword"],
    });

export type UseAccountReturn = {
  user: User | null;
  statistics: AccountStatistics;
  isLoadingUser: boolean;
  isUpdatingProfile: boolean;
  isUpdatingPassword: boolean;
  userError: Error | null;
  canUpdateProfile: boolean;
  canChangePassword: boolean;
  hasOrganization: boolean;
  profileForm: ReturnType<typeof useForm<ProfileFormData>>;
  passwordForm: ReturnType<typeof useForm<PasswordFormData>>;
  profileErrors: Record<string, { message?: string }>;
  passwordErrors: Record<string, { message?: string }>;
  updateProfile: (data: ProfileFormData) => Promise<void>;
  updatePassword: (data: PasswordFormData) => Promise<void>;
  refreshData: () => Promise<void>;
  formatDate: (date: Date | string) => string;
  getAccountStatus: () => "active" | "inactive" | "pending";
};

export const useAccount = (): UseAccountReturn => {
  const { t, i18n } = useTranslation("account");
  const { t: tValidation } = useTranslation("validation");
  const { user: authUser, updateUser, logout } = useAuth();
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(createUpdateProfileSchema(t)),
    defaultValues: {
      username: authUser?.username || "",
      email: authUser?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(createUpdatePasswordSchema(t, tValidation)),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { errors: profileErrors },
    reset: resetProfileForm,
  } = profileForm;

  const {
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = passwordForm;

  useEffect(() => {
    if (authUser) {
      resetProfileForm({
        username: authUser.username,
        email: authUser.email,
      });
    }
  }, [authUser, resetProfileForm]);

  const statistics: AccountStatistics = {
    memberSince: authUser?.createdAt?.toString() || "",
    currentRole: authUser?.role || "",
    accountStatus: "active",
    organizationName: userOrganization?.name,
  };

  // Permissions
  const canUpdateProfile = Boolean(authUser);
  const canChangePassword = Boolean(authUser);
  const hasOrganization = Boolean(userOrganization);

  // Actions
  const updateProfile = async (data: ProfileFormData): Promise<void> => {
    if (!authUser) return;

    setIsUpdatingProfile(true);
    try {
      const updateData: UpdateProfileRequest = {
        username:
          data.username !== authUser.username ? data.username : undefined,
        email: data.email !== authUser.email ? data.email : undefined,
      };

      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined)
      ) as UpdateProfileRequest;

      if (Object.keys(cleanUpdateData).length === 0) {
        return;
      }

      const updatedUser = await userService.updateMyProfile(cleanUpdateData);
      updateUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const updatePassword = async (data: PasswordFormData): Promise<void> => {
    if (!authUser) return;

    setIsUpdatingPassword(true);
    try {
      console.log("[useAccount] About to call changePassword API");
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      console.log("[useAccount] Password change API succeeded");
      // Only reset form and logout if API call succeeds
      resetPasswordForm();
      console.log("[useAccount] About to logout in 1500ms");
      setTimeout(() => {
        console.log("[useAccount] Logging out now");
        logout();
      }, 1500);
    } catch (error) {
      console.error("[useAccount] Error updating password:", error);
      console.log("[useAccount] NOT calling logout due to error");
      throw error;
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const refreshData = async (): Promise<void> => {};

  const formatDate = (date: Date | string): string => {
    const locale = i18n.language === "pt" ? "pt-BR" : "en-US";
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAccountStatus = (): "active" | "inactive" | "pending" => {
    return "active";
  };

  return {
    // Data
    user: authUser as unknown as User,
    statistics,

    // Loading states
    isLoadingUser: false,
    isUpdatingProfile,
    isUpdatingPassword,

    // Error states
    userError: null,

    // Permissions
    canUpdateProfile,
    canChangePassword,
    hasOrganization,

    // Forms
    profileForm,
    passwordForm,
    profileErrors,
    passwordErrors,

    // Actions
    updateProfile,
    updatePassword,
    refreshData,

    // Utils
    formatDate,
    getAccountStatus,
  };
};
