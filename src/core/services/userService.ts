import { measuraApi } from './measuraApi';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  isEmailVerified: boolean;
  hasCompletedOnboarding?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: string;
  provider?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  hasCompletedOnboarding?: boolean;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await measuraApi.get('/users/profile');
    return response.data;
  },

  getAllUsers: async (): Promise<UserProfile[]> => {
    const response = await measuraApi.get('/users');
    return response.data;
  },

  getUserById: async (params: { id: string }): Promise<UserProfile> => {
    const response = await measuraApi.get(`/users/${params.id}`);
    return response.data;
  },

  getUserByEmail: async (params: { email: string }): Promise<UserProfile> => {
    const response = await measuraApi.get(`/users/email/${params.email}`);
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<UserProfile> => {
    const response = await measuraApi.post('/users', data);
    return response.data;
  },

  updateUser: async (params: {
    id: string;
    data: UpdateUserData;
  }): Promise<UserProfile> => {
    const response = await measuraApi.put(`/users/${params.id}`, params.data);
    return response.data;
  },

  deleteUser: async (params: { id: string }): Promise<void> => {
    await measuraApi.delete(`/users/${params.id}`);
  },

  updateMyProfile: async (data: UpdateUserData): Promise<UserProfile> => {
    const response = await measuraApi.patch('/users/me', data);
    return response.data;
  },
}; 