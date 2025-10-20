"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";

interface BulkRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requirements: Array<{ title: string; description?: string; source: 'manual' }>) => void;
}

interface TempRequirement {
  id: string;
  title: string;
  description?: string;
}

export const BulkRequirementModal = ({ isOpen, onClose, onSubmit }: BulkRequirementModalProps) => {
  const { t } = useTranslation("fpa");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addedRequirements, setAddedRequirements] = useState<TempRequirement[]>([]);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRequirement: TempRequirement = {
      id: `temp-bulk-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
    };

    setAddedRequirements([...addedRequirements, newRequirement]);
    setTitle("");
    setDescription("");
  };

  const handleRemove = (id: string) => {
    setAddedRequirements(addedRequirements.filter(req => req.id !== id));
  };

  const handleSubmitAll = () => {
    if (addedRequirements.length === 0) return;

    const requirements = addedRequirements.map(req => ({
      title: req.title,
      description: req.description,
      source: 'manual' as const,
    }));

    onSubmit(requirements);
    setAddedRequirements([]);
    setTitle("");
    setDescription("");
    onClose();
  };

  const handleCancel = () => {
    setAddedRequirements([]);
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50"
      onClick={handleCancel}
    >
      <div
        className="bg-background rounded-lg shadow-xl border border-border max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-default">
            {t("importForms.manual.bulkAdd", "Adicionar Múltiplos Requisitos")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t("importForms.manual.bulkAddDescription", "Adicione os requisitos um por vez e depois confirme todos de uma vez.")}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleAdd} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("importForms.manual.requirementTitle", "Título do Requisito")} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("importForms.manual.titlePlaceholder", "Ex: Sistema de login")}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-default"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-default mb-1">
                {t("importForms.manual.description", "Descrição")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("importForms.manual.descriptionPlaceholder", "Ex: Os usuários devem poder fazer login com email e senha")}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-default"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              disabled={!title.trim()}
              className="w-full"
            >
              {t("importForms.manual.addToList", "Adicionar à Lista")}
            </Button>
          </form>

          {addedRequirements.length > 0 && (
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-default mb-3">
                {t("importForms.manual.addedToList", "Adicionados à lista")} ({addedRequirements.length})
              </h3>
              <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {addedRequirements.map((req) => (
                  <li key={req.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-md group">
                    <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                    <span className="flex-1 min-w-0">
                      <span className="font-medium text-default block break-words">{req.title}</span>
                      {req.description && (
                        <span className="text-gray-500 text-xs mt-0.5 block break-words">
                          {req.description}
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(req.id)}
                      className="text-red-600 hover:text-red-800 p-1 cursor-pointer transition-colors shrink-0"
                      title={t("actions.delete", "Deletar")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
          >
            {t("actions.cancel", "Cancelar")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmitAll}
            variant="primary"
            disabled={addedRequirements.length === 0}
          >
            {t("importForms.manual.addAll", "Adicionar Todos")} ({addedRequirements.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
