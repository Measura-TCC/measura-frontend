import useSWR, { mutate } from 'swr';
import { userService } from '@/core/services/userService';
import type { UseSWROptions } from '@/core/hooks/common/types';
import type { CreateUserData, UpdateUserData } from '@/core/services/userService';

// Individual data fetching hooks
export const useUsers = (options?: UseSWROptions) => {
  return useSWR('/users', userService.getAllUsers, options);
};

export const useUserProfile = (options?: UseSWROptions) => {
  return useSWR('/users/profile', userService.getProfile, options);
};

export const useUserById = (params: { id: string }, options?: UseSWROptions) => {
  return useSWR(
    params.id ? `/users/${params.id}` : null,
    () => userService.getUserById(params),
    options,
  );
};

export const useUserByEmail = (params: { email: string }, options?: UseSWROptions) => {
  return useSWR(
    params.email ? `/users/email/${params.email}` : null,
    () => userService.getUserByEmail(params),
    options,
  );
};

// Comprehensive user hook with all functionality
export const useUser = () => {
  // Actions
  const createUser = async (userData: CreateUserData) => {
    const newUser = await userService.createUser(userData);
    mutate('/users'); // Native SWR cache invalidation
    return newUser;
  };

  const updateUser = async (params: { id: string; data: UpdateUserData }) => {
    const updatedUser = await userService.updateUser(params);
    mutate('/users'); // Invalidate users list
    mutate(`/users/${params.id}`); // Invalidate specific user
    return updatedUser;
  };

  const deleteUser = async (params: { id: string }) => {
    await userService.deleteUser(params);
    mutate('/users'); // Refresh users list
    mutate(`/users/${params.id}`); // Remove specific user from cache
  };

  return {
    // Actions
    createUser,
    updateUser,
    deleteUser,
  };
}; 