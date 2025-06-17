import { UserRole } from "@/core/types";
import { useTranslation } from "react-i18next";

export const useDecodeRole = (role: UserRole) => {
  const { t } = useTranslation("common");
  switch (role) {
    case UserRole.USER:
      return t("role.user");
    case UserRole.ADMIN:
      return t("role.admin");
    case UserRole.ANALYST:
      return t("role.measurementAnalyst");
    case UserRole.MANAGER:
      return t("role.projectManager");
  }
};
