'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (user) router.push('/projects');
  }, [user]);

  if (user) return null;
  return <LoginForm />;
}
