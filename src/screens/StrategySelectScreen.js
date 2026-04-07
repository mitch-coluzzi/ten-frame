// StrategySelectScreen.js
// Two strategy cards, numerals first, minimal text. Pre-reader friendly.

import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../constants/theme';
import { OPERATIONS, STRATEGIES } from '../logic/strategyEngine';

export default function StrategySelectScreen({ route, navigation }) {
  const { operation, a, b } = route.params;
  const ones = a % 10;
  const isSub = operation === OPERATIONS.SUBTRACT;

  const choose = (strategy) => {
    navigation.navigate('Solve', { operation, a, b, strategy });
  };

  // Numeric chains rendered as big-number lines
  let cardA, cardB;
  if (isSub) {
    // Sub: take from ten / break apart
    const remTen = 10 - b;
    const second = b - ones;
    cardA = {
      strategy: STRATEGIES.TAKE_FROM_TEN,
      lines: [`10 − ${b} = ${remTen}`, `${remTen} + ${ones} = ${remTen + ones}`],
    };
    cardB = {
      strategy: STRATEGIES.BREAK_APART,
      lines: [`${b} = ${ones} + ${second}`, `${ones} − ${ones} = 0`, `10 − ${second} = ${10 - second}`],
    };
  } else {
    // Add: make a ten / direct
    const open = ones === 0 ? 10 : 10 - ones;
    const overflow = b - open;
    cardA = {
      strategy: STRATEGIES.MAKE_A_TEN,
      lines: [`${b} = ${open} + ${overflow}`, `${a} + ${open} = ${a + open}`, `${a + open} + ${overflow} = ${a + b}`],
    };
    cardB = null; // addition only offers Make-a-Ten when crossing
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.problem}>
          {a} {isSub ? '−' : '+'} {b}
        </Text>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => choose(cardA.strategy)}
        >
          {cardA.lines.map((line, i) => (
            <Text key={i} style={styles.cardLine}>
              {line}
            </Text>
          ))}
        </Pressable>

        {cardB && (
          <Pressable
            style={({ pressed }) => [styles.card, styles.cardAlt, pressed && styles.cardPressed]}
            onPress={() => choose(cardB.strategy)}
          >
            {cardB.lines.map((line, i) => (
              <Text key={i} style={[styles.cardLine, styles.cardLineAlt]}>
                {line}
              </Text>
            ))}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.appBg },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  problem: {
    fontSize: 64,
    fontWeight: '900',
    color: theme.colors.ink,
    marginVertical: theme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.colors.greenBg,
    borderColor: theme.colors.greenDark,
    borderWidth: 4,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  cardAlt: {
    backgroundColor: theme.colors.redBg,
    borderColor: theme.colors.redDark,
  },
  cardPressed: { transform: [{ scale: 0.97 }], opacity: 0.85 },
  cardLine: {
    fontSize: 36,
    fontWeight: '900',
    color: theme.colors.greenDark,
    marginVertical: 4,
  },
  cardLineAlt: { color: theme.colors.redDark },
});
