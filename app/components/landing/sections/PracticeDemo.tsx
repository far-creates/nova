'use client';


import { useRef, useState } from 'react';
import Button from '@/app/components/ui/Button';
import { practiceLevels } from '../landingData';
import {  Pen, ArrowBigDownDash } from "lucide-react";
import AudioPlayer from '@/app/components/ui/AudioPlayer';
import type { LegacyTrackPayload } from '@/packages/api/src/tracks';

type TrackPreview = LegacyTrackPayload;

interface PracticeDemoProps {
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

export default function PracticeDemo({
  currentTrack,
  typedPreview,
  onTypedPreviewChange,
  onSubmit,
  submitting,
  onSelectLevel,
  onShuffleTrack,
  selectedLevel,
}: PracticeDemoProps) {
  const [dialect] = useState('British (UK)');
  const audioRef = useRef<HTMLAudioElement | null>(null);



  return (
    <section className="relative overflow-hidden pb-10 md:pb-14 z-10">
  
     {/* ----------------------------- Demo Containter ------------------------------ */}
      <div dir='ltr'>
        <div className="relative -translate-y-36 translate-x-6 w-210" dir='rtl'>
          <div className="z-10 rounded-[2.25rem] border border-white/88 bg-white/86 p-4 shadow-[0_24px_80px_rgba(96,110,77,0.14)] backdrop-blur-xl md:p-6">
            <div className="space-y-5 flex ">
              <div className='w-90 ml-6 pl-6 border-l border-dashed border-[#2C4C30] '>
                

              <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-[#31482f]">لهجه </div>
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
                </div>

                <div>
                    <div className="mt-8 mb-2 text-sm font-semibold text-[#31482f]">سطح</div>
                

                    <div className="mt-3 flex flex-wrap justify-between gap-3 w-full" dir='ltr'>
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

              


                <div className="space-y-4 mt-8">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-[#31482f]">موضوع </div>
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
                </div>
                </div> 

            <div className='w-full'> 
              
               
               
              
                {/* ----------------------------- Audio And Speed Slider ------------------------------ */}
                <div className="p-2">

                  <AudioPlayer src={currentTrack?.filePath ?? null} />
                {/* <div className="flex gap-4 justify-between items-center">
          
              
                 <div className='w-full'>
                    <div className=" mb-2 flex items-center justify-between text-sm font-semibold text-[#31482f]">
                      <span>سرعت صدا</span>
                      <span className="text-[#7b8a73]">نرمال</span>
                    </div>
                    <div className=" relative rounded-full bg-[#f2f2e8] px-3 py-4">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        dir='ltr'
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full accent-[#355c39]"
                      />
                     </div>
                  </div>
                  <button
                      type="button"
                      onClick={handleTogglePlayback}
                      className="grid h-14 w-14 shrink-0 rounded-full place-items-center bg-transparent text-[#355c39] shadow-[0_12px_24px_rgba(53,92,57,0.2)] hover:cursor-pointer"
                      aria-label="پخش تمرین">
                    <PlayCircleIcon size={64}/>
                  </button>
         
                </div> */}

                {currentTrack ? (
                    <audio
                      ref={audioRef}
                      key={currentTrack.id}
                      src={currentTrack.filePath}
                      className="sr-only"
                    />
                  ) : null}
              </div>  
                {/* ----------------------------- Response Area ------------------------------ */}

<div>
<div className='flex gap-1 mb-2'> 
                      <Pen color='#9b8a58'/>
                      <span>هر چی می‌شنوی تایپ کن </span>
                    </div>
                    <div className='w-full h-full'>
                  
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#405241]">                
                  </label>
                  <textarea
                  value={typedPreview}
                  onChange={(e) => onTypedPreviewChange(e.target.value)}
                  placeholder="Type here..."
                  dir='ltr'
                  className="w-full resize-none border border-[#e7e0cd]  rounded-[1.2rem] bg-white px-4 py-3 text-sm leading-8 text-[#2f4330] placeholder:text-[#9da795] focus:border-[#9cb287] focus:outline-none"
                  />  
                </div>
</div>
           
         
                {/* <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="md" className="bg-[#f8f1d9]">
                    راهنمایی
                  </Button>
                  <div className="text-xs text-[#7a8774]">
                    {currentTrack ? currentTrack.title : 'هنوز نمونه‌ای انتخاب نشده است.'}
                  </div>
                </div> */}
            
             {/* ----------------------------- Submit Area ------------------------------ */}

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
                         
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


              <Button onClick={onSubmit} size="lg" className="min-w-56">
                {submitting ? 'در حال ارسال...' : 'بررسی پاسخ'}
              </Button>
            </div>

            {/* {submitMessage ? (
              <p className="mt-4 rounded-[1.1rem] bg-[#eef5e7] px-4 py-3 text-sm text-[#406047]">
                {submitMessage}
              </p>
            ) : null} */}

              <button
                type="button"
                onClick={onShuffleTrack}
                className="h-full inline-flex items-center gap-2 rounded-full bg-[#f7e9c7] px-5 text-sm font-medium text-[#5f4c18] transition hover:bg-[#f4dfac]"
              >
                <span>✦</span>
              تمرین بعدی
              </button>



            </div>
            </div></div></div>
            </div>

                           
        </div>
  
    </section>
  );
}
