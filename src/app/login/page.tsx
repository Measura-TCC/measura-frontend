'use client';

import { LoginView } from '@/presentation/views';
import { useAuth } from '@/core/hooks/useAuth';

const LoginPage = () => {
  const { login, isLoading } = useAuth();

  return <LoginView onLogin={login} isLoading={isLoading} />;
};

export default LoginPage; 