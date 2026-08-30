'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      router.push('/projects');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return <RegisterForm />;
}
