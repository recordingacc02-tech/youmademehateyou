import { useRef } from 'react';

export const MaskFigure = ({ isStatic = false }) => {
  const rootRef = useRef(null);

  const crackOffset = isStatic ? 0 : 1;
  const outlineOffset = isStatic ? 0 : 1;

  return (
    <div
      ref={rootRef}
      className="mask-figure absolute inset-0 flex items-center justify-center pointer-events-none"
      data-testid="mask-figure"
    >
      <svg
        viewBox="0 0 100 120"
        className="w-[42vmin] h-[50vmin] text-[#C5B2A1]"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="mask-outline"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={outlineOffset}
          d="M50,12 C74,12 88,34 88,60 C88,88 72,108 50,108 C28,108 12,88 12,60 C12,34 26,12 50,12 Z"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="0.8"
        />
        <path
          className="mask-eye"
          d="M30,52 L42,49"
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="1.2"
          strokeLinecap="round"
          style={isStatic ? { opacity: 0.8 } : { opacity: 0 }}
        />
        <path
          className="mask-eye"
          d="M58,49 L70,52"
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="1.2"
          strokeLinecap="round"
          style={isStatic ? { opacity: 0.8 } : { opacity: 0 }}
        />
        <path
          className="mask-crack"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={crackOffset}
          d="M50,12 L45,38 L55,56 L47,82 L52,108"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="0.6"
        />
        <path
          className="mask-crack"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={crackOffset}
          d="M88,60 L66,62 L58,74"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="0.6"
        />
        <path
          className="mask-crack"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={crackOffset}
          d="M12,60 L30,64 L38,78"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
};
