'use client';

import { HyphaeIllustration } from '@/components/visual/HyphaeIllustration';
import { GlowButton } from '@/components/visual/GlowButton';
import { GlassPanel } from '@/components/visual/GlassPanel';
import { HyphaeBackground } from '@/components/visual/HyphaeBackground';
import { uiText } from '@/lib/ui-text';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--hyphai-bg-deep)]">
      <HyphaeBackground />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-5 py-12 pt-safe pb-safe md:px-6 md:py-24">
        <section className="flex flex-col items-center text-center md:flex-row md:items-center md:gap-12 md:text-left">
          <HyphaeIllustration className="mb-8 shrink-0 md:mb-0" />
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-emerald-400 md:text-5xl">
              {uiText.landing.heroTitle}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
              {uiText.landing.heroSubtitle}
            </p>
            <div className="mt-8">
              <GlowButton onClick={onLogin} className="w-full sm:w-auto">
                {uiText.landing.cta}
              </GlowButton>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:mt-20 md:grid-cols-3">
          {uiText.landing.features.map((feature) => (
            <GlassPanel key={feature.title} className="p-6">
              <h3 className="font-display text-lg font-semibold text-zinc-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
            </GlassPanel>
          ))}
        </section>

        <section className="mt-16">
          <GlassPanel className="overflow-hidden p-0">
            <div className="border-b border-[var(--hyphai-border)] bg-zinc-950/80 px-4 py-3">
              <span className="text-xs text-zinc-500">{uiText.landing.previewLabel}</span>
            </div>
            <div className="space-y-3 p-6">
              <div className="ml-auto max-w-[75%] rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 px-4 py-2 text-sm text-emerald-950">
                {uiText.landing.previewUser}
              </div>
              <div className="max-w-[85%] rounded-2xl glass-panel px-4 py-3 text-sm text-zinc-200">
                {uiText.landing.previewAssistant}
              </div>
            </div>
          </GlassPanel>
        </section>
      </div>
    </div>
  );
}
