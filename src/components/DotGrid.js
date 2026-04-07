// DotGrid.js
// Vertical 5x2 ten-frame layout (5 rows, 2 columns).
// Fill order: top-to-bottom, left-to-right (column-major) — emphasizes 5-strip structure.
//
// Modes:
//   interactive=true + mode='remove' → rightmost-filled cell is tappable
//   interactive=true + mode='add'    → leftmost-empty cell is tappable

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const ROWS = 5;
const COLS = 2;
const TOTAL = ROWS * COLS;

// Map fill index (0..9) → grid position (row, col), column-major.
// First 5 dots fill column 0 top→bottom, next 5 fill column 1.
function indexToPos(i) {
  const col = Math.floor(i / ROWS);
  const row = i % ROWS;
  return { row, col };
}

export default function DotGrid({
  dotCount,
  role,
  interactive,
  onCellPress,
  mode = 'remove',
}) {
  // Build a 2D grid: cells[row][col] = isFilled
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  for (let i = 0; i < dotCount; i++) {
    const { row, col } = indexToPos(i);
    grid[row][col] = true;
  }

  // Determine the single tappable cell index, if any
  let tappableIndex = -1;
  if (interactive) {
    if (mode === 'remove' && dotCount > 0) {
      tappableIndex = dotCount - 1; // rightmost-filled in fill order
    } else if (mode === 'add' && dotCount < TOTAL) {
      tappableIndex = dotCount; // leftmost-empty in fill order
    }
  }
  const tappablePos = tappableIndex >= 0 ? indexToPos(tappableIndex) : null;

  return (
    <View style={styles.grid}>
      {Array.from({ length: ROWS }).map((_, row) => (
        <View key={row} style={styles.rowWrap}>
          {Array.from({ length: COLS }).map((__, col) => {
            const filled = grid[row][col];
            const isTappable =
              tappablePos && tappablePos.row === row && tappablePos.col === col;
            const dotStyle = [
              styles.cell,
              filled ? styles.cellFilled : styles.cellEmpty,
              isTappable && mode === 'add' && styles.cellTapAdd,
            ];
            if (isTappable) {
              return (
                <Pressable
                  key={col}
                  style={({ pressed }) => [
                    ...dotStyle,
                    pressed && { transform: [{ scale: 0.85 }], opacity: 0.7 },
                  ]}
                  onPress={() => onCellPress && onCellPress()}
                  hitSlop={6}
                />
              );
            }
            return <View key={col} style={dotStyle} />;
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: theme.sizing.dotSize * COLS + theme.sizing.dotGap * (COLS - 1),
    height: theme.sizing.dotSize * ROWS + theme.sizing.dotGap * (ROWS - 1),
  },
  rowWrap: {
    flexDirection: 'row',
    marginBottom: theme.sizing.dotGap,
  },
  cell: {
    width: theme.sizing.dotSize,
    height: theme.sizing.dotSize,
    borderRadius: theme.sizing.dotSize / 2,
    borderWidth: 2,
    marginRight: theme.sizing.dotGap,
  },
  cellEmpty: {
    backgroundColor: theme.colors.dotEmpty,
    borderColor: theme.colors.dotEmptyBorder,
  },
  cellFilled: {
    backgroundColor: theme.colors.dotFilled,
    borderColor: theme.colors.dotFilled,
  },
  cellTapAdd: {
    borderColor: theme.colors.greenDark,
    borderStyle: 'dashed',
  },
});
