interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'start';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-right';

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-[#d9e4d6] bg-white/80 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-[#6e7d63] shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f2c14e]" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-extrabold leading-tight text-[#28412d] md:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-[#60705d] md:text-base">{description}</p>
      ) : null}
    </div>
  );
}
