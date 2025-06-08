'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/primitives';
import { LoginForm } from './components/LoginForm/LoginForm';
import measuraLogo from '@/presentation/assets/images/measura-logo.png';

export const LoginView = () => {
  const { t } = useTranslation('login');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLoginSuccess = () => {
    setError('');
    router.push('/dashboard');
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
    setError(error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image src={measuraLogo} alt="Measura" width={125} height={125} />
          </Link>
          <p className="text-muted text-lg">{t('subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
                {error}
              </div>
            )}

            <LoginForm 
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary">
                {t('dontHaveAccount')}{' '}
                <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
                  {t('signUp')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted">
            {t('demoCredentials')}
          </p>
        </div>
      </div>
    </div>
  );
}; 