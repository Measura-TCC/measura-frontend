import { useTranslation } from "react-i18next";
import { CheckIcon, XIcon } from "@/presentation/assets/icons";

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  className = "",
}) => {
  const { t } = useTranslation("register");

  const requirements = [
    {
      key: "minLength",
      label: t("passwordRequirements.minLength"),
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      key: "uppercase",
      label: t("passwordRequirements.uppercase"),
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      key: "lowercase",
      label: t("passwordRequirements.lowercase"),
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      key: "number",
      label: t("passwordRequirements.number"),
      test: (pwd: string) => /\d/.test(pwd),
    },
    {
      key: "special",
      label: t("passwordRequirements.special"),
      test: (pwd: string) => /[@$!%*?&]/.test(pwd),
    },
  ];

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 rounded-md p-3 space-y-2 ${className}`}
    >
      <p className="text-xs font-medium text-muted">
        {t("passwordRequirements.title")}
      </p>
      <ul className="space-y-1.5">
        {requirements.map((requirement) => {
          const isValid = requirement.test(password);
          return (
            <li
              key={requirement.key}
              className={`flex items-center text-xs transition-colors duration-200 ${
                password.length === 0
                  ? "text-muted"
                  : isValid
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              <span className="mr-2 flex-shrink-0">
                {password.length === 0 ? (
                  <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" />
                ) : isValid ? (
                  <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckIcon className="w-2 h-2" />
                  </div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <XIcon className="w-2 h-2" />
                  </div>
                )}
              </span>
              <span
                className={
                  isValid && password.length > 0
                    ? "line-through opacity-75"
                    : ""
                }
              >
                {requirement.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
