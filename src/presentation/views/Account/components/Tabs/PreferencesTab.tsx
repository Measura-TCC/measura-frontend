import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { CogIcon } from "@/presentation/assets/icons";
import { LanguageSwitcher } from "@/presentation/components/common/LanguageSwitcher/LanguageSwitcher";

interface PreferencesTabProps {
  hasOrganization: boolean;
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({
  hasOrganization,
}) => {
  const { t } = useTranslation("account");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CogIcon className="w-5 h-5 text-primary" />
            {t("preferences.title")}
          </CardTitle>
          <p className="text-sm text-muted">{t("preferences.description")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-default">
              {t("preferences.languageLabel")}
            </label>
            <LanguageSwitcher />
            <p className="text-xs text-muted">
              {t("preferences.languageHelp")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("preferences.organizationTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {hasOrganization ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">
                  {t("preferences.organizationStatus")}
                </span>
                <span className="text-sm font-medium text-green-600">
                  {t("preferences.connected")}
                </span>
              </div>
              <p className="text-xs text-muted">
                {t("preferences.organizationHelp")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">
                  {t("preferences.organizationStatus")}
                </span>
                <span className="text-sm font-medium text-yellow-600">
                  {t("preferences.notConnected")}
                </span>
              </div>
              <p className="text-xs text-muted">
                {t("preferences.organizationHelpEmpty")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
