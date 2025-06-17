import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { useDecodeRole } from "@/core/hooks/common/useDecodeRole";
import { UserRole } from "@/core/types";

interface RoleSectionProps {
  user: {
    name: string;
    role: string;
  };
}

export const RoleSection: React.FC<RoleSectionProps> = ({ user }) => {
  const { t } = useTranslation("dashboard");
  const decodedRole = useDecodeRole(user?.role as UserRole);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("yourRole")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-secondary">{t("currentRole")}</p>
          <p className="font-semibold text-default capitalize">{decodedRole}</p>
          <p className="text-sm text-muted">
            {user?.role === "admin" && t("role.admin")}
            {user?.role === "manager" && t("role.manager")}
            {user?.role === "analyst" && t("role.analyst")}
            {user?.role === "user" && t("role.user")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
