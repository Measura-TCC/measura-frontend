import { useTranslation } from "react-i18next";
import Link from "next/link";

export const LoginFooter: React.FC = () => {
  const { t } = useTranslation("login");

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-secondary">
        {t("dontHaveAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary-dark"
        >
          {t("signUp")}
        </Link>
      </p>
    </div>
  );
};
