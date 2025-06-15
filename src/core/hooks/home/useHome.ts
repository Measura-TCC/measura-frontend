import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface HomeState {
  isLoading: boolean;
  error: string;
}

interface HomeProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogin: () => void;
}

export const useHome = ({ isAuthenticated, isLoading, onLogin }: HomeProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [state, setState] = useState<HomeState>({
    isLoading: false,
    error: "",
  });

  const handleQuickLogin = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      await onLogin();
    } catch (error) {
      console.error("Login failed:", error);
      setState((prev) => ({
        ...prev,
        error: "Login failed. Please try again.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [onLogin]);

  const handleGetStarted = useCallback(() => {
    if (isAuthenticated) {
      router.push("/overview");
    } else {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  const handleLearnMore = useCallback(() => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: "" }));
  }, []);

  return {
    t,
    isLoading: isLoading || state.isLoading,
    error: state.error,
    isAuthenticated,
    handleQuickLogin,
    handleGetStarted,
    handleLearnMore,
    clearError,
  };
};
