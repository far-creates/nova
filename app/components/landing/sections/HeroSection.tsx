'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import Button from '@/app/components/ui/Button';
import { practiceLevels } from '../landingData';
import { Pen, ArrowBigDownDash } from 'lucide-react';
import AudioPlayer from '@/app/components/ui/AudioPlayer';

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

export default function HeroSectionUnified({
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
      // Browsers can block autoplay-like starts
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pb-10 md:pb-14">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-[#f4d77f]/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-96 w-96 rounded-full bg-[#dbe7c9]/26 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[#fdfaf2]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero/nova-hero-bg.png"
              alt="Nova Hero Background"
              fill
              priority
              className="object-cover object-center"
              aria-hidden="true"
            />
          </div>

          {/* Hero Content Grid */}
          <div className="relative z-10 grid min-h-[560px] items-stretch gap-8 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
            {/* Left Column: Mascot */}
            <HeroMascot />

            {/* Right Column: Marketing Text */}
            <HeroText dialect={dialect} />
          </div>

          {/* Demo Section */}
          <DemoSection
            currentTrack={currentTrack}
            typedPreview={typedPreview}
            onTypedPreviewChange={onTypedPreviewChange}
            onSubmit={onSubmit}
            submitting={submitting}
            onSelectLevel={onSelectLevel}
            onShuffleTrack={onShuffleTrack}
            selectedLevel={selectedLevel}
            audioRef={audioRef}
            dialect={dialect}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Mascot Section with greeting bubble
 */
function HeroMascot() {
  return (
    <div className="relative flex items-start">
      <div className="absolute right-0 top-4 z-20 max-w-[360px] rounded-[1.6rem] border border-[#eadbb5] bg-white px-5 py-4 text-right shadow-[0_18px_45px_rgba(132,112,63,0.14)]">
        <p className="text-center text-xl font-semibold leading-8 text-[#435345]">
          با دقت گوش کن 💛
        </p>
        <div className="text-center text-2xl leading-none text-[#f0be31]">_</div>
        <p className="mt-2 text-center text-md font-normal leading-8 text-[#435345]">
          هر صدا یه فرصت جدید برای یادگیریه!
        </p>
      </div>
      <Image
        src="/images/mascot/nova-mascot.png"
        alt="nova mascot"
        width={480}
        height={480}
        priority
        className="translate-x-24 translate-y-21 object-cover object-center"
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Marketing Text Section
 */
function HeroText({ dialect }: { dialect: string }) {
  return (
    <div className="relative flex flex-col justify-center gap-6 rounded-[2rem] -translate-y-18 translate-x-24">
      {/* Badge */}
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#eadfbe] bg-white/88 px-4 py-2 text-sm font-medium text-[#5c6a57] shadow-[0_10px_24px_rgba(105,95,48,0.08)]">
        <span className="text-[#d4a72c] text-md">✦</span>
        <span>تمرین شنیداری هوشمند برای یادگیری طبیعی‌تر</span>
      </div>

      {/* Heading and Subheading */}
      <div>
        <h1 className="max-w-2xl text-2xl font-black leading-[1.14] tracking-tight text-[#2b3f2c] sm:text-5xl md:text-6xl lg:text-5xl">
          وقتی خوب گوش می‌کنی،
          <br />
          بهتر صحبت می‌کنی
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-9 text-[#5e6d59] md:text-lg">
          تمرین‌های تعاملی <span className="text-[#d4a72c]">✦</span> لهجه‌های واقعی{' '}
          <span className="text-[#d4a72c]">✦</span> محتوای کاربردی
        </p>
      </div>

      {/* Feature Pills */}
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
  );
}

/**
 * Demo Section with Form and Controls
 */
interface DemoSectionProps {
  currentTrack: TrackPreview | null;
  typedPreview: string;
  onTypedPreviewChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  onSelectLevel: (level: string) => void;
  onShuffleTrack: () => void;
  selectedLevel: string;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  dialect: string;
}

function DemoSection({
  currentTrack,
  typedPreview,
  onTypedPreviewChange,
  onSubmit,
  submitting,
  onSelectLevel,
  onShuffleTrack,
  selectedLevel,
  audioRef,
  dialect,
}: DemoSectionProps) {
  return (
    <div dir="ltr" className="relative z-10 -translate-y-36 translate-x-6 w-210">
      <div
        dir="rtl"
        className="rounded-[2.25rem] border border-white/88 bg-white/86 p-4 shadow-[0_24px_80px_rgba(96,110,77,0.14)] backdrop-blur-xl md:p-6"
      >
        <div className="space-y-5 flex">
          {/* Controls Sidebar */}
          <ControlsSidebar
            dialect={dialect}
            selectedLevel={selectedLevel}
            onSelectLevel={onSelectLevel}
          />

          {/* Main Form Section */}
          <div className="w-full">
            {/* Audio Player */}
            <div className="p-2">
              <AudioPlayer src={currentTrack?.filePath ?? null} />
              {currentTrack ? (
                <audio
                  ref={audioRef}
                  key={currentTrack.id}
                  src={currentTrack.filePath}
                  className="sr-only"
                />
              ) : null}
            </div>

            {/* Text Input Section */}
            <TextInputSection
              typedPreview={typedPreview}
              onTypedPreviewChange={onTypedPreviewChange}
            />

            {/* Submit and Next Buttons */}
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button onClick={onSubmit} size="lg" className="min-w-56">
                  {submitting ? 'در حال ارسال...' : 'بررسی پاسخ'}
                </Button>
              </div>

              <button
                type="button"
                onClick={onShuffleTrack}
                className="h-full inline-flex items-center gap-2 rounded-full bg-[#f7e9c7] px-5 text-sm font-medium text-[#5f4c18] transition hover:bg-[#f4dfac]"
              >
                <span>✦</span>
                تمرین بعدی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Controls Sidebar with Level Selection
 */
function ControlsSidebar({
  dialect,
  selectedLevel,
  onSelectLevel,
}: {
  dialect: string;
  selectedLevel: string;
  onSelectLevel: (level: string) => void;
}) {
  return (
    <div className="w-90 ml-6 pl-6 border-l border-dashed border-[#2C4C30] space-y-4">
      {/* Dialect */}
      <div>
        <div className="mb-2 text-sm font-semibold text-[#31482f]">لهجه</div>
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

      {/* Level Selection */}
      <div>
        <div className="mb-2 text-sm font-semibold text-[#31482f]">سطح</div>
        <div className="mt-3 flex flex-wrap justify-between gap-3 w-full" dir="ltr">
          {practiceLevels.map((level) => {
            const active = selectedLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onSelectLevel(level)}
                className={[
                  'rounded-lg border px-5 py-1 text-sm transition',
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

      {/* Topic */}
      <div>
        <div className="mb-2 text-sm font-semibold text-[#31482f]">موضوع</div>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-[#d8dfd2] bg-white px-3 py-2 text-sm text-[#344534]"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🇬🇧</span>
            <span>موضوع</span>
          </span>
          <ArrowBigDownDash />
        </button>
      </div>
    </div>
  );
}

/**
 * Text Input Section
 */
function TextInputSection({
  typedPreview,
  onTypedPreviewChange,
}: {
  typedPreview: string;
  onTypedPreviewChange: (value: string) => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex gap-1 mb-2">
        <Pen color="#9b8a58" size={18} />
        <span className="text-sm font-medium text-[#405241]">هر چی می‌شنوی تایپ کن</span>
      </div>
      <textarea
        value={typedPreview}
        onChange={(e) => onTypedPreviewChange(e.target.value)}
        placeholder="Type here..."
        dir="ltr"
        className="w-full resize-none border border-[#e7e0cd] rounded-[1.2rem] bg-white px-4 py-3 text-sm leading-8 text-[#2f4330] placeholder:text-[#9da795] focus:border-[#9cb287] focus:outline-none"
      />
    </div>
  );
}