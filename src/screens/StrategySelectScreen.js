// StrategySelectScreen.js
// Two-choice strategy picker for problems that cross a ten.
// Tier 1 problems skip this screen entirely (HomeScreen routes direct to Solve).

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { theme } from '../constants/theme';
import { STRATEGIES } from '../logic/strategyEngine';

export default function StrategySelectScreen({ route, navigation }) {
  const { minuend, subtrahend } = route.params;
  const ones = minuend % 10;

  const choose = (strategy) => {
    navigation.navigate('Solve', { minuend, subtrahend, strategy });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.problem}>
          {minuend} − {subtrahend} = ?
        </Text>
        <Text style={styles.prompt}>Pick how you want to solve it.</Text>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => choose(STRATEGIES.TAKE_FROM_TEN)}
        >
          <Text style={styles.cardTitle}>Take from the ten</Text>
          <Text style={styles.cardBody}>
            Take {subtrahend} away from the full ten frame, then add what's left.
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => choose(STRATEGIES.BREAK_APART)}
        >
          <Text style={styles.cardTitle}>Break the {subtrahend} apart</Text>
          <Text style={styles.cardBody}>
            Split {subtrahend} into {ones} and {subtrahend - ones}. Take {ones}{' '}
            from the ones first, then {subtrahend - ones} from the ten.
          </Text>
        </Pressable>
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
    fontSize: 56,
    fontWeight: '800',
    color: theme.colors.ink,
    marginVertical: theme.spacing.lg,
  },
  prompt: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.inkSoft,
    marginBottom: theme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.colors.frameBg,
    borderColor: theme.colors.frameBorder,
    borderWidth: 4,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardPressed: {
    backgroundColor: theme.colors.dotEmpty,
    transform: [{ scale: 0.98 }],
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  cardBody: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.ink,
    lineHeight: 24,
  },
});
