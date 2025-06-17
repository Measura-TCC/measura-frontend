import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/core/utils/constants";
import { authService } from "@/core/services/authService";
import type { AuthResponse } from "@/core/services/authService";
import type {
  LoginFormData,
  RegisterFormData,
  PasswordResetRequestData,
  PasswordResetData,
} from "@/core/schemas/auth";

interface AuthStore {
  user: AuthResponse["user"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (authData: AuthResponse) => void;
  logout: () => void;
  updateUser: (userData: Partial<AuthResponse["user"]>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (authData) => {
        try {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
        } catch (error) {
          console.debug("Failed to save access token to localStorage:", error);
        }

        set({
          user: authData.user,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        try {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        } catch (error) {
          console.debug(
            "Failed to remove access token from localStorage:",
            error
          );
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  const { setAuth, logout: clearAuth } = store;

  const mockUser = {
    id: "demo-user",
    username: "demo-user",
    email: "demo@measura.com",
    role: "measurement-analyst",
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const user = store.user || mockUser;
  const isAuthenticated = store.isAuthenticated;

  const login = async (loginData: LoginFormData) => {
    const response = await authService.login(loginData);
    setAuth(response);
    return response;
  };

  const register = async (registerData: RegisterFormData) => {
    const response = await authService.register(registerData);

    if (!response?.user || !response?.accessToken) {
      const error = new Error("Invalid registration response");
      throw error;
    }

    setAuth(response);
    return response;
  };

  const logout = () => {
    clearAuth();

    authService.logout().catch((error) => {
      console.debug("Logout service call failed:", error);
    });

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const requestPasswordReset = async (data: PasswordResetRequestData) => {
    const response = await authService.requestPasswordReset(data);
    return response;
  };

  const resetPassword = async (data: PasswordResetData) => {
    const response = await authService.resetPassword(data);
    return response;
  };

  const verifyEmail = async (token: string) => {
    const response = await authService.verifyEmail(token);
    return response;
  };

  const resendVerification = async (email: string) => {
    const response = await authService.resendVerification(email);
    return response;
  };

  return {
    ...store,
    user,
    isAuthenticated,

    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerification,
  };
};
