"use client";

import { useState } from "react";
import { Button } from "@/presentation/components/primitives";
import { BellIcon } from "@/presentation/assets/icons";
import { useMyInvitations } from "@/core/hooks/organizations";
import { useAuthStore } from "@/core/hooks/auth/useAuth";
import { InvitationsModal } from "@/presentation/components/modals/InvitationsModal";

export const InvitationBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { invitations } = useMyInvitations(isAuthenticated);
  const pendingCount = invitations.length;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 p-0 relative"
        title="Invitations"
      >
        <BellIcon className="w-4 h-4" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <InvitationsModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
