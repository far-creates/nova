'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import UserStatsComponent, { UserStats } from '@/app/components/UserStatsComponent';
import AttemptsHistory, { AttemptWithSentence } from '@/app/components/AttemptsHistory';
import ActivityHeatmap from '@/app/components/ActivityHeatmap';

interface DailySummary {
  date: string;
  attemptsCount: number;
  averageAccuracy: number;
  bestAccuracy: number;
  worstAccuracy: number;
}

interface SentenceOption {
  sentenceId: string;
  sentenceText: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [attempts, setAttempts] = useState<AttemptWithSentence[]>([]);
  const [attemptsTotal, setAttemptsTotal] = useState(0);
  const [sentenceOptions, setSentenceOptions] = useState<SentenceOption[]>([]);

  const [view, setView] = useState<'summary' | 'attempts'>('summary');
  const [dateFilter, setDateFilter] = useState('');
  const [sentenceFilter, setSentenceFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [offset, setOffset] = useState(0);

  const pageSize = 20;
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (view === 'attempts') {
          if (dateFilter) params.set('date', dateFilter);
          if (sentenceFilter) params.set('sentenceId', sentenceFilter);
          if (searchFilter) params.set('search', searchFilter);
        }
        params.set('limit', String(pageSize));
        params.set('offset', String(offset));

        const response = await fetch(`/api/profile?${params.toString()}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setStats(data.stats);
        setDailySummaries(data.dailySummaries || []);
        setAttempts(data.attempts || []);
        setAttemptsTotal(data.attemptsTotal || 0);
        setSentenceOptions(data.sentenceOptions || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [user, view, dateFilter, sentenceFilter, searchFilter, offset]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentPage = Math.floor(offset / pageSize) + 1;
  const totalPages = Math.max(1, Math.ceil(attemptsTotal / pageSize));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <Link href="/practice" className="text-blue-600 hover:text-blue-800 font-medium">
            Back to App
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-600 mt-2">{user.email}</p>
              <p className="text-gray-500 text-sm mt-2">
                Member since{' '}
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium">
                User {user.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Statistics</h3>
          {stats && <UserStatsComponent stats={stats} />}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Practice Insights</h3>
            <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
              <button
                onClick={() => setView('summary')}
                className={`px-4 py-2 text-sm font-medium ${view === 'summary' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              >
                Daily Summary
              </button>
              <button
                onClick={() => setView('attempts')}
                className={`px-4 py-2 text-sm font-medium ${view === 'attempts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              >
                Detailed Attempts
              </button>
            </div>
          </div>

          {view === 'summary' ? (
            <>
              <ActivityHeatmap dailySummaries={dailySummaries} />
              {dailySummaries.length === 0 && (
                <p className="text-gray-600 py-4">No daily activity data yet.</p>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setOffset(0);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <select
                  value={sentenceFilter}
                  onChange={(e) => {
                    setSentenceFilter(e.target.value);
                    setOffset(0);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All sentences</option>
                  {sentenceOptions.map((item) => (
                    <option key={item.sentenceId} value={item.sentenceId}>
                      {item.sentenceText.length > 60 ? `${item.sentenceText.slice(0, 60)}...` : item.sentenceText}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => {
                    setSearchFilter(e.target.value);
                    setOffset(0);
                  }}
                  placeholder="Search sentence or your text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <AttemptsHistory attempts={attempts} />
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} ({attemptsTotal} attempts)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOffset(Math.max(0, offset - pageSize))}
                    disabled={offset === 0}
                    className="px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setOffset(offset + pageSize)}
                    disabled={offset + pageSize >= attemptsTotal}
                    className="px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
