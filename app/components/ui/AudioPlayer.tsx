'use client';

import { PauseCircle, PlayCircle, RabbitIcon, TurtleIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentLabel = useMemo(() => formatTime(currentTime), [currentTime]);
  const durationLabel = useMemo(() => formatTime(duration), [duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.playbackRate = playbackRate;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src, playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrentTime(audio.currentTime || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

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

    handleLoadedMetadata();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        // The browser can block autoplay-like starts; the button remains available.
      }
      return;
    }

    audio.pause();
  };

  return (
    <div className={className}>
      <div className="p-4" dir='ltr'>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#31482f]">
          <span> </span>
          <span className="text-[#7b8a73]">{playbackRate.toFixed(2)}x</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={handleTogglePlayback}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full  text-[#355c39] shadow-[0_12px_24px_rgba(53,92,57,0.2)]"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? <PauseCircle size={64} /> : <PlayCircle size={64}  />}
          </button>

          <div className="mt-4 w-full">
     
        <div className="relative rounded-full bg-[#f2f2e8] px-3 py-4">
          <div className='flex gap-1'>
          <TurtleIcon size={24}/>
           
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="w-full accent-[#355c39]"
            aria-label="Playback speed"
          />  <RabbitIcon size={24}/></div>
        </div>
      </div>
        </div>

        {src ? (
          <audio ref={audioRef} key={src} src={src} className="sr-only" />
        ) : null}
      </div>

     </div>
  );
}
