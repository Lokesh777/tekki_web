'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import ProjectList from '@/components/projects/ProjectList';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, authChecked } = useStore();

  useEffect(() => {
    if (authChecked && !user) {
      router.push('/login');
    }
  }, [user, authChecked, router]);

  if (!user) {
    return null;
  }

  return <ProjectList />;
}
