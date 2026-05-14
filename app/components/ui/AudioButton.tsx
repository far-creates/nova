"use client";

import { Play, Pause } from "lucide-react";
import { useRef, useState } from "react";

export default function AudioButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      await audio.play();
    }

    setPlaying(!playing);
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center justify-center rounded-full p-4 bg-black text-white"
      >
        {playing ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <audio ref={audioRef} src="/audio/test.mp3" />
    </div>
  );
}