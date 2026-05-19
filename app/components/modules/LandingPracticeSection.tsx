'use client';

import PracticeWorkspace from '@/app/components/modules/PracticeWorkspace';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useLocale } from '@/app/context/LocaleContext';
import { practiceLevels } from '@/app/components/landing/landingData';
import type { LegacyAttemptResponse } from '@/packages/api/src/attempts';
import type { LegacyTrackPayload } from '@/packages/api/src/tracks';

interface LandingPracticeSectionProps {
  currentTrack: LegacyTrackPayload | null;
  typedPreview: string;
  onTypedPreviewChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  onSelectLevel: (level: string) => void;
  onShuffleTrack: () => void;
  selectedLevel: string;
  submitMessage: string;
  correction: LegacyAttemptResponse | null;
  accentLabel?: string;
}

export default function LandingPracticeSection({
  currentTrack,
  typedPreview,
  onTypedPreviewChange,
  onSubmit,
  submitting,
  onSelectLevel,
  onShuffleTrack,
  selectedLevel,
  submitMessage,
  correction,
  accentLabel = 'British (UK)',
}: LandingPracticeSectionProps) {
  const { messages } = useLocale();

  return (
    <PracticeWorkspace
      title={messages.landingPractice.title}
      description={messages.landingPractice.description}
      currentTrack={currentTrack}
      typedText={typedPreview}
      onTypedTextChange={onTypedPreviewChange}
      onPrimaryAction={onSubmit}
      primaryActionLabel={messages.practicePage.checkAnswer}
      primaryActionBusyLabel={messages.practicePage.checkingAnswer}
      primaryActionPending={submitting}
      primaryActionDisabled={!currentTrack || !typedPreview.trim()}
      secondaryAction={{
        label: messages.landingPractice.nextSentence,
        onClick: onShuffleTrack,
        variant: 'soft',
        icon: 'shuffle',
      }}
      feedbackMessage={submitMessage}
      feedbackTone={
        submitMessage.toLowerCase().includes('failed')
          ? 'error'
          : submitMessage
            ? 'success'
            : 'neutral'
      }
      correction={correction}
      sidebar={
        <>
          <Card variant="data" padding="md" className="space-y-4">
            <div className="space-y-1">
              <p className="font-ui-en text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-soft)]">
                {messages.landingPractice.accent}
              </p>
              <p className="text-base font-semibold text-[color:var(--color-text)]">
                {accentLabel}
              </p>
            </div>
            <p className="text-sm leading-7 text-[color:var(--color-text-muted)]">
              {messages.landingPractice.accentHint}
            </p>
          </Card>

          <Card variant="data" padding="md" className="space-y-4">
            <div className="space-y-1">
              <p className="font-ui-en text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-soft)]">
                {messages.landingPractice.level}
              </p>
              <p className="text-base font-semibold text-[color:var(--color-text)]">
                {messages.landingPractice.chooseLevel}
              </p>
            </div>
            <div className="flex flex-wrap gap-2" dir="ltr">
              {practiceLevels.map((level) => {
                const active = selectedLevel === level;
                return (
                  <Button
                    key={level}
                    type="button"
                    size="sm"
                    variant={active ? 'solid' : 'outline'}
                    onClick={() => onSelectLevel(level)}
                    className="min-w-14 rounded-[var(--radius-sm)]"
                  >
                    {level}
                  </Button>
                );
              })}
            </div>
          </Card>
        </>
      }
    />
  );
}
