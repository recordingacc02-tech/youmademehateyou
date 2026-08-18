import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import { CinematicExperience } from '@/components/CinematicExperience';
import { StaticExperience } from '@/components/StaticExperience';
import { Controls } from '@/components/Controls';
import { backspaceClack, clack, enterClack } from '@/lib/ambient';
import { useAudioHum } from '@/hooks/useAudioHum';
import { RainCanvas } from '@/components/RainCanvas';
import { DustCanvas } from '@/components/DustCanvas';
import '@/App.css';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
let viewCounted = false;
let codaCounted = false;

function App() {
  const { rainOn } = useAudioHum();
  const [count, setCount] = useState(null);
  const [codaCount, setCodaCount] = useState(null);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (viewCounted) return;
    viewCounted = true;
    axios
      .post(`${API}/views`)
      .then((r) => {
        setCount(r.data.count);
        setCodaCount(r.data.coda);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Backspace') backspaceClack();
      else if (e.key === 'Enter') enterClack();
      else clack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleCodaReached = () => {
    if (codaCounted) return;
    codaCounted = true;
    axios
      .post(`${API}/views/coda`)
      .then((r) => setCodaCount(r.data.coda))
      .catch(() => {});
  };

  const shared = { count, codaCount, onCodaReached: handleCodaReached };

  return (
    <div className="App" data-testid="app-root">
      <div className="grain-overlay" aria-hidden="true" />
      <DustCanvas />
      <RainCanvas active={rainOn} />
      {reduced ? <StaticExperience {...shared} /> : <CinematicExperience {...shared} />}
      <Controls />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            border: '1px solid #222',
            color: '#C5B2A1',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.15em',
          },
        }}
      />
    </div>
  );
}

export default App;
