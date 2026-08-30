'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import TaskBoard from '@/components/tasks/TaskBoard';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { user, authChecked, token } = useStore();

  useEffect(() => {
    if (authChecked && !user) {
      router.push('/login');
    }
  }, [user, authChecked, router]);

  if (!user && authChecked) {
    return null;
  }

  if (token && !authChecked) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <TaskBoard />;
}
