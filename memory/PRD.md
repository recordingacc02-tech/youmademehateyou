# PRD — R & S "youmademehateyou"

## Original Problem Statement
A single-page, scroll-driven cinematic web experience: an anonymous "warning notice" left behind by ex **R** for the *new boy* of **S**. Deadpan, clinical, darkly funny hazard-label voice — until the mask slips and the coda reveals the hate was love all along. Black canvas, monospace "notice" type for the cold warning, human serif for the vulnerable lines. Restraint is the whole effect: ONE glitch burst, pure stillness in the coda.

## Architecture
- **Frontend:** React (CRA/craco) + Tailwind. GSAP ScrollTrigger (pin + scrub) drives 4 pinned scenes; Anime.js v4 for micro-interactions (button press, final R flicker). WebAudio (synthesized, no audio files) for the ambient hum + sparse soft piano. `prefers-reduced-motion` renders a static readable document version instead.
- **Backend:** FastAPI, minimal — only a view counter. Routes: `GET /api/`, `GET /api/views`, `POST /api/views` (upsert $inc).
- **Database:** MongoDB, single doc in `counters` collection (`_id: "page_views"`). Droppable — frontend fails silently and hides the count.
- **Share preview:** static `public/og-image.png` (1200x630, rendered with the real Cormorant Garamond font) + og/twitter meta in `public/index.html` pointing at the absolute preview URL.

## User Personas
- The anonymous author (R) — not a user, the voice.
- The reader — arrives via shared link, scrolls, gets the gut-punch, shares it on.

## Core Requirements (static)
1. Hero: R & S warm together → S dissolves away on scroll.
2. Warning to the new boy: 5 deadpan mono lines + one glitch crack ("I HOPE HE'S—").
3. Mask slips: "no one" serif reveal → "R." alone → black (fake ending).
4. Coda: long black silence → 3 soft serif lines, final line trails off with typing dots + blinking cursor → R flickers once → end.
5. Share button (native share / clipboard + toast), ambient audio toggle (off by default), view counter.
6. Mobile-first pacing, reduced-motion static fallback, fast-scroller safety via pinned beats.

## Implemented
### 2026-07 (initial build)
- Full cinematic scroll experience (4 pinned scrubbed scenes, ~23 viewport heights): hero, S-dissolve, warning + glitch crack, mask slip, fake end, coda with trailing cursor + final R flicker.
- Tonal engine: warm #E8D8C8 → clinical white → dead grey #555 → faint warm #C5B2A1 coda.
- Hazard-notice chrome ("HAZARD NOTICE — FILE R/S") during the warning scene.
- Grain overlay, scroll progress hairline, share (navigator.share → clipboard + sonner toast), WebAudio ambient hum toggle (off by default).
- View counter (FastAPI + MongoDB) in footer as "witnessed N times"; silent when backend unreachable.
- Static reduced-motion version of the full notice.

### 2026-07 (iteration 2 — user requested)
- Full-screen hero letters (min(27vw, 64vh)) + bigger type across every scene (warning, mask, coda, static version).
- Soft synthesized piano layer added to the ambient toggle: sparse randomized A-minor notes with triangle octave, exponential decay, feedback-delay space — no audio files, still no phonk.
- og:image / twitter card meta + 1200x630 black "R & S" share card served at /og-image.png.
- Coda cursor switches from even blink to a lub-dub heartbeat pulse just before the final line fades.
- Footer "read it again" replay button — smooth-glides back to the top.
- Witness counter reset to 0 for the first real reader.

### 2026-07 (iteration 3 — user requested)
- Hazard-notice chrome now rubber-stamps in (fast scale 1.14 → 1, power4) when the warning scene begins, paired with a faint synthesized typewriter clack (bandpassed noise burst + low thock) that fires only when ambient sound is on.
- Audio engine refactored to a module singleton (`lib/ambient.js`) so scenes can trigger sound design; `useAudioHum` is now a thin subscribing wrapper.
- `#coda` deep-link: opening the URL with #coda jumps straight to the coda's black silence (instant, double-asserted to beat native fragment scrolling). Footer gained a "skip to the coda" shortcut that smooth-scrolls there and sets the hash for sharing. Static/reduced-motion version supports #coda natively via section id.
- Counter reset to 0 again after verification.

### 2026-07 (iteration 4 — user requested)
- Footer gained "pass on just the ending" — a quieter share link that copies the URL with #coda already appended.
- Every warning line now lands with its own faint key-clack (timeline calls in the scrubbed warning scene, slight random pitch jitter per clack so it sounds like real typing); fires forward and on scroll-back, silent unless ambient sound is on.
- Hardened clipboard sharing with an execCommand fallback (navigator.clipboard can be blocked without a trusted gesture).

