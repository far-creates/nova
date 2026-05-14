import Image from 'next/image';

export default function ValueBanner() {
  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[#e8dfc8] bg-gradient-to-r from-[#fff8ea] via-[#fef5db] to-[#f4fbe9] shadow-[0_18px_40px_rgba(84,96,67,0.08)]">
          <div className="grid items-center gap-6 px-5 py-5 md:grid-cols-[0.95fr_1.05fr] md:px-8">
            <div className="flex items-center gap-4">
              <div className="relative h-32 w-40 overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#f7f1cf,#fdfaf0)] shadow-inner">
                <Image
                  src="/images/hero/hero-bg.png"
                  alt=""
                  fill
                  className="object-cover object-left-top opacity-60"
                  aria-hidden="true"
                />
                <div className="absolute left-4 bottom-4 h-10 w-10 rounded-full bg-[#5c7843]/20 blur-md" />
                <div className="absolute right-4 top-4 h-6 w-6 rounded-full bg-[#f2bc3a]/60" />
              </div>
              <div>
                <h3 className="text-3xl font-black leading-tight text-[#2a4030] md:text-4xl">
                  رشد کن و
                  <br />
                  به رشد ایران کمک کن!
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 md:justify-end">
              <div className="hidden h-10 w-px bg-[#d8cfae] md:block" />
              <p className="max-w-2xl text-sm leading-8 text-[#5d6c56] md:text-base">
                با یادگیری و تمرین، آینده‌ی خودت را می‌سازی و در ساختن فردایی بهتر برای
                همه نقش داری.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
