// DotGrid.js
// Vertical 5x2 ten-frame layout. Cells-array based (cells: boolean[10]).
//
// Modes (when interactive=true):
//   'remove'  → any FILLED cell is tappable
//   'add'     → any EMPTY cell is tappable
//   'sandbox' → ANY cell is tappable (toggle)

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const ROWS = 5;
const COLS = 2;

// fill index 0..9 → grid position (column-major top-to-bottom)
function indexToPos(i) {
  const col = Math.floor(i / ROWS);
  const row = i % ROWS;
  return { row, col };
}

function posToIndex(row, col) {
  return col * ROWS + row;
}

export default function DotGrid({
  cells,
  interactive = false,
  mode = 'remove',
  onCellPress,
}) {
  const isCellTappable = (filled) => {
    if (!interactive) return false;
    if (mode === 'sandbox') return true;
    if (mode === 'remove') return filled;
    if (mode === 'add') return !filled;
    return false;
  };

  return (
    <View style={styles.grid}>
      {Array.from({ length: ROWS }).map((_, row) => (
        <View key={row} style={styles.rowWrap}>
          {Array.from({ length: COLS }).map((__, col) => {
            const idx = posToIndex(row, col);
            const filled = cells[idx];
            const tappable = isCellTappable(filled);
            const dotStyle = [
              styles.cell,
              filled ? styles.cellFilled : styles.cellEmpty,
              tappable && mode === 'add' && styles.cellTapAdd,
            ];
            if (tappable) {
              return (
                <Pressable
                  key={col}
                  style={({ pressed }) => [
                    ...dotStyle,
                    pressed && {
                      transform: [{ scale: 0.85 }],
                      opacity: 0.7,
                    },
                  ]}
                  onPress={() => onCellPress && onCellPress(idx)}
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