### 2026-07 (iteration 5 — user requested)
- Coda read receipts: second counter (`coda_reaches` doc, `POST /api/views/coda`) fires once per visit when the coda scene is actually reached (ScrollTrigger onEnter in cinematic, IntersectionObserver in static). `GET/POST /api/views` now return `{count, coda}`. Footer shows it smaller and dimmer beside the witness count: "witnessed N times · M reached the coda".
- Spacebar typewriter: every keypress anywhere on the page fires a soft clack (variation built in) while ambient sound is on; modifier shortcuts (cmd/ctrl/alt) are ignored. No-op when sound is off.
- Both counters reset to 0 after verification.

### 2026-07 (iteration 6 — user requested)
- Real recorded piano: 9 Salamander-style grand piano samples (FatBoy soundfont, A2–A4) in `public/audio/piano/`, decoded into WebAudio buffers and played with random soft velocity + octave-down chance through the existing delay space. Synthesized oscillator notes remain as fallback until/if samples aren't loaded yet.
- Witness ratio whisper: when witnesses ≥ 10 and fewer than half reach the coda, the footer adds a near-invisible line — "most don't make it to the end".
- Distinct editing clacks: Backspace is a lower, duller crunch; Enter is a heavier knock followed by a carriage-return thock; all other keys keep the standard clack.

### 2026-07 (iteration 7 — user requested)
- Typewriter effect: every mono line (dissolve caption, all 5 warning lines, the glitch-calm line, the mask's mono line) types itself character by character, scrub-synced to scroll (retypes on the way back down, untypes going up), with a per-character key-clack when sound is on. Serif/coda lines keep soft fades — tonal contrast preserved.
- Rain layer: optional faint rain (looped shaped noise, lowpassed with patter top) behind its own cloud-rain toggle that only appears while ambient sound is on; off by default.
- Vinyl crackle: sparse random pops start when the coda scene is reached (ScrollTrigger in cinematic, IntersectionObserver in static) and stop if you scroll back above it; silent unless sound is on.
- Dedication line: footer carries "for s., obviously." in dim serif italic — one-line config (`SCRIPT.dedication` in lib/content.js), no accounts.

### 2026-07 (iteration 8 — user requested)
- Typing cursor: thin blinking block cursor (▍) injected by the typewriter engine at the tip of every line while it's mid-type; hidden before typing starts and after the line completes (visibility-toggled so the blink animation can't override it).
- Letter-in sound: a single deep piano note (A2 sample at half rate = A1, 55Hz) sounds when ambient is switched on while the giant R & S are on screen, and again when you scroll back up to the letters (8s cooldown).
- Rain on glass: fixed canvas overlay draws faint droplet trails that slide and self-erase (destination-out fade keeps text readable); runs only while the rain layer is on, fades in/out over 2s.

### 2026-06 (iteration 9 — "make it FULL visual" pivot)
- Scene 1: crimson red-thread-of-fate canvas drawn live between R and S — sags and sways while together, snaps into two falling dangles when S leaves; S also disintegrates into ~420 drifting dust particles (canvas sampling of the actual glyph) as it exits; global ambient dust-mote canvas behind everything.
- Scene 2: hazard-tape stripes rubber-stamp in top/bottom, a giant ghost countdown (10 → 00) ticks down behind the warning lines in sync with scroll, and the glitch burst now fires jagged white screen-crack lines across the viewport with the "I HOPE HE'S—" flash.
- Scene 3: hand-drawn porcelain mask (SVG) traces itself in line-by-line, eyes appear, cracks spider across it during "no one", then the whole mask tips and falls away as "R." appears.
- Scene 4: EKG heartbeat line draws across the coda — flat, small blips, one big spike ("my heart jumps"), then flatlines and fades to black.
- Static/reduced-motion version renders the cracked mask and full EKG inline.
- Technical: child ScrollTriggers inside pinned scenes desynced (didn't account for earlier pin spacers) — all visual beats are now driven from the parent pinned timelines; SVG stroke draws use proxy tweens setting stroke-dashoffset attributes (GSAP CSS interpolation of the property snapped instead of tweening).


- curl: `GET /api/`, `POST /api/views` increments, `GET /api/views` reads, counter reset to 0 confirmed.
- `curl -I /og-image.png` served (200, image/png).
- Screenshots (desktop + mobile): hero at full-screen scale, warning lines, glitch burst, mask serif, "R.", coda, dots + cursor, footer with replay button.
- Programmatic: coda cursor computed `animation-name` switches `cursor-blink` → `cursor-heartbeat` in the fade zone.
- NOT verified by ear: hum/piano audio output (no audio capture possible in screenshot tooling); the graph builds and schedules correctly in code.

## Deployment
- 2026-07: Deployment-agent health check — PASS, zero blockers (env config, CORS, supervisor, queries, no hardcoded secrets/ports). Ready for Emergent Kubernetes deployment (250m CPU / 1Gi / 2 replicas).

## Backlog
- P2: Hash deep-link to replay from the coda.
- P2: og-image refresh automation if the hero typography changes.
- P3: Locale variants of the notice text.

## Next Tasks
1. Optionally regenerate og-image.png if hero design changes again.
2. Consider a real recorded piano sample if synthesized tones feel too thin (would need an asset).
