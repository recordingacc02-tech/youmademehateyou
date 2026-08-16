import { useRef } from 'react';
import { Share2, Volume2, VolumeX } from 'lucide-react';
import { animate } from 'animejs';
import { shareNotice } from '../lib/share';
import { useAudioHum } from '../hooks/useAudioHum';

const btnClass =
  'fixed z-50 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-[#666] hover:text-[#C5B2A1] hover:border-white/25 transition-colors duration-300';

export const Controls = () => {
  const { on, toggle } = useAudioHum();
  const shareRef = useRef(null);
  const audioRef = useRef(null);

  const press = (ref) => {
    if (ref.current) animate(ref.current, { scale: [1, 0.82, 1], duration: 380, ease: 'outQuad' });
  };

  return (
    <>
      <button
        ref={shareRef}
        data-testid="share-button"
        aria-label="share this notice"
        onClick={() => {
          press(shareRef);
          shareNotice();
        }}
        className={`${btnClass} top-5 right-5`}
      >
        <Share2 size={15} strokeWidth={1.5} />
      </button>
      <button
        ref={audioRef}
        data-testid="audio-toggle-button"
        aria-label={on ? 'mute ambient hum' : 'play ambient hum'}
        aria-pressed={on}
        onClick={() => {
          press(audioRef);
          toggle();
        }}
        className={`${btnClass} bottom-5 right-5 ${on ? 'text-[#C5B2A1] border-white/25' : ''}`}
      >
        {on ? <Volume2 size={15} strokeWidth={1.5} /> : <VolumeX size={15} strokeWidth={1.5} />}
      </button>
    </>
  );
};
