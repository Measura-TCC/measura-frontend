'use client';

import { DashboardView } from '@/presentation/views';
import { useAuth } from '@/core/hooks/auth/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();

  // Map the auth user data to match what DashboardView expects
  const dashboardUser = user 
    ? { 
        name: user.username, // Map username to name
        role: user.role 
      }
    : { 
        name: 'Guest', 
        role: 'user' 
      };

  return <DashboardView user={dashboardUser} />;
};

export default DashboardPage;