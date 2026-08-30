'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';

const AuthProvider = ({ children }) => {
  const { checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return children;
};

export default AuthProvider;
