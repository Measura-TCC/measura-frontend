import { z } from "zod";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  PROJECT_MANAGER = "project-manager",
  MEASUREMENT_ANALYST = "measurement-analyst",
}

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/\d/, "A senha deve conter pelo menos um número")
  .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial");

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: passwordSchema,
    role: z.enum([UserRole.PROJECT_MANAGER, UserRole.MEASUREMENT_ANALYST]),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const passwordResetSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

export const firebaseLoginSchema = z.object({
  idToken: z.string().min(1, "Firebase ID token is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PasswordResetRequestData = z.infer<
  typeof passwordResetRequestSchema
>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type FirebaseLoginData = z.infer<typeof firebaseLoginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
