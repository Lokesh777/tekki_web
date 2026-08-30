'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import Button from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      router.push('/projects');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full text-center p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Manager
          </h1>
          <p className="text-gray-600">
            Internal project management tool with real-time collaboration
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push('/login')}
          >
            Get Started
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Real-time task updates • Team collaboration</p>
        </div>
      </div>
    </div>
  );
}
