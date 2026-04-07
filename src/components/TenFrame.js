// TenFrame.js
// Single ten-frame card. Optional bondLabel renders a satellite circle
// directly below the frame, visually associating the part with this frame.

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import DotGrid from './DotGrid';
import { theme } from '../constants/theme';

export default function TenFrame({
  cells,
  role,
  interactive,
  onCellPress,
  isTarget,
  mode = 'remove',
  hintTrigger = 0,
  highlightCells = [],
  bondLabel = null,
  bondColor = 'green',
}) {
  const isSpectator = role === 'spectator';

  const hintAnim = useRef(new Animated.Value(0)).current;
  const lastHint = useRef(0);
  useEffect(() => {
    if (hintTrigger > lastHint.current) {
      lastHint.current = hintTrigger;
      hintAnim.setValue(1);
      Animated.timing(hintAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: false,
      }).start();
    }
  }, [hintTrigger, hintAnim]);

  const palette =
    bondColor === 'red'
      ? {
          ring: theme.colors.redDark,
          fill: theme.colors.redBg,
          ink: theme.colors.redDark,
        }
      : {
          ring: theme.colors.greenDark,
          fill: theme.colors.greenBg,
          ink: theme.colors.greenDark,
        };

  return (
    <View style={styles.column}>
      <Animated.View
        style={[
          styles.frame,
          isSpectator && { opacity: theme.opacity.spectator },
          isTarget && styles.frameTarget,
          {
            borderColor: hintAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                isTarget ? theme.colors.dotFilled : theme.colors.frameBorder,
                theme.colors.hintGlow,
              ],
            }),
          },
        ]}
      >
        <DotGrid
          cells={cells}
          interactive={interactive}
          onCellPress={onCellPress}
          mode={mode}
          highlightCells={highlightCells}
        />
      </Animated.View>

      {bondLabel != null && (
        <View
          style={[
            styles.bondCircle,
            { borderColor: palette.ring, backgroundColor: palette.fill },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.bondText, { color: palette.ink }]}>
            {bondLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

const BOND_SIZE = 64;

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
    margin: theme.spacing.sm,
  },
  frame: {
    backgroundColor: theme.colors.frameBg,
    borderWidth: theme.sizing.frameBorderWidth,
    borderRadius: theme.sizing.frameRadius,
    padding: theme.sizing.framePadding,
  },
  frameTarget: {
    shadowColor: theme.colors.dotFilled,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  bondCircle: {
    width: BOND_SIZE,
    height: BOND_SIZE,
    borderRadius: BOND_SIZE / 2,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  bondText: {
    fontSize: 32,
    fontWeight: '900',
  },
});
