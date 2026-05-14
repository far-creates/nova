import { impactSteps } from '../landingData';
import SectionHeading from './SectionHeading';

export default function ImpactSection() {
  return (
    <section id="impact" className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="هر یادگیری، یک اثر مثبت"
          title="هر یادگیری، یک تأثیر مثبت"
          description="در این مسیر، هر تمرین یک قدم است و هر قدم می‌تواند به فرد، کلاس و جامعه کمک کند."
        />

        <div className="mt-8 rounded-[2rem] border border-[#dfe7d5] bg-[#eef5e8]/70 px-5 py-7 shadow-[0_18px_40px_rgba(84,96,67,0.06)]">
          <div className="grid gap-6 md:grid-cols-5">
            {impactSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-sm">
                    <Icon className="h-6 w-6 text-[#355c39]" />
                  </div>
                  <div className="mt-3 max-w-[180px] text-sm font-semibold leading-6 text-[#2c402f]">
                    {step.title}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-[#61705d]">{step.description}</p>
                  {index < impactSteps.length - 1 ? (
                    <div className="absolute right-[-18%] top-7 hidden h-px w-[36%] border-t border-dashed border-[#cbd6c0] md:block" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
