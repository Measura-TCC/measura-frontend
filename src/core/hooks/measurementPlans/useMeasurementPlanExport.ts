import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useOrganizations } from "@/core/hooks/organizations";
import { measurementPlanService } from "@/core/services/measurementPlanService";
import { ExportFormat } from "@/core/types/plans";
import { API_BASE_URL } from "@/core/utils/constants";
import type {
  ExportMeasurementPlanDto,
  ExportResponseDto,
  ChartImageDto,
} from "@/core/types/plans";

interface UseMeasurementPlanExportParams {
  planId: string;
  captureCharts?: () => Promise<ChartImageDto[]>;
}

export const useMeasurementPlanExport = (params: UseMeasurementPlanExportParams) => {
  const { i18n } = useTranslation();
  const { userOrganization } = useOrganizations({ fetchUserOrganization: true });
  const { planId, captureCharts } = params;
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
        // Capture charts if the function is provided and includeCharts is enabled
        let chartImages: ChartImageDto[] | undefined;
        if (captureCharts && options?.includeCharts) {
          try {
            chartImages = await captureCharts();
            console.log(`Captured ${chartImages.length} chart images for export`);
          } catch (error) {
            console.error("Error capturing charts:", error);
            // Continue with export even if chart capture fails
          }
        }

        const exportData: ExportMeasurementPlanDto = {
          format,
          locale: i18n.language,
          options: {
            includeDetails: true,
            includeMeasurements: true,
            includeAnalysis: true,
            ...options,
          },
          chartImages,
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
    [userOrganization, planId, i18n.language, captureCharts]
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
          : `${API_BASE_URL}${downloadUrl}`;

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