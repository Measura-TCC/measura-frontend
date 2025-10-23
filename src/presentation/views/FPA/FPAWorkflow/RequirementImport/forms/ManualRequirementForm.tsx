"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import type { Requirement } from "@/core/types/fpa";
import { BulkRequirementModal } from "../BulkRequirementModal";

interface ManualRequirementFormProps {
  requirements: Requirement[];
  addRequirement: (requirement: { title: string; description?: string; source: 'manual' }) => void;
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'manual' }>) => void;
  removeRequirement?: (requirementId: string) => void;
}

export const ManualRequirementForm = ({ requirements, addRequirement, addRequirements, removeRequirement }: ManualRequirementFormProps) => {
  const { t } = useTranslation("fpa");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRequirement({
      title: title.trim(),
      description: description.trim() || undefined,
      source: "manual",
    });

    setTitle("");
    setDescription("");
  };

  const handleBulkSubmit = (bulkRequirements: Array<{ title: string; description?: string; source: 'manual' }>) => {
    addRequirements(bulkRequirements);
  };

  return (
    <>
      <BulkRequirementModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleBulkSubmit}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900 whitespace-normal">
              {t("importForms.manual.title")}
            </h3>
            <Button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              variant="secondary"
              className="text-sm shrink-0"
            >
              {t("importForms.manual.addMultiple", "Add Multiple")}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("importForms.manual.requirementTitle")} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("importForms.manual.titlePlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:invalid:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("importForms.manual.description")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("importForms.manual.descriptionPlaceholder")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

            <Button type="submit" variant="primary">
              {t("importForms.manual.addAnother")}
            </Button>
          </form>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-fit">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {t("importForms.manual.added", "Requisitos adicionados")} ({requirements.length})
          </h4>
          {requirements.length > 0 ? (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {requirements.slice().reverse().map((req) => (
                <li key={req._id} className="text-sm text-gray-600 flex items-start gap-2 group">
                  <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                  <span className="flex-1 min-w-0">
                    <span className="font-medium block break-words">{req.title}</span>
                    {req.description && (
                      <span className="text-gray-500 block text-xs mt-0.5 break-words">
                        {req.description.substring(0, 100)}
                        {req.description.length > 100 ? "..." : ""}
                      </span>
                    )}
                  </span>
                  {removeRequirement && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(req._id)}
                      className="text-red-600 hover:text-red-800 p-1 cursor-pointer transition-colors shrink-0"
                      title={t("actions.delete", "Delete")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">
                {t("importForms.manual.noRequirementsYet", "Nenhum requisito adicionado ainda")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t("importForms.manual.addRequirementsToSee", "Adicione requisitos para vê-los aqui")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
