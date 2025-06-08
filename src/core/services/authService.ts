import { AxiosResponse, AxiosError } from "axios";
import { measuraApi } from "./measuraApi";
import { omit } from "@/core/utils";
import type {
  RegisterFormData,
  LoginFormData,
  PasswordResetRequestData,
  PasswordResetData,
  FirebaseLoginData,
} from "@/core/schemas/auth";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MessageResponse {
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

const handleApiCall = async <T>(
  apiCall: Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await apiCall;
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const apiError: ApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
        status: error.response?.status,
        data: error.response?.data,
      };

      console.error("API Error:", apiError);
    }

    throw error; // Re-throw the original error to maintain axios error structure
  }
};

export const authService = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const registerData = omit(data, ["confirmPassword"]);
    return handleApiCall<AuthResponse>(
      measuraApi.post("/auth/register", registerData)
    );
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    return handleApiCall<AuthResponse>(measuraApi.post("/auth/login", data));
  },

  firebaseLogin: async (data: FirebaseLoginData): Promise<AuthResponse> => {
    return handleApiCall<AuthResponse>(
      measuraApi.post("/auth/firebase-login", data)
    );
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<{ accessToken: string }> => {
    return handleApiCall<{ accessToken: string }>(
      measuraApi.post("/auth/refresh", { refreshToken })
    );
  },

  requestPasswordReset: async (
    data: PasswordResetRequestData
  ): Promise<MessageResponse> => {
    return handleApiCall<MessageResponse>(
      measuraApi.post("/auth/password-reset-request", data)
    );
  },

  resetPassword: async (data: PasswordResetData): Promise<MessageResponse> => {
    return handleApiCall<MessageResponse>(
      measuraApi.post("/auth/password-reset", data)
    );
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return handleApiCall<{ message: string }>(
      measuraApi.post("/auth/verify-email", { token })
    );
  },

  logout: async (): Promise<void> => {
    return handleApiCall<void>(measuraApi.post("/auth/logout"));
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return handleApiCall<{ message: string }>(
      measuraApi.post("/auth/forgot-password", { email })
    );
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    return handleApiCall<{ message: string }>(
      measuraApi.post("/auth/resend-verification", { email })
    );
  },
};
