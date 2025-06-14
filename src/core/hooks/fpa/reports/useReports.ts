import { measuraApi } from "@/core/services/measuraApi";

export interface ReportOptions {
  format?: "pdf" | "excel" | "word";
  includeComponents?: boolean;
  includeGSC?: boolean;
  includeCalculations?: boolean;
}

const reportService = {
  generateDetailedReport: async (
    estimateId: string,
    options?: ReportOptions
  ): Promise<Blob> => {
    const params = new URLSearchParams();
    if (options?.format) params.append("format", options.format);
    if (options?.includeComponents !== undefined)
      params.append("includeComponents", String(options.includeComponents));
    if (options?.includeGSC !== undefined)
      params.append("includeGSC", String(options.includeGSC));
    if (options?.includeCalculations !== undefined)
      params.append("includeCalculations", String(options.includeCalculations));

    const response = await measuraApi.get(
      `/estimates/reports/${estimateId}/detailed?${params.toString()}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  generateSummaryReport: async (
    estimateId: string,
    options?: ReportOptions
  ): Promise<Blob> => {
    const params = new URLSearchParams();
    if (options?.format) params.append("format", options.format);

    const response = await measuraApi.get(
      `/estimates/reports/${estimateId}/summary?${params.toString()}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  exportEstimate: async (
    estimateId: string,
    format: "pdf" | "excel" | "word" = "pdf"
  ): Promise<Blob> => {
    const response = await measuraApi.get(
      `/estimates/reports/${estimateId}/export?format=${format}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  generateComparisonReport: async (
    estimateIds: string[],
    options?: ReportOptions
  ): Promise<Blob> => {
    const params = new URLSearchParams();
    estimateIds.forEach((id) => params.append("estimateIds", id));
    if (options?.format) params.append("format", options.format);

    const response = await measuraApi.post(
      `/estimates/reports/comparison?${params.toString()}`,
      {},
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};

export const useReports = () => {
  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateDetailedReport = async (
    estimateId: string,
    estimateName: string,
    options?: ReportOptions
  ) => {
    try {
      const blob = await reportService.generateDetailedReport(
        estimateId,
        options
      );
      const format = options?.format || "pdf";
      const filename = `${estimateName}_detailed_report.${format}`;
      downloadFile(blob, filename);
    } catch (error) {
      console.error("Failed to generate detailed report:", error);
      throw error;
    }
  };

  const generateSummaryReport = async (
    estimateId: string,
    estimateName: string,
    options?: ReportOptions
  ) => {
    try {
      const blob = await reportService.generateSummaryReport(
        estimateId,
        options
      );
      const format = options?.format || "pdf";
      const filename = `${estimateName}_summary_report.${format}`;
      downloadFile(blob, filename);
    } catch (error) {
      console.error("Failed to generate summary report:", error);
      throw error;
    }
  };

  const exportEstimate = async (
    estimateId: string,
    estimateName: string,
    format: "pdf" | "excel" | "word" = "pdf"
  ) => {
    try {
      const blob = await reportService.exportEstimate(estimateId, format);
      const filename = `${estimateName}_export.${format}`;
      downloadFile(blob, filename);
    } catch (error) {
      console.error("Failed to export estimate:", error);
      throw error;
    }
  };

  const generateComparisonReport = async (
    estimateIds: string[],
    filename: string,
    options?: ReportOptions
  ) => {
    try {
      const blob = await reportService.generateComparisonReport(
        estimateIds,
        options
      );
      const format = options?.format || "pdf";
      const fullFilename = `${filename}_comparison.${format}`;
      downloadFile(blob, fullFilename);
    } catch (error) {
      console.error("Failed to generate comparison report:", error);
      throw error;
    }
  };

  return {
    generateDetailedReport,
    generateSummaryReport,
    exportEstimate,
    generateComparisonReport,
  };
};
