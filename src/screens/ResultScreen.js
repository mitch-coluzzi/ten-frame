// ResultScreen.js
// Big answer reveal + optional "Did you notice?" pattern prompt for tier 3+.
// Play Again returns to Home, New Problem clears inputs.

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

export default function ResultScreen({ route, navigation }) {
  const { minuend, subtrahend, strategy } = route.params;
  const answer = minuend - subtrahend;
  const tier = getTier(minuend, subtrahend);
  const showPattern = shouldShowPattern(minuend, subtrahend);

  const scaleAnim = useMemo(() => new Animated.Value(0.4), []);
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  // Equivalence hint: e.g. for 23-5 the same fact 13-5 hides inside.
  const onesPlusTen = (minuend % 10) + 10;
  const equivalentMinuend = onesPlusTen;
  const equivalentSubtrahend = subtrahend;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.equation}>
          {minuend} − {subtrahend} =
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
              {equivalentMinuend} − {equivalentSubtrahend} ={' '}
              {equivalentMinuend - equivalentSubtrahend} hides inside this
              problem. The ones place does the same work every time!
            </Text>
          </View>
        )}

        <View style={styles.btnRow}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnSecondary,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => navigation.popToTop()}
          >
            <Text style={[styles.btnText, styles.btnTextSecondary]}>
              New Problem
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
            onPress={() =>
              navigation.replace('Solve', { minuend, subtrahend, strategy })
            }
          >
            <Text style={styles.btnText}>Play Again</Text>
          </Pressable>
        </View>

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
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
  },
  answer: {
    fontSize: 160,
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
    marginBottom: theme.spacing.lg,
    width: '100%',
    maxWidth: 480,
  },
  patternTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  patternBody: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.ink,
    lineHeight: 24,
  },
  btnRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  btn: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 16,
  },
  btnSecondary: {
    backgroundColor: theme.colors.frameBg,
    borderWidth: 3,
    borderColor: theme.colors.frameBorder,
  },
  btnText: {
    color: '#fff',
    fontSize: theme.fontSizes.title,
    fontWeight: '800',
  },
  btnTextSecondary: {
    color: theme.colors.ink,
  },
  tierBadge: {
    marginTop: theme.spacing.lg,
    color: theme.colors.inkSoft,
    fontSize: theme.fontSizes.small,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
