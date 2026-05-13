'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SentenceList, { Sentence } from '@/app/components/SentenceList';
import TextInput from '@/app/components/TextInput';
import { useAuth } from '@/app/context/AuthContext';

export default function PracticePage() {
  const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(null);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Listen and Type</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, <span className="font-semibold">{user.username}</span>!
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SentenceList onSelect={setSelectedSentence} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            {selectedSentence ? (
              <TextInput key={selectedSentence.id} sentence={selectedSentence} />
            ) : (
              <div className="text-gray-500 text-center p-8">
                Select a track to start listening
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
