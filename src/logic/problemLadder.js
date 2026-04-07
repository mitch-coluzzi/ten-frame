// problemLadder.js
// Tier 1–5 difficulty + strategy choice helpers, for both subtraction and addition.

import { OPERATIONS } from './strategyEngine';

export function getTier(operation, a, b) {
  if (a < 1 || b < 1) return 1;
  if (operation === OPERATIONS.SUBTRACT && b > a) return 1;

  if (operation === OPERATIONS.SUBTRACT) {
    const ones = a % 10;
    const tens = Math.floor(a / 10);
    const crossesTen = b > ones;
    if (!crossesTen && tens === 0) return 1;
    if (crossesTen && tens === 1) return 2;
    if (crossesTen && tens === 2) return 3;
    if (crossesTen && tens === 3 && ones < 4) return 4;
    if (crossesTen && tens >= 3) return 5;
    return 1;
  }

  // Addition
  const ones = a % 10;
  const open = ones === 0 ? 10 : 10 - ones;
  const crossesTen = b > open && (a + b) > 10;
  const sumTens = Math.floor((a + b) / 10);
  if (!crossesTen) return 1;
  if (crossesTen && sumTens <= 1) return 2;
  if (crossesTen && sumTens === 2) return 3;
  if (crossesTen && sumTens === 3) return 4;
  return 5;
}

export function needsStrategyChoice(operation, a, b) {
  if (operation === OPERATIONS.SUBTRACT) {
    const ones = a % 10;
    return b > ones && a >= 10;
  }
  // Addition: only ask when crossing a ten
  const ones = a % 10;
  const open = ones === 0 ? 10 : 10 - ones;
  return b > open && (a + b) > 10;
}

export function shouldShowPattern(operation, a, b) {
  return getTier(operation, a, b) >= 3;
}
