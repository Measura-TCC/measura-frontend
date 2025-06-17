import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";
import {
  LockClosedIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/presentation/assets/icons";
import type { PasswordFormData } from "@/core/types";

interface SecurityTabProps {
  canChangePassword: boolean;
  isUpdatingPassword: boolean;
  passwordForm: UseFormReturn<PasswordFormData>;
  passwordErrors: Record<string, { message?: string }>;
  onUpdatePassword: (data: PasswordFormData) => Promise<void>;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  canChangePassword,
  isUpdatingPassword,
  passwordForm,
  passwordErrors,
  onUpdatePassword,
}) => {
  const { t } = useTranslation("account");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { register, handleSubmit } = passwordForm;

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      await onUpdatePassword(data);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className={!canChangePassword ? "opacity-50" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockClosedIcon className="w-5 h-5 text-primary" />
            {t("security.title")}
          </CardTitle>
          <p className="text-sm text-muted">{t("security.description")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSubmit(handlePasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="text-sm font-medium text-default"
              >
                {t("form.currentPasswordLabel")}
              </label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  {...register("currentPassword")}
                  placeholder={t("form.currentPasswordPlaceholder")}
                  disabled={!canChangePassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={!canChangePassword}
                >
                  {showPasswords.current ? (
                    <EyeOffIcon className="w-4 h-4 text-muted" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-muted" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-600">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-default"
              >
                {t("form.newPasswordLabel")}
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder={t("form.newPasswordPlaceholder")}
                  disabled={!canChangePassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={!canChangePassword}
                >
                  {showPasswords.new ? (
                    <EyeOffIcon className="w-4 h-4 text-muted" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-muted" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-600">
                  {passwordErrors.newPassword.message}
                </p>
              )}
              <p className="text-xs text-muted">
                {t("form.passwordRequirements")}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-default"
              >
                {t("form.confirmPasswordLabel")}
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder={t("form.confirmPasswordPlaceholder")}
                  disabled={!canChangePassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={!canChangePassword}
                >
                  {showPasswords.confirm ? (
                    <EyeOffIcon className="w-4 h-4 text-muted" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-muted" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            {updateSuccess && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex items-center">
                  <CheckIcon className="w-4 h-4 text-green-400 mr-2" />
                  <p className="text-sm text-green-700">
                    {t("security.updateSuccess")}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                disabled={!canChangePassword || isUpdatingPassword}
                className="w-full"
              >
                {isUpdatingPassword
                  ? t("security.updating")
                  : t("security.updateButton")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
