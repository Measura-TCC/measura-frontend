"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/presentation/components/primitives";
import { useOrganizationMembers, useMemberActions } from "@/core/hooks/organizations";
import { useAuthStore } from "@/core/hooks/auth/useAuth";
import { useDecodeRole } from "@/core/hooks/common/useDecodeRole";
import { UserRole } from "@/core/types";
import { RemoveMemberModal } from "./RemoveMemberModal";

interface Props {
  organizationId: string;
  userRole: string;
  isOwner: boolean;
}

const MemberRoleDisplay = ({ role }: { role: string }) => {
  let userRole: UserRole;

  switch (role) {
    case "admin":
      userRole = UserRole.ADMIN;
      break;
    case "project-manager":
      userRole = UserRole.MANAGER;
      break;
    case "measurement-analyst":
      userRole = UserRole.ANALYST;
      break;
    default:
      userRole = UserRole.USER;
  }

  const translatedRole = useDecodeRole(userRole);
  return <>{translatedRole}</>;
};

export const OrganizationMembersSection = ({ organizationId, userRole, isOwner }: Props) => {
  const { t } = useTranslation("organization");
  const { user } = useAuthStore();
  const { members, isLoading } = useOrganizationMembers(organizationId);
  const { removeMember } = useMemberActions();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);

  const canRemoveMembers = isOwner || userRole === "project-manager" || userRole === "admin";

  const handleRemoveClick = (userId: string, username: string) => {
    setMemberToRemove({ id: userId, name: username });
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;

    await removeMember(organizationId, memberToRemove.id);
    setMemberToRemove(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("members.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>{t("members.noMembers")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("members.username")}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("members.email")}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("members.role")}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("members.status")}</th>
                  {canRemoveMembers && (
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t("members.actions")}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id} className="border-t dark:border-gray-700">
                    <td className="px-4 py-3 text-sm dark:text-gray-300">
                      {member.username}
                      {member.isOwner && (
                        <span className="ml-2 px-2 py-1 rounded text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400">
                          {t("members.owner")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm dark:text-gray-300">{member.email}</td>
                    <td className="px-4 py-3 text-sm dark:text-gray-300">
                      <MemberRoleDisplay role={member.role} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      }`}>
                        {member.isActive ? t("members.active") : t("members.inactive")}
                      </span>
                    </td>
                    {canRemoveMembers && (
                      <td className="px-4 py-3 text-sm">
                        {member._id !== user?.id && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRemoveClick(member._id, member.username)}
                          >
                            {t("members.remove")}
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {showRemoveModal && memberToRemove && (
        <RemoveMemberModal
          isOpen={showRemoveModal}
          onClose={() => {
            setShowRemoveModal(false);
            setMemberToRemove(null);
          }}
          onConfirm={handleConfirmRemove}
          memberName={memberToRemove.name}
        />
      )}
    </Card>
  );
};
