'use client';

import { useRouter } from 'next/navigation';
import { HomeView } from '@/presentation/views';
import { useAuth } from '@/core/hooks/auth/useAuth';

const Home = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <HomeView 
      isAuthenticated={isAuthenticated}
      isLoading={false}
      onLogin={() => router.push('/login')}
    />
  );
};

export default Home; 