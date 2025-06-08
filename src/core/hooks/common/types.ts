import type { SWRConfiguration } from "swr";

export interface UseSWROptions extends SWRConfiguration {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  revalidateOnMount?: boolean;
  revalidateIfStale?: boolean;
  refreshInterval?: number;
  errorRetryCount?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
  details?: string;
}

// Common response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
