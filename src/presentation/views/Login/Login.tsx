'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/presentation/components/primitives';
import Image from 'next/image';
import measuraLogo from '@/presentation/assets/images/measura-logo.png';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const LoginView = ({ onLogin, isLoading }: LoginViewProps) => {
  const { t } = useTranslation('login');
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(t('fillAllFields'));
      return;
    }

    try {
      await onLogin(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(t('invalidCredentials'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-default">
                  {t('email')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('enterYourEmail')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-default">
                  {t('password')}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('enterYourPassword')}
                  disabled={isLoading}
                />
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