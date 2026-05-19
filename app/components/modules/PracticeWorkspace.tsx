'use client';

import * as React from 'react';
import { Headphones, RotateCcw, Sparkles } from 'lucide-react';
import AudioPlayer from '@/app/components/ui/AudioPlayer';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Field from '@/app/components/ui/Field';
import Textarea from '@/app/components/ui/Textarea';
import { useLocale } from '@/app/context/LocaleContext';
import { cn } from '@/lib/cn';
import type { LegacyAttemptResponse } from '@/packages/api/src/attempts';
import type { LegacyTrackPayload } from '@/packages/api/src/tracks';

export interface PracticeWorkspaceProps {
  title: string;
  description: string;
  currentTrack: LegacyTrackPayload | null;
  typedText: string;
  onTypedTextChange: (value: string) => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
  primaryActionBusyLabel?: string;
  primaryActionPending?: boolean;
  primaryActionDisabled?: boolean;
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'soft' | 'outline' | 'ghost' | 'solid' | 'danger';
    icon?: 'shuffle' | 'reset';
    disabled?: boolean;
  };
  feedbackMessage?: string;
  feedbackTone?: 'neutral' | 'success' | 'error';
  correction?: LegacyAttemptResponse | null;
  sidebar?: React.ReactNode;
}

const feedbackToneStyles = {
  neutral:
    'border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-text-muted)]',
  success:
    'border-[color:var(--color-success)]/20 bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]',
  error:
    'border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]',
} as const;

export default function PracticeWorkspace({
  title,
  description,
  currentTrack,
  typedText,
  onTypedTextChange,
  onPrimaryAction,
  primaryActionLabel,
  primaryActionBusyLabel,
  primaryActionPending = false,
  primaryActionDisabled = false,
  secondaryAction,
  feedbackMessage,
  feedbackTone = 'neutral',
  correction,
  sidebar,
}: PracticeWorkspaceProps) {
  const { messages } = useLocale();
  const stats = correction
    ? [
        {
          label: messages.practiceWorkspace.accuracy,
          value: `${correction.accuracy}%`,
          tone: 'text-[color:var(--color-primary)]',
        },
        {
          label: messages.practiceWorkspace.wrong,
          value: String(correction.wrong.length),
          tone: 'text-[color:var(--color-danger)]',
        },
        {
          label: messages.practiceWorkspace.extra,
          value: String(correction.extra.length),
          tone: 'text-[color:var(--color-warning)]',
        },
      ]
    : [];

  const secondaryIcon =
    secondaryAction?.icon === 'shuffle' ? (
      <Sparkles size={18} />
    ) : secondaryAction?.icon === 'reset' ? (
      <RotateCcw size={18} />
    ) : null;

  return (
    <section className="relative z-10 pb-10 md:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          {sidebar ? <div className="space-y-4">{sidebar}</div> : null}

          <Card variant="panel" padding="lg" className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--color-accent-solar-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-warning)]">
                  <Headphones size={16} />
                  {messages.practiceWorkspace.badge}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[color:var(--color-text)] sm:text-3xl">
                    {title}
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-text-muted)] sm:text-base">
                    {description}
                  </p>
                </div>
              </div>

              <Card variant="data" padding="sm" className="min-w-[220px] space-y-2">
                <p className="font-ui-en text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-soft)]">
                  {messages.practiceWorkspace.currentTrack}
                </p>
                {currentTrack ? (
                  <>
                    <p className="text-sm font-semibold text-[color:var(--color-text)]">
                      {currentTrack.title}
                    </p>
                    <p className="font-ui-en text-sm text-[color:var(--color-text-muted)]">
                      Level {String(currentTrack.difficulty).toUpperCase()}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[color:var(--color-text-muted)]">
                    {messages.practiceWorkspace.pickTrack}
                  </p>
                )}
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <AudioPlayer src={currentTrack?.filePath ?? null} />

                <Field
                  label={messages.practiceWorkspace.typeWhatYouHear}
                  helperText={messages.practiceWorkspace.inputHelp}
                >
                  <Textarea
                    dir="ltr"
                    value={typedText}
                    onChange={(event) => onTypedTextChange(event.target.value)}
                    placeholder={messages.practiceWorkspace.inputPlaceholder}
                    className="min-h-40"
                  />
                </Field>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={onPrimaryAction}
                    size="lg"
                    className="sm:min-w-52"
                    disabled={primaryActionPending || primaryActionDisabled}
                  >
                    {primaryActionPending && primaryActionBusyLabel
                      ? primaryActionBusyLabel
                      : primaryActionLabel}
                  </Button>

                  {secondaryAction ? (
                    <Button
                      onClick={secondaryAction.onClick}
                      size="lg"
                      variant={secondaryAction.variant ?? 'soft'}
                      className="sm:min-w-44"
                      disabled={secondaryAction.disabled}
                    >
                      {secondaryIcon}
                      {secondaryAction.label}
                    </Button>
                  ) : null}
                </div>

                {feedbackMessage ? (
                  <div
                    className={cn(
                      'rounded-[var(--radius-md)] border px-4 py-3 text-sm',
                      feedbackToneStyles[feedbackTone]
                    )}
                  >
                    {feedbackMessage}
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <Card variant="data" padding="md" className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-ui-en text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-soft)]">
                      {messages.practiceWorkspace.feedback}
                    </p>
                    <h3 className="text-lg font-bold text-[color:var(--color-text)]">
                      {messages.practiceWorkspace.result}
                    </h3>
                  </div>

                  {correction ? (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        {stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-[var(--radius-md)] bg-[color:var(--color-surface-muted)] p-3 text-center"
                          >
                            <div className="font-ui-en text-xs uppercase tracking-[0.14em] text-[color:var(--color-text-soft)]">
                              {stat.label}
                            </div>
                            <div className={cn('mt-2 text-xl font-black', stat.tone)}>
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 text-sm text-[color:var(--color-text-muted)]">
                        <p>
                          {messages.practiceWorkspace.correctChars}:{' '}
                          <span className="font-semibold text-[color:var(--color-text)]">
                            {correction.correct.length}
                          </span>
                        </p>
                        <p>
                          {messages.practiceWorkspace.wrongChars}:{' '}
                          <span className="font-semibold text-[color:var(--color-danger)]">
                            {correction.wrong.length}
                          </span>
                        </p>
                        <p>
                          {messages.practiceWorkspace.extraChars}:{' '}
                          <span className="font-semibold text-[color:var(--color-warning)]">
                            {correction.extra.length}
                          </span>
                        </p>
                      </div>

                      {correction.wrong.length > 0 ? (
                        <div className="rounded-[var(--radius-md)] border border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/10 p-4">
                          <p className="mb-2 text-sm font-semibold text-[color:var(--color-danger)]">
                            {messages.practiceWorkspace.firstMistakes}
                          </p>
                          <div className="space-y-1 text-sm text-[color:var(--color-danger)]">
                            {correction.wrong.slice(0, 3).map((item) => (
                              <div key={`${item.index}-${item.expected}-${item.got}`}>
                                {messages.practiceWorkspace.expectedGot(
                                  item.index,
                                  item.expected,
                                  item.got
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-sm leading-7 text-[color:var(--color-text-muted)]">
                      {messages.practiceWorkspace.emptyResult}
                    </p>
                  )}
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
