"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent, Button, Table, type Column } from "@/presentation/components/primitives";
import { useInvitations } from "@/core/hooks/organizations";
import { InvitationStatus } from "@/core/types/organization-invitations";

interface Props {
  organizationId: string;
}

export const OrganizationInvitationsSection = ({ organizationId }: Props) => {
  const { t } = useTranslation("organization");
  const [filter, setFilter] = useState<InvitationStatus | "ALL">("ALL");
  const {
    orgInvitations: invitations,
    isLoadingOrgInvitations: isLoading,
  } = useInvitations({ fetchOrganization: organizationId });

  const filtered = filter === "ALL" ? invitations : invitations.filter(inv => inv.status === filter);

  const columns: Column[] = [
    {
      key: "user",
      label: t("invitations.user"),
      render: (invitation) => invitation.userIdentifier,
    },
    {
      key: "status",
      label: t("invitations.status"),
      render: (invitation) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            invitation.status === "PENDING"
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
              : invitation.status === "ACCEPTED"
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          }`}
        >
          {t(`invitations.statusLabels.${invitation.status}`)}
        </span>
      ),
    },
    {
      key: "invitedBy",
      label: t("invitations.invitedBy"),
      render: (invitation) => invitation.invitedBy.username,
      hideOnMobile: true,
    },
    {
      key: "date",
      label: t("invitations.date"),
      render: (invitation) => new Date(invitation.createdAt).toLocaleDateString(),
      hideOnMobile: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("invitations.organizationInvitations")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={` hover:cursor-pointer ${
                  filter === status
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-secondary hover:border-border"
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {t(`invitations.${status.toLowerCase()}Invitations`)}
              </button>
            ))}
          </nav>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded" />
            ))}
          </div>
        ) : (
          <Table
            columns={columns}
            data={filtered}
            getRowKey={(invitation) => invitation._id}
            emptyMessage={
              <div>
                <p>{t("invitations.noInvitations")}</p>
                <p className="text-sm mt-2">{t("invitations.inviteFirstMember")}</p>
              </div>
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
