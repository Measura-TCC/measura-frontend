"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useReports, ReportOptions } from "@/core/hooks/fpa/reports/useReports";

interface ExportDropdownProps {
  estimateId: string;
  estimateName: string;
}

export const ExportDropdown = ({
  estimateId,
  estimateName,
}: ExportDropdownProps) => {
  const { t } = useTranslation("fpa");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { generateDetailedReport, generateSummaryReport, exportEstimate } =
    useReports();

  const handleExport = async (
    type: "detailed" | "summary" | "export",
    format: "pdf" | "excel" | "word"
  ) => {
    setIsLoading(true);
    setIsOpen(false);

    try {
      const options: ReportOptions = {
        format,
        includeComponents: true,
        includeGSC: true,
        includeCalculations: true,
      };

      switch (type) {
        case "detailed":
          await generateDetailedReport(estimateId, estimateName, options);
          break;
        case "summary":
          await generateSummaryReport(estimateId, estimateName, options);
          break;
        case "export":
          await exportEstimate(estimateId, estimateName, format);
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {t("exportDropdown.generating")}
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t("exportDropdown.title")}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                {t("exportDropdown.reports")}
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 px-3 py-1">
                  {t("exportDropdown.detailedReport")}
                </div>
                <div className="flex space-x-1 px-3">
                  <button
                    onClick={() => handleExport("detailed", "pdf")}
                    className="flex-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  >
                    {t("exportDropdown.pdf")}
                  </button>
                  <button
                    onClick={() => handleExport("detailed", "excel")}
                    className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  >
                    {t("exportDropdown.excel")}
                  </button>
                  <button
                    onClick={() => handleExport("detailed", "word")}
                    className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    {t("exportDropdown.word")}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 px-3 py-1">
                  {t("exportDropdown.summaryReport")}
                </div>
                <div className="flex space-x-1 px-3">
                  <button
                    onClick={() => handleExport("summary", "pdf")}
                    className="flex-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  >
                    {t("exportDropdown.pdf")}
                  </button>
                  <button
                    onClick={() => handleExport("summary", "excel")}
                    className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  >
                    {t("exportDropdown.excel")}
                  </button>
                  <button
                    onClick={() => handleExport("summary", "word")}
                    className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    {t("exportDropdown.word")}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 my-2"></div>

              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                {t("exportDropdown.export")}
              </div>

              <div className="mb-2">
                <div className="text-sm font-medium text-gray-700 px-3 py-1">
                  {t("exportDropdown.completeExport")}
                </div>
                <div className="flex space-x-1 px-3">
                  <button
                    onClick={() => handleExport("export", "pdf")}
                    className="flex-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  >
                    {t("exportDropdown.pdf")}
                  </button>
                  <button
                    onClick={() => handleExport("export", "excel")}
                    className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  >
                    {t("exportDropdown.excel")}
                  </button>
                  <button
                    onClick={() => handleExport("export", "word")}
                    className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    {t("exportDropdown.word")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
