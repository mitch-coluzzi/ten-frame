// problemLadder.js
// Returns difficulty tier 1–5 for any subtraction problem.
//
// Tier 1: single frame, no ten crossing (e.g. 9 − 4)
// Tier 2: crosses ten, one ten in play (e.g. 13 − 5)
// Tier 3: crosses ten, two spectator frames possible (e.g. 23 − 5)
// Tier 4: crosses ten, multiple spectator frames (e.g. 33 − 5)
// Tier 5: harder decomposition — large minuend AND larger ones removal (e.g. 34 − 7)

export function getTier(minuend, subtrahend) {
  if (minuend < 1 || subtrahend < 1 || subtrahend > minuend) return 1;

  const ones = minuend % 10;
  const tens = Math.floor(minuend / 10);
  const crossesTen = subtrahend > ones;

  if (!crossesTen && tens === 0) return 1;
  if (crossesTen && tens === 1) return 2;
  if (crossesTen && tens === 2) return 3;
  if (crossesTen && tens === 3 && ones < 4) return 4;
  if (crossesTen && tens >= 3) return 5;
  return 1;
}

// Strategy choice: tier 1 problems don't need a strategy choice
// (no ten crossing — just remove from the partial frame).
export function needsStrategyChoice(minuend, subtrahend) {
  const ones = minuend % 10;
  return subtrahend > ones && minuend >= 10;
}

// "Did you notice?" prompt only fires for tier 3+ (where the same
// math fact repeats across spectator frames).
export function shouldShowPattern(minuend, subtrahend) {
  return getTier(minuend, subtrahend) >= 3;
}
