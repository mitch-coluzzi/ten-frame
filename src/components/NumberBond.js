// NumberBond.js
// Strategy 2 visual: subtrahend split into two labeled parts.
// e.g. 5 = 4 + 1 → top circle "5", two lines down to "4" and "1".

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function NumberBond({ whole, parts }) {
  const [a, b] = parts;
  return (
    <View style={styles.wrap}>
      <View style={[styles.bubble, styles.whole]}>
        <Text style={styles.wholeText}>{whole}</Text>
      </View>
      <View style={styles.lines}>
        <View style={[styles.line, styles.lineLeft]} />
        <View style={[styles.line, styles.lineRight]} />
      </View>
      <View style={styles.partsRow}>
        <View style={[styles.bubble, styles.part]}>
          <Text style={styles.partText}>{a}</Text>
        </View>
        <View style={[styles.bubble, styles.part]}>
          <Text style={styles.partText}>{b}</Text>
        </View>
      </View>
    </View>
  );
}

const BUBBLE = 64;
const PART_BUBBLE = 52;

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  bubble: {
    borderRadius: 999,
    borderWidth: 3,
    backgroundColor: theme.colors.frameBg,
    borderColor: theme.colors.frameBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whole: {
    width: BUBBLE,
    height: BUBBLE,
    backgroundColor: theme.colors.dotFilled,
    borderColor: theme.colors.frameBorder,
  },
  wholeText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '800',
  },
  lines: {
    width: 130,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    width: 3,
    height: 28,
    backgroundColor: theme.colors.frameBorder,
  },
  lineLeft: {
    transform: [{ rotate: '-30deg' }],
    marginLeft: 28,
  },
  lineRight: {
    transform: [{ rotate: '30deg' }],
    marginRight: 28,
  },
  partsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    marginTop: 4,
  },
  part: {
    width: PART_BUBBLE,
    height: PART_BUBBLE,
  },
  partText: {
    fontSize: 26,
    color: theme.colors.ink,
    fontWeight: '800',
  },
});
