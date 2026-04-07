// StrategySelectScreen.js
// Two strategy cards. Each leads with a bond visualization showing
// what's being decomposed, then the operation chain in big numerals.

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { theme } from '../constants/theme';
import { OPERATIONS, STRATEGIES } from '../logic/strategyEngine';
import NumberBond from '../components/NumberBond';

export default function StrategySelectScreen({ route, navigation }) {
  const { operation, a, b } = route.params;
  const ones = a % 10;
  const isSub = operation === OPERATIONS.SUBTRACT;

  const choose = (strategy) => {
    navigation.navigate('Solve', { operation, a, b, strategy });
  };

  let cardA = null;
  let cardB = null;

  if (isSub) {
    // SUB — Take From Ten: decompose minuend into (10 + ones)
    const remTen = 10 - b;
    cardA = {
      strategy: STRATEGIES.TAKE_FROM_TEN,
      bond: { whole: a, parts: [10, ones], color: 'green' },
      lines: [`10 − ${b} = ${remTen}`, `${remTen} + ${ones} = ${remTen + ones}`],
      bg: theme.colors.greenBg,
      border: theme.colors.greenDark,
      ink: theme.colors.greenDark,
    };
    // SUB — Break Apart: decompose subtrahend
    const second = b - ones;
    cardB = {
      strategy: STRATEGIES.BREAK_APART,
      bond: { whole: b, parts: [ones, second], color: 'red' },
      lines: [`${ones} − ${ones} = 0`, `10 − ${second} = ${10 - second}`],
      bg: theme.colors.redBg,
      border: theme.colors.redDark,
      ink: theme.colors.redDark,
    };
  } else {
    // ADD — Make a Ten: decompose addend into (fillToTen + overflow)
    const open = ones === 0 ? 10 : 10 - ones;
    const overflow = b - open;
    cardA = {
      strategy: STRATEGIES.MAKE_A_TEN,
      bond: { whole: b, parts: [open, overflow], color: 'green' },
      lines: [
        `${a} + ${open} = ${a + open}`,
        `${a + open} + ${overflow} = ${a + b}`,
      ],
      bg: theme.colors.greenBg,
      border: theme.colors.greenDark,
      ink: theme.colors.greenDark,
    };
  }

  const renderCard = (card) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: card.bg, borderColor: card.border },
        pressed && styles.cardPressed,
      ]}
      onPress={() => choose(card.strategy)}
    >
      <NumberBond {...card.bond} />
      <View style={styles.divider} />
      {card.lines.map((line, i) => (
        <Text key={i} style={[styles.cardLine, { color: card.ink }]}>
          {line}
        </Text>
      ))}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.problem}>
          {a} {isSub ? '−' : '+'} {b}
        </Text>
        {cardA && renderCard(cardA)}
        {cardB && renderCard(cardB)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.appBg },
  scroll: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    paddingBottom: theme.spacing.xl * 2,
  },
  problem: {
    fontSize: 64,
    fontWeight: '900',
    color: theme.colors.ink,
    marginBottom: theme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    borderWidth: 4,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  cardPressed: { transform: [{ scale: 0.97 }], opacity: 0.85 },
  divider: {
    height: 3,
    width: '70%',
    backgroundColor: '#d9d2c2',
    marginVertical: theme.spacing.md,
    borderRadius: 2,
  },
  cardLine: {
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
});
