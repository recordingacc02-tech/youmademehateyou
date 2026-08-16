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

## Verified
- curl: `GET /api/`, `POST /api/views` increments, `GET /api/views` reads, counter reset to 0 confirmed.
- `curl -I /og-image.png` served (200, image/png).
- Screenshots (desktop + mobile): hero at full-screen scale, warning lines, glitch burst, mask serif, "R.", coda, dots + cursor, footer with replay button.
- Programmatic: coda cursor computed `animation-name` switches `cursor-blink` → `cursor-heartbeat` in the fade zone.
- NOT verified by ear: hum/piano audio output (no audio capture possible in screenshot tooling); the graph builds and schedules correctly in code.

## Backlog
- P2: Hash deep-link to replay from the coda.
- P2: og-image refresh automation if the hero typography changes.
- P3: Locale variants of the notice text.

## Next Tasks
1. Optionally regenerate og-image.png if hero design changes again.
2. Consider a real recorded piano sample if synthesized tones feel too thin (would need an asset).
