'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import ProjectList from '@/components/projects/ProjectList';
import Loader from '@/components/ui/Loader';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, authChecked } = useStore();

  useEffect(() => {
    if (authChecked && !user) router.push('/login');
  }, [user, authChecked]);

  if (authChecked && !user) return null;
  if (!user) return <Loader fullScreen />;

  return <ProjectList />;
}
