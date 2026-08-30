'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';
import Loader from '@/components/ui/Loader';

const AuthProvider = ({ children }) => {
  const { checkAuth, authChecked, token } = useStore();

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, []);

  if (token && !authChecked) {
    return <Loader fullScreen />;
  }

  return children;
};

export default AuthProvider;
