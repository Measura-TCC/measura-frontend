"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInvitationActions } from "@/core/hooks/organizations";
import { Button } from "@/presentation/components/primitives";
import { createPortal } from "react-dom";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId?: string;
}

export const InviteUserModal = ({ isOpen, onClose, organizationId }: InviteUserModalProps) => {
  const { t } = useTranslation("organization");
  const [userIdentifier, setUserIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { inviteUser } = useInvitationActions();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdentifier.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await inviteUser(userIdentifier.trim(), organizationId);
      setSuccess(true);
      setUserIdentifier("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      let errorMessage = t("invitations.errors.failedToInvite");

      if (err.response?.data) {
        const { message, error } = err.response.data;
        const backendMessage = message || error;

        if (backendMessage) {
          const translationKey = `invitations.errors.${backendMessage}`;
          const translated = t(translationKey);
          errorMessage = translated !== translationKey ? translated : backendMessage;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="border-b dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold dark:text-white">{t("invitations.inviteUser")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="userIdentifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("invitations.emailOrUsername")}
            </label>
            <input
              id="userIdentifier"
              type="text"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              placeholder={t("invitations.emailOrUsernamePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded">
              {t("invitations.invitationSent")}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t("invitations.sending") : t("invitations.send")}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
