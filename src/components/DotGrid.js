// DotGrid.js
// 2x5 dot layout for a single ten-frame.
// Renders 10 cells; each cell shows filled / empty / spectator state.
// Pure visual at Session A — no tap handlers yet.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const ROWS = 2;
const COLS = 5;
const TOTAL = ROWS * COLS;

export default function DotGrid({ dotCount, role }) {
  // Build cell array left-to-right, top-to-bottom.
  const cells = [];
  for (let i = 0; i < TOTAL; i++) {
    cells.push(i < dotCount);
  }

  const isSpectator = role === 'spectator';

  return (
    <View style={styles.grid}>
      {cells.map((filled, i) => {
        const dotStyle = [
          styles.cell,
          filled && (isSpectator ? styles.cellSpectator : styles.cellFilled),
          !filled && styles.cellEmpty,
        ];
        return <View key={i} style={dotStyle} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: theme.sizing.dotSize * COLS + theme.sizing.dotGap * (COLS - 1),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    height: theme.sizing.dotSize * ROWS + theme.sizing.dotGap,
  },
  cell: {
    width: theme.sizing.dotSize,
    height: theme.sizing.dotSize,
    borderRadius: theme.sizing.dotSize / 2,
    borderWidth: 2,
  },
  cellEmpty: {
    backgroundColor: theme.colors.dotEmpty,
    borderColor: theme.colors.dotEmptyBorder,
  },
  cellFilled: {
    backgroundColor: theme.colors.dotFilled,
    borderColor: theme.colors.dotFilled,
  },
  cellSpectator: {
    backgroundColor: theme.colors.dotSpectator,
    borderColor: theme.colors.dotSpectator,
  },
});
