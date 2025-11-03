import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import { CheckIcon, XIcon } from "@/presentation/assets/icons";
import { ExportFormat } from "@/core/types/plans";

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (
    format: ExportFormat,
    options: {
      includeDetails?: boolean;
      includeMeasurements?: boolean;
      includeAnalysis?: boolean;
      includeCycles?: boolean;
      includeMonitoring?: boolean;
      includeCharts?: boolean;
      includeCalculations?: boolean;
    }
  ) => Promise<void>;
  hasMonitoringData: boolean;
  hasCalculations: boolean;
}

export const ExportOptionsModal: React.FC<ExportOptionsModalProps> = ({
  isOpen,
  onClose,
  onExport,
  hasMonitoringData,
  hasCalculations,
}) => {
  const { t } = useTranslation("plans");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(
    ExportFormat.PDF
  );
  const [options, setOptions] = useState({
    includeDetails: true,
    includeMeasurements: true,
    includeAnalysis: true,
    includeCycles: hasMonitoringData,
    includeMonitoring: hasMonitoringData,
    includeCharts: hasCalculations,
    includeCalculations: hasCalculations,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedFormat, options);
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-full backdrop-blur-sm bg-white/20 dark:bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full mx-4 shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("export.exportOptions")}
        </h2>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("export.selectFormat")}
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedFormat(ExportFormat.PDF)}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedFormat === ExportFormat.PDF
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium">PDF</span>
                {selectedFormat === ExportFormat.PDF && (
                  <CheckIcon className="h-5 w-5 ml-2" />
                )}
              </div>
            </button>
            <button
              onClick={() => setSelectedFormat(ExportFormat.DOCX)}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedFormat === ExportFormat.DOCX
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium">DOCX</span>
                {selectedFormat === ExportFormat.DOCX && (
                  <CheckIcon className="h-5 w-5 ml-2" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("export.includeInExport")}
          </label>
          <div className="space-y-3">
            {/* Basic Options */}
            <div className="space-y-2">
              <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.includeDetails}
                  onChange={() => handleOptionChange("includeDetails")}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                  {t("export.includeDetails")}
                </span>
              </label>

              <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.includeMeasurements}
                  onChange={() => handleOptionChange("includeMeasurements")}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                  {t("export.includeMeasurements")}
                </span>
              </label>

              <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={options.includeAnalysis}
                  onChange={() => handleOptionChange("includeAnalysis")}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                  {t("export.includeAnalysis")}
                </span>
              </label>
            </div>

            {/* Monitoring & Cycles Options */}
            {hasMonitoringData && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
                    {t("monitoring.title")}
                  </p>
                </div>

                <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeCycles}
                    onChange={() => handleOptionChange("includeCycles")}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                    {t("export.includeCycles")}
                  </span>
                </label>

                <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeMonitoring}
                    onChange={() => handleOptionChange("includeMonitoring")}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                    {t("export.includeMonitoring")}
                  </span>
                </label>
              </>
            )}

            {/* Calculations & Charts Options */}
            {hasCalculations && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
                    {t("formulas.calculations")}
                  </p>
                </div>

                <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeCalculations}
                    onChange={() => handleOptionChange("includeCalculations")}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                    {t("export.includeCalculations")}
                  </span>
                </label>

                <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeCharts}
                    onChange={() => handleOptionChange("includeCharts")}
                    disabled={!options.includeCalculations}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <div className="ml-3 flex-1">
                    <span
                      className={`text-sm ${
                        options.includeCalculations
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {t("export.includeCharts")}
                    </span>
                    {!options.includeCalculations && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t("export.chartsRequireCalculations")}
                      </p>
                    )}
                  </div>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose} disabled={isExporting}>
            <XIcon className="h-4 w-4 mr-2" />
            {t("cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("export.exporting")}
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                {t("export.export")}
              </>
            )}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};
