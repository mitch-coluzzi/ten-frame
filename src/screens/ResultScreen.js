// ResultScreen.js
// Big answer reveal. Optional "Try the other way" button when an alternate
// strategy applies. Play Again returns Home.

import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { theme } from '../constants/theme';
import { shouldShowPattern, getTier } from '../logic/problemLadder';
import { OPERATIONS, STRATEGIES } from '../logic/strategyEngine';

function alternateStrategy(strategy) {
  if (strategy === STRATEGIES.TAKE_FROM_TEN) return STRATEGIES.BREAK_APART;
  if (strategy === STRATEGIES.BREAK_APART) return STRATEGIES.TAKE_FROM_TEN;
  return null;
}

export default function ResultScreen({ route, navigation }) {
  const { operation, a, b, strategy } = route.params;
  const isAdd = operation === OPERATIONS.ADD;
  const answer = isAdd ? a + b : a - b;
  const tier = getTier(operation, a, b);
  const showPattern = shouldShowPattern(operation, a, b);
  const altStrategy = alternateStrategy(strategy);

  const scaleAnim = useMemo(() => new Animated.Value(0.4), []);
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const ones = a % 10;
  const equivalentA = ones + 10;
  const equivalentAns = isAdd ? equivalentA + b : equivalentA - b;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.equation}>
          {a} {isAdd ? '+' : '−'} {b} =
        </Text>
        <Animated.Text
          style={[styles.answer, { transform: [{ scale: scaleAnim }] }]}
        >
          {answer}
        </Animated.Text>

        {showPattern && (
          <View style={styles.patternCard}>
            <Text style={styles.patternTitle}>Did you notice?</Text>
            <Text style={styles.patternBody}>
              {equivalentA} {isAdd ? '+' : '−'} {b} = {equivalentAns}
            </Text>
          </View>
        )}

        {altStrategy && (
          <Pressable
            style={({ pressed }) => [
              styles.altBtn,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() =>
              navigation.replace('Solve', {
                operation,
                a,
                b,
                strategy: altStrategy,
              })
            }
          >
            <Text style={styles.altBtnText}>Try the other way</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.btnText}>Play Again</Text>
        </Pressable>

        <Text style={styles.tierBadge}>Tier {tier}</Text>
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
    justifyContent: 'center',
  },
  equation: {
    fontSize: 56,
    fontWeight: '900',
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
  },
  answer: {
    fontSize: 180,
    fontWeight: '900',
    color: theme.colors.dotFilled,
    marginBottom: theme.spacing.lg,
  },
  patternCard: {
    backgroundColor: theme.colors.frameBg,
    borderColor: theme.colors.frameBorder,
    borderWidth: 3,
    borderRadius: 18,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  patternTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  patternBody: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.ink,
  },
  altBtn: {
    backgroundColor: theme.colors.frameBg,
    borderWidth: 3,
    borderColor: theme.colors.frameBorder,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 16,
    marginBottom: theme.spacing.md,
  },
  altBtnText: {
    color: theme.colors.ink,
    fontSize: theme.fontSizes.body,
    fontWeight: '800',
    letterSpacing: 1,
  },
  btn: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl * 1.5,
    borderRadius: 16,
  },
  btnText: {
    color: '#fff',
    fontSize: theme.fontSizes.title,
    fontWeight: '800',
  },
  tierBadge: {
    marginTop: theme.spacing.lg,
    color: theme.colors.inkSoft,
    fontSize: theme.fontSizes.small,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
