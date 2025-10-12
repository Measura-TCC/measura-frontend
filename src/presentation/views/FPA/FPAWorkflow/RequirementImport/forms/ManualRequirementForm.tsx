"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRequirements } from "@/core/hooks/fpa";
import { Button } from "@/presentation/components/primitives";

export const ManualRequirementForm = () => {
  const { t } = useTranslation("fpa");
  const { addRequirement, requirements } = useRequirements();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRequirement({
      title: title.trim(),
      description: description.trim(),
      source: "manual",
    });

    setTitle("");
    setDescription("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("importForms.manual.title")}
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("importForms.manual.requirementTitle")} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("importForms.manual.titlePlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
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

      {requirements.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-fit">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Requisitos adicionados ({requirements.length})
          </h4>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {requirements.slice().reverse().map((req) => (
              <li key={req.id} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="flex-1">
                  <span className="font-medium">{req.title}</span>
                  {req.description && (
                    <span className="text-gray-500 block text-xs mt-0.5">
                      {req.description.substring(0, 100)}
                      {req.description.length > 100 ? "..." : ""}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
