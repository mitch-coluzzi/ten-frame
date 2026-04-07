# Ten Frame Math — Claude Code Context
**Project:** Ten Frame Subtraction Tool for Lillie (age 6)
**Repo:** Kids repo — standalone module at `/ten-frame/`
**Version:** 1.0.0
**Status:** Ready to build — Session A

---

## What We Are Building

A guided, interactive ten-frame subtraction tool teaching two foundational mental math strategies to a 6-year-old. Fully local, no backend, no API keys, no environment variables.

Numbers range from 0–40, requiring up to 4 ten frames (2×5 grids each).

---

## Core Concept

Ten frames are 2×5 grids of dots. Numbers are represented by filling dots left-to-right, top-to-bottom across as many frames as needed.

For any subtraction problem, frames are classified into three roles before solving:

| Role | Description | Visual Treatment |
|---|---|---|
| Spectator | Full tens frames uninvolved in the subtraction | Dimmed, locked |
| Active Ten | The full ten frame the subtraction will touch | Bright, interactive |
| Active Ones | The partial frame representing leftover ones | Bright, interactive |

**Example — 34 − 5:**
- Frames 1 and 2 (the 20) → Spectator
- Frame 3 (the full 10) → Active Ten
- Frame 4 (the 4) → Active Ones
- The child solves 14 − 5, the spectator frames reactivate, answer assembles as 20 + 9 = 29

---

## The Two Strategies

Both strategies apply to the same problem. The child chooses which path to take.

### Strategy 1 — Take from the Ten
**14 − 5 example:**
1. Remove 5 from the Active Ten frame (10 − 5 = 5)
2. Combine remaining 5 with the Active Ones (4)
3. Result: 5 + 4 = 9

Mental move: attack the ten directly, then combine remainders.

### Strategy 2 — Break Apart the Subtrahend
**14 − 5 example:**
1. Split 5 into (4 + 1) — matching the ones count
2. Remove the 4 from Active Ones → ones frame goes empty
3. Remove remaining 1 from Active Ten
4. Result: 9

Mental move: decompose the subtrahend to zero out the ones first, then handle the remainder.

---

## Problem Difficulty Ladder

| Tier | Example | What is being learned |
|---|---|---|
| 1 | 9 − 4 | Single frame, no ten crossing |
| 2 | 13 − 5 | Crosses ten, two strategies introduced |
| 3 | 23 − 5 | Same math fact, one spectator frame |
| 4 | 33 − 5 | Same math fact, two spectator frames |
| 5 | 34 − 7 | Crosses ten, spectator frames, harder decomposition |

Tier is computed by `problemLadder.js` from the minuend and subtrahend values.

---

## Screen Flow

```
HomeScreen
  → enter minuend (starting number, 1–40)
  → enter subtrahend (number to subtract, constrained to not exceed minuend)
  → tap Solve

StrategySelectScreen
  → display the problem
  → two choices: "Take from the ten" / "Break the [n] apart"
  → child taps one

SolveScreen
  → guided step-by-step interaction
  → frames display with role-based visual states
  → child taps to remove dots per strategy steps
  → app prompts each step with simple language

ResultScreen
  → answer displayed large
  → optional: "Did you notice?" prompt for Tier 3–5 problems surfacing the pattern
  → Play Again / New Problem
```

---

## Folder Structure

```
/ten-frame/
  app.json
  babel.config.js
  App.js
  /src/
    /components/
      TenFrame.js         ← single frame grid, dot states
      DotGrid.js          ← 2×5 dot layout, active/spectator/empty states
      NumberBond.js       ← subtrahend split visual (Strategy 2 only)
    /screens/
      HomeScreen.js
      StrategySelectScreen.js
      SolveScreen.js
      ResultScreen.js
    /logic/
      frameClassifier.js  ← assigns spectator/active-ten/active-ones roles
      problemLadder.js    ← returns tier 1–5 for any given problem
      strategyEngine.js   ← step sequencer for both strategies
    /constants/
      theme.js            ← colors, fonts, sizing
```

---

## Stack

