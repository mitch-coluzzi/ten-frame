// HomeScreen.js
// Session A scope:
//   - Numeric input for minuend (1–40)
//   - Numeric input for subtrahend (1..minuend)
//   - Live ten-frame display wired to current minuend value
//   - Solve button (stub — Strategy/Solve screens land in Session B)
//
// Frame roles render visually so the classification logic is verifiable
// at a glance before strategy flows are wired.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import TenFrame from '../components/TenFrame';
import { classifyFrames, buildFrames } from '../logic/frameClassifier';
import { theme } from '../constants/theme';

const MIN_MIN = 1;
const MAX_MIN = 40;

function clampInt(raw, min, max) {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return null;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export default function HomeScreen() {
  const [minuendText, setMinuendText] = useState('14');
  const [subtrahendText, setSubtrahendText] = useState('5');

  const minuend = clampInt(minuendText, 0, MAX_MIN);
  const subRaw = clampInt(subtrahendText, 0, MAX_MIN);
  const subtrahend =
    subRaw === null || minuend === null
      ? null
      : Math.min(subRaw, minuend);

  const frames = useMemo(() => {
    if (minuend === null || minuend < MIN_MIN) return buildFrames(0);
    if (subtrahend === null || subtrahend < 1) return buildFrames(minuend);
    return classifyFrames(minuend, subtrahend);
  }, [minuend, subtrahend]);

  const canSolve =
    minuend !== null &&
    minuend >= MIN_MIN &&
    subtrahend !== null &&
    subtrahend >= 1 &&
    subtrahend <= minuend;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Let's subtract!</Text>

        <View style={styles.framesWrap}>
          {frames.map((f) => (
            <TenFrame key={f.index} dotCount={f.dotCount} role={f.role} />
          ))}
        </View>

        <View style={styles.problem}>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Start with</Text>
            <TextInput
              style={styles.input}
              value={minuendText}
              onChangeText={setMinuendText}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <Text style={styles.minus}>−</Text>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Take away</Text>
            <TextInput
              style={styles.input}
              value={subtrahendText}
              onChangeText={setSubtrahendText}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        <Pressable
          style={[styles.solveBtn, !canSolve && styles.solveBtnDisabled]}
          disabled={!canSolve}
          onPress={() => {
            // Session B will navigate → StrategySelectScreen
          }}
        >
          <Text style={styles.solveBtnText}>Solve</Text>
        </Pressable>

        <Text style={styles.helper}>
          {canSolve
            ? `${minuend} − ${subtrahend} = ?`
            : 'Pick two numbers to start (1–40).'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.appBg },
  scroll: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSizes.title,
    color: theme.colors.ink,
    fontWeight: '800',
    marginBottom: theme.spacing.lg,
  },
  framesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  problem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  inputBlock: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.inkSoft,
    marginBottom: theme.spacing.xs,
  },
  input: {
    width: 90,
    height: 70,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: theme.colors.frameBorder,
    backgroundColor: theme.colors.frameBg,
    textAlign: 'center',
    fontSize: theme.fontSizes.large,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  minus: {
    fontSize: theme.fontSizes.large,
    fontWeight: '800',
    color: theme.colors.ink,
    marginBottom: theme.spacing.md,
  },
  solveBtn: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl * 1.5,
    borderRadius: 16,
    marginBottom: theme.spacing.md,
  },
  solveBtnDisabled: { opacity: 0.4 },
  solveBtnText: {
    color: '#fff',
    fontSize: theme.fontSizes.title,
    fontWeight: '800',
    letterSpacing: 1,
  },
  helper: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.inkSoft,
  },
});
