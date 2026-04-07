// frameClassifier.js
// Assigns each ten-frame a role for a given subtraction problem.
//
// Roles:
//   'spectator'   — full ten-frame uninvolved in the subtraction (dimmed, locked)
//   'active-ten'  — the full ten-frame the subtraction will touch
//   'active-ones' — the partial frame representing leftover ones
//   'empty'       — frame with zero dots (not rendered or rendered blank)
//
// A "frame" in the output is a 2x5 grid (10 cells). For numbers 0–40 we
// use up to 4 frames. Frame index 0 is the leftmost / first frame.
//
// classifyFrames returns an array of frame descriptors:
//   [{ index, dotCount, role }]
//
// Inputs:
//   minuend    — the starting number (1–40)
//   subtrahend — the number being subtracted (1..minuend)
//
// Rules:
// - Total dots = minuend, packed left-to-right, top-to-bottom across frames.
// - The "ones frame" is the rightmost partial frame (dotCount < 10 && > 0).
//   If minuend is a clean multiple of 10, there is NO ones frame; the last
//   full frame becomes the active-ten and there is no active-ones.
// - The "active-ten" is the rightmost FULL frame.
// - All other full frames to the left of active-ten are spectators.
// - When subtrahend <= ones count, neither active-ten nor spectators are
//   touched mathematically — but for the teaching model we still classify
//   the rightmost full frame as the active-ten so the strategy UI has a
//   consistent target. (Tier 1 problems short-circuit this in problemLadder.)

export function buildFrames(minuend) {
  const frames = [];
  let remaining = minuend;
  let i = 0;
  while (remaining > 0) {
    const dotCount = Math.min(10, remaining);
    frames.push({ index: i, dotCount, role: 'empty' });
    remaining -= dotCount;
    i += 1;
  }
  if (frames.length === 0) {
    frames.push({ index: 0, dotCount: 0, role: 'empty' });
  }
  return frames;
}

export function classifyFrames(minuend, subtrahend) {
  if (
    typeof minuend !== 'number' ||
    typeof subtrahend !== 'number' ||
    minuend < 0 ||
    subtrahend < 0 ||
    subtrahend > minuend
  ) {
    throw new Error(
      `classifyFrames: invalid inputs minuend=${minuend} subtrahend=${subtrahend}`
    );
  }

  const frames = buildFrames(minuend);

  // Identify rightmost partial frame (dotCount in 1..9) → active-ones
  // Identify rightmost FULL frame (dotCount === 10) → active-ten
  let activeOnesIdx = -1;
  let activeTenIdx = -1;

  for (let i = frames.length - 1; i >= 0; i--) {
    if (activeOnesIdx === -1 && frames[i].dotCount > 0 && frames[i].dotCount < 10) {
      activeOnesIdx = i;
    }
  }
  for (let i = frames.length - 1; i >= 0; i--) {
    if (frames[i].dotCount === 10) {
      activeTenIdx = i;
      break;
    }
  }

  for (let i = 0; i < frames.length; i++) {
    if (i === activeOnesIdx) {
      frames[i].role = 'active-ones';
    } else if (i === activeTenIdx) {
      frames[i].role = 'active-ten';
    } else if (frames[i].dotCount === 10) {
      frames[i].role = 'spectator';
    } else {
      frames[i].role = 'empty';
    }
  }

  return frames;
}
