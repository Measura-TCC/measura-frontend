import { z } from "zod";
import { registerSchema } from "@/core/schemas/auth";

export { UserRole } from "@/core/schemas/auth";
export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegistrationStatus = "idle" | "loading" | "success" | "error";

export interface RegistrationState {
  status: RegistrationStatus;
  error: string | null;
  isSubmitting: boolean;
}

export interface RegistrationSuccess {
  message: string;
  redirectTo?: string;
}

export interface RegistrationError {
  message: string;
  field?: keyof RegisterFormData;
}

export interface RoleOption {
  value: string;
  label: string;
  description: string;
}

export interface FormFieldError {
  field: keyof RegisterFormData;
  message: string;
}

export const REGISTER_PERMISSIONS = {
  CREATE_ACCOUNT: "create_account",
  SKIP_EMAIL_VERIFICATION: "skip_email_verification",
} as const;
