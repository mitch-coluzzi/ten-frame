// DotGrid.js
// Vertical 5x2 ten-frame layout. cells: boolean[10] state.
//
// Modes (when interactive=true):
//   'remove'  → any FILLED cell tappable
//   'add'     → any EMPTY cell tappable
//   'sandbox' → ANY cell tappable (toggle)
//
// `highlightCells` (number[]): cell indices to pulse with a "tap me next"
// glow. Pulsing is shared via a single Animated.Value loop.

import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const ROWS = 5;
const COLS = 2;

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
  highlightCells = [],
}) {
  // Shared pulse loop
  const pulseAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const highlightSet = new Set(highlightCells);

  const isCellTappable = (filled) => {
    if (!interactive) return false;
    if (mode === 'sandbox') return true;
    if (mode === 'remove') return filled;
    if (mode === 'add') return !filled;
    return false;
  };

  const renderCell = (idx, filled, tappable) => {
    const isHighlight = highlightSet.has(idx);

    const baseStyle = [
      styles.cell,
      filled ? styles.cellFilled : styles.cellEmpty,
      tappable && mode === 'add' && styles.cellTapAdd,
    ];

    const cellInner = isHighlight ? (
      <Animated.View
        style={[
          styles.highlightRing,
          {
            borderColor: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [theme.colors.hintGlow, theme.colors.accent],
            }),
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 1],
            }),
          },
        ]}
      />
    ) : null;

    if (tappable) {
      return (
        <Pressable
          key={idx}
          style={({ pressed }) => [
            ...baseStyle,
            pressed && { transform: [{ scale: 0.85 }], opacity: 0.7 },
          ]}
          onPress={() => onCellPress && onCellPress(idx)}
          hitSlop={6}
        >
          {cellInner}
        </Pressable>
      );
    }
    return (
      <View key={idx} style={baseStyle}>
        {cellInner}
      </View>
    );
  };

  return (
    <View style={styles.grid}>
      {Array.from({ length: ROWS }).map((_, row) => (
        <View key={row} style={styles.rowWrap}>
          {Array.from({ length: COLS }).map((__, col) => {
            const idx = posToIndex(row, col);
            const filled = cells[idx];
            const tappable = isCellTappable(filled);
            return renderCell(idx, filled, tappable);
          })}
        </View>
      ))}
    </View>
  );
}

const RING_INSET = -6;

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
    alignItems: 'center',
    justifyContent: 'center',
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
  highlightRing: {
    position: 'absolute',
    top: RING_INSET,
    left: RING_INSET,
    right: RING_INSET,
    bottom: RING_INSET,
    borderWidth: 4,
    borderRadius: theme.sizing.dotSize,
  },
});
