"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export const JiraImportForm = () => {
  const { t } = useTranslation("fpa");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [jql, setJql] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Jira Cloud Import</h3>
      <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
        🚧 Coming soon - Jira integration is under development
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.jira.domain")}
        </label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder={t("importForms.jira.domainPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.jira.email")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("importForms.jira.emailPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.jira.apiToken")}
        </label>
        <input
          type="password"
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          placeholder={t("importForms.jira.apiTokenPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.jira.jql")}
        </label>
        <input
          type="text"
          value={jql}
          onChange={(e) => setJql(e.target.value)}
          placeholder={t("importForms.jira.jqlPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
        <p className="text-xs text-gray-500 mt-1">
          {t("importForms.jira.jqlHelp")}
        </p>
      </div>
    </div>
  );
};
