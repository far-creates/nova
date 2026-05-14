import { audiences } from '../landingData';
import SectionHeading from './SectionHeading';

export default function AudienceGrid() {
  return (
    <section id="audience" className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="برای چه کسانی؟"
          title="برای چه کسانی ساخته شده است؟"
          description="از معلم تا دانشجو و زبان‌آموز مستقل، همه می‌توانند از این ساختار ساده استفاده کنند."
        />

        <div id="learners" className="mt-8 grid gap-4 md:grid-cols-3">
          {audiences.map((item) => {
            const Icon = item.icon;
            const toneMap = {
              teacher: 'from-[#eff5eb] to-white',
              student: 'from-[#f3efe4] to-white',
              learner: 'from-[#eef2f6] to-white',
            } as const;

            return (
              <article
                key={item.title}
                className={`rounded-[1.7rem] border border-[#eadfc9] bg-gradient-to-br ${toneMap[item.tone as keyof typeof toneMap]} p-5 shadow-[0_12px_30px_rgba(84,96,67,0.06)]`}
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.5rem] bg-white shadow-sm">
                    <Icon className="h-10 w-10 text-[#355c39]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#29412d]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#60705c]">{item.description}</p>
                    <div className="mt-3 text-sm font-medium text-[#3d5a40]">
                      بیشتر بدانید →
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
