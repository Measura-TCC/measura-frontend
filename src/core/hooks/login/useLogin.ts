import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/core/schemas/auth";
import { useAuth } from "@/core/hooks/auth";
import { useErrorHandler } from "@/core/hooks/common/useErrorHandler";

interface LoginState {
  isLoading: boolean;
  error: string;
  showEmailVerification: boolean;
  userEmail: string;
}

export const useLogin = () => {
  const router = useRouter();
  const { getFormattedError } = useErrorHandler();
  const { login, resendVerification } = useAuth();

  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: "",
    showEmailVerification: false,
    userEmail: "",
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    formState: { errors: formErrors },
  } = loginForm;

  const handleLoginSuccess = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
    router.push("/overview");
  }, [router]);

  const handleLoginError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        showEmailVerification: false,
      }));

      try {
        await login(data);
        loginForm.reset();
        handleLoginSuccess();
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
          setState((prev) => ({
            ...prev,
            showEmailVerification: true,
            userEmail: data.usernameOrEmail,
          }));
          handleLoginError(
            "Please verify your email address before logging in. Check your inbox for a verification email."
          );
        } else {
          const formattedError = getFormattedError(error as Error);
          handleLoginError(formattedError);
        }
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [login, loginForm, handleLoginSuccess, handleLoginError, getFormattedError]
  );

  const handleResendVerification = useCallback(async () => {
    if (!state.userEmail) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await resendVerification(state.userEmail);
      handleLoginError(
        "Verification email sent! Please check your inbox and spam folder."
      );
    } catch (error) {
      const formattedError = getFormattedError(error as Error);
      handleLoginError(formattedError);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [
    state.userEmail,
    resendVerification,
    getFormattedError,
    handleLoginError,
  ]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
  }, []);

  return {
    loginForm,
    formErrors,
    isLoading: state.isLoading,
    error: state.error,
    showEmailVerification: state.showEmailVerification,
    handleLogin,
    handleResendVerification,
    clearError,
  };
};
