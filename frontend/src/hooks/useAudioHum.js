import { useEffect, useState } from 'react';
import { ambientIsOn, onAmbientChange, toggleAmbient } from '../lib/ambient';

export const useAudioHum = () => {
  const [on, setOn] = useState(ambientIsOn());
  useEffect(() => onAmbientChange(setOn), []);
  return { on, toggle: toggleAmbient };
};
