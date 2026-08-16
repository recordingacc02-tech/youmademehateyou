import { shareNotice, shareCoda } from '../lib/share';

export const Footer = ({ count, codaCount, onSkipToCoda }) => (
  <footer
    className="relative bg-black min-h-[55vh] flex flex-col items-center justify-center gap-7 px-6"
    data-testid="notice-footer"
  >
    <p className="font-mono-notice text-[10px] tracking-[0.4em] uppercase text-[#3d3d3d]">
      youmademehateyou
    </p>
    <p
      className="font-mono-notice text-[10px] md:text-xs tracking-[0.2em] text-[#555] text-center"
      data-testid="view-counter"
    >
      filed anonymously{count != null ? ` · witnessed ${count} times` : ''}
      {codaCount != null && (
        <span className="text-[8px] md:text-[9px] tracking-[0.2em] text-[#3a3a3a]" data-testid="coda-counter">
          {' '}· {codaCount} reached the coda
        </span>
      )}
    </p>
    {count != null && codaCount != null && count >= 10 && codaCount / count < 0.5 && (
      <p
        className="font-mono-notice text-[8px] md:text-[9px] tracking-[0.3em] text-[#2b2b2b] text-center"
        data-testid="witness-ratio"
      >
        most don't make it to the end
      </p>
    )}
    <button
      data-testid="footer-share-button"
      onClick={shareNotice}
      className="font-mono-notice text-[10px] tracking-[0.3em] uppercase text-[#666] border-b border-[#333] pb-1 hover:text-[#C5B2A1] hover:border-[#C5B2A1]/40 transition-colors duration-300"
    >
      pass this notice on
    </button>
    <button
      data-testid="replay-button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="font-mono-notice text-[9px] tracking-[0.3em] uppercase text-[#3d3d3d] hover:text-[#8a7a6a] transition-colors duration-300"
    >
      read it again
    </button>
    {onSkipToCoda && (
      <button
        data-testid="coda-skip-button"
        onClick={onSkipToCoda}
        className="font-mono-notice text-[9px] tracking-[0.3em] uppercase text-[#333] hover:text-[#8a7a6a] transition-colors duration-300"
      >
        skip to the coda
      </button>
    )}
    <button
      data-testid="footer-coda-share-button"
      onClick={shareCoda}
      className="font-mono-notice text-[9px] tracking-[0.3em] uppercase text-[#2e2e2e] hover:text-[#8a7a6a] transition-colors duration-300"
    >
      pass on just the ending
    </button>
    <p className="font-mono-notice text-[9px] tracking-[0.25em] uppercase text-[#2e2e2e]">
      — r
    </p>
  </footer>
);
