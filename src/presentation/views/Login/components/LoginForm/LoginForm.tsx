import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/presentation/components/primitives";
import { loginSchema, type LoginFormData } from "@/core/schemas/auth";
import { useAuth } from "@/core/hooks/auth";
import { useErrorHandler } from "@/core/hooks/common/useErrorHandler";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const { t } = useTranslation("login");
  const { getFormattedError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { login, resendVerification } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setShowEmailVerification(false);
    try {
      await login(data);
      reset();
      onSuccess?.();
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse?.response?.data?.message ||
        errorResponse?.message ||
        "Login failed";

      if (
        errorMessage.includes("verify your email") ||
        errorMessage.includes("email verification")
      ) {
        setShowEmailVerification(true);
        setUserEmail(data.usernameOrEmail);
        onError?.(
          "Please verify your email address before logging in. Check your inbox for a verification email."
        );
      } else {
        const formattedError = getFormattedError(error as Error);
        onError?.(formattedError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) return;

    setIsLoading(true);
    try {
      await resendVerification(userEmail);
      onError?.(
        "Verification email sent! Please check your inbox and spam folder."
      );
    } catch (error) {
      const formattedError = getFormattedError(error as Error);
      onError?.(formattedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {errors.usernameOrEmail && (
            <span className="text-sm text-red-600">
              {errors.usernameOrEmail.message}
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
          {errors.password && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? t("signingIn") : t("signInButton")}
        </Button>
      </form>

      {showEmailVerification && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-sm font-medium text-amber-900 mb-2">
            Email Verification Required
          </h3>
          <p className="text-sm text-amber-700 mb-3">
            Your account needs email verification. Please check your inbox for a
            verification email. If you can&apos;t find it, check your spam
            folder.
          </p>
          <Button
            onClick={handleResendVerification}
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
  );
};
