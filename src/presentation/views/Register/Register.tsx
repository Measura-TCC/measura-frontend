"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRegister } from "@/core/hooks/register";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { RegisterPageHeader, RegisterForm, ErrorAlert } from "./components";

export const RegisterView: React.FC = () => {
  const { t } = useTranslation("register");

  const {
    registrationState,
    roleOptions,

    isRegistering,
    canRegister,

    registerForm,
    formErrors,

    register,
    clearError,
  } = useRegister();

  if (isRegistering && registrationState.status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 w-32 bg-gray-200 rounded mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <RegisterPageHeader />

        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorAlert
              error={registrationState.error}
              onDismiss={clearError}
            />

            <RegisterForm
              registerForm={registerForm}
              formErrors={formErrors}
              roleOptions={roleOptions}
              isRegistering={isRegistering}
              canRegister={canRegister}
              onSubmit={register}
            />

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary">
                {t("alreadyHaveAccount")}{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  {t("signIn")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted">{t("termsAgreement")}</p>
        </div>
      </div>
    </div>
  );
};
