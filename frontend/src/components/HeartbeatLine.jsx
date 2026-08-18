import { useRef } from 'react';

const D =
  'M0,100 L260,100 L275,100 L283,86 L291,112 L299,100 L520,100 L545,100 L558,18 L572,168 L586,100 L780,100 L793,100 L801,88 L809,110 L817,100 L960,100 L970,96 L980,104 L990,100 L1200,100';

export const HeartbeatLine = ({ isStatic = false }) => {
  const rootRef = useRef(null);

  return (
    <div
      ref={rootRef}
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none"
      data-testid="heartbeat-line"
    >
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="w-full h-[26vh]"
        fill="none"
        aria-hidden="true"
        style={{ filter: 'drop-shadow(0 0 6px rgba(197, 178, 161, 0.25))' }}
      >
        <path
          className="ekg-path"
          d={D}
          stroke="#C5B2A1"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={isStatic ? 0 : 1}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
