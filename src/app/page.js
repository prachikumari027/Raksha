'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import { useDoctor } from '@/context/doctorContext';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const { doctor } = useDoctor();

  useEffect(() => {
    // Check if user or doctor is logged in from context
    if (user) {
      router.push('/user/home');
    } else if (doctor) {
      router.push('/doctor/home');
    } else {
      // Otherwise redirect to login
      router.push('/login');
    }
  }, [user, doctor, router]);

  return null;
}
