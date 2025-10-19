import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/core/utils/constants';

type AuthResponse = { accessToken: string; refreshToken: string };

let isRefreshing = false;
let refreshPromise: Promise<AuthResponse> | null = null;

const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }
  return null;
};

const clearTokensAndRedirect = (navigate?: (path: string) => void): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }

    const currentPath = window.location.pathname.replace(/\/$/, '');
    if (currentPath !== '/login' && currentPath !== '/register') {
      if (navigate) {
        navigate('/login');
      } else {
        window.location.href = '/login';
      }
    }
  }
};

const refreshAccessToken = async (): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await authAxios.post('/auth/refresh', {}, {
      withCredentials: true,
    });

    const { accessToken, refreshToken } = response.data;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      } catch (error) {
        console.error('Failed to store new access token:', error);
      }
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.debug('Token refresh failed:', error);
    throw error;
  }
};

const measuraApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

measuraApi.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

measuraApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosError['config'] & { _retry?: boolean };

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                           originalRequest?.url?.includes('/auth/register') ||
                           originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          const authData = await refreshPromise;
          if (authData && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
          }
          return measuraApi(originalRequest);
        } catch (refreshError) {
          clearTokensAndRedirect();
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;
      refreshPromise = refreshAccessToken()
        .then((authData) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
          }
          return authData;
        })
        .catch((refreshError) => {
          clearTokensAndRedirect();
          throw refreshError;
        })
        .finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });

      try {
        await refreshPromise;
        return measuraApi(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { measuraApi }; 