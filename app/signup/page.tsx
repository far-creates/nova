'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '@/app/components/SignupForm';
import { useAuth } from '@/app/context/AuthContext';

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to home
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return <SignupForm />;
}
