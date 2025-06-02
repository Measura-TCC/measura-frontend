'use client';

import { DashboardView } from '@/presentation/views';
import { useAuth } from '@/core/hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();

  return <DashboardView user={user || { name: 'Guest', role: 'user' }} />;
};

export default DashboardPage; 