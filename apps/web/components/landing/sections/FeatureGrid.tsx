import { features } from '../landingData';
import SectionHeading from './SectionHeading';

export default function FeatureGrid() {
  return (
    <section id="features" className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ú†Ø±Ø§ØŸ"
          title="Ú†Ø±Ø§ NovaØŸ"
          description="ÙˆÛŒÚ˜Ú¯ÛŒâ€ŒÙ‡Ø§ÛŒÛŒ Ú©Ù‡ ØªÙ…Ø±ÛŒÙ† Ø±Ø§ Ø³Ø§Ø¯Ù‡ØŒ Ú¯Ø±Ù… Ùˆ Ø¯Ø± Ø¹ÛŒÙ† Ø­Ø§Ù„ Ù…Ø¤Ø«Ø± Ù†Ú¯Ù‡ Ù…ÛŒâ€ŒØ¯Ø§Ø±Ù†Ø¯."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-[1.6rem] border border-[#ebdfc7] bg-white/85 p-6 text-center shadow-[0_12px_30px_rgba(84,96,67,0.06)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${feature.accent}`}>
                  <Icon className="h-8 w-8 text-[#355c39]" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#29412d]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#61705d]">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
