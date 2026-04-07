// TenFrame.js
// Cells-based ten-frame card. Hint glow ring fires briefly on wrong-tap.

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
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
}) {
  const isSpectator = role === 'spectator';

  // Hint pulse — animates a yellow border ring when hintTrigger increments
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

  return (
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
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: theme.colors.frameBg,
    borderWidth: theme.sizing.frameBorderWidth,
    borderRadius: theme.sizing.frameRadius,
    padding: theme.sizing.framePadding,
    margin: theme.spacing.sm,
  },
  frameTarget: {
    shadowColor: theme.colors.dotFilled,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
