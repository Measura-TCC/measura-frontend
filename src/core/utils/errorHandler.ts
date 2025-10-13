import { AxiosError } from 'axios';
import { STORAGE_KEYS } from './constants';

type ValidationError = {
  field: string;
  message: string;
};

type NavigationCallback = (path: string) => void;

interface ErrorData {
  message?: string;
  details?: string;
  validationErrors?: ValidationError[];
  errorType?: string;
}

export const handleApiError = (
  error: AxiosError<ErrorData>,
  navigate?: NavigationCallback
): { message: string; type: 'error' | 'validation' | 'network' } => {
  const data = error.response?.data;
  const message = data?.message;
  const details = data?.details;
  const validationErrors = data?.validationErrors;

  if (error.response?.status === 401) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : '';
    const isOnAuthPage = currentPath === '/login' || currentPath === '/register';

    if (isOnAuthPage) {
      return { message: 'Unauthorized', type: 'error' };
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (storageError) {
      console.warn('Failed to clear tokens:', storageError);
    }

    if (navigate) {
      navigate('/login');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    return { message: 'Unauthorized', type: 'error' };
  }

  if (error.response?.status === 422 || error.response?.status === 400) {
    if (validationErrors && Array.isArray(validationErrors)) {
      const firstError = validationErrors[0];
      if (firstError?.message) {
        return { message: firstError.message, type: 'validation' };
      }
    }
    
    if (message) {
      return { message, type: 'validation' };
    }
    
    if (details) {
      return { message: details, type: 'validation' };
    }
  }

  if (error.response?.status && error.response.status >= 500) {
    const serverMessage = message || 'Erro interno do servidor. Tente novamente.';
    return { message: serverMessage, type: 'error' };
  }

  if (error.response && message) {
    return { message, type: 'error' };
  }

  if (!error.response) {
    const networkMessage = 'Erro de conexão. Verifique sua internet.';
    return { message: networkMessage, type: 'network' };
  }

  const genericMessage = 'Ocorreu um erro inesperado.';
  return { message: genericMessage, type: 'error' };
};

export const getErrorType = (error: AxiosError<ErrorData>): 'error' | 'validation' | 'network' => {
  const errorType = error.response?.data?.errorType;
  
  if (errorType === 'VALIDATION_ERROR') return 'validation';
  if (errorType === 'BUSINESS_ERROR') return 'error';
  if (errorType === 'SYSTEM_ERROR') return 'error';
  
  if (!error.response) {
    return 'network';
  }
  
  return 'error';
}; 