import { useRef } from 'react';

const TAPE =
  'repeating-linear-gradient(45deg, rgba(212, 165, 60, 0.13) 0 14px, transparent 14px 28px)';

export const HazardLayer = ({ isStatic = false }) => {
  const numRef = useRef(null);

  return (
    <div className="absolute inset-0 pointer-events-none" data-testid="hazard-layer">
      <div
        className={`hazard-tape absolute top-14 left-0 right-0 h-2 ${isStatic ? '' : 'opacity-0'}`}
        style={{ backgroundImage: TAPE }}
        aria-hidden="true"
      />
      <div
        className={`hazard-tape absolute bottom-8 left-0 right-0 h-2 ${isStatic ? '' : 'opacity-0'}`}
        style={{ backgroundImage: TAPE }}
        aria-hidden="true"
      />
      <div
        ref={numRef}
        data-testid="countdown-number"
        aria-hidden="true"
        className="countdown-number absolute right-[5vw] top-1/2 -translate-y-1/2 font-mono-notice font-thin text-[34vw] md:text-[22vw] leading-none text-white/[0.05] select-none"
      >
        {isStatic ? '00' : '10'}
      </div>
    </div>
  );
};
