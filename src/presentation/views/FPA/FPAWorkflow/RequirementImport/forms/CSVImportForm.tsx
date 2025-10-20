"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import type { Requirement } from "@/core/types/fpa";
import { CSVColumnMapper } from "../components/CSVColumnMapper";

interface CSVImportFormProps {
  requirements: Requirement[];
  addRequirements: (requirements: Array<{ title: string; description?: string; source: 'csv' }>) => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview';

export const CSVImportForm = ({ requirements, addRequirements }: CSVImportFormProps) => {
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
