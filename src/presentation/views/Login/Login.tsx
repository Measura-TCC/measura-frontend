"use client";

import { useLogin } from "@/core/hooks/login/useLogin";
import { LoginHeader, LoginCard, LoginFooter } from "./components";

export const LoginView = () => {
  const loginHook = useLogin();

  const {
    loginForm,
    formErrors,
    isLoading,
    error,
    showEmailVerification,
    handleLogin,
    handleResendVerification,
    clearError,
  } = loginHook;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader />

        <LoginCard
          loginForm={loginForm}
          formErrors={formErrors}
          isLoading={isLoading}
          error={error}
          showEmailVerification={showEmailVerification}
          onLogin={handleLogin}
          onResendVerification={handleResendVerification}
          onClearError={clearError}
        />

        <LoginFooter />
      </div>
    </div>
  );
};
