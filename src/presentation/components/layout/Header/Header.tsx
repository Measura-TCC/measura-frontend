import { useTheme } from '@/core/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/hooks/auth';
import { Button } from '@/presentation/components/primitives';
import { LanguageSwitcher } from '@/presentation/components/common/LanguageSwitcher/LanguageSwitcher';
import { UserIcon, SunIcon, MoonIcon, LogoutIcon } from '@/presentation/assets/icons';
import Image from 'next/image';
import measuraLogo from '@/presentation/assets/images/measura-logo.png';
import measura from '@/presentation/assets/icons/measura.png';

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image 
              src={measura} 
              alt="Measura" 
              width={25} 
              height={25} 
              className="lg:hidden ml-16"

            />
            <Image 
              src={measuraLogo} 
              alt="Measura" 
              width={125} 
              height={125} 
              className="hidden lg:block"
            />
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
              title={t('themeToggle')}
            >
              {theme === 'dark' ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </Button>
{/* 
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-9 h-9 p-0"
              title={t('notifications')}
            >
              <BellIcon className="w-4 h-4" />
            </Button> */}

            <div className="flex items-center space-x-2 border-l border-border pl-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-muted" />
                <span className="text-sm font-medium text-default">
                  {user?.username || t('user')}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-9 h-9 p-0"
                title={t('logout')}
              >
                <LogoutIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 