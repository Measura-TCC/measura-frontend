import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/presentation/components/primitives';
import { loginSchema, type LoginFormData } from '@/core/schemas/auth';
import { useAuth } from '@/core/hooks/auth';
import { useErrorHandler } from '@/core/hooks/common/useErrorHandler';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const { t } = useTranslation('login');
  const { getFormattedError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      reset();
      onSuccess?.();
    } catch (error) {
      const formattedError = getFormattedError(error as Error);
      onError?.(formattedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-default">
          {t('email')}
        </label>
        <Input
          {...register('email')}
          id="email"
          type="email"
          placeholder={t('enterYourEmail')}
          disabled={isLoading}
        />
        {errors.email && (
          <span className="text-sm text-red-600">{errors.email.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-default">
          {t('password')}
        </label>
        <Input
          {...register('password')}
          id="password"
          type="password"
          placeholder={t('enterYourPassword')}
          disabled={isLoading}
        />
        {errors.password && (
          <span className="text-sm text-red-600">{errors.password.message}</span>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? t('signingIn') : t('signInButton')}
      </Button>
    </form>
  );
}; 