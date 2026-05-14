'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import Button from '@/app/components/ui/Button';
import { practiceLevels, supportPoints } from '../landingData';

interface TrackPreview {
  id: string;
  title: string;
  filePath: string;
  difficulty: string;
  createdAt: string;
}

interface HeroSectionProps {
  currentTrack: TrackPreview | null;
  typedPreview: string;
  onTypedPreviewChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  onSelectLevel: (level: string) => void;
  onShuffleTrack: () => void;
  selectedLevel: string;
  submitMessage: string;
}

const effortLevels = [
  { label: 'مبتدی', key: 'beginner' },
  { label: 'متوسط', key: 'intermediate' },
  { label: 'پیشرفته', key: 'advanced' },
];

const waveform = [
  26, 34, 48, 22, 40, 55, 68, 42, 36, 58, 74, 52, 38, 47, 64, 41, 30, 39, 54, 33,
];

export default function HeroSection({
  currentTrack,
  typedPreview,
  onTypedPreviewChange,
  onSubmit,
  submitting,
  onSelectLevel,
  onShuffleTrack,
  selectedLevel,
  submitMessage,
}: HeroSectionProps) {
  const [dialect] = useState('تهرانی');
  const [speed, setSpeed] = useState(58);
  const [effortLevel, setEffortLevel] = useState('intermediate');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlayback = async () => {
    if (!currentTrack || !audioRef.current) return;
    if (!audioRef.current.paused) {
      audioRef.current.pause();
      return;
    }

    try {
      await audioRef.current.play();
    } catch {
      // The browser can block autoplay-like starts; the button will remain available.
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-4 md:pt-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-[#f4d77f]/18 blur-3xl" />
        <div className="absolute right-0 top-28 h-80 w-80 rounded-full bg-[#d8e6c7]/30 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),rgba(253,250,242,0.0)_72%)]" />
        <Image
          src="/images/hero/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-35"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(253,250,242,0.7)_0%,rgba(253,250,242,0.92)_28%,rgba(253,250,242,1)_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-2 text-center">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-[#27402d] sm:text-5xl md:text-6xl">
            مهارت شنیدن را تقویت کن
          </h1>
          <p className="mt-3 text-lg leading-8 text-[#5e6d59] md:text-xl">
            با گوش دادن واقعی، یاد بگیر و پیشرفت کن.
          </p>
          <div className="mt-4 inline-flex items-center gap-3 text-[#c79a32]">
            <span className="h-px w-10 bg-gradient-to-l from-transparent via-[#deb75b] to-transparent" />
            <span className="text-base">✦</span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#deb75b] to-transparent" />
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
          <div className="rounded-[2rem] border border-white/80 bg-white/82 p-4 shadow-[0_22px_60px_rgba(96,110,77,0.12)] backdrop-blur-xl md:p-5">
            <div className="rounded-[1.6rem] border border-[#e9e1cc] bg-[#fffdf8] p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#31482f]">
                  <span className="text-lg">🎧</span>
                  <span>تمرین شنیداری</span>
                </div>
                <div className="rounded-full border border-[#d8dfd2] bg-[#f7f7ed] px-4 py-2 text-xs font-medium text-[#5d6b56]">
                  بدون نیاز به ثبت‌نام
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="rounded-[1.35rem] border border-[#e7e0cd] bg-white p-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleTogglePlayback}
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#355c39] text-white shadow-[0_12px_24px_rgba(53,92,57,0.2)] transition hover:bg-[#2d4f31]"
                        aria-label="پخش تمرین"
                      >
                        <span className="ml-1 text-2xl leading-none">▶</span>
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-end gap-2">
                          {waveform.map((height, index) => (
                            <span
                              key={`${height}-${index}`}
                              className="w-1.5 rounded-full bg-gradient-to-t from-[#90a36d] via-[#b6c57c] to-[#e4e2cf]"
                              style={{ height: `${height}px` }}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex justify-end text-xs text-[#7a8773]">
                          00:00 / 00:12
                        </div>
                      </div>
                    </div>
                    {currentTrack ? (
                      <audio
                        ref={audioRef}
                        key={currentTrack.id}
                        src={currentTrack.filePath}
                        className="sr-only"
                      />
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#405241]">
                      <span>آنچه را شنیده‌ای تایپ کن</span>
                      <span className="text-[#9b8a58]">✎</span>
                    </label>
                    <textarea
                      value={typedPreview}
                      onChange={(e) => onTypedPreviewChange(e.target.value)}
                      placeholder="اینجا بنویسید..."
                      className="h-40 w-full resize-none rounded-[1.2rem] border border-[#e4e0d0] bg-white px-4 py-3 text-sm leading-8 text-[#2f4330] placeholder:text-[#9da795] focus:border-[#9cb287] focus:outline-none"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button variant="outline" size="md" className="bg-[#f8f1d9]">
                      راهنمایی
                    </Button>
                    <div className="text-xs text-[#7a8774]">
                      {currentTrack ? currentTrack.title : 'هنوز نمونه‌ای انتخاب نشده است.'}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-[#e7e0cd] bg-white p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-sm font-semibold text-[#31482f]">لهجه</div>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl border border-[#d8dfd2] bg-white px-3 py-2 text-sm text-[#344534]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇮🇷</span>
                          <span>{dialect}</span>
                        </span>
                        <span className="text-[#7d8b74]">⌄</span>
                      </button>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-semibold text-[#31482f]">سطح</div>
                      <div className="flex flex-wrap gap-2">
                        {effortLevels.map((level) => {
                          const active = effortLevel === level.key;
                          return (
                            <button
                              key={level.key}
                              type="button"
                              onClick={() => setEffortLevel(level.key)}
                              className={[
                                'rounded-lg border px-3 py-2 text-xs font-semibold transition',
                                active
                                  ? 'border-[#355c39] bg-[#355c39] text-white'
                                  : 'border-[#d8dfd2] bg-white text-[#5b6a55] hover:border-[#b8c7af]',
                              ].join(' ')}
                            >
                              {level.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {practiceLevels.map((level) => {
                          const active = selectedLevel === level;
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => onSelectLevel(level)}
                              className={[
                                'rounded-lg border px-3 py-2 text-sm transition',
                                active
                                  ? 'border-[#355c39] bg-[#355c39] text-white'
                                  : 'border-[#d8dfd2] bg-white text-[#5b6a55] hover:border-[#b8c7af]',
                              ].join(' ')}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#31482f]">
                        <span>سرعت</span>
                        <span className="text-[#7b8a73]">نرمال</span>
                      </div>
                      <div className="relative rounded-full bg-[#f2f2e8] px-3 py-4">
                        <input
                          type="range"
                          min="20"
                          max="100"
                          value={speed}
                          onChange={(e) => setSpeed(Number(e.target.value))}
                          className="w-full accent-[#355c39]"
                        />
                      </div>
                    </div>

                    <div className="rounded-[1rem] border border-dashed border-[#e5d8b5] bg-[#fffaf0] px-3 py-3 text-xs leading-6 text-[#7b6d4d]">
                      اگر بخواهی، می‌توانی قبل از ارسال، جواب را مرور کنی و دوباره گوش بدهی.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={onShuffleTrack}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f7e9c7] px-5 py-3 text-sm font-medium text-[#5f4c18] transition hover:bg-[#f4dfac]"
                >
                  <span>☻</span>
                  شروع با یک نمونه
                </button>

                <Button onClick={onSubmit} size="lg" className="min-w-56">
                  {submitting ? 'در حال ارسال...' : 'بررسی پاسخ'}
                </Button>
              </div>

              {submitMessage ? (
                <p className="mt-4 rounded-[1.1rem] bg-[#eef5e7] px-4 py-3 text-sm text-[#406047]">
                  {submitMessage}
                </p>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-[560px] lg:min-h-[640px]">
            <div className="absolute right-2 top-8 rounded-[1.8rem] border border-[#eadbb5] bg-white/92 px-6 py-5 text-center shadow-[0_16px_40px_rgba(132,112,63,0.12)]">
              <div className="text-2xl font-black text-[#334d35]">با دقت گوش کن</div>
              <div className="mt-1 text-base text-[#5d6957]">هر صدا، یک فرصت یادگیری!</div>
            </div>

            <div className="absolute right-10 top-36 hidden h-7 w-7 rounded-full bg-[#ffcb47]/90 shadow-[0_0_0_10px_rgba(255,203,71,0.12)] lg:block" />
            <div className="absolute right-0 top-48 hidden h-5 w-5 rounded-full bg-[#ffcb47]/95 shadow-[0_0_0_8px_rgba(255,203,71,0.14)] lg:block" />

            <div className="absolute left-0 right-0 bottom-0 h-[170px] rounded-[3rem] bg-[linear-gradient(180deg,rgba(233,225,178,0.0),rgba(164,183,92,0.18)_40%,rgba(95,125,72,0.22)_100%)]" />
            <Image
              src="/images/hero/hero-bg.png"
              alt=""
              fill
              className="object-cover object-bottom opacity-60"
              aria-hidden="true"
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:bottom-10">
              <div className="relative h-[430px] w-[430px] md:h-[520px] md:w-[520px]">
                <Image
                  src="/images/mascot/nova-mascot.png"
                  alt="Nova mascot"
                  fill
                  sizes="(max-width: 768px) 430px, 520px"
                  className="object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.12)]"
                  priority
                />
              </div>
            </div>

            <div className="absolute bottom-6 left-3 right-3 rounded-[2rem] border border-[#e8e0c8] bg-white/78 p-4 shadow-[0_18px_35px_rgba(105,95,48,0.1)] backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-3">
                {supportPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.2rem] bg-[#fffdf6] px-4 py-3 text-sm text-[#566554]"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-28 right-6 hidden rounded-full border border-[#f2dfb3] bg-white px-5 py-3 text-sm text-[#5f6d57] shadow-md lg:block">
              بررسی و دریافت امتیاز
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
