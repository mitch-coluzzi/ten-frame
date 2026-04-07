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
- **Session B — Strategy Flows + Animation: SHIPPED v1.1.0** (April 7, 2026)
  - problemLadder.js (tier 1–5, needsStrategyChoice, shouldShowPattern)
  - strategyEngine.js (DIRECT / TAKE_FROM_TEN / BREAK_APART step sequencer)
  - NumberBond.js (Strategy 2 split visual)
  - StrategySelectScreen.js (two-card picker)
  - SolveScreen.js (tap-to-remove guided steps, auto-advance, role-frozen frames)
  - ResultScreen.js (spring answer reveal, "Did you notice?" for tier 3+, Play Again / New Problem)
  - HomeScreen rewritten: vertical input layout, green Start With palette, navigation wired
  - Animation: react-native Animated API used (instruction pulse + answer spring). Reanimated 2 plugin still loaded but unused — reserved for a polish pass once core flow is validated.

### User Feedback Folded In (v1.1.0)
- "Greyed out" spectator frames → switched to full color (opacity 1.0). Spectators are visually identical to active frames now; only the target frame gets a glow ring + interactivity.
- "Start with" input → green / dark green palette (border, label, background tint).
- Inputs displayed vertically (Start with → minus sign → Take away) instead of horizontally.

### Session D — v1.3.0 (April 7, 2026)
**Pedagogy pass — explain mode, not test mode.**

Lillie's tutor (Mitch) clarified the framing: this app's purpose is to **explain** how subtraction/addition works, not to test whether she knows the answer. That shifts how mistakes, hints, and progression should feel — every interaction should reinforce the concept, never gate her.

**Shipped:**
- Frame state migrated to `cells: boolean[10]` arrays — every cell independently tappable.
- DotGrid modes: 'remove' (any filled), 'add' (any empty), 'sandbox' (any toggle).
- Hint/forgive system: wrong taps anywhere on target frame OR on a non-target frame trigger a yellow border-ring pulse on the target — gentle "try here" instead of silent rejection. SolveScreen wraps each frame in outer Pressable to catch wrong-region taps.
- "Try the other way" button on Result for sub problems with two strategies (TAKE_FROM_TEN ↔ BREAK_APART). Replays the same problem with the alternate path so cross-strategy comparison happens immediately.
- Sandbox / Free Play screen: 4 frames, free tap-to-toggle, live total readout. No problem, no judgment.
- Home expression layout switched from stacked column to horizontal `14 + 5` row.
- NumberBond redesigned for emphasis: muted-gray whole on top, angled connector lines, two parts tightly grouped inside a colored pill (oval) with `+` between — visually says "this number is made of these two pieces."
- StrategySelectScreen now embeds the NumberBond visual at the top of each card, then the operation chain in big numerals.

### v1.3.1 (April 7, 2026)
- "Highlight which to tap" — DotGrid renders the next N "should-tap" cells with a pulsing yellow↔orange ring. SolveScreen computes the set per step (last N filled in remove mode, first N empty in add mode) and recomputes after each tap. Guides without forcing — any valid cell still works.

### Session E.2 — v1.4.2 (April 7, 2026): Spatial bond + click fix + input clamping
- **Spatial bond layout**: bond parts now render as satellite circles directly UNDER the frame they target. For 14−5 Break Apart (5 = 4+1), the "4" circle sits below the active-ones frame (the one with 4 dots) and the "1" circle sits below the active-ten frame. Visual association is now direct: "this number affects this frame." TenFrame extended with `bondLabel` + `bondColor` props. The bond `whole` is shown as small gray text above the framesWrap.
- strategyEngine: BREAK_APART and MAKE_A_TEN bond steps now include a `bondTargets` array (e.g. `['active-ones', 'active-ten']`) mapping each `bondParts[i]` to a frame role.
- Standalone NumberBond removed from SolveScreen (still used by StrategySelectScreen previews where there are no frames to attach to).
- **Click fix**: NumberBond + EquationLine got `pointerEvents="none"` so their inner Views (especially the rotated bond lines) don't intercept clicks meant for parent Pressables. StrategySelectScreen cards switched from Pressable to TouchableOpacity for more reliable tap handling on react-native-web.
- **Input clamping**: typing 41 in the input is now physically prevented. New `sanitizeInput()` helper strips non-digits and clamps to a max on every onChangeText. For SUB: b ≤ a. For ADD: b ≤ MAX − a. Op toggle also re-clamps b. Combined max for addition is 40 (e.g. 20+20).

