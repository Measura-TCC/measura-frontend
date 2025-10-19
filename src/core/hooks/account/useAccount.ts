import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/core/hooks/auth";
import { useOrganizations } from "@/core/hooks/organizations";
import { userService } from "@/core/services";
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

const createUpdatePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, t("validation.currentPasswordRequired")),
      newPassword: z.string().min(6, t("validation.newPasswordMinLength")),
      confirmPassword: z
        .string()
        .min(1, t("validation.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordsDontMatch"),
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
  const { user: authUser, updateUser } = useAuth(); // eslint-disable-line @typescript-eslint/no-unused-vars
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
    resolver: zodResolver(createUpdatePasswordSchema(t)),
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

      await userService.updateUser({
        id: authUser.id,
        data: cleanUpdateData,
      });
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
      resetPasswordForm();
    } catch (error) {
      console.error("Error updating password:", error);
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
