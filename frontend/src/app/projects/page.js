'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import ProjectList from '@/components/projects/ProjectList';

export default function ProjectsPage() {
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

  return <ProjectList />;
}
