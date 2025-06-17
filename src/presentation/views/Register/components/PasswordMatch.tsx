import { useTranslation } from "react-i18next";
import { CheckIcon, XIcon } from "@/presentation/assets/icons";

interface PasswordMatchProps {
  password: string;
  confirmPassword: string;
  show: boolean;
  className?: string;
}

export const PasswordMatch: React.FC<PasswordMatchProps> = ({
  password,
  confirmPassword,
  show,
  className = "",
}) => {
  const { t } = useTranslation("register");

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;
  const showMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  if (!show || confirmPassword.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-center text-xs mt-1 transition-all duration-200 ${className}`}
    >
      <span className="mr-2 flex-shrink-0">
        {passwordsMatch ? (
          <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckIcon className="w-2 h-2 text-green-600 dark:text-green-400" />
          </div>
        ) : (
          <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <XIcon className="w-2 h-2 text-red-500 dark:text-red-400" />
          </div>
        )}
      </span>
      <span
        className={`transition-colors duration-200 ${
          passwordsMatch
            ? "text-green-600 dark:text-green-400"
            : "text-red-500 dark:text-red-400"
        }`}
      >
        {passwordsMatch
          ? t("passwordMatch.match")
          : showMismatch
          ? t("passwordMatch.noMatch")
          : ""}
      </span>
    </div>
  );
};
