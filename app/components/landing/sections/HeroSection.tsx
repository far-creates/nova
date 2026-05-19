'use client';

import Image from 'next/image';



export default function HeroSectionUnified() {
  
return (
    <section id="home" className="relative overflow-hidden pb-10 md:pb-14 z-0">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-[#f4d77f]/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-96 w-96 rounded-full bg-[#dbe7c9]/26 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[#fdfaf2]" />
      </div>

      {/* ----------------------------- Background Image ------------------------------ */}
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden ">
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

      {/* ----------------------------- Upper Containter ------------------------------ */}

          <div className="relative z-10 grid min-h-[560px] items-stretch gap-8 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
            
      {/* ----------------------------- Moscot Containter ------------------------------ */}

          <div className="relative flex items-start ">
              <div className="absolute right-0 top-4 z-20 max-w-[360px] rounded-[1.6rem] border border-[#eadbb5] bg-white px-5 py-4 text-right shadow-[0_18px_45px_rgba(132,112,63,0.14)]"> 
                <p className="mt-2 text-xl font-semibold leading-8 text-[#435345] text-center">
                 با دقت گوش کن 💛
                </p>
                <div className="text-2xl leading-none text-[#f0be31] text-center">_</div>        
                <p className="mt-2 text-md font-normal leading-8 text-[#435345] text-center">
                  هر صدا یه فرصت جدید برای یادگیریه! 
                </p>
              </div>
              <Image 
                 src="/images/mascot/nova-mascot.png"
                 alt="nova mascot"
                 width={480}
                 height={480}
                 priority
                 className="object-cover object-center translate-x-24 translate-y-21"
                 aria-hidden="true"/>
            </div>

      {/* ----------------------------- Marketing Text Containter ------------------------------ */}

            <div className="relative flex flex-col justify-center gap-6 rounded-[2rem] -translate-y-18 translate-x-24">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#eadfbe] bg-white/88 px-4 py-2 text-sm font-medium text-[#5c6a57] shadow-[0_10px_24px_rgba(105,95,48,0.08)]">
                <span className="text-[#d4a72c] text-md">✦</span>
                <span>تمرین شنیداری هوشمند برای یادگیری طبیعی‌تر</span>
              </div>

              <div>
                <h1 className="max-w-2xl text-2xl leading-[150%] font-black leading-[1.14] tracking-tight text-[#2b3f2c] sm:text-5xl md:text-6xl lg:text-5xl">
                  وقتی خوب گوش می‌کنی،
                  <br />
                  بهتر صحبت می‌کنی
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-9 text-[#5e6d59] md:text-lg">
                  تمرین‌های تعاملی  <span className="text-[#d4a72c]">✦</span> لهجه‌های واقعی <span className="text-[#d4a72c]">✦</span> محتوای کاربردی  
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
          </div>
        </div>
    </div>
</section>
  );
}
