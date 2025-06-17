import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { handleApiError } from "@/core/utils/errorHandler";
import { useToast } from "./useToast";

interface ErrorData {
  message?: string;
  details?: string;
  validationErrors?: { field: string; message: string }[];
  errorType?: string;
}

export const useErrorHandler = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      console.error("Error occurred:", error, "Context:", context);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          const message = error.response.data?.message;
          if (message?.includes("email")) {
            toast.error({ message: t("errors.emailAlreadyExists") });
            return;
          }
          if (message?.includes("username")) {
            toast.error({ message: t("errors.usernameAlreadyExists") });
            return;
          }
          if (message?.includes("organization")) {
            toast.error({ message: t("errors.organizationAlreadyExists") });
            return;
          }
          toast.error({ message: message || t("errors.conflict") });
          return;
        }

        if (error.response?.status === 401) {
          toast.error({ message: t("errors.unauthorized") });
          return;
        }

        if (error.response?.status === 403) {
          const message = error.response.data?.message;
          if (message?.includes("organization")) {
            toast.error({ message: t("errors.organizationAccessDenied") });
            return;
          }
          toast.error({ message: t("errors.forbidden") });
          return;
        }

        if (error.response?.status === 400) {
          const message = error.response.data?.message;
          toast.error({ message: message || t("errors.badRequest") });
          return;
        }

        const navigate = (path: string) => router.push(path);
        return handleApiError(error, navigate);
      }

      if (error instanceof Error) {
        return error.message;
      }

      return "An unexpected error occurred.";
    },
    [router, t, toast]
  );

  const getFormattedError = (error: AxiosError<ErrorData> | Error): string => {
    if (error instanceof AxiosError) {
      const apiError = handleApiError(error);

      if (error.response?.status === 409) {
        const message = error.response.data?.message;
        if (typeof message === "string") {
          if (
            message.includes("Username already exists") ||
            message.includes("username")
          ) {
            return "This username is already taken. Please choose a different one.";
          }
          if (
            message.includes("Email already exists") ||
            message.includes("email")
          ) {
            return "This email is already registered. Please use a different email or try logging in.";
          }
        }
        return "This information is already in use. Please try different values.";
      }

      if (error.response?.status === 401) {
        return "Invalid credentials. Please check your username/email and password.";
      }

      if (error.response?.status === 400) {
        const message = error.response.data?.message;
        return message || "Please check your input and try again.";
      }

      return apiError.message || "An unexpected error occurred.";
    }

    return error.message || "An unexpected error occurred.";
  };

  return { handleError, getFormattedError };
};
