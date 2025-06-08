'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/primitives';
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import measuraLogo from '@/presentation/assets/images/measura-logo.png';

export const RegisterView = () => {
  const { t } = useTranslation('register');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegisterSuccess = () => {
    setError('');
    router.push('/dashboard');
  };

  const handleRegisterError = (error: string) => {
    console.error('Registration error:', error);
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

            <RegisterForm 
              onSuccess={handleRegisterSuccess}
              onError={handleRegisterError}
            />

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary">
                {t('alreadyHaveAccount')}{' '}
                <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                  {t('signIn')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted">
            {t('termsAgreement')}
          </p>
        </div>
      </div>
    </div>
  );
}; 