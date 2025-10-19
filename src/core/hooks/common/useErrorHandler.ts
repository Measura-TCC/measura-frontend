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

/**
 * Smart error handling strategy:
 * - Toast: Critical/system errors user can't immediately fix (403, 404, 500+, network)
 * - Inline: User-fixable validation errors (400, 401, 409) - returned as string
 * - Never show both together
 */
export const useErrorHandler = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      console.error("Error occurred:", error, "Context:", context);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // INLINE ERRORS (400, 401, 409) - Don't show toast, return string for inline display
        if (status === 400 || status === 401 || status === 409) {
          // These are handled by getFormattedError for inline display
          return;
        }

        // TOAST ERRORS (403, 404, 500+, network)
        if (status === 403) {
          if (message?.includes("organization")) {
            toast.error({ message: t("common:errors.organizationAccessDenied") });
            return;
          }
          toast.error({ message: t("common:errors.forbidden") });
          return;
        }

        if (status === 404) {
          toast.error({ message: t("login:errors.userNotFound") });
          return;
        }

        if (status && status >= 500) {
          toast.error({ message: t("login:errors.serverError") });
          return;
        }

        // Network/connection errors
        if (!status) {
          toast.error({ message: t("login:errors.networkError") });
          return;
        }

        const navigate = (path: string) => router.push(path);
        return handleApiError(error, navigate);
      }

      if (error instanceof Error) {
        return error.message;
      }

      return t("login:errors.serverError");
    },
    [router, t, toast]
  );

  const getFormattedError = (error: AxiosError<ErrorData> | Error): string => {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      // 409 Conflict - Inline errors for duplicate data
      if (status === 409) {
        if (typeof message === "string") {
          if (message.includes("username")) {
            return t("common:errors.usernameAlreadyExists");
          }
          if (message.includes("email")) {
            return t("common:errors.emailAlreadyExists");
          }
          if (message.includes("organization")) {
            return t("common:errors.organizationAlreadyExists");
          }
        }
        return t("common:errors.conflict");
      }

      // 401 Unauthorized - Inline error for invalid credentials
      if (status === 401) {
        return t("login:errors.invalidCredentials");
      }

      // 400 Bad Request - Inline error for validation
      if (status === 400) {
        return message || t("common:errors.badRequest");
      }

      // Network/connection errors
      if (!status) {
        return t("login:errors.networkError");
      }

      const apiError = handleApiError(error);
      return apiError.message || t("login:errors.serverError");
    }

    return error.message || t("login:errors.serverError");
  };

  return { handleError, getFormattedError };
};
