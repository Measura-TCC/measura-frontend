import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";
import { LoginFormData } from "@/core/schemas/auth";

interface LoginCardProps {
  loginForm: UseFormReturn<LoginFormData>;
  formErrors: Record<string, { message?: string }>;
  isLoading: boolean;
  error: string;
  showEmailVerification: boolean;
  onLogin: (data: LoginFormData) => Promise<void>;
  onResendVerification: () => Promise<void>;
  onClearError: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  loginForm,
  formErrors,
  isLoading,
  error,
  showEmailVerification,
  onLogin,
  onResendVerification,
}) => {
  const { t } = useTranslation("login");
  const { register, handleSubmit } = loginForm;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
            {error}
          </div>
        )}

        <div>
          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="usernameOrEmail"
                className="text-sm font-medium text-default"
              >
                {t("email")}
              </label>
              <Input
                {...register("usernameOrEmail")}
                id="usernameOrEmail"
                type="text"
                placeholder={t("enterYourEmail")}
                disabled={isLoading}
              />
              {formErrors.usernameOrEmail && (
                <span className="text-sm text-red-600">
                  {formErrors.usernameOrEmail.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-default"
              >
                {t("password")}
              </label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder={t("enterYourPassword")}
                disabled={isLoading}
              />
              {formErrors.password && (
                <span className="text-sm text-red-600">
                  {formErrors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? t("signingIn") : t("signInButton")}
            </Button>
          </form>

          {showEmailVerification && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="text-sm font-medium text-amber-900 mb-2">
                Email Verification Required
              </h3>
              <p className="text-sm text-amber-700 mb-3">
                Your account needs email verification. Please check your inbox
                for a verification email. If you can&apos;t find it, check your
                spam folder.
              </p>
              <Button
                onClick={onResendVerification}
                variant="secondary"
                size="sm"
                disabled={isLoading}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                {isLoading ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
