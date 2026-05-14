import Image from 'next/image';
import Button from '@/app/components/ui/Button';
import { closingNotes } from '../landingData';

export default function ClosingCTA() {
  return (
    <section id="story" className="py-8 md:py-12">
      <div id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.2rem] border border-[#e8dfc8] bg-gradient-to-r from-[#fff8ea] via-[#fff3d8] to-[#f7fbee] px-6 py-6 shadow-[0_18px_40px_rgba(84,96,67,0.08)] md:px-8">
          <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.05fr_0.95fr]">
            <div className="relative flex items-center justify-center">
              <div className="relative h-44 w-44 overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f7f1cf,#fefaf0)] shadow-inner">
                <Image
                  src="/images/hero/hero-bg.png"
                  alt=""
                  fill
                  className="object-cover object-left opacity-75"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute -top-2 left-6 rounded-full bg-white px-3 py-2 text-xl shadow-sm">
                🙂
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-black leading-tight text-[#2b422f] md:text-4xl">
                رشد کن و
                <br />
                به رشد ایران کمک کن!
              </h2>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d7d0b9] bg-[#fffaf0] px-4 py-2 text-xs font-medium text-[#6d6957]">
                با یادگیری و تمرین، مسیرت روشن‌تر می‌شود.
              </div>
              <div className="mt-6 flex justify-center">
                <Button size="lg">شروع تمرین شنیداری</Button>
              </div>
            </div>

            <div className="space-y-4 text-[#4e5d4c]">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-xl text-[#e1a91a]">♥</div>
                <p className="text-sm leading-7">
                  با یادگیری و آموزش، آینده خودت را بساز و در ساختن آینده‌ای روشن برای
                  ایران سهیم باش.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[#eadfc7] bg-white/70 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {closingNotes.map((note) => (
                    <div key={note} className="rounded-2xl bg-[#fffdf6] px-3 py-3 text-sm">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
