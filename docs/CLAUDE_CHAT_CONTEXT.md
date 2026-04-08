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

### Session G.5 — v1.6.5 (April 7, 2026): Frame alignment fix
- TenFrame always reserves bondCircle space (via a transparent border View when `bondLabel == null`).
- Previously: when bondLabel was null (spectator frames in aggregate mode), TenFrame's column had no bondCircle and was shorter than active TenFrames. With cross-column flex-end alignment, the spectator frames sat higher than active frames because their columns started lower in the framesWrap.
- Now: spectator and active TenFrames always have identical total column heights → frame rows align horizontally on the same baseline, regardless of which frames carry visible labels.
- The v1.6.4 MAKE_A_TEN fix verified in code at strategyEngine.js line 200: `bondTargets: ['active-ten', 'active-ones']`.

### Session G.4 — v1.6.4 (April 7, 2026): Make a Ten addition fix
- **Bug**: MAKE_A_TEN strategy was using bondTargets `['active-ones', 'next-frame']` which didn't match how frames are actually labeled by `classifyAddInitial`.
- **Why it was wrong**: `classifyAddInitial(a, b)` calls `classifyFrames(SUM, b)` to get frames sized for the SUM. Roles are then assigned based on the FINAL state — so the partial frame currently holding the existing ones (e.g. 5 out of 10 for a=25) is labeled `active-ten` because in the final state it WILL be full. The new frame for the leftover ones is labeled `active-ones`.
- **Fix**: bondTargets corrected to `['active-ten', 'active-ones']`. Action step targets fixed: fill-the-ten step now targets `active-ten` (the frame currently partial), overflow step targets `active-ones` (the new frame).
- **For 25+7 specifically**: Frames are [10, 10, 5/10, 0/2]. Spectators are the first two 10s (with aggregate "20" gray label). Active group is the partial 5 frame and the empty 2 frame. Bond shows 7 → (5)(2): the 5 satellite sits above the 5/10 frame (where we add 5 to fill the ten), the 2 satellite sits above the 0/2 frame (where the overflow lands). This matches Mitch's expected behavior: "add 5 to fill up the remaining and then 2 in the leftover one."
- ADD_DIRECT was already correct (it targets active-ones which is the right frame for tier 1 cases).

### Session G.3 — v1.6.3 (April 7, 2026): Spectator aggregate label + mute button fix
- **Spectator aggregate**: when there are 2+ spectator frames (minuend ≥ 30), the per-frame green (10) labels are hidden and replaced with a single gray aggregate label centered above the spectator group ("20" for two spectators, "30" for three).
- 1 spectator (20-29): unchanged — keeps the per-frame green (10).
- 0 spectators (≤ 19): unchanged — no spectator group at all.
- Implementation: `useAggregateSpectator = spectatorFrames.length >= 2`. spectatorColumn wraps the aggregate label above the spectator frames row. Per-frame label suppressed via `bondLabel = null` for spectator frames when in aggregate mode.
- **Mute button visibility fix**: previously the button used a wrapping flex row that wasn't reliably rendering on web. Rewrote with `alignSelf: 'flex-end'` directly on the Pressable, and added a text label alongside the emoji ("🔇 Sound off" / "🔊 Sound on") so it's recognizable even if the emoji glyph fails to render.

### Session G.2 — v1.6.2 (April 7, 2026): Audio default OFF
- Jess will narrate the lessons manually. `narrate.js` `muted` flag default flipped from `false` to `true`. Audio is silent on app load.
- The 🔊/🔇 toggle on Home still works — tap to re-enable if Jess wants TTS for solo practice later.
- All `speak()` calls remain in the codebase; they just no-op while muted. Re-enabling is one tap, not a code change.

### Session G.1 — v1.6.1 (April 7, 2026): Audio quietening per Jess
- **Removed per-dot count narration** ("1, 2, 3...") in Show + Do. Was distracting per Jess's feedback.
- **Removed strategy title speech** on card tap. The bond visualization is enough; no need to verbally announce "Take from 10".
- **Final reveal phrasing changed to "X remain"**: instead of "5 plus 4 equals 9" → "9 remain". For tier 3+: "3 remain, plus 10 equals 13" preserves the static add-up.
- Action step instructions now play normally in Show (no count-suppression gate).

