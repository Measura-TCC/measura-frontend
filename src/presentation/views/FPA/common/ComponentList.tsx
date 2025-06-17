"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ComponentItem {
  _id: string;
  name: string;
  description?: string;
  complexity?: "LOW" | "MEDIUM" | "HIGH";
  functionPoints?: number;
  primaryIntent?: string;
  recordElementTypes?: number;
  dataElementTypes?: number;
  fileTypesReferenced?: number;
  derivedData?: boolean;
  outputFormat?: string;
  retrievalLogic?: string;
  externalSystem?: string;
  createdAt: string;
  updatedAt: string;
}

interface ComponentListProps {
  title: string;
  components: ComponentItem[];
  componentType: string;
  onEdit?: (component: ComponentItem) => void;
  onDelete: (componentId: string) => void;
  isLoading?: boolean;
}

export const ComponentList = ({
  title,
  components,
  componentType,
  onEdit,
  onDelete,
  isLoading = false,
}: ComponentListProps) => {
  const { t, i18n } = useTranslation("fpa");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const locale = i18n.language === "pt" ? "pt-BR" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDelete = (componentId: string) => {
    onDelete(componentId);
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-default">{title}</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-background-secondary rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">
          {components.length}{" "}
          {components.length === 1
            ? t("components.component")
            : t("components.components")}
        </span>
      </div>

      {components.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500">
            {t("components.noComponentsYet", { type: componentType })}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {t("components.addComponentsUsingButtons")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {components.map((component) => (
            <div
              key={component._id}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {component.name}
                    </h4>
                    {component.complexity && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getComplexityColor(
                          component.complexity
                        )}`}
                      >
                        {t(`complexityLabels.${component.complexity}`)}
                      </span>
                    )}
                    {component.functionPoints !== undefined && (
                      <span className="text-sm font-semibold text-indigo-600">
                        {component.functionPoints} {t("calculations.fp")}
                      </span>
                    )}
                  </div>

                  {component.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {component.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {component.recordElementTypes !== undefined && (
                      <span>
                        {t("components.ret")}: {component.recordElementTypes}
                      </span>
                    )}
                    {component.dataElementTypes !== undefined && (
                      <span>
                        {t("components.det")}: {component.dataElementTypes}
                      </span>
                    )}
                    {component.fileTypesReferenced !== undefined && (
                      <span>
                        {t("components.ftr")}: {component.fileTypesReferenced}
                      </span>
                    )}
                    {component.derivedData !== undefined && (
                      <span>
                        Derived: {component.derivedData ? "Yes" : "No"}
                      </span>
                    )}
                    <span>
                      {t("components.created")}:{" "}
                      {formatDate(component.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEdit?.(component)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Edit component"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  {deleteConfirmId === component._id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDelete(component._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Confirm delete"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                        title="Cancel delete"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(component._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete component"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
