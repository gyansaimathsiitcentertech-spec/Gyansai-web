import React from 'react';

interface DualTitleProps {
  lead: string;
  accent: string;
  subtitle?: string;
  align?: 'center' | 'left';
  light?: boolean;
  action?: React.ReactNode;
}

export function DualTitle({
  lead,
  accent,
  subtitle,
  align = 'center',
  light = false,
  action,
}: DualTitleProps) {
  if (align === 'center') {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className={`display-face text-2xl font-bold tracking-tight sm:text-4xl ${
            light ? 'text-white' : 'text-[#1F386B]'
          }`}
        >
          <span>{lead}</span>{' '}
          <span className={light ? 'text-[#FF8FB1]' : 'text-[#AA2451]'}>{accent}</span>
        </h2>
        <div className="section-rule mx-auto mt-3" aria-hidden="true" />
        {subtitle && (
          <p
            className={`mt-3 text-sm leading-relaxed sm:text-base ${
              light ? 'text-white/80' : 'text-slate-600'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2
          className={`display-face text-2xl font-bold tracking-tight sm:text-4xl ${
            light ? 'text-white' : 'text-[#1F386B]'
          }`}
        >
          <span>{lead}</span>{' '}
          <span className={light ? 'text-[#FF8FB1]' : 'text-[#AA2451]'}>{accent}</span>
        </h2>
        <div className="section-rule mt-3" aria-hidden="true" />
        {subtitle && (
          <p
            className={`mt-3 text-sm leading-relaxed sm:text-base ${
              light ? 'text-white/80' : 'text-slate-600'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
  action?: React.ReactNode;
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = 'left',
  light = false,
  action,
}: SectionHeadingProps) {
  const words = title.trim().split(' ');
  const splitIdx = Math.max(1, Math.ceil(words.length / 2));
  const lead = words.slice(0, splitIdx).join(' ');
  const accent = words.slice(splitIdx).join(' ');

  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {kicker && (
        <p
          className={`mb-1.5 text-xs font-semibold tracking-wide ${
            light ? 'text-[#FF8FB1]' : 'text-[#AA2451]'
          }`}
        >
          {kicker}
        </p>
      )}
      <DualTitle
        lead={lead}
        accent={accent}
        subtitle={subtitle}
        align={align}
        light={light}
        action={action}
      />
    </div>
  );
}

interface PageHeroProps {
  kicker: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageHero({ kicker, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#1F386B] py-14 text-white sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 88% 18%, #AA2451 0%, transparent 48%)',
        }}
        aria-hidden="true"
      />
      <div className="shell relative">
        <p className="text-xs font-semibold tracking-wide text-[#FF9EC0]">{kicker}</p>
        <h1 className="display-face mt-2.5 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          {description}
        </p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
