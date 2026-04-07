// NumberBond.js
// Whole (muted gray) on top, two angled lines fanning down to TWO
// SEPARATE circles — one per part. NO + sign between them. The
// visual says "this number is two pieces" without looking like an
// equation.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function NumberBond({
  whole,
  parts,
  color = 'green',
  staticParts = [],
}) {
  const [a, b] = parts;
  const palette =
    color === 'red'
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

  const staticPalette = {
    ring: '#9e9e9e',
    fill: '#f0f0f0',
    ink: '#616161',
  };

  const partPalette = (idx) =>
    staticParts.includes(idx) ? staticPalette : palette;

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Text style={styles.whole}>{whole}</Text>

      <View style={styles.lines}>
        <View style={[styles.line, styles.lineLeft]} />
        <View style={[styles.line, styles.lineRight]} />
      </View>

      <View style={styles.partsRow}>
        <View
          style={[
            styles.circle,
            {
              borderColor: partPalette(0).ring,
              backgroundColor: partPalette(0).fill,
            },
          ]}
        >
          <Text style={[styles.partText, { color: partPalette(0).ink }]}>
            {a}
          </Text>
          {staticParts.includes(0) && (
            <Text style={styles.staticTag}>locked</Text>
          )}
        </View>
        <View
          style={[
            styles.circle,
            {
              borderColor: partPalette(1).ring,
              backgroundColor: partPalette(1).fill,
            },
          ]}
        >
          <Text style={[styles.partText, { color: partPalette(1).ink }]}>
            {b}
          </Text>
          {staticParts.includes(1) && (
            <Text style={styles.staticTag}>locked</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const CIRCLE = 76;
const GAP = 56;

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  whole: {
    fontSize: 56,
    fontWeight: '900',
    color: '#bdbdbd',
    marginBottom: 2,
  },
  lines: {
    width: CIRCLE * 2 + GAP - 40,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  line: {
    width: 4,
    height: 44,
    backgroundColor: '#bdbdbd',
    borderRadius: 2,
  },
  lineLeft: {
    transform: [{ rotate: '32deg' }],
    marginLeft: 28,
  },
  lineRight: {
    transform: [{ rotate: '-32deg' }],
    marginRight: 28,
  },
  partsRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partText: {
    fontSize: 38,
    fontWeight: '900',
  },
  staticTag: {
    position: 'absolute',
    bottom: 6,
    fontSize: 9,
    fontWeight: '800',
    color: '#9e9e9e',
    letterSpacing: 1,
  },
});
