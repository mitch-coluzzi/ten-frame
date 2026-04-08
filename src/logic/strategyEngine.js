// strategyEngine.js
// Step sequencer for both subtraction and addition.

export const OPERATIONS = {
  SUBTRACT: 'subtract',
  ADD: 'add',
};

export const STRATEGIES = {
  // Subtraction
  TAKE_FROM_TEN: 'take-from-ten',
  BREAK_APART: 'break-apart',
  SUB_DIRECT: 'sub-direct', // tier 1 sub — single frame
  // Addition
  MAKE_A_TEN: 'make-a-ten',
  ADD_DIRECT: 'add-direct', // tier 1 add — single frame
};

// Each step:
//   instruction:  string for the child (still shown but kept short)
//   target:       'active-ten' | 'active-ones' | 'next-frame' | null
//   actionCount:  dots to add or remove this step
//   action:       'remove' | 'add' | null
//   showBond:     boolean — display the NumberBond
//   bondParts:    [a, b]
//   bondWhole:    number (subtrahend or addend)
//   isFinal:      last step → ResultScreen
//   numericLine:  short numeric summary string ("10 − 5 = 5")

export function buildSteps(operation, strategy, a, b) {
  if (operation === OPERATIONS.SUBTRACT) return buildSubSteps(strategy, a, b);
  if (operation === OPERATIONS.ADD) return buildAddSteps(strategy, a, b);
  throw new Error(`buildSteps: unknown operation "${operation}"`);
}

function buildSubSteps(strategy, minuend, subtrahend) {
  const ones = minuend % 10;

  if (strategy === STRATEGIES.SUB_DIRECT) {
    return [
      {
        instruction: `Take ${subtrahend} away.`,
        target: 'active-ones',
        actionCount: subtrahend,
        action: 'remove',
        numericLine: `${minuend} − ${subtrahend}`,
      },
      {
        instruction: `${minuend - subtrahend}!`,
        target: null,
        actionCount: 0,
        action: null,
        isFinal: true,
        numericLine: `= ${minuend - subtrahend}`,
      },
    ];
  }

  if (strategy === STRATEGIES.TAKE_FROM_TEN) {
    const remainingInTen = 10 - subtrahend;
    const tens = Math.floor(minuend / 10);
    const staticTotal = 10 * Math.max(0, tens - 1);
    const workingPart = 10 + ones; // active-ten + active-ones
    const finalTotal = staticTotal + remainingInTen + ones;

    return [
      {
        instruction: `${workingPart} = 10 + ${ones}`,
        spokenInstruction: `${workingPart} splits into ten and ${ones}`,
        target: null,
        actionCount: 0,
        action: null,
        showBond: true,
        bondParts: [10, ones],
        bondTargets: ['active-ten', 'active-ones'],
        bondWhole: workingPart,
        numericLine: `${workingPart} = 10 + ${ones}`,
      },
      {
        instruction: `Take ${subtrahend} from the ten.`,
        spokenInstruction: `Take ${subtrahend} from the ten`,
        target: 'active-ten',
        actionCount: subtrahend,
        action: 'remove',
        numericLine: `10 − ${subtrahend} = ${remainingInTen}`,
      },
      {
        instruction: `${finalTotal}!`,
        spokenInstruction:
          staticTotal > 0
            ? `${remainingInTen} plus ${ones} equals ${remainingInTen + ones}, plus ${staticTotal} equals ${finalTotal}`
            : `${remainingInTen} plus ${ones} equals ${finalTotal}`,
        target: null,
        actionCount: 0,
        action: null,
        isFinal: true,
        numericLine: `= ${finalTotal}`,
      },
    ];
  }

  if (strategy === STRATEGIES.BREAK_APART) {
    const firstChunk = ones;
    const secondChunk = subtrahend - ones;
    return [
      {
        instruction: `${subtrahend} = ${firstChunk} + ${secondChunk}`,
        spokenInstruction: `${subtrahend} splits into ${firstChunk} and ${secondChunk}`,
        target: null,
        actionCount: 0,
        action: null,
        showBond: true,
        bondParts: [firstChunk, secondChunk],
        bondTargets: ['active-ones', 'active-ten'],
        bondWhole: subtrahend,
        numericLine: `${subtrahend} = ${firstChunk} + ${secondChunk}`,
      },
      {
        instruction: `Take ${firstChunk}.`,
        spokenInstruction: `Take ${firstChunk}`,
        target: 'active-ones',
        actionCount: firstChunk,
        action: 'remove',
        numericLine: `${ones} − ${firstChunk} = 0`,
      },
      {
        instruction: `Take ${secondChunk}.`,
        spokenInstruction: `Take ${secondChunk}`,
        target: 'active-ten',
        actionCount: secondChunk,
        action: 'remove',
        numericLine: `10 − ${secondChunk} = ${10 - secondChunk}`,
      },
      (() => {
        const tens = Math.floor(minuend / 10);
        const staticTotal = 10 * Math.max(0, tens - 1);
        const activeTenLeft = 10 - secondChunk;
        const total = minuend - subtrahend;
        return {
          instruction: `${total}!`,
          spokenInstruction:
            staticTotal > 0
              ? `${activeTenLeft} plus ${staticTotal} equals ${total}`
              : `${total}`,
          target: null,
          actionCount: 0,
          action: null,
          isFinal: true,
          numericLine: `= ${total}`,
        };
      })(),
    ];
  }

  throw new Error(`buildSubSteps: unknown strategy "${strategy}"`);
}

function buildAddSteps(strategy, first, addend) {
  const ones = first % 10;
  const openInActive = ones === 0 ? 0 : 10 - ones; // open slots in current active frame

  if (strategy === STRATEGIES.ADD_DIRECT) {
    return [
      {
        instruction: `Add ${addend}.`,
        target: 'active-ones',
        actionCount: addend,
        action: 'add',
        numericLine: `${first} + ${addend}`,
      },
      {
        instruction: `${first + addend}!`,
        target: null,
        actionCount: 0,
        action: null,
        isFinal: true,
        numericLine: `= ${first + addend}`,
      },
    ];
  }

  if (strategy === STRATEGIES.MAKE_A_TEN) {
    const fillToTen = openInActive;       // dots needed to finish the current ten
    const overflow = addend - fillToTen;  // remaining dots → next frame
    return [
      {
        instruction: `${addend} = ${fillToTen} + ${overflow}`,
        target: null,
        actionCount: 0,
        action: null,
        showBond: true,
        bondParts: [fillToTen, overflow],
        bondTargets: ['active-ones', 'next-frame'],
        bondWhole: addend,
        numericLine: `${addend} = ${fillToTen} + ${overflow}`,
      },
      {
        instruction: `Add ${fillToTen} to finish the ten.`,
        target: 'active-ones',
        actionCount: fillToTen,
        action: 'add',
        numericLine: `${first} + ${fillToTen} = ${first + fillToTen}`,
      },
      {
        instruction: `Add ${overflow} to the new frame.`,
        target: 'next-frame',
        actionCount: overflow,
        action: 'add',
        numericLine: `${first + fillToTen} + ${overflow} = ${first + addend}`,
      },
      {
        instruction: `${first + addend}!`,
        target: null,
        actionCount: 0,
        action: null,
        isFinal: true,
        numericLine: `= ${first + addend}`,
      },
    ];
  }

  throw new Error(`buildAddSteps: unknown strategy "${strategy}"`);
}
