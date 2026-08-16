import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';
import { SCRIPT } from '../lib/content';
import { clack } from '../lib/ambient';
import { Footer } from './Footer';

gsap.registerPlugin(ScrollTrigger);

const GREY = '#555555';

export const CinematicExperience = ({ count }) => {
  const rootRef = useRef(null);
  const progressRef = useRef(null);
  const flickerPlayed = useRef(false);
  const codaTriggerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });

      // SCENE 1 — the letters + the dissolve
      const s1 = gsap.timeline({
        scrollTrigger: {
          trigger: '.scene-letters',
          start: 'top top',
          end: '+=280%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
      s1.to('.scroll-hint', { opacity: 0, duration: 0.3 }, 0)
        .to('.tagline', { opacity: 0, y: -24, duration: 0.7 }, 0.2)
        .to('.letter-amp', { opacity: 0, scale: 0.7, duration: 0.7 }, 0.6)
        .to(
          '.letter-s',
          { x: '30vw', y: '-26vh', rotate: 9, opacity: 0, duration: 1.5, ease: 'power1.in' },
          0.8
        )
        .to('.letter-r', { x: '12vw', color: GREY, duration: 1.4 }, 1.0)
        .fromTo(
          '.dissolve-caption',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          2.0
        )
        .to('.dissolve-caption', { autoAlpha: 0, y: -16, duration: 0.5 }, 2.9)
        .to('.letter-r', { opacity: 0, duration: 0.5 }, 3.1)
        .to({}, { duration: 0.4 }, 3.6);

      // SCENE 2 — the warning to the new boy
      const s2 = gsap.timeline({
        scrollTrigger: {
          trigger: '.scene-warning',
          start: 'top top',
          end: '+=700%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
      s2.fromTo(
        '.notice-chrome',
        { opacity: 0, scale: 1.14 },
        { opacity: 1, scale: 1, duration: 0.18, ease: 'power4.out' },
        0
      );
      SCRIPT.warningLines.forEach((_, i) => {
        const at = 0.6 + i * 1.9;
        s2.call(() => clack(), [], at + 0.12);
        s2.fromTo(
          `.warn-line-${i}`,
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          at
        ).to(`.warn-line-${i}`, { autoAlpha: 0, y: -18, duration: 0.4, ease: 'power2.in' }, at + 1.45);
      });
      const g0 = 0.6 + SCRIPT.warningLines.length * 1.9 + 0.3;
      s2.fromTo('.glitch-calm', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, g0)
        .to('.glitch-calm', { autoAlpha: 0, duration: 0.06 }, g0 + 1.0)
        .fromTo('.glitch-break', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, g0 + 1.06)
        .to('.glitch-break', { autoAlpha: 0, duration: 0.06 }, g0 + 1.6)
        .fromTo('.glitch-after', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, g0 + 1.75)
        .to('.glitch-after', { autoAlpha: 0, duration: 0.4 }, g0 + 2.6)
        .to('.notice-chrome', { opacity: 0, duration: 0.4 }, g0 + 2.7)
        .to({}, { duration: 0.3 }, g0 + 3.0);

      // SCENE 3 — the mask slips
      const s3 = gsap.timeline({
        scrollTrigger: {
          trigger: '.scene-mask',
          start: 'top top',
          end: '+=380%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
      s3.fromTo('.ghost-r', { opacity: 0 }, { opacity: 0.05, duration: 0.8 }, 0)
        .fromTo('.mask-line-1', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.7)
        .to('.mask-line-1', { autoAlpha: 0, y: -18, duration: 0.5 }, 2.4)
        .to({}, { duration: 0.5 }, 2.9)
        .fromTo('.mask-line-2', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 3.4)
        .to('.mask-line-2', { autoAlpha: 0, duration: 0.6 }, 5.2)
        .fromTo(
          '.mask-r-dot',
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 1, scale: 1, duration: 0.8 },
          5.6
        )
        .to('.ghost-r', { opacity: 0, duration: 0.4 }, 5.6)
        .to('.mask-r-dot', { autoAlpha: 0, duration: 0.8 }, 6.8)
        .to({}, { duration: 0.6 }, 7.6);

      // SCENE 4 — fake end, long silence, the coda
      const s4 = gsap.timeline({
        scrollTrigger: {
          trigger: '.scene-coda',
          start: 'top top',
          end: '+=520%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress > 0.96 && !flickerPlayed.current) {
              flickerPlayed.current = true;
              animate('.final-r', {
                opacity: [0, 0.85, 0, 0.4, 0],
                duration: 750,
                ease: 'linear',
              });
            }
            if (self.progress < 0.85) flickerPlayed.current = false;
          },
        },
      });
      s4.to({}, { duration: 1.4 })
        .fromTo('.coda-line-1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0 }, 1.6)
        .to('.coda-line-1', { autoAlpha: 0, duration: 0.7 }, 3.4)
        .fromTo('.coda-line-2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9 }, 3.9)
        .to('.coda-line-2', { autoAlpha: 0, duration: 0.7 }, 5.4)
        .fromTo('.coda-line-3', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 6.0)
        .fromTo('.coda-dots', { width: 0 }, { width: '4.2em', duration: 1.6, ease: 'steps(16)' }, 6.8)
        .set('.coda-cursor', { css: { animationName: 'cursor-heartbeat', animationDuration: '1.3s' } }, 8.5)
        .to('.coda-line-3', { autoAlpha: 0, duration: 1.2 }, 9.2)
        .to({}, { duration: 0.8 }, 10.4);

      codaTriggerRef.current = s4.scrollTrigger;

      ScrollTrigger.create({
        trigger: '.scene-warning',
        start: 'top top',
        onEnter: clack,
      });

      if (window.location.hash === '#coda') {
        const jumpToCoda = () => {
          ScrollTrigger.refresh();
          if (codaTriggerRef.current) {
            window.scrollTo(0, codaTriggerRef.current.start + 120);
          }
        };
        requestAnimationFrame(jumpToCoda);
        setTimeout(jumpToCoda, 800);
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} data-testid="cinematic-experience">
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-px bg-[#C5B2A1]/30 origin-left scale-x-0 z-50"
        aria-hidden="true"
      />

      <section className="scene-letters relative h-screen w-full overflow-hidden" data-testid="scene-letters">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex items-baseline font-serif-human font-light leading-none tracking-tighter text-[#E8D8C8]"
            data-testid="hero-letters"
          >
            <span className="letter-r text-[42vw] md:text-[min(27vw,64vh)]" data-testid="letter-r">R</span>
            <span className="letter-amp text-[13vw] md:text-[min(8vw,19vh)] italic mx-[1.5vw] opacity-70">&amp;</span>
            <span className="letter-s text-[42vw] md:text-[min(27vw,64vh)]" data-testid="letter-s">S</span>
          </div>
        </div>
        <p
          className="tagline absolute inset-x-0 top-[70%] md:top-[78%] text-center font-serif-human italic font-light text-xl md:text-3xl text-[#C5B2A1]/80 px-6"
          data-testid="hero-tagline"
        >
          {SCRIPT.tagline}
        </p>
        <p
          className="dissolve-caption absolute inset-x-0 top-[77%] md:top-[85%] text-center font-mono-notice text-xs md:text-base tracking-[0.18em] text-white/90 px-6 opacity-0"
          data-testid="dissolve-caption"
        >
          {SCRIPT.dissolveCaption}
        </p>
        <div className="scroll-hint absolute bottom-10 inset-x-0 flex justify-center">
          <span className="font-mono-notice text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-[#4a4a4a]">
            scroll to read the notice
          </span>
        </div>
      </section>

      <section className="scene-warning relative h-screen w-full overflow-hidden" data-testid="scene-warning">
        <div className="notice-chrome absolute top-0 inset-x-0 flex justify-between pl-6 md:pl-10 pr-20 pt-6 opacity-0">
          <span className="font-mono-notice text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40">
            {SCRIPT.chromeLeft}
          </span>
          <span className="font-mono-notice text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40 hidden sm:inline">
            {SCRIPT.chromeRight}
          </span>
        </div>
        {SCRIPT.warningLines.map((line, i) => (
          <p
            key={i}
            className={`warn-line warn-line-${i} absolute inset-0 flex items-center px-[8vw] md:px-[12vw] opacity-0`}
            data-testid={`warning-line-${i}`}
          >
            <span className="font-mono-notice font-light text-base md:text-2xl leading-relaxed md:leading-loose text-white/90 max-w-[34ch] md:max-w-[46ch]">
              {line}
            </span>
          </p>
        ))}
        <p className="glitch-calm absolute inset-0 flex items-center px-[8vw] md:px-[12vw] opacity-0">
          <span className="font-mono-notice font-light text-base md:text-2xl text-white/90">
            {SCRIPT.glitchCalm}
          </span>
        </p>
        <p className="glitch-break absolute inset-0 flex items-center px-[8vw] md:px-[12vw] opacity-0">
          <span
            className="glitch-crack font-mono-notice font-medium text-lg md:text-3xl text-white"
            data-testid="glitch-line"
          >
            {SCRIPT.glitchBreak}
          </span>
        </p>
        <p className="glitch-after absolute inset-0 flex items-center px-[8vw] md:px-[12vw] opacity-0">
          <span className="font-mono-notice font-light text-sm md:text-base text-[#555]">
            {SCRIPT.glitchAfter}
          </span>
        </p>
      </section>

      <section className="scene-mask relative h-screen w-full overflow-hidden" data-testid="scene-mask">
        <span
          className="ghost-r absolute inset-0 flex items-center justify-center font-serif-human text-[70vw] md:text-[40vw] leading-none text-[#E8D8C8] opacity-0 select-none"
          aria-hidden="true"
        >
          R
        </span>
        <p className="mask-line-1 absolute inset-0 flex items-center justify-center px-8 opacity-0" data-testid="mask-line-1">
          <span className="font-mono-notice font-light text-sm md:text-lg tracking-[0.12em] leading-loose text-white/80 text-center max-w-[38ch]">
            {SCRIPT.maskLine1}
          </span>
        </p>
        <p className="mask-line-2 absolute inset-0 flex items-center justify-center px-8 opacity-0" data-testid="mask-line-2">
          <span className="font-serif-human font-light text-3xl md:text-5xl text-[#C5B2A1] text-center leading-relaxed max-w-[24ch]">
            {SCRIPT.maskLine2}
          </span>
        </p>
        <span
          className="mask-r-dot absolute inset-0 flex items-center justify-center font-serif-human font-light text-[26vw] md:text-[14vw] text-[#8a7a6a] opacity-0"
          data-testid="mask-r-dot"
        >
          R.
        </span>
      </section>

      <section className="scene-coda relative h-screen w-full overflow-hidden bg-black" data-testid="scene-coda">
        <p className="coda-line-1 absolute inset-0 flex items-center justify-center px-8 opacity-0" data-testid="coda-line-1">
          <span className="font-serif-human font-light text-2xl md:text-4xl text-[#C5B2A1] text-center leading-relaxed max-w-[26ch]">
            {SCRIPT.coda1}
          </span>
        </p>
        <p className="coda-line-2 absolute inset-0 flex items-center justify-center px-8 opacity-0" data-testid="coda-line-2">
          <span className="font-serif-human font-light text-2xl md:text-4xl text-[#C5B2A1] text-center leading-relaxed">
            {SCRIPT.coda2}
          </span>
        </p>
        <p className="coda-line-3 absolute inset-0 flex items-center justify-center px-8 opacity-0" data-testid="coda-line-3">
          <span className="font-serif-human font-light text-2xl md:text-4xl text-[#C5B2A1]/90 text-center leading-relaxed">
            {SCRIPT.coda3}
            <span className="coda-dots">{SCRIPT.codaDots}</span>
            <span className="coda-cursor cursor-blink text-[#C5B2A1]/70">|</span>
          </span>
        </p>
        <span
          className="final-r absolute inset-0 flex items-center justify-center font-serif-human font-light text-[18vw] md:text-[10vw] text-[#C5B2A1] opacity-0"
          data-testid="final-r"
        >
          R
        </span>
      </section>

      <Footer
        count={count}
        onSkipToCoda={() => {
          window.history.replaceState(null, '', '#coda');
          if (codaTriggerRef.current) {
            window.scrollTo({ top: codaTriggerRef.current.start + 120, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
};