- Expo managed workflow (same as Animal Mixer in this repo)
- React Native
- Reanimated 2 — dot entry/exit animations
- React Navigation — screen transitions
- Local state only (useState, useReducer) — no Supabase, no API

**No environment variables required.**

---

## Scaffold Commands

```bash
# From /ten-frame/
npx create-expo-app . --template blank
npx expo install react-native-reanimated
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

Add to `babel.config.js`:
```js
plugins: ['react-native-reanimated/plugin']
```

---

## Visual Design

**Aesthetic:** Warm, toy-like, high contrast. Readable from arm's length by a 6-year-old.

**Dot states:**
- Filled / Active: warm coral-red
- Empty slot: warm cream with tan border
- Spectator filled: desaturated/dimmed version of filled
- Removing (mid-animation): flashes amber → shrinks to nothing

**Frames:**
- Off-white background with warm wood-tone border
- Spectator frames: reduced opacity (~40%), no interaction
- Active frames: full opacity, tap targets enabled

**Typography:** Nunito or Fredoka One — rounded, chunky, friendly. Numbers large.

**Layout:** Portrait orientation. 2×2 frame grid at top, controls below.

---

## Animation Spec (Reanimated 2)

| Event | Animation |
|---|---|
| Dot added | Scale 0→1 with spring bounce |
| Dot removed (active) | Flash amber, scale 1→0 over 300ms |
| Spectator frames lock | Opacity 1→0.4 over 200ms |
| Spectator frames reactivate | Opacity 0.4→1 over 200ms |
| Result reveal | Number scales up with spring, brief color flash |
| Strategy 2 split | Subtrahend numeral splits into two labeled parts with slide animation |

---

## Session Plan

**Session A — Core Structure**
- Scaffold Expo app
- `theme.js` constants
- `TenFrame.js` and `DotGrid.js` components
- `frameClassifier.js` logic
- `HomeScreen.js` with number input
- Basic frame display wired to input value (no interaction yet)

**Session B — Strategy Flows + Animation**
- `strategyEngine.js`
- `problemLadder.js`
- `StrategySelectScreen.js`
- `SolveScreen.js` with guided step interaction
- `ResultScreen.js`
- `NumberBond.js` for Strategy 2
- Full Reanimated 2 animation layer

---

## Constraints

- Portrait orientation only
- Minuend: 1–40
- Subtrahend: 1–minuend (never goes below zero)
- No score tracking in v1.0 (add in v1.1 if desired)
- No sound in v1.0
- APK built locally via `npx expo run:android` or `eas build --platform android --profile preview --local`

---

## Implementation Addendum (Claude Code session log)

### Build Status
- **Session A — Core Structure: SHIPPED v1.0.0** (April 7, 2026)
  - Expo scaffold, theme.js, frameClassifier.js, DotGrid.js, TenFrame.js, HomeScreen.js with live frame preview wired to inputs.

### Web + Mobile Parity (added v1.0.1)
- Spec is React Native / Expo, but Mitch wants the same product accessible via web AND phone, both updated in parallel from a single codebase.
- Expo Web (react-native-web + @expo/metro-runtime) chosen — same source tree, same components, exports a static bundle for web.
- Railway hosts the web build via Nixpacks: `npm install → npm run build (expo export -p web) → npm start (serve dist)`.
- Mitch will test in Railway (web) first before installing Expo Go for mobile.

### Repo Decision
- Standalone repo `mitch-coluzzi/ten-frame` confirmed (not a subfolder of a "Kids repo").
- The spec's `/ten-frame/` folder maps to repo root.

### Asset Decision
- Placeholder 1×1 PNGs created at `assets/{icon,splash,adaptive-icon,favicon}.png` so Expo doesn't error. Real branded assets pending.

### Session Plan Reminder for Next Design Session
- Session B is queued: problemLadder.js, strategyEngine.js, StrategySelectScreen, SolveScreen, ResultScreen, NumberBond, Reanimated layer, font wiring (Nunito or Fredoka via expo-font).
- Mitch wants to verify Session A end-to-end on Railway before Session B is built.
