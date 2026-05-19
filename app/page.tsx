'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { fetchLegacyTracks, submitLegacyAttempt } from '@/packages/api/src/client';
import type { LegacyAttemptResponse } from '@/packages/api/src/attempts';
import type { LegacyTrackPayload } from '@/packages/api/src/tracks';

import AppHeader from '@/app/components/blocks/AppHeader';
import HeroSection from '@/app/components/landing/sections/HeroSection';
import ValueBanner from '@/app/components/landing/sections/ValueBanner';
import FeatureGrid from '@/app/components/landing/sections/FeatureGrid';
import AudienceGrid from '@/app/components/landing/sections/AudienceGrid';
import ImpactSection from '@/app/components/landing/sections/ImpactSection';
import ClosingCTA from '@/app/components/landing/sections/ClosingCTA';
import LandingPracticeSection from '@/app/components/modules/LandingPracticeSection';

type TrackPreview = LegacyTrackPayload;

const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LandingPage() {
  const { user, loading } = useAuth();

  const [tracks, setTracks] = useState<TrackPreview[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [selectedLevel, setSelectedLevel] =
    useState('B1');

  const [typedPreview, setTypedPreview] =
    useState('');

  const [submitMessage, setSubmitMessage] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);
  const [correction, setCorrection] =
    useState<LegacyAttemptResponse | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const data = await fetchLegacyTracks();
        setTracks(data);
      } catch {
        setTracks([]);
      }
    };

    loadTracks();
  }, []);

  const tracksByLevel = useMemo(() => {
    const groups = new Map<string, TrackPreview[]>();

    tracks.forEach((track) => {
      const key = String(
        track.difficulty || ''
      ).toUpperCase();

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key)?.push(track);
    });

    return groups;
  }, [tracks]);

  const currentTrack =
    tracks.length === 0
      ? null
      : tracks[
          Math.min(
            currentTrackIndex,
            tracks.length - 1
          )
        ] ?? null;

  const selectRandomNextTrack = () => {
    if (tracks.length <= 1) {
      return;
    }

    const next = Math.floor(
      Math.random() * tracks.length
    );

    setCurrentTrackIndex(next);

    const nextTrack = tracks[next];

    const nextLevel = String(
      nextTrack?.difficulty || ''
    ).toUpperCase();

    if (levelOrder.includes(nextLevel)) {
      setSelectedLevel(nextLevel);
    }
  };

  const selectLevel = (level: string) => {
    setSelectedLevel(level);

    const levelTrack =
      tracksByLevel.get(level)?.[0];

    const fallbackTrack = tracks[0];

    const nextTrack =
      levelTrack ?? fallbackTrack;

    if (!nextTrack) {
      return;
    }

    const nextIndex = tracks.findIndex(
      (track) => track.id === nextTrack.id
    );

    if (nextIndex >= 0) {
      setCurrentTrackIndex(nextIndex);

      setTypedPreview('');
      setCorrection(null);

      setSubmitMessage(
        `سطح ${level} انتخاب شد`
      );
    }
  };

  const handleShuffleTrack = () => {
    if (!tracks.length) {
      return;
    }

    selectRandomNextTrack();

    setTypedPreview('');
    setCorrection(null);

    setSubmitMessage(
      'یک تمرین تازه انتخاب شد'
    );
  };

  const handleSubmitRandom = async () => {
    if (
      !currentTrack ||
      !typedPreview.trim()
    ) {
      return;
    }

    const shouldSaveAttempt = !!user;

    setSubmitting(true);

    setSubmitMessage('');
    setCorrection(null);

    try {
      const result = await submitLegacyAttempt(
        {
          audioTrackId: currentTrack.id,
          userText: typedPreview,
          saveAttempt:
            shouldSaveAttempt,
        },
        {
          credentials: shouldSaveAttempt
            ? 'include'
            : 'same-origin',
        }
      );

      setCorrection(result);

      if (shouldSaveAttempt) {
        setSubmitMessage(
          'پاسخت ذخیره شد. تمرین بعدی آماده است.'
        );
      } else {
        setSubmitMessage(
          'تمرین انجام شد. برای ذخیره تاریخچه وارد حساب شوید.'
        );
      }
    } catch (error) {
      console.error(
        'Submit failed:',
        error
      );

      setSubmitMessage(
        'ارسال انجام نشد. لطفاً دوباره تلاش کن.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf2] text-[#2a402d]">
      <AppHeader
        isAuthenticated={Boolean(user)}
        loading={loading}
      />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-[#dfebcf]/40 blur-3xl" />

          <div className="absolute right-0 top-96 h-80 w-80 rounded-full bg-[#f3ddb1]/35 blur-3xl" />
        </div>
        <HeroSection />

        <LandingPracticeSection
          currentTrack={currentTrack}
          typedPreview={typedPreview}
          onTypedPreviewChange={
            setTypedPreview
          }
          onSubmit={handleSubmitRandom}
          submitting={submitting}
          onSelectLevel={selectLevel}
          onShuffleTrack={
            handleShuffleTrack
          }
          selectedLevel={selectedLevel}
          submitMessage={submitMessage}
          correction={correction}
        />

        <ValueBanner />

        <FeatureGrid />

        <AudienceGrid />

        <ImpactSection />

        <ClosingCTA />
      </main>
    </div>
  );
}
