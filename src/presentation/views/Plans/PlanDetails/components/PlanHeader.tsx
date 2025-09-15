import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/primitives";
import {
  ArrowLeftIcon,
  DownloadIcon,
  GearIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "@/presentation/assets/icons";
import { ExportFormat } from "@/core/types/plans";

interface PlanHeaderProps {
  planName: string;
  planResponsible: string;
  isEditing: boolean;
  isUpdatingPlan: boolean;
  isExporting: boolean;
  onEditToggle: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onExport: (format: ExportFormat) => void;
  onDelete: () => void;
}

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  planName,
  planResponsible,
  isEditing,
  isUpdatingPlan,
  isExporting,
  onEditToggle,
  onSaveEdit,
  onCancelEdit,
  onExport,
  onDelete,
}) => {
  const { t } = useTranslation("plans");
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {t("planDetails.back")}
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {planName}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {t("responsible")}: {planResponsible}
          </p>
          {isEditing && (
            <p className="text-sm text-blue-600 mt-1">
              {t("planDetails.editingMode")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!isEditing ? (
          <>
            <Button
              variant="ghost"
              onClick={() => onExport(ExportFormat.PDF)}
              disabled={isExporting}
              size="sm"
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("export.exportPdf")}</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => onExport(ExportFormat.DOCX)}
              disabled={isExporting}
              size="sm"
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("export.exportDocx")}</span>
              <span className="sm:hidden">DOCX</span>
            </Button>
            <Button
              variant="primary"
              onClick={onEditToggle}
              size="sm"
            >
              <GearIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("edit")}</span>
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              size="sm"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("delete")}</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={onSaveEdit}
              disabled={isUpdatingPlan}
              size="sm"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {t("save")}
            </Button>
            <Button
              variant="ghost"
              onClick={onCancelEdit}
              disabled={isUpdatingPlan}
              size="sm"
            >
              <XIcon className="h-4 w-4 mr-2" />
              {t("cancel")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};