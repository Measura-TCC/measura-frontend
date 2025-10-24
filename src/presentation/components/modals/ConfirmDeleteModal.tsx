import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting?: boolean;
  itemName?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting = false,
  itemName,
}) => {
  const { t } = useTranslation("plans");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-default">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
              disabled={isDeleting}
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">
                {message}
              </p>
              {itemName && (
                <p className="text-sm text-red-900 font-semibold mt-2">
                  {itemName}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? t("deleting") : t("delete")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
