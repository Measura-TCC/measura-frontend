import { z } from "zod";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  PROJECT_MANAGER = "project-manager",
  MEASUREMENT_ANALYST = "measurement-analyst",
}

export const createPasswordSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(8, t("validation.passwordMinLength"))
    .regex(/[A-Z]/, t("validation.passwordUppercase"))
    .regex(/[a-z]/, t("validation.passwordLowercase"))
    .regex(/\d/, t("validation.passwordNumber"))
    .regex(/[@$!%*?&]/, t("validation.passwordSpecial"));

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      username: z.string().min(3, t("validation.usernameMinLength")),
      email: z.string().email(t("validation.emailInvalid")),
      password: createPasswordSchema(t),
      role: z.enum([UserRole.PROJECT_MANAGER, UserRole.MEASUREMENT_ANALYST]),
      confirmPassword: z
        .string()
        .min(1, t("validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsDontMatch"),
      path: ["confirmPassword"],
    });

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const createPasswordResetSchema = (t: (key: string) => string) =>
  z
    .object({
      token: z.string().min(1, "Token é obrigatório"),
      password: createPasswordSchema(t),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsDontMatch"),
      path: ["confirmPassword"],
    });

export const firebaseLoginSchema = z.object({
  idToken: z.string().min(1, "Firebase ID token is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Create default schemas with dummy translation function for types
const dummyT = (key: string) => key;
export const registerSchema = createRegisterSchema(dummyT);
export const passwordResetSchema = createPasswordResetSchema(dummyT);

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PasswordResetRequestData = z.infer<
  typeof passwordResetRequestSchema
>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type FirebaseLoginData = z.infer<typeof firebaseLoginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
