'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/apps/web/context/LocaleContext';
import { useAuth } from '@/apps/web/context/AuthContext';
import { fetchLegacyTracks, submitLegacyAttempt } from '@/packages/api/src/client';
import type { LegacyAttemptResponse } from '@/packages/api/src/attempts';
import type { LegacyTrackListResponse, LegacyTrackPayload } from '@/packages/api/src/tracks';
import PracticeWorkspace from '@/apps/web/components/modules/PracticeWorkspace';
import TrackListSidebar from '@/apps/web/components/modules/TrackListSidebar';
import { Button, Card } from '@/packages/ui/src';

export default function PracticePage() {
  const [tracks, setTracks] = useState<LegacyTrackPayload[]>([]);
  const [currentTrack, setCurrentTrack] = useState<LegacyTrackPayload | null>(null);
  const [typedText, setTypedText] = useState('');
  const [correction, setCorrection] = useState<LegacyAttemptResponse | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [tracksLoading, setTracksLoading] = useState(true);
  const [tracksError, setTracksError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, loading, logout } = useAuth();
  const { messages } = useLocale();
  const router = useRouter();
  const loadTracksFailedMessage = messages.practicePage.loadTracksFailed;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadTracks = async () => {
      try {
        setTracksLoading(true);
        setTracksError(null);
        const data: LegacyTrackListResponse = await fetchLegacyTracks();
        setTracks(data);
        setCurrentTrack((previous) => previous ?? data[0] ?? null);
      } catch (error) {
        console.error('Error loading tracks:', error);
        setTracks([]);
        setTracksError(loadTracksFailedMessage);
      } finally {
        setTracksLoading(false);
      }
    };

    void loadTracks();
  }, [loadTracksFailedMessage, user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSelectTrack = (track: LegacyTrackPayload) => {
    setCurrentTrack(track);
    setTypedText('');
    setCorrection(null);
    setSubmitMessage('');
  };

  const handleSubmit = async (saveAttempt: boolean) => {
    if (!currentTrack || !typedText.trim()) {
      return;
    }

    if (saveAttempt) {
      setSaving(true);
    } else {
      setChecking(true);
    }

    setSubmitMessage('');
    setCorrection(null);

    try {
      const result = await submitLegacyAttempt(
        {
          audioTrackId: currentTrack.id,
          userText: typedText,
          saveAttempt,
        },
        {
          credentials: 'include',
        }
      );

      setCorrection(result);
      setSubmitMessage(
        saveAttempt ? messages.practicePage.attemptSaved : messages.practicePage.answerChecked
      );
    } catch (error) {
      console.error(saveAttempt ? 'Error saving attempt:' : 'Error checking attempt:', error);
      setSubmitMessage(
        saveAttempt ? messages.practicePage.saveFailed : messages.practicePage.checkFailed
      );
    } finally {
      if (saveAttempt) {
        setSaving(false);
      } else {
        setChecking(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[color:var(--color-text-muted)]">{messages.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <Card
          variant="feature"
          padding="md"
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="space-y-2">
            <p className="font-ui-en text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent-solar)]">
              {messages.practicePage.tag}
            </p>
            <h1 className="text-3xl font-black text-[color:var(--color-text)]">
              {messages.practicePage.title}
            </h1>
            <p className="text-sm leading-7 text-[color:var(--color-text-muted)]">
              {messages.practicePage.description(user.username ?? user.email)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/profile">{messages.common.profile}</Link>
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              {messages.common.logout}
            </Button>
          </div>
        </Card>

        <PracticeWorkspace
          title={messages.practicePage.workspaceTitle}
          description={messages.practicePage.workspaceDescription}
          currentTrack={currentTrack}
          typedText={typedText}
          onTypedTextChange={setTypedText}
          onPrimaryAction={() => void handleSubmit(false)}
          primaryActionLabel={messages.practicePage.checkAnswer}
          primaryActionBusyLabel={messages.practicePage.checkingAnswer}
          primaryActionPending={checking}
          primaryActionDisabled={!currentTrack || !typedText.trim() || saving}
          secondaryAction={{
            label: saving ? messages.practicePage.savingAttempt : messages.practicePage.saveAttempt,
            onClick: () => void handleSubmit(true),
            variant: 'outline',
            icon: 'reset',
            disabled: saving || checking || !currentTrack || !typedText.trim(),
          }}
          feedbackMessage={submitMessage}
          feedbackTone={
            submitMessage.toLowerCase().includes('could not')
              ? 'error'
              : submitMessage
                ? 'success'
                : 'neutral'
          }
          correction={correction}
          sidebar={
            <TrackListSidebar
              tracks={tracks}
              currentTrackId={currentTrack?.id ?? null}
              onSelectTrack={handleSelectTrack}
              loading={tracksLoading}
              error={tracksError}
            />
          }
        />
      </div>
    </div>
  );
}
