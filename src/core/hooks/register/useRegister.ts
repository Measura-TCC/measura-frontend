import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { createRegisterSchema } from "@/core/schemas/auth";
import { useAuth } from "@/core/hooks/auth";
import { useErrorHandler } from "@/core/hooks/common/useErrorHandler";
import {
  RegisterFormData,
  UserRole,
  RoleOption,
  RegistrationState,
} from "@/core/types/register";

export type UseRegisterReturn = {
  registrationState: RegistrationState;
  roleOptions: RoleOption[];

  isRegistering: boolean;
  canRegister: boolean;

  registerForm: ReturnType<typeof useForm<RegisterFormData>>;
  formErrors: Record<string, { message?: string }>;

  register: (data: RegisterFormData) => Promise<void>;
  clearError: () => void;
  resetForm: () => void;

  formatErrorMessage: (error: Error) => string;
  validateForm: () => Promise<boolean>;
};

export const useRegister = (): UseRegisterReturn => {
  const { t } = useTranslation("register");
  const { t: tValidation } = useTranslation("validation");
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { getFormattedError } = useErrorHandler();

  const [registrationState, setRegistrationState] = useState<RegistrationState>(
    {
      status: "idle",
      error: null,
      isSubmitting: false,
    }
  );

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(t, tValidation)),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.PROJECT_MANAGER,
    },
  });

  const {
    formState: { errors: formErrors, isValid },
  } = registerForm;

  const roleOptions: RoleOption[] = [
    {
      value: UserRole.PROJECT_MANAGER,
      label: t("projectManager"),
      description: t("projectManagerDescription"),
    },
    {
      value: UserRole.MEASUREMENT_ANALYST,
      label: t("metricsAnalyst"),
      description: t("metricsAnalystDescription"),
    },
  ];

  const isRegistering = registrationState.isSubmitting;
  const canRegister = isValid && !isRegistering;

  const clearError = () => {
    setRegistrationState((prev) => ({
      ...prev,
      error: null,
      status: prev.status === "error" ? "idle" : prev.status,
    }));
  };

  const resetForm = () => {
    registerForm.reset();
    setRegistrationState({
      status: "idle",
      error: null,
      isSubmitting: false,
    });
  };

  const formatErrorMessage = (error: Error) => {
    return getFormattedError(error);
  };

  const validateForm = async () => {
    return await registerForm.trigger();
  };

  const register = async (data: RegisterFormData) => {
    setRegistrationState({
      status: "loading",
      error: null,
      isSubmitting: true,
    });

    try {
      await registerUser(data);

      setRegistrationState({
        status: "success",
        error: null,
        isSubmitting: false,
      });

      resetForm();
      router.push("/overview");
    } catch (error) {
      const errorMessage = formatErrorMessage(error as Error);

      setRegistrationState({
        status: "error",
        error: errorMessage,
        isSubmitting: false,
      });
    }
  };

  return {
    registrationState,
    roleOptions,

    isRegistering,
    canRegister,

    registerForm,
    formErrors,

    register,
    clearError,
    resetForm,

    formatErrorMessage,
    validateForm,
  };
};
