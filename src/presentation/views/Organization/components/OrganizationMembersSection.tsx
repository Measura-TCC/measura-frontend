"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent, Button, Table, type Column } from "@/presentation/components/primitives";
import { useMembers } from "@/core/hooks/organizations";
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
  const { members, isLoading, removeMember } = useMembers(organizationId);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);

  const canRemoveMembers = isOwner || userRole === "project-manager" || userRole === "admin";

  const handleRemoveClick = (userId: string, username: string) => {
    setMemberToRemove({ id: userId, name: username });
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;

    await removeMember(memberToRemove.id);
    setMemberToRemove(null);
  };

  const columns: Column[] = [
    {
      key: "username",
      label: t("members.username"),
      render: (member) => (
        <>
          {member.username}
          {member.isOwner && (
            <span className="ml-2 px-2 py-1 rounded text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400">
              {t("members.owner")}
            </span>
          )}
        </>
      ),
    },
    {
      key: "email",
      label: t("members.email"),
      render: (member) => member.email,
      hideOnMobile: true,
    },
    {
      key: "role",
      label: t("members.role"),
      render: (member) => <MemberRoleDisplay role={member.role} />,
    },
    {
      key: "status",
      label: t("members.status"),
      render: (member) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            member.isActive
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          }`}
        >
          {member.isActive ? t("members.active") : t("members.inactive")}
        </span>
      ),
    },
  ];

  if (canRemoveMembers) {
    columns.push({
      key: "actions",
      label: t("members.actions"),
      render: (member) =>
        member._id !== user?.id ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleRemoveClick(member._id, member.username)}
          >
            {t("members.remove")}
          </Button>
        ) : null,
    });
  }

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
        ) : (
          <Table
            columns={columns}
            data={members}
            getRowKey={(member) => member._id}
            emptyMessage={t("members.noMembers")}
          />
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
