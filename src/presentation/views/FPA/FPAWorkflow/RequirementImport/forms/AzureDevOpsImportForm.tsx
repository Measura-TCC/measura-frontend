"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export const AzureDevOpsImportForm = () => {
  const { t } = useTranslation("fpa");
  const [organization, setOrganization] = useState("");
  const [project, setProject] = useState("");
  const [pat, setPat] = useState("");
  const [wiql, setWiql] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Azure DevOps Import</h3>
      <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
        🚧 Coming soon - Azure DevOps integration is under development
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.azureDevops.organization")}
        </label>
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder={t("importForms.azureDevops.organizationPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.azureDevops.project")}
        </label>
        <input
          type="text"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder={t("importForms.azureDevops.projectPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.azureDevops.pat")}
        </label>
        <input
          type="password"
          value={pat}
          onChange={(e) => setPat(e.target.value)}
          placeholder={t("importForms.azureDevops.patPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("importForms.azureDevops.wiql")}
        </label>
        <textarea
          value={wiql}
          onChange={(e) => setWiql(e.target.value)}
          placeholder={t("importForms.azureDevops.wiqlPlaceholder")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled
        />
      </div>
    </div>
  );
};
