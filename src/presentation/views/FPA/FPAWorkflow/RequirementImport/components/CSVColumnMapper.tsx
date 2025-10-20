"use client";

import { useTranslation } from "react-i18next";

interface CSVColumnMapperProps {
  headers: string[];
  onMappingChange: (mapping: { title: string | null; description: string | null }) => void;
  mapping: { title: string | null; description: string | null };
}

export const CSVColumnMapper = ({ headers, onMappingChange, mapping }: CSVColumnMapperProps) => {
  const { t } = useTranslation("fpa");

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMappingChange({
      ...mapping,
      title: e.target.value || null,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMappingChange({
      ...mapping,
      description: e.target.value || null,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-default mb-4">
          {t("importForms.csv.mapColumns", "Map Your CSV Columns")}
        </h3>
        <p className="text-sm text-secondary mb-4">
          {t("importForms.csv.mapColumnsDescription", "Select which columns from your CSV correspond to the requirement fields.")}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-default mb-2">
            {t("importForms.csv.nameColumn", "Name Column")} *
          </label>
          <select
            value={mapping.title || ""}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-default"
          >
            <option value="">{t("importForms.csv.selectColumn", "Select a column...")}</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-default mb-2">
            {t("importForms.csv.descriptionColumn", "Description Column")} ({t("importForms.csv.optional", "optional")})
          </label>
          <select
            value={mapping.description || ""}
            onChange={handleDescriptionChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-default"
          >
            <option value="">{t("importForms.csv.selectColumn", "Select a column...")}</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-sm font-medium text-default mb-2">
          {t("importForms.csv.detectedColumns", "Detected Columns")}:
        </p>
        <div className="flex flex-wrap gap-2">
          {headers.map((header) => (
            <span
              key={header}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
            >
              {header}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
