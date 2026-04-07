# Ten Frame Math — Claude Code Session Context

> **Read this first, every session. ~2 minute load.**
> Last updated: v1.3.0 · Session D · April 7, 2026
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
| `theme.js` | ✅ A + B | Added green palette, spectator opacity 1.0 (full color) |
| `frameClassifier.js` | ✅ Session A | Role assignment + buildFrames helper |
| `DotGrid.js` | ✅ A + B | Added `interactive` + `onCellPress`; rightmost filled is tappable |
| `TenFrame.js` | ✅ A + B | Added `isTarget` glow ring + interactive passthrough |
| `HomeScreen.js` | ✅ A + B | Vertical input column, green Start With, navigates to StrategySelect or Solve |
| `App.js` | ✅ A + B | All 4 screens registered, APP_VERSION = 1.1.0 |
| `problemLadder.js` | ✅ Session B | getTier, needsStrategyChoice, shouldShowPattern |
| `strategyEngine.js` | ✅ Session B | buildSteps for DIRECT / TAKE_FROM_TEN / BREAK_APART |
| `StrategySelectScreen.js` | ✅ Session B | Two-card picker, only shown when ten-crossing |
| `SolveScreen.js` | ✅ Session B | Tap-to-remove guided steps, frozen role classification, auto-advance |
| `ResultScreen.js` | ✅ Session B | Spring scale answer reveal, "Did you notice?" for tier 3+ |
| `NumberBond.js` | ✅ Session B | Whole + two-part visual, used in Break Apart step 1 |
| Animation layer | ✅ Session B (basic) | react-native Animated API: instruction pulse, answer spring. Reanimated 2 plugin loaded but not yet used — reserved for polish pass. |

---

## Session Log

| Date | Session | Version | Notes |
|---|---|---|---|
| 2026-04-07 | A | 1.0.0 | Pivot from erroneous vanilla scaffold. Expo scaffold (`package.json`, `app.json`, `babel.config.js`, `App.js`), `theme.js`, `frameClassifier.js`, `DotGrid.js`, `TenFrame.js`, `HomeScreen.js` shipped. Live frame preview wired to minuend/subtrahend inputs. Solve button stubbed pending Session B. |
| 2026-04-07 | A.1 | 1.0.1 | Web parity added: react-dom, react-native-web, @expo/metro-runtime, serve. `app.json` web config (metro bundler, static output). Scripts: dev/web/build/start. Placeholder PNG assets created. `.gitignore` added. JessieProject local folder deleted. Railway auto-deploy via Nixpacks (install → build → start). |
| 2026-04-07 | A.2 | 1.0.2 | Railway build fixes: replaced 1×1 PNGs with valid sized assets (1024 icon, 1284×2778 splash, 48 favicon); switched web `output` from `static` to `single` (SPA, no expo-router required). |
| 2026-04-07 | B | 1.1.0 | **Full app build.** problemLadder + strategyEngine logic. NumberBond component. StrategySelectScreen, SolveScreen (interactive tap-to-remove with auto-advance), ResultScreen (spring answer reveal + "Did you notice?" for tier 3+). All 4 screens registered in App.js. HomeScreen rewritten: vertical input column, green "Start with" palette, navigation wired (DIRECT for tier 1, otherwise StrategySelect). Spectator frames now full color (opacity 1.0) per user feedback. DotGrid + TenFrame extended with interactive/onCellPress/isTarget. Animation: react-native Animated API for instruction pulse + answer spring. |
| 2026-04-07 | C | 1.2.0 | **Addition mode + UX overhaul.** Vertical 5×2 ten-frame layout (column-major fill). Math-style stacked input on Home (right-aligned, sign on left, divider). Green/red palette (greens for ten-frames + Start With + addition; reds for Take Away + subtraction). +/− toggle (radio buttons) on Home. Strategy cards rewritten — numerals only, minimal text, color-coded. NumberBond rotation fixed (was inverted). SolveScreen handles both ops with `mode='add'\|'remove'` on DotGrid; addition uses `classifyAddInitial(a,b)` so frames pre-size to a+b and the user fills empty cells. strategyEngine adds OPERATIONS enum + buildAddSteps (DIRECT, MAKE_A_TEN). problemLadder + needsStrategyChoice + shouldShowPattern signatures take operation. Play Again returns to Home (popToTop). Tier 1 add/sub still skips strategy picker. |
| 2026-04-07 | D | 1.3.0 | **Pedagogy pass: any-cell taps, hint/forgive, alt strategy, sandbox, bond emphasis.** Frame state migrated from `dotCount` to `cells: boolean[10]` array — every cell is independently tappable. DotGrid modes: 'remove' (any filled tappable), 'add' (any empty), 'sandbox' (any toggle). SolveScreen wraps frames in outer Pressable for wrong-tap detection → triggers hint pulse (yellow border ring) on target frame. ResultScreen offers "Try the other way" button for sub strategies (TAKE_FROM_TEN ↔ BREAK_APART). New SandboxScreen: 4 frames, free toggle, live total. Home → Free Play button. Home expression now horizontal (`14 + 5` in a row, not stacked). NumberBond redesigned: muted gray whole on top, angled connector lines, parts grouped tight inside a colored pill/oval with `+` between them — strong visual emphasis on decomposition. StrategySelectScreen embeds NumberBond at top of each card, divider, then operation chain in big numerals. |

---

## Web + Mobile Parity

**Single codebase, two targets.** The Expo project is configured for web export so Railway can serve a static bundle while the same code runs on iOS/Android via Expo Go (and later as a native APK/IPA).

- **Local mobile dev:** `npm run dev` → Expo Dev Tools → scan QR with Expo Go.
- **Local web dev:** `npm run web` → opens in browser via react-native-web.
- **Production web build:** `npm run build` → outputs static bundle to `dist/`.
- **Production web serve:** `npm start` → `serve dist -s -l $PORT` (Railway-compatible).
- **Railway flow:** Nixpacks auto-detects Node, runs `npm install` → `npm run build` → `npm start`. No special config needed.
- **Web deps added:** `react-dom`, `react-native-web`, `@expo/metro-runtime`, `serve`.
- **Web export config:** `app.json` → `expo.web` = `{ bundler: "metro", output: "static" }`.

Both targets update in parallel from the same commit. Any change to `src/` ships to web on push and is picked up by Expo Go on next reload.

## Pre-Build Note for Mitch

`npm install` has not been run yet — `node_modules/` does not exist locally. Before launching the simulator/device, run:

```bash
cd /mnt/c/Users/mitch/OneDrive/Desktop/ten-frame
npm install
npm run dev      # mobile via Expo Go
npm run web      # web via react-native-web in browser
```

Railway will run `npm install && npm run build && npm start` automatically on push.
