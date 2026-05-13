'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface TrackPreview {
  id: string;
  title: string;
  filePath: string;
  difficulty: string;
  createdAt: string;
}

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tracks, setTracks] = useState<TrackPreview[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [typedPreview, setTypedPreview] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const res = await fetch('/api/tracks');
        if (!res.ok) return;
        const data = await res.json();
        setTracks(data || []);
      } catch {
        setTracks([]);
      }
    };

    loadTracks();
  }, []);

  const boundedTrackIndex =
    tracks.length === 0 ? 0 : Math.min(currentTrackIndex, tracks.length - 1);
  const currentTrack = tracks[boundedTrackIndex] ?? null;

  const practiceTiles = useMemo(() => {
    const labels = ['A1', 'B1', 'C1', 'A2', 'B2', 'C2'];
    return labels.map((label, idx) => ({
      label,
      track: tracks[idx] ?? null,
    }));
  }, [tracks]);

  const selectRandomNextTrack = () => {
    if (tracks.length <= 1) return;
    let next = boundedTrackIndex;
    while (next === boundedTrackIndex) {
      next = Math.floor(Math.random() * tracks.length);
    }
    setCurrentTrackIndex(next);
  };

  const handleSubmitRandom = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!currentTrack || !typedPreview.trim()) return;

    setSubmitting(true);
    setSubmitMessage('');
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          audioTrackId: currentTrack.id,
          userText: typedPreview,
          saveAttempt: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit attempt');
      }

      setTypedPreview('');
      setSubmitMessage('Saved. Next random track loaded.');
      selectRandomNextTrack();
    } catch (error) {
      console.error('Submit failed:', error);
      setSubmitMessage('Could not submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Listening App</h1>
            <p className="text-slate-600 mt-1 text-lg">Train your ears</p>
          </div>

          <div className="flex gap-3">
            {loading ? null : user ? (
              <Link href="/profile" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                Profile
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-full md:w-auto">
              {currentTrack ? (
                <audio key={currentTrack.id} controls className="w-full md:w-72">
                  <source src={currentTrack.filePath} />
                  Your browser does not support audio playback.
                </audio>
              ) : (
                <div className="w-full md:w-72 h-12 rounded-lg border border-slate-300 text-sm text-slate-500 flex items-center justify-center">
                  No preview track yet
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-1">Listen, then type what you hear:</p>
              <input
                value={typedPreview}
                onChange={(e) => setTypedPreview(e.target.value)}
                placeholder="Type what you heard..."
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmitRandom}
              disabled={submitting || !typedPreview.trim() || !currentTrack}
              className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium text-center hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {currentTrack ? (
            <div className="mt-4 text-sm text-slate-600">
              Random track: <span className="font-medium text-slate-800">{currentTrack.title}</span>
            </div>
          ) : null}
          {submitMessage ? <p className="mt-2 text-sm text-blue-700">{submitMessage}</p> : null}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div className="grid grid-cols-3 gap-4">
            {practiceTiles.map((item, i) => (
              <button
                key={`${item.label}-${i}`}
                type="button"
                onClick={() => {
                  if (!user) {
                    router.push('/login');
                    return;
                  }
                  if (!item.track) return;
                  const idx = tracks.findIndex((t) => t.id === item.track?.id);
                  if (idx >= 0) {
                    setCurrentTrackIndex(idx);
                    setTypedPreview('');
                    setSubmitMessage(`Selected ${item.label}: ${item.track.title}`);
                  }
                }}
                className="h-28 rounded-xl border border-slate-300 bg-white shadow-sm hover:shadow-md transition p-3 flex flex-col items-center justify-center text-slate-700"
              >
                <span className="text-2xl font-semibold">{item.label}</span>
                <span className="text-xs text-slate-500 mt-1 text-center line-clamp-1">
                  {item.track ? item.track.title : 'Coming soon'}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="h-24 rounded-xl border border-slate-300 bg-white shadow-sm px-4 flex items-center text-lg font-medium text-slate-700">
              Browse by topic
            </div>
            <div className="h-64 rounded-xl border border-slate-300 bg-white shadow-sm px-4 py-4 flex items-center justify-center text-2xl font-semibold text-slate-700 text-center">
              Test yourself
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
