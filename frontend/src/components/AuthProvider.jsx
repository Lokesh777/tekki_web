'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import Loader from '@/components/ui/Loader';

const AuthProvider = ({ children }) => {
  const { checkAuth } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeout;

    const verify = async () => {
      await checkAuth();
      setReady(true);
    };

    verify();

    timeout = setTimeout(() => {
      setReady(true);
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  if (!ready) {
    return <Loader fullScreen />;
  }

  return children;
};

export default AuthProvider;
