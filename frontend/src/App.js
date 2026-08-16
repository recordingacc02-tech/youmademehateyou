import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import { CinematicExperience } from '@/components/CinematicExperience';
import { StaticExperience } from '@/components/StaticExperience';
import { Controls } from '@/components/Controls';
import '@/App.css';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
let viewCounted = false;

function App() {
  const [count, setCount] = useState(null);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (viewCounted) return;
    viewCounted = true;
    axios
      .post(`${API}/views`)
      .then((r) => setCount(r.data.count))
      .catch(() => {});
  }, []);

  return (
    <div className="App" data-testid="app-root">
      <div className="grain-overlay" aria-hidden="true" />
      {reduced ? <StaticExperience count={count} /> : <CinematicExperience count={count} />}
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
