'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/presentation/components/primitives';
import Image from 'next/image';
import measuraLogo from '@/presentation/assets/images/measura-logo.png';

interface RegisterViewProps {
  onRegister: (name: string, email: string, password: string, role: string) => Promise<void>;
  isLoading: boolean;
}

export const RegisterView = ({ onRegister, isLoading }: RegisterViewProps) => {
  const { t } = useTranslation('register');
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'manager', // default to project manager
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError(t('fillAllFields'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    try {
      await onRegister(formData.username, formData.email, formData.password, formData.role);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(t('registrationFailed'));
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
                <label htmlFor="username" className="text-sm font-medium text-default">
                  {t('username')}
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t('enterFullName')}
                  disabled={isLoading}
                />
              </div>

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
                  placeholder={t('enterEmail')}
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
                  placeholder={t('createPassword')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-default">
                  {t('confirmPassword')}
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('confirmYourPassword')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t('role')}
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      id="manager"
                      name="role"
                      type="radio"
                      value="manager"
                      checked={formData.role === 'manager'}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="manager" className="ml-2 text-sm text-default">
                      {t('projectManager')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="analyst"
                      name="role"
                      type="radio"
                      value="analyst"
                      checked={formData.role === 'analyst'}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="analyst" className="ml-2 text-sm text-default">
                      {t('metricsAnalyst')}
                    </label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? t('creatingAccount') : t('createAccountButton')}
              </Button>
            </form>

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