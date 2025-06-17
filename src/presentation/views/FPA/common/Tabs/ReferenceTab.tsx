"use client";

import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { ChartIcon } from "@/presentation/assets/icons";
import { FunctionTypeInfo, ComplexityInfo } from "@/core/types/fpa";

interface ReferenceTabProps {
  functionTypes: FunctionTypeInfo[];
  complexityLevels: ComplexityInfo[];
}

export const ReferenceTab: React.FC<ReferenceTabProps> = ({
  functionTypes,
  complexityLevels,
}) => {
  const { t } = useTranslation("fpa");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartIcon className="w-5 h-5 text-primary" />
          {t("quickReference")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium text-default mb-3">
            {t("functionTypes")}
          </h4>
          <div className="space-y-3">
            {functionTypes.map((type) => (
              <div key={type.value} className="text-sm">
                <span className="font-medium text-secondary">
                  {type.value}:
                </span>
                <span className="ml-2 text-muted">
                  {type.label.split("(")[1]?.replace(")", "") || type.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-default mb-3">
            {t("complexityLevels")}
          </h4>
          <div className="space-y-3">
            {complexityLevels.map((level) => (
              <div key={level.value} className="text-sm">
                <span className="font-medium text-secondary">
                  {level.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-default mb-3">{t("guidelines")}</h4>
          <div className="text-sm text-muted space-y-2">
            <p>{t("guideline1")}</p>
            <p>{t("guideline2")}</p>
            <p>{t("guideline3")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
