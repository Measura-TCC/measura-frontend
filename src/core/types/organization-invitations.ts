export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export interface OrganizationInvitation {
  _id: string;
  userIdentifier: string;
  organizationId: {
    _id: string;
    name: string;
    description?: string;
  };
  invitedBy: {
    _id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  status: InvitationStatus;
  createdAt: string;
  respondedAt?: string;
}
