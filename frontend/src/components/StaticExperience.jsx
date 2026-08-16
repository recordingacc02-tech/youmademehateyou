import { useEffect } from 'react';
import { SCRIPT } from '../lib/content';
import { setCrackle } from '../lib/ambient';
import { Footer } from './Footer';

export const StaticExperience = ({ count, codaCount, onCodaReached }) => {
  useEffect(() => {
    if (!onCodaReached) return undefined;
    const el = document.querySelector('[data-testid="scene-coda"]');
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onCodaReached();
          setCrackle(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onCodaReached]);

  return (
  <main className="bg-[#030303] text-[#E8D8C8]" data-testid="static-experience">
    <section className="min-h-screen flex flex-col items-center justify-center gap-10 px-6" data-testid="scene-letters">
      <div
        className="flex items-baseline font-serif-human font-light leading-none tracking-tighter"
        data-testid="hero-letters"
      >
        <span className="text-[40vw] md:text-[24vw]" data-testid="letter-r">R</span>
        <span className="text-[13vw] md:text-[8vw] italic mx-[1.5vw] opacity-50">&amp;</span>
        <span className="text-[40vw] md:text-[24vw] text-[#E8D8C8]/25" data-testid="letter-s">S</span>
      </div>
      <p className="font-serif-human italic font-light text-xl md:text-3xl text-[#C5B2A1]/80 text-center" data-testid="hero-tagline">
        {SCRIPT.tagline}
      </p>
      <p className="font-mono-notice text-xs md:text-base tracking-[0.18em] text-white/70 text-center" data-testid="dissolve-caption">
        {SCRIPT.dissolveCaption}
      </p>
    </section>

    <section className="px-[8vw] md:px-[14vw] py-[20vh] flex flex-col gap-[12vh]" data-testid="scene-warning">
      <div className="flex justify-between font-mono-notice text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40">
        <span>{SCRIPT.chromeLeft}</span>
        <span className="hidden sm:inline">{SCRIPT.chromeRight}</span>
      </div>
      {SCRIPT.warningLines.map((line, i) => (
        <p
          key={i}
          className="font-mono-notice font-light text-base md:text-2xl leading-relaxed md:leading-loose text-white/90 max-w-[46ch]"
          data-testid={`warning-line-${i}`}
        >
          {line}
        </p>
      ))}
      <p className="font-mono-notice font-light text-base md:text-2xl text-white/90">{SCRIPT.glitchCalm}</p>
      <p className="font-mono-notice font-medium text-lg md:text-3xl text-white/50 line-through" data-testid="glitch-line">
        {SCRIPT.glitchBreak}
      </p>
      <p className="font-mono-notice font-light text-sm md:text-base text-[#555]">{SCRIPT.glitchAfter}</p>
    </section>

    <section className="min-h-screen flex flex-col items-center justify-center gap-[14vh] px-8" data-testid="scene-mask">
      <p className="font-mono-notice font-light text-sm md:text-lg tracking-[0.12em] leading-loose text-white/80 text-center max-w-[38ch]" data-testid="mask-line-1">
        {SCRIPT.maskLine1}
      </p>
      <p className="font-serif-human font-light text-3xl md:text-5xl text-[#C5B2A1] text-center leading-relaxed max-w-[24ch]" data-testid="mask-line-2">
        {SCRIPT.maskLine2}
      </p>
      <span className="font-serif-human font-light text-[24vw] md:text-[13vw] text-[#8a7a6a]" data-testid="mask-r-dot">R.</span>
    </section>

    <section id="coda" className="min-h-[160vh] bg-black flex flex-col items-center justify-center gap-[16vh] px-8" data-testid="scene-coda">
      <p className="font-serif-human font-light text-2xl md:text-4xl text-[#C5B2A1] text-center leading-relaxed max-w-[26ch]" data-testid="coda-line-1">
        {SCRIPT.coda1}
      </p>
      <p className="font-serif-human font-light text-2xl md:text-4xl text-[#C5B2A1] text-center leading-relaxed" data-testid="coda-line-2">
        {SCRIPT.coda2}
      </p>
      <p className="font-serif-human font-light text-2xl md:text-4xl text-[#C5B2A1]/90 text-center leading-relaxed" data-testid="coda-line-3">
        {SCRIPT.coda3}
        <span>{SCRIPT.codaDots}</span>
      </p>
    </section>

    <Footer count={count} codaCount={codaCount} />
  </main>
  );
};
