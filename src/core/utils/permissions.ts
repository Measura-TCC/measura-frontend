import { UserRole } from "@/core/types";

export const canManageOrganization = (role?: string): boolean => {
  if (!role) return false;
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
};

export const canManageProjects = (role?: string): boolean => {
  if (!role) return false;
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
};

export const canChangeEstimateStatus = (role?: string): boolean => {
  if (!role) return false;
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
};

export const canChangePlanStatus = (role?: string): boolean => {
  if (!role) return false;
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
};

export const canInviteMembers = (role?: string): boolean => {
  if (!role) return false;
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
};

export const canRemoveMembers = (role?: string, isOwner?: boolean): boolean => {
  if (isOwner) return true;
  if (!role) return false;
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
};