### Session G — v1.6.0 (April 7, 2026): Bond gap closed, count-along audio, auto-advance, bond centering
- **Take from 10 now has a bond step** in the Solve flow. Previously TAKE_FROM_TEN had no `showBond=true` step, so the bond visualization disappeared between StrategySelect and Solve. Now: bond step at the start with `bondWhole = 10 + ones` (the working part — 12 for 22-9, 14 for 14-5), `bondParts = [10, ones]`, `bondTargets = ['active-ten', 'active-ones']`. Take from 10 final step also fixed: previously omitted spectator addition (showed "1+2=3" for 22-9 instead of 13). Now computes `finalTotal = staticTotal + remainingInTen + ones`.
- **Count-along audio**: in Show, the loop now `speak(String(n+1))` after each dot mutation. In Do, `handleValidCellPress` speaks the running tally on each valid tap. Counts the action being performed ("1, 2, 3..."), not the remaining count. Teach is silent.
- **Spoken instruction phrasing**: every step now has a `spokenInstruction` field with kid-friendly TTS-optimized phrasing. Bond steps say "5 splits into 4 and 1" instead of "5 = 4 + 1". Tier 3+ final steps narrate the full add-up: "3 plus 10 equals 13" so the spectator contribution is audible. Falls back to `instruction` if absent.
- **Auto-advance non-action steps in Do + Teach**: bond/final steps no longer require a Next button. Universal useEffect: bond steps auto-advance after 1600ms, final after 400ms, other non-action after 800ms. Action steps still wait for Lillie's input.
- **Show bond hold extended** from 1200ms → 2400ms so TTS has time to finish "X splits into Y and Z" before moving on. Action step initial pause restored to 600ms so the instruction speech kicks off before the per-dot count overrides it.
- **Bond header centered over active group**: framesWrap split into `spectatorGroup` (no header) and `activeGroup` (with bond header above). For 22-9, the gray "12" with `/\` lines now sits centered over the active-ten + active-ones frames only, not over all three including the spectator.
- **Start Over button** on Solve in Do + Teach phases. Resets frame state to initial, stepIndex to 0, action count to 0, stops in-flight speech. Doesn't change phase.

### Session F — v1.5.0 (April 7, 2026): Audio narration + bond labels above frames
- **Audio narration via `expo-speech`**: new `src/lib/narrate.js` wraps speak/stop with a global module-level mute toggle. Works on iOS/Android (native TTS) and on web (Web Speech API fallback). Default voice (en-US, rate 0.9, pitch 1.0). Quiet-fail on errors so narration is never blocking.
- **Where it speaks**:
  - SolveScreen: each step's `instruction` field on entry (Show + Do phases). Teach is silent ("show me you know" — no help).
  - ResultScreen: speaks the answer on mount, stops on unmount.
  - StrategySelectScreen: speaks the card's `title` on tap.
- **Mute toggle 🔊/🔇** on HomeScreen top-right. Module-level state with `subscribeMute` so the button mirrors mute state across mount/unmount.
- **Bond labels flipped above frames** per Mitch's spec: layout is now `equation → bond whole + /\ → labels above frames → frames`. TenFrame's column order changed: bondCircle first, then frame.
- **Strategy card titles** ("Take from 10", "Take from 1", "Make a 10") added to card data structures but **not displayed visually** — they exist purely for the audio narration on tap. Lillie hears the strategy name when she selects a card.
- We may want to rename these later — they're working labels for now.

### Session E.6 — v1.4.6 (April 7, 2026): Bond Y-lines + grey-out consumed parts
- Above the framesWrap, the bond whole now renders with two angled `/\` connector lines below it (gray bars at ±32deg). Visual `whole → parts` decomposition is now obvious without having to mentally connect the satellite circles to the whole.
- Bond satellites track a `bondDone` flag. Once Lillie removes the dots associated with a bond part (i.e., `stepIndex > bi + 1` where bi is the bond part index), that satellite turns grey (border, fill, ink). The other part stays in its strategy color until consumed.
- Visually says: "this piece is done, focus on the remaining colored one."
- TenFrame: new `bondDone` prop.
- For 22−9 Break Apart: bond shows 9 → (2)(7). After step 1 removes the 2 from active-ones, the (2) satellite turns grey. After step 2 removes the 7 from active-ten, the (7) also turns grey. Result follows.

### Audio narration — Pending decision
Mitch asked whether audio could play in tune with each step. **Yes, both web and native.** `expo-speech` package wraps platform TTS on iOS/Android and falls back to the browser's `window.speechSynthesis` Web Speech API on web. Free, instant, no API key, no network. Voice quality varies by OS but it's serviceable for K-2 narration.
- Implementation: `Speech.speak(text)` at the top of each Show step + on Continue tap in Do/Teach. Cancel on phase change/skip via `Speech.stop()`.
- ~30 lines of code, single dep add (`expo-speech`).
- Decision: scope for next session (E.7 or F).

### Session E.5 — v1.4.5 (April 7, 2026): Phase flow polish + persistent bond + hidden equation card
- **Watch loop snappier**: 500ms hover after load, then straight into animation. No more per-step read pauses. Bond/final hold trimmed (2000→1200ms), action breath trimmed (550→400ms).
- **Do → Teach auto-transitions** without requiring the "Now you try!" button. When the final non-action step is reached in Do phase, a 500ms timer transitions to Teach automatically.
- **Watch → Do auto-transitions** (re-confirmed; was briefly removed during iteration).
- **Persistent strategy bond**: pulled the bondTargets/bondParts/bondWhole into a top-level `useMemo strategyBond` derived from the first showBond step. Bond satellites + the gray "whole" above frames now persist across ALL steps in Solve, not just the bond step. Lillie sees the decomposition continuously throughout the animation.
- **Equation card hidden entirely**: removed the bordered instruction card that used to render below the frames. Bonds carry the explanation; the equation text was redundant noise.

### Session E.4 — v1.4.4 (April 7, 2026): Spectator-aware Take From Ten bond + SUB b ≤ 10
- **TAKE_FROM_TEN bond fixed for spectator frames.** Previously the strategy card showed 22 = 10 + 2 (which equals 12, not 22 — pedagogically wrong). Now it correctly shows 22 = 10 (locked, gray) + 12. For 33: 33 = 20 (locked) + 13. Tier 2 (no spectators, e.g. 14) keeps the simple 14 = 10 + 4 decomposition.
- **NumberBond `staticParts` prop**: array of part indices to mark "locked." Locked parts get a gray palette (border, fill, ink) and a tiny "locked" label. Visually communicates "this part doesn't change."
- **Subtraction b ≤ 10**: subtrahend now capped at 10 since the strategies only handle single-ten-frame removal. New `SUB_B_MAX` constant in HomeScreen, applied in `b` clamp, on-change handler, and canSolve check.

### Session E.3 — v1.4.3 (April 7, 2026): Bond satellites on every screen + Watch stutter fix
- **Bond satellites everywhere**: every TenFrame on Home, Solve, and Sandbox shows a bond satellite circle below it with the current dot count (green palette). It's a permanent counter — as Lillie removes/adds dots, the satellite updates live.
- **Strategy bond step still wins**: during a Solve bond step (Break Apart, Make a Ten), the strategy's `bondTargets`/`bondParts` mapping replaces the count satellite for the affected frames, with the strategy color (red for Break Apart, green for Make a Ten).
- **Watch stutter fix**: the original Show loop had `initialPause + bondHold + breath` stacked = 5+s of dead air on the opening bond step. Refactored to a single hold per non-action step. Action steps now: 700ms read pause → 950ms per-dot → 550ms breath. Bond/final: 2000ms hold. A 350ms settle at loop start prevents the screen from feeling frozen on entry.

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
