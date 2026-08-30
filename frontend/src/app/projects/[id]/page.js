'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import TaskBoard from '@/components/tasks/TaskBoard';
import Loader from '@/components/ui/Loader';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { user, authChecked } = useStore();

  useEffect(() => {
    if (authChecked && !user) router.push('/login');
  }, [user, authChecked]);

  if (authChecked && !user) return null;
  if (!user) return <Loader fullScreen />;

  return <TaskBoard />;
}
