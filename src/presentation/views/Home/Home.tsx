'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/primitives';

interface HomeViewProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogin: () => void;
}

export const HomeView = ({ isAuthenticated, isLoading, onLogin }: HomeViewProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleQuickLogin = async () => {
    try {
      onLogin();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted">{t('loading')}</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Measura</h1>
          <p className="text-muted text-lg">{t('appSubtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('welcome')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-secondary text-sm">
              {t('appDescription')}
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleQuickLogin}
                className="w-full"
                size="lg"
              >
                {t('quickDemoLogin')}
              </Button>
              
              <div className="text-center">
                <span className="text-xs text-muted">
                  {t('demoDescription')}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-default mb-2">{t('keyFeatures')}</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>{t('feature1')}</li>
                <li>{t('feature2')}</li>
                <li>{t('feature3')}</li>
                <li>{t('feature4')}</li>
                <li>{t('feature5')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-muted">
          <p>{t('footerText')}</p>
          <p className="mt-1">{t('techStack')}</p>
        </footer>
      </div>
    </div>
  );
}; 