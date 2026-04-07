// EquationLine.js
// Renders a math equation with a BLANK BOX where the answer goes.
// e.g. "10 − 5 = ☐"
//
// Props:
//   lhs:    string — left-hand side text (e.g. "10 − 5")
//   color:  ink color
//   answer: optional — when provided, fills the blank box with the value

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function EquationLine({
  lhs,
  color = theme.colors.ink,
  answer = null,
  size = 32,
}) {
  return (
    <View style={styles.row} pointerEvents="none">
      <Text style={[styles.text, { color, fontSize: size }]}>{lhs}</Text>
      <Text style={[styles.text, { color, fontSize: size }]}> = </Text>
      <View
        style={[
          styles.box,
          { borderColor: color, width: size * 1.4, height: size * 1.4 },
        ]}
      >
        {answer != null && (
          <Text style={[styles.boxText, { color, fontSize: size }]}>
            {answer}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  text: {
    fontWeight: '900',
  },
  box: {
    borderWidth: 4,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  boxText: {
    fontWeight: '900',
  },
});
