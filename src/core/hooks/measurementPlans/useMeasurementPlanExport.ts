import { useState, useCallback } from "react";
import { useOrganizations } from "@/core/hooks/organizations";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import { ExportFormat } from "@/core/types/plans";
import type {
  ExportMeasurementPlanDto,
  ExportResponseDto,
} from "@/core/types/plans";

interface UseMeasurementPlanExportParams {
  planId: string;
}

export const useMeasurementPlanExport = (params: UseMeasurementPlanExportParams) => {
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { planId } = params;
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<Error | null>(null);

  const exportPlan = useCallback(
    async (format: ExportFormat, options?: ExportMeasurementPlanDto['options']): Promise<ExportResponseDto> => {
      if (!userOrganization) {
        throw new Error("Organization is required");
      }

      setIsExporting(true);
      setExportError(null);

      try {
        const exportData: ExportMeasurementPlanDto = {
          format,
          options: {
            includeDetails: true,
            includeMeasurements: true,
            includeAnalysis: true,
            ...options,
          },
        };

        const result = await measurementPlanService.export({
          organizationId: userOrganization._id,
          planId,
          data: exportData,
        });

        return result;
      } catch (error) {
        const exportErr = error instanceof Error ? error : new Error("Export failed");
        setExportError(exportErr);
        throw exportErr;
      } finally {
        setIsExporting(false);
      }
    },
    [userOrganization, planId]
  );

  const exportToPdf = useCallback(
    async (options?: ExportMeasurementPlanDto['options']): Promise<ExportResponseDto> => {
      return exportPlan(ExportFormat.PDF, options);
    },
    [exportPlan]
  );

  const exportToDocx = useCallback(
    async (options?: ExportMeasurementPlanDto['options']): Promise<ExportResponseDto> => {
      return exportPlan(ExportFormat.DOCX, options);
    },
    [exportPlan]
  );

  const downloadFile = useCallback(
    async (downloadUrl: string, filename: string): Promise<void> => {
      try {
        // Construct the full URL if it's a relative path
        const fullUrl = downloadUrl.startsWith('http')
          ? downloadUrl
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${downloadUrl}`;

        const link = document.createElement("a");
        link.href = fullUrl;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        throw new Error("Failed to download file");
      }
    },
    []
  );

  const exportAndDownload = useCallback(
    async (format: ExportFormat, options?: ExportMeasurementPlanDto['options']): Promise<void> => {
      try {
        const result = await exportPlan(format, options);
        await downloadFile(result.downloadUrl, result.filename);
      } catch (error) {
        throw error;
      }
    },
    [exportPlan, downloadFile]
  );

  const clearError = useCallback((): void => {
    setExportError(null);
  }, []);

  return {
    isExporting,
    exportError,
    exportPlan,
    exportToPdf,
    exportToDocx,
    downloadFile,
    exportAndDownload,
    clearError,
  };
};