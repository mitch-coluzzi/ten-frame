# Ten Frame Math — Claude Code Session Context

> **Read this first, every session. ~2 minute load.**
> Last updated: v1.0.0 · Session A · April 7, 2026
> For: Lillie (age 6) · Owner: Mitch Coluzzi

---

## What This Product Is

A guided, interactive **ten-frame subtraction tool** teaching two foundational mental-math strategies to a 6-year-old:

1. **Take from the Ten** — attack the active ten directly, then combine remainders
2. **Break Apart the Subtrahend** — decompose the subtrahend to zero out the ones first, then handle the remainder

Numbers range **0–40** (up to 4 ten-frames). Frames are classified into three visual roles per problem: **spectator** (dimmed, locked), **active-ten** (bright, full ten that will be touched), **active-ones** (bright, partial frame of leftover ones).

Tablet-first, portrait only, fully local — no backend, no API, no env vars.

---

## The File Tree

```
ten-frame/
├── package.json
├── app.json                       (Expo config — portrait, version 1.0.0)
├── babel.config.js                (reanimated plugin)
├── App.js                         (Stack navigator + APP_VERSION constant)
├── README.md
├── src/
│   ├── components/
│   │   ├── TenFrame.js            (single bordered frame)
│   │   ├── DotGrid.js             (2x5 layout, role-aware states)
│   │   └── NumberBond.js          (Session B — Strategy 2 split visual)
│   ├── screens/
│   │   ├── HomeScreen.js          (number entry + live frame display)
│   │   ├── StrategySelectScreen.js  (Session B)
│   │   ├── SolveScreen.js         (Session B)
│   │   └── ResultScreen.js        (Session B)
│   ├── logic/
│   │   ├── frameClassifier.js     (spectator/active-ten/active-ones roles)
│   │   ├── problemLadder.js       (Session B — tier 1–5)
│   │   └── strategyEngine.js      (Session B — step sequencer)
│   └── constants/
│       └── theme.js               (colors, fonts, sizing, animation timings)
└── docs/
    ├── CONTEXT.md                 (this file)
    └── CLAUDE_CHAT_CONTEXT.md     (Claude.ai design-session bootstrap, full spec)
```

---

## Architecture Rules (Locked)

- **Expo managed workflow.** No bare workflow, no native ejection.
- **Local state only** — `useState` / `useReducer`. No Supabase, no API, no env vars.
- **Portrait orientation only** (`app.json`).
- **Theme is the single source of truth** for colors, fonts, sizing, animation timings. No hardcoded colors anywhere outside `theme.js`.
- **Reanimated 2** for all animations (Session B). No `Animated` API mixing.
- **No localStorage / AsyncStorage for preferences in v1.x.** Score tracking deferred to v1.1.
- **Tap targets ≥44px** — driven by `theme.sizing.dotSize`.
- **Minuend constraint:** 1–40. **Subtrahend constraint:** 1..minuend (never below zero).

---

## Stack & Versioning

- **Expo:** ~51.0.0
- **React Native:** 0.74.5
- **React Navigation:** stack v6
- **Reanimated:** ~3.10.1
- **App version:** `APP_VERSION` constant in `App.js` — currently `1.0.0`. Displayed in stack header (`Ten Frame Math  v1.0.0`).
- **Bump rule:** patch on each Claude Code session that ships code; minor on session boundaries (Session A=1.0, Session B=1.1, etc); major at classroom-pilot quality.
- **Repo:** `mitch-coluzzi/ten-frame` (treated as the spec's `/ten-frame/` module root)
- **Local clone:** `/mnt/c/Users/mitch/OneDrive/Desktop/ten-frame`

---

## Workflow Rules (mirrored from SoldFast CRM)

- **Tool approvals:** All tool calls auto-approved. Test environment.
- **Git identity:** Mitch Coluzzi / mitch@soldfast.com
- **Git commands:** All git commands pre-approved. Run `cd` then git as separate Bash calls (never `&&` chained). `git push` authorized.
- **Single-branch workflow:** `main` only.
- **Commit protocol:** Anytime the user prompts to commit, ALWAYS update BOTH `docs/CONTEXT.md` AND `docs/CLAUDE_CHAT_CONTEXT.md` to reflect work just completed BEFORE committing. Include both files in the same commit.
- **No stalling on commits:** push immediately, don't idle.
- **Verify protocol:** When asked to verify/check tree, report current `APP_VERSION` from `App.js` and the session it corresponds to.

---

## Frame Classifier — How It Works

`src/logic/frameClassifier.js` exports `classifyFrames(minuend, subtrahend)`:

- Builds frames by packing `minuend` dots left→right, top→bottom, 10 per frame.
- Identifies the **rightmost partial frame** (1–9 dots) → `active-ones`.
- Identifies the **rightmost full frame** (10 dots) → `active-ten`.
- All other full frames to the left → `spectator`.
- If `minuend` is a clean multiple of 10, there is no `active-ones` — the last full frame becomes the active-ten.

Example — `34 − 5`:
- Frames 1, 2 → spectator (the 20)
- Frame 3 → active-ten (the full 10)
- Frame 4 → active-ones (the 4)

---

## Module Status

| Module | Status | Notes |
|---|---|---|
| `theme.js` | ✅ Session A | Colors, sizing, fonts, animation timings |
| `frameClassifier.js` | ✅ Session A | Role assignment + buildFrames helper |
| `DotGrid.js` | ✅ Session A | 2x5 cells, filled/empty/spectator visual states |
| `TenFrame.js` | ✅ Session A | Bordered card wrapper, spectator opacity |
| `HomeScreen.js` | ✅ Session A | Number entry, live frame preview, Solve stub |
| `App.js` | ✅ Session A | Stack navigator, version in header |
| `problemLadder.js` | ⬜ Session B | Tier 1–5 from minuend/subtrahend |
| `strategyEngine.js` | ⬜ Session B | Step sequencer for both strategies |
| `StrategySelectScreen.js` | ⬜ Session B | Two-choice picker |
| `SolveScreen.js` | ⬜ Session B | Guided step interaction |
| `ResultScreen.js` | ⬜ Session B | Answer reveal + "Did you notice?" |
| `NumberBond.js` | ⬜ Session B | Strategy 2 subtrahend split visual |
| Reanimated layer | ⬜ Session B | Per spec animation table |

---

## Session Log

| Date | Session | Version | Notes |
|---|---|---|---|
| 2026-04-07 | A | 1.0.0 | Pivot from erroneous vanilla scaffold. Expo scaffold (`package.json`, `app.json`, `babel.config.js`, `App.js`), `theme.js`, `frameClassifier.js`, `DotGrid.js`, `TenFrame.js`, `HomeScreen.js` shipped. Live frame preview wired to minuend/subtrahend inputs. Solve button stubbed pending Session B. |

---

## Pre-Build Note for Mitch

`npm install` has not been run yet — `node_modules/` does not exist locally. Before launching the simulator/device, run:

```bash
cd /mnt/c/Users/mitch/OneDrive/Desktop/ten-frame
npm install
npx expo start
```
