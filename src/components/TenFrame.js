// TenFrame.js
// A single ten-frame: bordered card with a 2x5 DotGrid inside.
// Spectator role applies a translucent overlay + reduced opacity.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import DotGrid from './DotGrid';
import { theme } from '../constants/theme';

export default function TenFrame({ dotCount, role }) {
  const isSpectator = role === 'spectator';
  return (
    <View
      style={[
        styles.frame,
        isSpectator && { opacity: theme.opacity.spectator },
      ]}
    >
      <DotGrid dotCount={dotCount} role={role} />
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
});
