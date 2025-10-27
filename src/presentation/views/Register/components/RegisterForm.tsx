import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Button, Input } from "@/presentation/components/primitives";
import { EyeIcon, EyeOffIcon } from "@/presentation/assets/icons";
import { RegisterFormData, RoleOption } from "@/core/types/register";
import { PasswordRequirements } from "./PasswordRequirements";
import { EmailValidation } from "./EmailValidation";
import { PasswordMatch } from "./PasswordMatch";
import { UsernameValidation } from "./UsernameValidation";

interface RegisterFormProps {
  registerForm: UseFormReturn<RegisterFormData>;
  formErrors: Record<string, { message?: string }>;
  roleOptions: RoleOption[];
  isRegistering: boolean;
  canRegister: boolean;
  onSubmit: (data: RegisterFormData) => Promise<void>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  registerForm,
  formErrors,
  roleOptions,
  isRegistering,
  canRegister,
  onSubmit,
}) => {
  const { t } = useTranslation("register");
  const { register, handleSubmit, watch } = registerForm;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailValidation, setShowEmailValidation] = useState(false);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);

  const password = watch("password") || "";
  const username = watch("username") || "";
  const email = watch("email") || "";
  const confirmPassword = watch("confirmPassword") || "";

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-default">
          {t("username")}
        </label>
        <Input
          {...register("username")}
          id="username"
          type="text"
          placeholder={t("enterFullName")}
          disabled={isRegistering}
        />
        <UsernameValidation username={username} className="mt-2" />
        {formErrors.username && username.length > 0 && (
          <span className="text-sm text-red-600">
            {formErrors.username.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-default">
          {t("email")}
        </label>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder={t("enterEmail")}
          disabled={isRegistering}
          onBlur={() => setShowEmailValidation(true)}
        />

        <EmailValidation
          email={email}
          show={showEmailValidation}
          className="mt-2"
        />

        {formErrors.email && email.length > 0 && (
          <span className="text-sm text-red-600">
            {formErrors.email.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-default">
          {t("password")}
        </label>
        <div className="relative">
          <Input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("createPassword")}
            disabled={isRegistering}
            className="pr-10"
          />
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 hover:cursor-pointer"
            disabled={isRegistering}
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </Button>
        </div>
        <PasswordRequirements password={password} className="mt-2" />

        {formErrors.password && password.length > 0 && (
          <span className="text-sm text-red-600">
            {formErrors.password.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-default"
        >
          {t("confirmPassword")}
        </label>
        <div className="relative">
          <Input
            {...register("confirmPassword")}
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("confirmPassword")}
            disabled={isRegistering}
            className="pr-10"
            onBlur={() => setShowPasswordMatch(true)}
          />
          <Button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 hover:cursor-pointer"
            disabled={isRegistering}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </Button>
        </div>

        <PasswordMatch
          password={password}
          confirmPassword={confirmPassword}
          show={showPasswordMatch}
          className="mt-2"
        />

        {formErrors.confirmPassword && confirmPassword.length > 0 && (
          <span className="text-sm text-red-600">
            {formErrors.confirmPassword.message}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-default">{t("role")}</label>
        <div className="space-y-2">
          {roleOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                {...register("role")}
                id={option.value}
                type="radio"
                value={option.value}
                disabled={isRegistering}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor={option.value} className="text-sm text-default">
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {formErrors.role && (
          <span className="text-sm text-red-600">
            {formErrors.role.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!canRegister || isRegistering}
      >
        {isRegistering ? t("creatingAccount") : t("createAccountButton")}
      </Button>
    </form>
  );
};
