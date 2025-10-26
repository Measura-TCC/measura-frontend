"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table } from "@/presentation/components/primitives";
import { Pagination } from "@/presentation/components/primitives/Pagination/Pagination";
import { usePagination } from "@/core/hooks/usePagination";
import type { Requirement } from "@/core/types/fpa";
import { CSVColumnMapper } from "../components/CSVColumnMapper";

interface CSVImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'csv' }>) => void;
  removeRequirement?: (requirementId: string) => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview';

export const CSVImportForm = ({ requirements, addRequirements, removeRequirement }: CSVImportFormProps) => {
  const { t } = useTranslation("fpa");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [step, setStep] = useState<ImportStep>('upload');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<{ title: string | null; description: string | null }>({
    title: null,
    description: null,
  });
  const [isDragging, setIsDragging] = useState(false);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedRequirements,
    startIndex,
    endIndex,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({ data: requirements, initialItemsPerPage: 5 });

  const detectBestColumn = (headers: string[], patterns: string[]): string | null => {
    const lowerHeaders = headers.map(h => h.toLowerCase());
    for (const pattern of patterns) {
      const index = lowerHeaders.findIndex(h => h.includes(pattern));
      if (index !== -1) return headers[index];
    }
    return null;
  };

  const parseCSVFile = async (file: File) => {
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header row and one data row");
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    const rows: string[][] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      rows.push(values);
    }

    return { headers, rows };
  };

  const processFile = async (file: File) => {
    if (file && (file.type === "text/csv" || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      try {
        const { headers, rows } = await parseCSVFile(file);
        setCsvHeaders(headers);
        setCsvRows(rows);

        const titleColumn = detectBestColumn(headers, ['title', 'titulo', 'name', 'nome', 'requirement', 'req']);
        const descColumn = detectBestColumn(headers, ['description', 'descricao', 'descrição', 'desc', 'details', 'detalhes']);

        setColumnMapping({
          title: titleColumn,
          description: descColumn,
        });

        setStep('mapping');
      } catch (error) {
        console.error("Error parsing CSV:", error);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleBackToUpload = () => {
    setStep('upload');
    setSelectedFile(null);
    setCsvHeaders([]);
    setCsvRows([]);
    setColumnMapping({ title: null, description: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProceedToPreview = () => {
    if (!columnMapping.title) return;
    setStep('preview');
  };

  const handleBackToMapping = () => {
    setStep('mapping');
  };

  const handleImport = async () => {
    if (!columnMapping.title) return;

    setIsImporting(true);
    try {
      const titleIndex = csvHeaders.indexOf(columnMapping.title);
      const descIndex = columnMapping.description ? csvHeaders.indexOf(columnMapping.description) : -1;

      const parsedRequirements = csvRows
        .filter(row => row[titleIndex]?.trim())
        .map(row => ({
          title: row[titleIndex].trim(),
          description: descIndex >= 0 ? row[descIndex]?.trim() : undefined,
          source: "csv" as const,
        }));

      addRequirements(parsedRequirements);
      handleBackToUpload();
    } catch (error) {
      console.error("Error importing CSV:", error);
    } finally {
      setIsImporting(false);
    }
  };

  if (step === 'upload') {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-default">
            {t("importForms.csv.uploadFile")}
          </h3>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer text-secondary hover:text-default"
            >
              <div className="mb-2 text-4xl">📁</div>
              <p className="text-sm">{t("importForms.csv.dragDrop")}</p>
            </label>
          </div>
        </div>

        {requirements.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("requirementImport.allRequirements", "All Requirements")} ({requirements.length})
              </h4>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap hidden sm:inline">
                  {t("requirementClassification.itemsPerPage")}
                </label>
                <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap sm:hidden">
                  {t("requirementClassification.itemsPerPageShort")}
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <div className="p-4">
              <div className="overflow-x-auto">
                <Table
                  columns={[
                    {
                      key: "title",
                      label: t("requirementImport.requirementTitle"),
                      render: (req: Requirement) => (
                        <div className="font-medium text-default">{req.title}</div>
                      ),
                    },
                    {
                      key: "description",
                      label: t("requirementImport.description"),
                      render: (req: Requirement) => (
                        <div className="text-sm text-secondary max-w-md line-clamp-2">
                          {req.description || "-"}
                        </div>
                      ),
                      hideOnMobile: true,
                    },
                    {
                      key: "source",
                      label: t("requirementImport.source"),
                      render: (req: Requirement) => (
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            {req.source}
                          </span>
                          {req.sourceReference && (
                            <div className="text-xs text-secondary mt-1 font-mono">
                              {req.sourceReference}
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: "actions",
                      label: t("actions.edit"),
                      render: (req: Requirement) => (
                        removeRequirement && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(req._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium cursor-pointer"
                            title={t("actions.delete", "Delete")}
                          >
                            {t("actions.remove", { defaultValue: "Remove" })}
                          </button>
                        )
                      ),
                    },
                  ]}
                  data={paginatedRequirements}
                  getRowKey={(req) => req._id}
                />
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPreviousPage={goToPreviousPage}
                onNextPage={goToNextPage}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={requirements.length}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'mapping') {
    return (
      <div className="space-y-6">
        <CSVColumnMapper
          headers={csvHeaders}
          mapping={columnMapping}
          onMappingChange={setColumnMapping}
        />

        <div className="flex justify-end gap-3">
          <Button onClick={handleBackToUpload} variant="secondary">
            Voltar
          </Button>
          <Button
            onClick={handleProceedToPreview}
            variant="primary"
            disabled={!columnMapping.title}
          >
            {t("importForms.csv.nextPreview")}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    const titleIndex = csvHeaders.indexOf(columnMapping.title!);
    const descIndex = columnMapping.description ? csvHeaders.indexOf(columnMapping.description) : -1;
    const previewRows = csvRows.slice(0, 5);
    const totalRows = csvRows.filter(row => row[titleIndex]?.trim()).length;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-default mb-2">
            {t("importForms.csv.preview", "Preview")}
          </h3>
          <p className="text-sm text-secondary">
            {t("importForms.csv.previewDescription", "Showing {{count}} of {{total}} requirements", {
              count: Math.min(5, totalRows),
              total: totalRows,
            })}
          </p>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-default">
                  {t("importForms.manual.requirementTitle", "Title")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-default">
                  {t("importForms.manual.description", "Description")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {previewRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-sm text-default">
                    {row[titleIndex] || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary">
                    {descIndex >= 0 ? (row[descIndex] || "-") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={handleBackToMapping} variant="secondary">
            Voltar
          </Button>
          <Button
            onClick={handleImport}
            variant="primary"
            disabled={isImporting}
          >
            {isImporting
              ? t("requirementImport.importing")
              : t("importForms.csv.importItems", { count: totalRows })}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
