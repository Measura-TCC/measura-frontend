'use client';

import { HomeView } from '@/presentation/views';
import { useAuth } from '@/core/hooks/useAuth';

const Home = () => {
  const { isAuthenticated, isLoading, login} = useAuth();

  return (
    <HomeView 
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      onLogin={() => login('demo@measura.com', 'password')}
    />
  );
};

export default Home; 