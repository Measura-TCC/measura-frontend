"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import { createPortal } from "react-dom";

interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  memberName: string;
}

export const RemoveMemberModal = ({ isOpen, onClose, onConfirm, memberName }: RemoveMemberModalProps) => {
  const { t } = useTranslation("organization");
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleRemove = async () => {
    setIsRemoving(true);
    setError(null);

    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      let errorMessage = t("members.errors.failedToRemove");

      if (err.response?.data) {
        const { message, error } = err.response.data;
        const backendMessage = message || error;

        if (backendMessage) {
          const translationKey = `members.errors.${backendMessage}`;
          const translated = t(translationKey);
          errorMessage = translated !== translationKey ? translated : backendMessage;
        }
      }

      setError(errorMessage);
    } finally {
      setIsRemoving(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="border-b dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold dark:text-white">{t("members.removeMember")}</h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {t("members.removeConfirmation", { username: memberName })}
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded">
            {t("members.removeWarning")}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 px-6 py-4 flex gap-2">
          <Button
            variant="primary"
            onClick={handleRemove}
            disabled={isRemoving}
            className="bg-red-600 hover:bg-red-700"
          >
            {isRemoving ? t("members.removing") : t("members.yesRemove")}
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isRemoving}
          >
            {t("cancel")}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
