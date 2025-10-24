"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import { integrationService } from "@/core/services/integrationService";
import type { GitHubIntegration } from "@/core/types/integrations";
import { createPortal } from "react-dom";

interface ConfigureGitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  existingConfig?: GitHubIntegration;
  onSuccess: () => void;
}

export const ConfigureGitHubModal = ({
  isOpen,
  onClose,
  organizationId,
  existingConfig,
  onSuccess,
}: ConfigureGitHubModalProps) => {
  const { t } = useTranslation("organization");
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    enabled: existingConfig?.enabled ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setError(null);
    setTestResult(null);

    try {
      await integrationService.configureGitHub(organizationId, formData);
      const result = await integrationService.testGitHubConnection(organizationId);
      setTestResult({
        success: result.success,
        message: result.success ? t("integrations.testSuccess") : t("integrations.testFailed")
      });
    } catch (err: any) {
      setError(err.response?.data?.message || t("integrations.testConnectionFailed"));
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (existingConfig) {
        await integrationService.updateGitHub(organizationId, formData);
      } else {
        await integrationService.configureGitHub(organizationId, formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t("integrations.saveConfigFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">
            {existingConfig ? t("integrations.editGitHub") : t("integrations.configureGitHub")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer"
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("integrations.github.token")} *
            </label>
            <input
              id="token"
              type="password"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              placeholder={existingConfig ? "••••••••" : t("integrations.github.tokenPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required={!existingConfig}
              disabled={isSubmitting}
            />
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block"
            >
              {t("integrations.howToGenerate")}
            </a>
          </div>

          <div className="flex items-center">
            <input
              id="enabled"
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              disabled={isSubmitting}
            />
            <label htmlFor="enabled" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("integrations.enableIntegration")}
            </label>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {testResult && (
            <div className={`${testResult.success ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'} border px-4 py-3 rounded`}>
              {testResult.message}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={handleTestConnection}
              variant="secondary"
              disabled={isTesting || isSubmitting || !formData.token}
            >
              {isTesting ? t("integrations.testing") : t("integrations.testConnection")}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t("integrations.saving") : t("integrations.save")}
            </Button>
            <Button type="button" onClick={onClose} variant="secondary">
              {t("integrations.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
