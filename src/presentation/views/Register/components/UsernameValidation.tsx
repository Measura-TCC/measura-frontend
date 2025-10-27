import { useTranslation } from "react-i18next";
import { CheckIcon, XIcon } from "@/presentation/assets/icons";

interface UsernameValidationProps {
  username: string;
  className?: string;
}

export const UsernameValidation: React.FC<UsernameValidationProps> = ({
  username,
  className = "",
}) => {
  const { t } = useTranslation("register");

  const requirements = [
    {
      key: "minLength",
      label: t("usernameRequirements.minLength"),
      test: (name: string) => name.length >= 3,
    },
    {
      key: "maxLength",
      label: t("usernameRequirements.maxLength"),
      test: (name: string) => name.length <= 100,
    },
    {
      key: "onlyLetters",
      label: t("usernameRequirements.onlyLetters"),
      test: (name: string) => /^[a-zA-Z\s]*$/.test(name),
    },
    {
      key: "noMultipleSpaces",
      label: t("usernameRequirements.noMultipleSpaces"),
      test: (name: string) => !/\s{2,}/.test(name) && !/^\s|\s$/.test(name),
    },
  ];

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 rounded-md p-3 space-y-2 ${className}`}
    >
      <p className="text-xs font-medium text-muted">
        {t("usernameRequirements.title")}
      </p>
      <ul className="space-y-1.5">
        {requirements.map((requirement) => {
          const isValid = requirement.test(username);
          return (
            <li
              key={requirement.key}
              className={`flex items-center text-xs transition-colors duration-200 ${
                username.length === 0
                  ? "text-muted"
                  : isValid
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              <span className="mr-2 flex-shrink-0">
                {username.length === 0 ? (
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
                  isValid && username.length > 0
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
