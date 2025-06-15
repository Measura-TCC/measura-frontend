import { useTranslation } from "react-i18next";

export const LoadingSection: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
        <div className="text-muted font-medium">{t("loading")}</div>
      </div>
    </div>
  );
};
