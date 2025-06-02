'use client';

import { RegisterView } from '@/presentation/views';
import { useAuth } from '@/core/hooks/useAuth';

const RegisterPage = () => {
  const { register, isLoading } = useAuth();

  return <RegisterView onRegister={register} isLoading={isLoading} />;
};

export default RegisterPage; 