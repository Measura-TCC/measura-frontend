import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/presentation/components/primitives";
import {
  registerSchema,
  type RegisterFormData,
  UserRole,
} from "@/core/schemas/auth";
import { useAuth } from "@/core/hooks/auth";
import { useErrorHandler } from "@/core/hooks/common/useErrorHandler";

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const RegisterForm = ({ onSuccess, onError }: RegisterFormProps) => {
  const { t } = useTranslation("register");
  const { getFormattedError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { register: registerUser } = useAuth();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      reset();
      onSuccess?.();
    } catch (error) {
      const formattedError = getFormattedError(error as Error);
      onError?.(formattedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-default">
          {t("username")}
        </label>
        <Input
          {...register("username")}
          id="username"
          type="text"
          placeholder={t("enterFullName")}
          disabled={isLoading}
        />
        {errors.username && (
          <span className="text-sm text-red-600">
            {errors.username.message}
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
          disabled={isLoading}
        />
        {errors.email && (
          <span className="text-sm text-red-600">{errors.email.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-default">
          {t("password")}
        </label>
        <Input
          {...register("password")}
          id="password"
          type="password"
          placeholder={t("createPassword")}
          disabled={isLoading}
        />
        {errors.password && (
          <span className="text-sm text-red-600">
            {errors.password.message}
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
        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          placeholder={t("confirmPassword")}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <span className="text-sm text-red-600">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-default">{t("role")}</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              {...register("role")}
              id="project-manager"
              type="radio"
              value={UserRole.PROJECT_MANAGER}
              disabled={isLoading}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label htmlFor="project-manager" className="text-sm text-default">
              {t("projectManager")}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              {...register("role")}
              id="measurement-analyst"
              type="radio"
              value={UserRole.MEASUREMENT_ANALYST}
              disabled={isLoading}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <label
              htmlFor="measurement-analyst"
              className="text-sm text-default"
            >
              {t("metricsAnalyst")}
            </label>
          </div>
        </div>
        {errors.role && (
          <span className="text-sm text-red-600">{errors.role.message}</span>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? t("creatingAccount") : t("createAccountButton")}
      </Button>
    </form>
  );
};
