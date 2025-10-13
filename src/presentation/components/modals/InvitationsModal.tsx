"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useMyInvitations, useInvitationActions } from "@/core/hooks/organizations";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { Button } from "@/presentation/components/primitives";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface InvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvitationsModal = ({ isOpen, onClose }: InvitationsModalProps) => {
  const { t } = useTranslation("organization");
  const router = useRouter();
  const { invitations, isLoading } = useMyInvitations();
  const { acceptInvitation, rejectInvitation } = useInvitationActions();
  const { mutateUserOrganization } = useUserOrganization();
  const [processing, setProcessing] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleAccept = async (id: string) => {
    setProcessing(id);
    try {
      await acceptInvitation(id);
      await mutateUserOrganization();
      onClose();
      router.push("/organization");
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      await rejectInvitation(id);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="border-b dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold dark:text-white">{t("invitations.myInvitations")}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 rounded-lg" />
              ))}
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>{t("invitations.noPending")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation._id} className="border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-lg dark:text-white">{invitation.organizationId.name}</h3>
                  {invitation.organizationId.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{invitation.organizationId.description}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t("invitations.invitedBy")}: {invitation.invitedBy.firstName} {invitation.invitedBy.lastName} (@{invitation.invitedBy.username})
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {t("invitations.sentOn")}: {new Date(invitation.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAccept(invitation._id)}
                      disabled={processing === invitation._id}
                    >
                      {t("invitations.accept")}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReject(invitation._id)}
                      disabled={processing === invitation._id}
                    >
                      {t("invitations.reject")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            {t("invitations.close")}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
