'use client';

import { PauseCircle, PlayCircle, RabbitIcon, TurtleIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, cn } from '@/packages/ui/src';
import { useLocale } from '@/apps/web/context/LocaleContext';

interface AudioPlayerProps {
  src: string | null;
  className?: string;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function AudioPlayer({ src, className = '' }: AudioPlayerProps) {
  const { messages } = useLocale();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isReady = Boolean(src);

  const currentLabel = useMemo(() => formatTime(currentTime), [currentTime]);
  const durationLabel = useMemo(() => formatTime(duration), [duration]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (src) {
      audio.src = src;
      audio.load();
    }
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrentTime(audio.currentTime || 0);
      audio.playbackRate = playbackRate;
    };

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    if (audio.src) {
      handleLoadedMetadata();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, playbackRate]);

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {}
    } else {
      audio.pause();
    }
  };

  return (
    <Card
      variant="data"
      padding="md"
      className={cn('transition-colors', isPlaying ? 'player-active' : 'player-ready', className)}
    >
      <div className="space-y-4" dir="ltr">
        <div className="flex items-center justify-between text-sm font-semibold text-[color:var(--color-text)]">
          <span className="font-ui-en text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-soft)]">
            {isReady ? messages.practiceWorkspace.ready : messages.practiceWorkspace.idle}
          </span>
          <span className="font-ui-en text-[color:var(--color-text-muted)]">{playbackRate.toFixed(2)}x</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleTogglePlayback}
            disabled={!isReady}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[color:var(--color-surface-elevated)] text-[color:var(--color-primary)] shadow-[var(--shadow-soft)] transition hover:bg-[color:var(--color-bg-elevated)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? <PauseCircle size={64} /> : <PlayCircle size={64} />}
          </button>

          <div className="w-full space-y-3">
            <div className="relative rounded-full bg-[color:var(--color-surface-muted)] px-3 py-4">
              <div className="flex items-center gap-2">
                <TurtleIcon size={20} className="text-[color:var(--color-text-muted)]" />
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(Number(e.target.value))}
                  disabled={!isReady}
                  className="w-full accent-[color:var(--color-primary)] disabled:opacity-50"
                  aria-label="Playback speed"
                />
                <RabbitIcon size={20} className="text-[color:var(--color-text-muted)]" />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-[color:var(--color-text-muted)]">
              <span className="font-ui-en">
                {currentLabel} / {durationLabel}
              </span>
              <span>
                {isPlaying
                  ? messages.practiceWorkspace.playing
                  : isReady
                    ? messages.practiceWorkspace.paused
                    : messages.practiceWorkspace.noTrack}
              </span>
            </div>
          </div>
        </div>

        {src ? <audio ref={audioRef} src={src} /> : null}
      </div>
    </Card>
  );
}
