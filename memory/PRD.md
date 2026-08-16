# PRD — R & S "youmademehateyou"

## Original Problem Statement
A single-page, scroll-driven cinematic web experience: an anonymous "warning notice" left behind by ex **R** for the *new boy* of **S**. Deadpan, clinical, darkly funny hazard-label voice — until the mask slips and the coda reveals the hate was love all along. Black canvas, monospace "notice" type for the cold warning, human serif for the vulnerable lines. Restraint is the whole effect: ONE glitch burst, pure stillness in the coda.

## Architecture
- **Frontend:** React (CRA/craco) + Tailwind. GSAP ScrollTrigger (pin + scrub) drives 4 pinned scenes; Anime.js v4 for micro-interactions (button press, final R flicker). `prefers-reduced-motion` renders a static readable document version instead.
- **Backend:** FastAPI, minimal — only a view counter. Routes: `GET /api/`, `GET /api/views`, `POST /api/views` (upsert $inc).
- **Database:** MongoDB, single doc in `counters` collection (`_id: "page_views"`). Droppable — frontend fails silently and hides the count.

## User Personas
- The anonymous author (R) — not a user, the voice.
- The reader — arrives via shared link, scrolls, gets the gut-punch, shares it on.

## Core Requirements (static)
1. Hero: R & S warm together → S dissolves away on scroll.
2. Warning to the new boy: 5 deadpan mono lines + one glitch crack ("I HOPE HE'S—").
3. Mask slips: "no one" serif reveal → "R." alone → black (fake ending).
4. Coda: long black silence → 3 soft serif lines, final line trails off with typing dots + blinking cursor → R flickers once → end.
5. Share button (native share / clipboard + toast), ambient hum toggle (off by default), view counter.
6. Mobile-first pacing, reduced-motion static fallback, fast-scroller safety via pinned beats.

## Implemented (2026-07)
- Full cinematic scroll experience (4 pinned scrubbed scenes, ~23 viewport heights) — hero, S-dissolve, warning + glitch crack, mask slip, fake end, coda with trailing cursor + final R flicker.
- Tonal engine: warm #E8D8C8 → clinical white → dead grey #555 → faint warm #C5B2A1 coda.
- Hazard-notice chrome ("HAZARD NOTICE — FILE R/S") during the warning scene.
- Grain overlay, scroll progress hairline, share (navigator.share → clipboard + sonner toast), WebAudio ambient hum toggle (off by default).
- View counter (FastAPI + MongoDB), shown in footer as "witnessed N times"; silent when backend unreachable.
- Static reduced-motion version of the full notice.
- data-testids on all interactive/critical elements.

## Verified
- curl: `GET /api/`, `POST /api/views` increments, `GET /api/views` reads.
- Screenshots (desktop 1920x800 + mobile 390x844): hero, dissolve, warning lines, glitch burst, mask serif, "R.", coda lines, trailing dots + cursor, footer counter, end black.

## Backlog
- P1: OG/meta share preview card (title/description set; no og:image yet — could generate a minimal "R & S" card image).
- P2: Web Share API level 2 with a share image.
- P2: Optional hash deep-link to replay from the coda.
- P3: Locale variants of the notice text.

## Next Tasks
1. Add og:image card for richer link previews when shared.
2. Optional: subtle "replay" affordance at the footer.
