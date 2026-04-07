// strategyEngine.js
// Produces a sequence of guided steps for a given strategy + problem.
//
// Each step describes:
//   instruction: string for the child
//   target:      'active-ten' | 'active-ones' | null  (which frame to tap)
//   removeCount: number of dots to remove from target this step (0 if none)
//   showBond:    boolean — Strategy 2 step 1 displays the NumberBond
//   bondParts:   [a, b] when showBond
//   isFinal:     last step → ResultScreen on advance

export const STRATEGIES = {
  TAKE_FROM_TEN: 'take-from-ten',
  BREAK_APART: 'break-apart',
  DIRECT: 'direct', // tier 1 — no ten crossing, single frame
};

export function buildSteps(strategy, minuend, subtrahend) {
  const ones = minuend % 10;

  if (strategy === STRATEGIES.DIRECT) {
    return [
      {
        instruction: `Take away ${subtrahend} from the ones frame.`,
        target: 'active-ones',
        removeCount: subtrahend,
      },
      {
        instruction: `You have ${minuend - subtrahend} left!`,
        target: null,
        removeCount: 0,
        isFinal: true,
      },
    ];
  }

  if (strategy === STRATEGIES.TAKE_FROM_TEN) {
    const remainingInTen = 10 - subtrahend;
    return [
      {
        instruction: `Take ${subtrahend} away from the full ten frame.`,
        target: 'active-ten',
        removeCount: subtrahend,
      },
      {
        instruction: `Now combine what's left: ${remainingInTen} + ${ones} = ${remainingInTen + ones}`,
        target: null,
        removeCount: 0,
        isFinal: true,
      },
    ];
  }

  if (strategy === STRATEGIES.BREAK_APART) {
    const firstChunk = ones;            // zero out the ones frame first
    const secondChunk = subtrahend - ones;
    return [
      {
        instruction: `Break ${subtrahend} into ${firstChunk} and ${secondChunk}.`,
        target: null,
        removeCount: 0,
        showBond: true,
        bondParts: [firstChunk, secondChunk],
      },
      {
        instruction: `First, take away ${firstChunk} from the ones frame.`,
        target: 'active-ones',
        removeCount: firstChunk,
      },
      {
        instruction: `Now take away ${secondChunk} from the ten frame.`,
        target: 'active-ten',
        removeCount: secondChunk,
      },
      {
        instruction: `You have ${minuend - subtrahend} left!`,
        target: null,
        removeCount: 0,
        isFinal: true,
      },
    ];
  }

  throw new Error(`buildSteps: unknown strategy "${strategy}"`);
}
