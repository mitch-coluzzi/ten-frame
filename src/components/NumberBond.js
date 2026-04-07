// NumberBond.js
// Strong visual: whole number appears at top in muted gray, two angled
// lines drop into a pill-shaped oval that tightly groups the parts with
// a "+" between them. Conveys "this number is made of these two pieces."

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function NumberBond({ whole, parts, color = 'green' }) {
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

  return (
    <View style={styles.wrap}>
      {/* Whole — muted gray, de-emphasized */}
      <Text style={styles.whole}>{whole}</Text>

      {/* Connector lines */}
      <View style={styles.lines}>
        <View style={[styles.line, styles.lineLeft]} />
        <View style={[styles.line, styles.lineRight]} />
      </View>

      {/* Parts oval — tight group */}
      <View
        style={[
          styles.oval,
          { borderColor: palette.ring, backgroundColor: palette.fill },
        ]}
      >
        <Text style={[styles.partText, { color: palette.ink }]}>{a}</Text>
        <Text style={[styles.plusText, { color: palette.ink }]}>+</Text>
        <Text style={[styles.partText, { color: palette.ink }]}>{b}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  whole: {
    fontSize: 56,
    fontWeight: '900',
    color: '#bdbdbd', // muted gray — de-emphasized
    marginBottom: 4,
  },
  lines: {
    width: 110,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  line: {
    width: 4,
    height: 32,
    backgroundColor: '#bdbdbd',
    borderRadius: 2,
  },
  lineLeft: {
    transform: [{ rotate: '30deg' }],
    marginLeft: 22,
  },
  lineRight: {
    transform: [{ rotate: '-30deg' }],
    marginRight: 22,
  },
  oval: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 4,
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 180,
  },
  partText: {
    fontSize: 44,
    fontWeight: '900',
    marginHorizontal: 6,
  },
  plusText: {
    fontSize: 36,
    fontWeight: '900',
    marginHorizontal: 4,
  },
});
