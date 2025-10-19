"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";

export const CSVImportForm = () => {
  const { t } = useTranslation("fpa");
  // TODO: Implement addMultipleRequirements - requirements are created with estimate
  const addMultipleRequirements = (requirements: unknown[]) => {
    console.log("TODO: Add requirements to estimate creation payload", requirements);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    }
  };

  const parseCSV = async (file: File): Promise<any[]> => {
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const requirements = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });

      if (row.title || row.titulo) {
        requirements.push({
          title: row.title || row.titulo || `Requirement ${i}`,
          description: row.description || row.descricao || row.descrição || "",
          source: "csv" as const,
          metadata: {
            status: row.status,
            assignee: row.assignee || row.responsavel || row.responsável,
            priority: row.priority || row.prioridade,
            labels: row.labels ? row.labels.split(";") : [],
          },
        });
      }
    }

    return requirements;
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      const requirements = await parseCSV(selectedFile);
      addMultipleRequirements(requirements);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error importing CSV:", error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("importForms.csv.uploadFile")}
      </h3>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
          className="cursor-pointer text-gray-600 hover:text-gray-900"
        >
          <div className="mb-2 text-4xl">📁</div>
          <p className="text-sm">{t("importForms.csv.dragDrop")}</p>
        </label>
      </div>

      {selectedFile && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            {t("importForms.csv.fileSelected", {
              filename: selectedFile.name,
            })}
          </p>
        </div>
      )}

      <Button
        onClick={handleImport}
        disabled={!selectedFile || isImporting}
        variant="primary"
      >
        {isImporting
          ? t("requirementImport.importing")
          : t("requirementImport.importButton")}
      </Button>
    </div>
  );
};
