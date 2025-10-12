"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ClickUpImportForm = () => {
  const { t } = useTranslation("fpa");
  const [token, setToken] = useState("");
  const [listId, setListId] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">ClickUp Import</h3>
      <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
        🚧 Coming soon - ClickUp integration is under development
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.clickup.token")}
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t("importForms.clickup.tokenPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.clickup.listId")}
        </label>
        <input
          type="text"
          value={listId}
          onChange={(e) => setListId(e.target.value)}
          placeholder={t("importForms.clickup.listIdPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>
    </div>
  );
};
