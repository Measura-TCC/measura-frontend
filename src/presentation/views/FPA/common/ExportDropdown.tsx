"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useReports, ReportOptions } from "@/core/hooks/fpa/reports/useReports";
import { DownloadIcon, ChevronDownIcon } from "@/presentation/assets/icons";
import { Button } from "@/presentation/components/primitives/Button/Button";

interface ExportDropdownProps {
  estimateId: string;
  estimateName: string;
}

export const ExportDropdown = ({
  estimateId,
  estimateName,
}: ExportDropdownProps) => {
  const { t, i18n } = useTranslation("fpa");
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
        locale: i18n.language,
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
          await exportEstimate(estimateId, estimateName, format, i18n.language);
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
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        variant="primary"
        size="md"
        className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {t("exportDropdown.generating")}
          </>
        ) : (
          <>
            <DownloadIcon className="w-4 h-4 mr-2" />
            {t("exportDropdown.title")}
            <ChevronDownIcon className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

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
                  <Button
                    onClick={() => handleExport("detailed", "pdf")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  >
                    {t("exportDropdown.pdf")}
                  </Button>
                  <Button
                    onClick={() => handleExport("detailed", "excel")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  >
                    {t("exportDropdown.excel")}
                  </Button>
                  <Button
                    onClick={() => handleExport("detailed", "word")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    {t("exportDropdown.word")}
                  </Button>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 px-3 py-1">
                  {t("exportDropdown.summaryReport")}
                </div>
                <div className="flex space-x-1 px-3">
                  <Button
                    onClick={() => handleExport("summary", "pdf")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  >
                    {t("exportDropdown.pdf")}
                  </Button>
                  <Button
                    onClick={() => handleExport("summary", "excel")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  >
                    {t("exportDropdown.excel")}
                  </Button>
                  <Button
                    onClick={() => handleExport("summary", "word")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    {t("exportDropdown.word")}
                  </Button>
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
                  <Button
                    onClick={() => handleExport("export", "pdf")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  >
                    {t("exportDropdown.pdf")}
                  </Button>
                  <Button
                    onClick={() => handleExport("export", "excel")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  >
                    {t("exportDropdown.excel")}
                  </Button>
                  <Button
                    onClick={() => handleExport("export", "word")}
                    variant="ghost"
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    {t("exportDropdown.word")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
