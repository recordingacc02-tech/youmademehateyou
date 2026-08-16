import { useEffect, useState } from 'react';
import { ambientIsOn, onAmbientChange, rainIsOn, toggleAmbient, toggleRain } from '../lib/ambient';

export const useAudioHum = () => {
  const [on, setOn] = useState(ambientIsOn());
  const [rainOn, setRainOn] = useState(rainIsOn());
  useEffect(
    () =>
      onAmbientChange(() => {
        setOn(ambientIsOn());
        setRainOn(rainIsOn());
      }),
    []
  );
  return { on, rainOn, toggle: toggleAmbient, toggleRain };
};
