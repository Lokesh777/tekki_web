'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import Loader from '@/components/ui/Loader';

const AuthProvider = ({ children }) => {
  const { checkAuth, authChecked } = useStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setChecking(false);
    };
    verify();
  }, []);

  if (checking || !authChecked) {
    return <Loader fullScreen />;
  }

  return children;
};

export default AuthProvider;
