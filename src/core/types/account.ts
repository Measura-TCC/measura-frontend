export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId?: string;
  hasCompletedOnboarding?: boolean;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  username: string;
  email: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountStatistics {
  memberSince: string;
  currentRole: string;
  accountStatus: "active" | "inactive" | "pending";
  lastLogin?: string;
  organizationName?: string;
}

export type AccountTab = "profile" | "security" | "preferences";

export const ACCOUNT_PERMISSIONS = {
  UPDATE_PROFILE: "update_profile",
  CHANGE_PASSWORD: "change_password",
  VIEW_ACCOUNT: "view_account",
} as const;
