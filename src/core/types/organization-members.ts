export type UserRole = "user" | "admin" | "project-manager" | "measurement-analyst";

export interface OrganizationMember {
  _id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveOrganizationResponse {
  message: string;
}

export interface RemoveMemberResponse {
  message: string;
}
