'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useRequireAuth() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // undefined = still loading, null = definitively not logged in
    if (currentUser === null) router.replace('/login');
  }, [currentUser, router]);

  return currentUser;
}
