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
    .min(8, t("validation.password.minLength"))
    .max(128, t("validation.password.maxLength"))
    .regex(/[A-Z]/, t("validation.password.uppercase"))
    .regex(/[a-z]/, t("validation.password.lowercase"))
    .regex(/\d/, t("validation.password.number"))
    .regex(/[@$!%*?&]/, t("validation.password.special"));

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      username: z
        .string()
        .min(3, t("validation.username.minLength"))
        .max(100, t("validation.username.maxLength"))
        .regex(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, t("validation.username.pattern")),
      email: z.string().email(t("validation.email.invalid")),
      password: createPasswordSchema(t),
      role: z.enum([UserRole.PROJECT_MANAGER, UserRole.MEASUREMENT_ANALYST]),
      confirmPassword: z
        .string()
        .min(1, t("validation.confirmPassword.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirmPassword.mismatch"),
      path: ["confirmPassword"],
    });

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    usernameOrEmail: z.string().min(1, t("login:errors.emailRequired")),
    password: z.string().min(1, t("login:errors.passwordRequired")),
  });

export const createPasswordResetRequestSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("validation.email.invalid")),
  });

export const createPasswordResetSchema = (t: (key: string) => string) =>
  z
    .object({
      token: z.string().min(1, t("validation.common.required")),
      password: createPasswordSchema(t),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirmPassword.mismatch"),
      path: ["confirmPassword"],
    });

export const createFirebaseLoginSchema = (t: (key: string) => string) =>
  z.object({
    idToken: z.string().min(1, t("validation.common.required")),
  });

export const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("validation.email.invalid")),
  });

// Create default schemas with dummy translation function for types
const dummyT = (key: string) => key;
export const registerSchema = createRegisterSchema(dummyT);
export const loginSchema = createLoginSchema(dummyT);
export const passwordResetRequestSchema = createPasswordResetRequestSchema(dummyT);
export const passwordResetSchema = createPasswordResetSchema(dummyT);
export const firebaseLoginSchema = createFirebaseLoginSchema(dummyT);
export const forgotPasswordSchema = createForgotPasswordSchema(dummyT);

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PasswordResetRequestData = z.infer<
  typeof passwordResetRequestSchema
>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type FirebaseLoginData = z.infer<typeof firebaseLoginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