### Session E.1 — v1.4.1 (April 7, 2026): Bond + equation polish
- **NumberBond**: redesigned again — now **two separate circles** (one per part), **no `+` sign** between them. Lillie read the previous `+` as making it look like another equation; the bond should say "this is two pieces of one number," not "do this math."
- **New `EquationLine` component**: renders any equation as `LHS = ☐` with a blank-box visual placeholder for the answer. Strategy cards and SolveScreen instruction text both use it. Equations are now PROMPTS, not completed math — reinforces "discover the answer through the dots."
- **Phase pills are tappable** — Lillie can jump back to Watch (or any phase) at any time. Cancels in-progress Show loop on jump.
- **Watch animation slowed** per Lillie's pace: initial pause 800→1400ms, per-dot 600→1100ms, bond/final hold 1700→2800ms, breath 500→900ms. All timing constants live at top of the Show useEffect for easy further tuning.

### Session E — v1.4.0 (April 7, 2026): Show / Do / Teach SHIPPED
Linear three-phase sequence per problem, in keeping with the "explain not test" framing. Each problem now runs:
1. **Show** — app auto-plays the demonstration. Frames mutate on a timer (~600ms/dot), instruction text and bond surface in sync, no input required. Skip-ahead button available.
2. **Do** — current guided flow with highlights showing which cells to tap and hint pulses for wrong taps.
3. **Teach** — bare execution. Highlights, instruction card, and bond all hidden. Hints still catch wrong taps (gentle, not punishing). "Your turn!" banner is the only on-screen prompt.

Phase indicator pills at top of SolveScreen (👁 Watch / 🖐 Try / 🎓 Show me) show current state. Frame state resets between phases. ResultScreen shows "You taught it yourself! 🎉" celebration line when reached via the Teach phase.

**Also fixed in this session:** ScrollView wasn't scrollable on web because react-native-web requires an explicit `style={{flex:1}}` on the ScrollView itself (not just contentContainerStyle). Applied fix to Home, Strategy, Solve, and Sandbox screens.

### Pedagogical Framing — "Show one, Do one, Teach one" (original proposal — now shipped)
Mitch suggested the classical pedagogy model. Mapping it to this app:
- **Show one** — Auto-play mode. The app demonstrates the problem itself: dots animate out, instruction text surfaces in sync, no input required. (Future: pair with audio narration via expo-speech.)
- **Do one** — Current Solve flow. Highlights guide which cells to tap. Hints catch wrong taps. She drives, app supports.
- **Teach one** — She picks a problem and either narrates it back to a parent watching, or the app prompts "Now show me how" with no highlights/no instruction text — pure execution. Could also be a "make your own problem" flow built on top of Sandbox.

This is queued for the next session. Open question: should "Show / Do / Teach" be a mode toggle on Home (3-way radio) or a sequence the child progresses through naturally for each problem?

### Open / Deferred from prior design discussion
- **Forecast / predict-the-answer feature** — held for next session pending the "explain not test" framing reconsideration. May reshape (e.g. show the answer up front, then walk through WHY).
- **Audio narration via expo-speech** — held; arguably the highest-impact accessibility win for a 6yo non-reader.
- **Problem sets / doubles drills** — deferred.
**Addition mode added + visual + UX overhaul:**
- Ten-frames now vertical 5×2 (was horizontal 2×5). Column-major fill order: top-to-bottom column 1, then column 2.
- Math-style stacked input on Home: right-aligned with the operator sign on the LEFT of the bottom number, divider line below — like the column subtraction layout kids learn in school.
- Filled dots are GREEN (not coral). Green = ten-frame fill + "Start with" + addition. Red = "Take away" + subtraction. Color carries semantic meaning.
- +/− toggle radio buttons at top of Home — switches between addition and subtraction mode.
- Strategy cards rewritten: numerals only, minimal text. Each card shows the equation chain in big numbers. Pre-reader friendly per Lillie's age.
- NumberBond `/ \` rotation was inverted — fixed.
- Play Again button on Result now returns to Home (popToTop) instead of replaying the same problem.
- Addition strategies: DIRECT (no ten crossing) and MAKE_A_TEN (split addend into "fill the ten" + "overflow into next frame").
- Addition implementation: `classifyAddInitial(a, b)` builds frames sized for the sum but with only `a` cells initially filled. SolveScreen taps fill empty cells (mode='add') instead of removing filled ones (mode='remove').
- All routing functions (problemLadder, strategyEngine) take an `operation` parameter — `OPERATIONS.SUBTRACT` or `OPERATIONS.ADD`.

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
