// Export common hooks
export type { ApiError, ApiResponse } from "./common/types";
export { useErrorHandler } from "./common/useErrorHandler";

export { useAuth, useAuthStore } from "@/core/hooks/auth/useAuth";

export {
  useUser,
  useUsers,
  useUserProfile,
  useUserById,
  useUserByEmail,
} from "./users";
