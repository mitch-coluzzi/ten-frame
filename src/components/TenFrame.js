// TenFrame.js
// A single ten-frame: bordered card with a 2x5 DotGrid inside.
// Spectator role applies reduced opacity. Glow ring on active+interactive frames.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import DotGrid from './DotGrid';
import { theme } from '../constants/theme';

export default function TenFrame({
  dotCount,
  role,
  interactive,
  onCellPress,
  isTarget,
  mode = 'remove',
}) {
  const isSpectator = role === 'spectator';
  return (
    <View
      style={[
        styles.frame,
        isSpectator && { opacity: theme.opacity.spectator },
        isTarget && styles.frameTarget,
      ]}
    >
      <DotGrid
        dotCount={dotCount}
        role={role}
        interactive={interactive}
        onCellPress={onCellPress}
        mode={mode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: theme.colors.frameBg,
    borderColor: theme.colors.frameBorder,
    borderWidth: theme.sizing.frameBorderWidth,
    borderRadius: theme.sizing.frameRadius,
    padding: theme.sizing.framePadding,
    margin: theme.spacing.sm,
  },
  frameTarget: {
    borderColor: theme.colors.dotFilled,
    shadowColor: theme.colors.dotFilled,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
