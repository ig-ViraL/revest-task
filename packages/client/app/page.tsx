'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem('revest_current_user');
    if (user && user !== 'null') router.replace('/home');
    else router.replace('/login');
  }, [router]);
  return null;
}
