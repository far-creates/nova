'use client';

import Image from 'next/image';
import { useState } from 'react';
import Button from '@/app/components/ui/Button';
import AudioPlayer from '@/app/components/ui/AudioPlayer';
import { practiceLevels } from '../landingData';
import { ArrowBigDownDash, Pen } from 'lucide-react';

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

export default function HeroSectionAudio({
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
  const [dialect] = useState('British (UK)');
  const [effortLevel, setEffortLevel] = useState('intermediate');

  return (
    <section id="home" dir="ltr" className="relative overflow-hidden pb-10 md:pb-14">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-[#f4d77f]/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-96 w-96 rounded-full bg-[#dbe7c9]/26 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[#fdfaf2]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#e9debf] bg-[#fdfaf2] shadow-[0_28px_90px_rgba(96,110,77,0.12)]">
          <div className="absolute inset-0">
            <Image
              src="/images/hero/nova-hero-bg.png"
              alt=""
              fill
              priority
              className="object-cover object-center opacity-100"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(253,250,242,0.96)_0%,rgba(253,250,242,0.84)_42%,rgba(253,250,242,0.72)_100%)]" />
          </div>

          <div className="relative z-10 grid min-h-[560px] items-stretch gap-8 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
            <div className="relative flex flex-col justify-center gap-6 rounded-[2rem] bg-white/30 p-5 text-right backdrop-blur-[2px] md:p-8" dir="rtl">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#eadfbe] bg-white/88 px-4 py-2 text-sm font-medium text-[#5c6a57] shadow-[0_10px_24px_rgba(105,95,48,0.08)]">
                <span className="text-[#d4a72c]">✦</span>
                <span>تمرین شنیداری هوشمند برای یادگیری طبیعی‌تر</span>
              </div>

              <div>
                <h1 className="max-w-2xl text-4xl font-black leading-[1.14] tracking-tight text-[#2b3f2c] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                  وقتی خوب گوش می‌کنی،
                  <br />
                  بهتر صحبت می‌کنی
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-9 text-[#5e6d59] md:text-xl">
                  با تمرین‌های تعاملی شنیداری، لهجه‌های واقعی و محتوای کاربردی، انگلیسی را طبیعی‌تر یاد بگیر.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {['بدون نیاز به ثبت‌نام', 'همین حالا امتحان کن'].map((item, index) => (
                  <div
                    key={item}
                    className={[
                      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-[0_8px_20px_rgba(86,101,84,0.06)]',
                      index === 0
                        ? 'border-[#e7ddc2] bg-white/88 text-[#53614e]'
                        : 'border-[#f1ddb0] bg-[#fff6de] text-[#715718]',
                    ].join(' ')}
                  >
                    <span className="text-[#cf9b21]">●</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-start justify-end">
              <div className="absolute right-0 top-4 z-20 max-w-[260px] rounded-[1.6rem] border border-[#eadbb5] bg-white px-5 py-4 text-right shadow-[0_18px_45px_rgba(132,112,63,0.14)]">
                <div className="text-2xl leading-none text-[#f0be31]">♥</div>
                <p className="mt-2 text-base font-semibold leading-8 text-[#435345]">
                  با دقت گوش کن
                  <br />
                  و لذت یادگیری را حس کن!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="-mt-6 relative z-10 md:-mt-12">
          <div className="rounded-[2.25rem] border border-white/88 bg-white/86 p-4 shadow-[0_24px_80px_rgba(96,110,77,0.14)] backdrop-blur-xl md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#2f4330]">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#355c39] text-white shadow-[0_12px_24px_rgba(53,92,57,0.22)]">
                  ▶
                </span>
                <span>تمرین شنیداری</span>
              </div>
              <div className="rounded-full border border-[#e0e4d6] bg-[#f7f7ed] px-4 py-2 text-xs font-medium text-[#5d6b56]">
                بدون نیاز به ثبت‌نام
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
              <div className="space-y-5">
                <AudioPlayer src={currentTrack?.filePath ?? null} />

                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#405241]">
                    <Pen size={16} color="#9b8a58" />
                    <span>هر چی می‌شنوی تایپ کن</span>
                  </div>
                  <textarea
                    value={typedPreview}
                    onChange={(e) => onTypedPreviewChange(e.target.value)}
                    placeholder="اینجا بنویسید..."
                    className="h-40 w-full resize-none rounded-[1.2rem] border border-[#e4e0d0] bg-white px-4 py-3 text-sm leading-8 text-[#2f4330] placeholder:text-[#9da795] focus:border-[#9cb287] focus:outline-none"
                  />
                  <div className="mt-2 text-xs text-[#7f8a74]">
                    اگر خواستی، می‌توانی قبل از ارسال دوباره گوش بدهی و متن را اصلاح کنی.
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="md" className="bg-[#f8f1d9]">
                    راهنمایی
                  </Button>
                  <div className="text-xs text-[#7a8774]">
                    {currentTrack ? currentTrack.title : 'هنوز نمونه‌ای انتخاب نشده است.'}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#e7e0cd] bg-white p-4">
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-[#31482f]">لهجه را انتخاب کنید</div>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl border border-[#d8dfd2] bg-white px-3 py-2 text-sm text-[#344534]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">🇬🇧</span>
                        <span>{dialect}</span>
                      </span>
                      <ArrowBigDownDash />
                    </button>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-semibold text-[#31482f]">سطح خود را انتخاب کنید</div>
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

                  <div className="rounded-[1rem] border border-dashed border-[#e5d8b5] bg-[#fffaf0] px-3 py-3 text-xs leading-6 text-[#7b6d4d]">
                    اگر بخواهی، می‌توانی قبل از ارسال، جواب را مرور کنی و دوباره گوش بدهی.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onShuffleTrack}
                className="inline-flex items-center gap-2 rounded-full bg-[#f7e9c7] px-5 py-3 text-sm font-medium text-[#5f4c18] transition hover:bg-[#f4dfac]"
              >
                <span>✦</span>
                شروع با یک نمونه جدید
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
      </div>
    </section>
  );
}
