"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export const GitHubImportForm = () => {
  const { t } = useTranslation("fpa");
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [projectNumber, setProjectNumber] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        GitHub Projects Import
      </h3>
      <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
        🚧 Coming soon - GitHub integration is under development
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.github.token")}
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t("importForms.github.tokenPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.github.owner")}
        </label>
        <input
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder={t("importForms.github.ownerPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.github.repo")}
        </label>
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder={t("importForms.github.repoPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.github.projectNumber")}
        </label>
        <input
          type="text"
          value={projectNumber}
          onChange={(e) => setProjectNumber(e.target.value)}
          placeholder={t("importForms.github.projectNumberPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>
    </div>
  );
};
