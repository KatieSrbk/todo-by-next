'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/Auth/AuthForm';
import { checkAuth } from '@/services/authApi';

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAlreadyAuth = async () => {
      const userData = await checkAuth();
      if (userData) {
        router.push('/');
      }
    };

    checkAlreadyAuth();
  }, [router]);

  const handleAuthSuccess = () => {
    router.push('/');
  };

  return <AuthForm onSuccess={handleAuthSuccess} />;
};

export default LoginPage;