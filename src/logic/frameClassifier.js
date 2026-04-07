// frameClassifier.js
// Builds frames + assigns roles for subtraction problems.
// Each frame returns:
//   { index, role, cells: boolean[10], dotCount }
// where dotCount = cells.filter(Boolean).length (kept for convenience).

const FRAME_SIZE = 10;

function makeCells(filledCount) {
  return Array.from({ length: FRAME_SIZE }, (_, i) => i < filledCount);
}

function countCells(cells) {
  return cells.reduce((n, b) => n + (b ? 1 : 0), 0);
}

export function buildFrames(total) {
  const frames = [];
  let remaining = total;
  let i = 0;
  while (remaining > 0) {
    const filled = Math.min(FRAME_SIZE, remaining);
    frames.push({
      index: i,
      role: 'empty',
      cells: makeCells(filled),
      dotCount: filled,
    });
    remaining -= filled;
    i += 1;
  }
  if (frames.length === 0) {
    frames.push({ index: 0, role: 'empty', cells: makeCells(0), dotCount: 0 });
  }
  return frames;
}

// classifyAddInitial: addition mode. Frames are sized to the SUM (a+b),
// but only the first `a` cells are filled in `cells`. `finalCells` mirrors
// the final state (a+b). Role assignment is based on the FINAL state so
// the active frames are where the addend will land.
export function classifyAddInitial(a, b) {
  const sum = a + b;
  const finalFrames = classifyFrames(sum, b > 0 ? Math.min(b, sum) : 0);
  let toFill = a;
  return finalFrames.map((f) => {
    const filled = Math.min(f.dotCount, toFill);
    toFill -= filled;
    return {
      index: f.index,
      role: f.role,
      cells: makeCells(filled),
      finalCells: f.cells.slice(),
      dotCount: filled,
    };
  });
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

  let activeOnesIdx = -1;
  let activeTenIdx = -1;

  for (let i = frames.length - 1; i >= 0; i--) {
    if (
      activeOnesIdx === -1 &&
      frames[i].dotCount > 0 &&
      frames[i].dotCount < FRAME_SIZE
    ) {
      activeOnesIdx = i;
    }
  }
  for (let i = frames.length - 1; i >= 0; i--) {
    if (frames[i].dotCount === FRAME_SIZE) {
      activeTenIdx = i;
      break;
    }
  }

  for (let i = 0; i < frames.length; i++) {
    if (i === activeOnesIdx) {
      frames[i].role = 'active-ones';
    } else if (i === activeTenIdx) {
      frames[i].role = 'active-ten';
    } else if (frames[i].dotCount === FRAME_SIZE) {
      frames[i].role = 'spectator';
    } else {
      frames[i].role = 'empty';
    }
  }

  return frames;
}

export { FRAME_SIZE, makeCells, countCells };
