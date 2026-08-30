'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import TaskBoard from '@/components/tasks/TaskBoard';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <TaskBoard />;
}
