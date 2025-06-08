// Export common hooks
export type { ApiError, ApiResponse } from './common/types';
export { useErrorHandler } from './common/useErrorHandler';

// Export authentication hooks
export { useAuth, useAuthStore } from './auth';

// Export user management hooks
export { 
  useUser,
  useUsers,
  useUserProfile,
  useUserById,
  useUserByEmail,
} from './users'; 