// StrategySelectScreen.js
// Two strategy cards. Each leads with a bond visualization showing
// what's being decomposed, then the operation chain in big numerals.

import React from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { theme } from '../constants/theme';
import { OPERATIONS, STRATEGIES } from '../logic/strategyEngine';
import NumberBond from '../components/NumberBond';
import EquationLine from '../components/EquationLine';
import { speak } from '../lib/narrate';

export default function StrategySelectScreen({ route, navigation }) {
  const { operation, a, b } = route.params;
  const ones = a % 10;
  const isSub = operation === OPERATIONS.SUBTRACT;

  const choose = (card) => {
    if (card.title) speak(card.title);
    navigation.navigate('Solve', { operation, a, b, strategy: card.strategy });
  };

  let cardA = null;
  let cardB = null;

  if (isSub) {
    // SUB — Take From Ten: decompose minuend.
    // Tier 2 (no spectators): a = 10 + ones (e.g. 14 = 10 + 4)
    // Tier 3+ (has spectators): a = staticPart + workingPart
    //   where staticPart = sum of spectator frames, workingPart = active group (10 + ones)
    const tens = Math.floor(a / 10);
    const remTen = 10 - b;
    let bondConfig;
    if (tens >= 2) {
      const staticPart = 10 * (tens - 1);
      const workingPart = a - staticPart; // = 10 + ones
      bondConfig = {
        whole: a,
        parts: [staticPart, workingPart],
        color: 'green',
        staticParts: [0],
      };
    } else {
      bondConfig = {
        whole: a,
        parts: [10, ones],
        color: 'green',
      };
    }
    cardA = {
      strategy: STRATEGIES.TAKE_FROM_TEN,
      title: 'Take from 10',
      bond: bondConfig,
      lines: [`10 − ${b}`, `${remTen} + ${ones}`],
      bg: theme.colors.greenBg,
      border: theme.colors.greenDark,
      ink: theme.colors.greenDark,
    };
    // SUB — Break Apart: decompose subtrahend
    const second = b - ones;
    cardB = {
      strategy: STRATEGIES.BREAK_APART,
      title: 'Take from 1',
      bond: { whole: b, parts: [ones, second], color: 'red' },
      lines: [`${ones} − ${ones}`, `10 − ${second}`],
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
      title: 'Make a 10',
      bond: { whole: b, parts: [open, overflow], color: 'green' },
      lines: [`${a} + ${open}`, `${a + open} + ${overflow}`],
      bg: theme.colors.greenBg,
      border: theme.colors.greenDark,
      ink: theme.colors.greenDark,
    };
  }

  const renderCard = (card) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        { backgroundColor: card.bg, borderColor: card.border },
      ]}
      onPress={() => choose(card)}
    >
      <NumberBond {...card.bond} />
      <View style={styles.divider} />
      {card.lines.map((lhs, i) => (
        <EquationLine key={i} lhs={lhs} color={card.ink} size={28} />
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
      >
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
  scrollView: { flex: 1 },
  scroll: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    paddingBottom: theme.spacing.xl * 2,
    flexGrow: 1,
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
