"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/presentation/components/primitives";
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
    cancelInvitation
  } = useInvitations({ fetchOrganization: organizationId });
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = filter === "ALL" ? invitations : invitations.filter(inv => inv.status === filter);

  const handleCancel = async (id: string) => {
    setProcessing(id);
    try {
      await cancelInvitation(id, organizationId);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("invitations.organizationInvitations")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>{t("invitations.noInvitations")}</p>
            <p className="text-sm mt-2">{t("invitations.inviteFirstMember")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("invitations.user")}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("invitations.status")}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("invitations.invitedBy")}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("invitations.date")}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("invitations.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((invitation) => (
                  <tr key={invitation._id} className="border-t dark:border-gray-700">
                    <td className="px-4 py-3 text-sm dark:text-gray-300">{invitation.userIdentifier}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        invitation.status === "PENDING" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400" :
                        invitation.status === "ACCEPTED" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" :
                        "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      }`}>
                        {t(`invitations.statusLabels.${invitation.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm dark:text-gray-300">{invitation.invitedBy.username}</td>
                    <td className="px-4 py-3 text-sm dark:text-gray-300">{new Date(invitation.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      {invitation.status === "PENDING" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCancel(invitation._id)}
                          disabled={processing === invitation._id}
                        >
                          {t("invitations.cancel")}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
