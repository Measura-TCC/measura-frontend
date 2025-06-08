import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/core/utils/errorHandler";

interface ErrorData {
  message?: string;
  details?: string;
  validationErrors?: { field: string; message: string }[];
  errorType?: string;
}

export const useErrorHandler = () => {
  const router = useRouter();

  const handleError = (error: AxiosError<ErrorData>) => {
    console.error("Handling error:", error);

    const navigate = (path: string) => router.push(path);

    return handleApiError(error, navigate);
  };

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
