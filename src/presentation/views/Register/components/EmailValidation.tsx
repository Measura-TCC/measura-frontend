import { useTranslation } from "react-i18next";
import { CheckIcon, XIcon } from "@/presentation/assets/icons";

interface EmailValidationProps {
  email: string;
  show: boolean;
  className?: string;
}

export const EmailValidation: React.FC<EmailValidationProps> = ({
  email,
  show,
  className = "",
}) => {
  const { t } = useTranslation("register");

  // Email validation regex (same as used in schema)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  // Don't show anything if not supposed to show or email is empty
  if (!show || email.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-center text-xs mt-1 transition-all duration-200 ${className}`}
    >
      <span className="mr-2 flex-shrink-0">
        {isValidEmail ? (
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
          isValidEmail
            ? "text-green-600 dark:text-green-400"
            : "text-red-500 dark:text-red-400"
        }`}
      >
        {isValidEmail
          ? t("emailValidation.valid")
          : t("emailValidation.invalid")}
      </span>
    </div>
  );
};
