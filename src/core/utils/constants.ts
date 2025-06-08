// Environment Variables Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const SWAGGER_URL = process.env.NEXT_PUBLIC_SWAGGER_URL || 'http://localhost:8080/api';
export const OPENAPI_URL = process.env.NEXT_PUBLIC_OPENAPI_URL || 'http://localhost:8080/api-json';

// API Configuration Constants
export const API_TIMEOUT = 30000;
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const; 