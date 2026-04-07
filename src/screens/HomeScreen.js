// HomeScreen.js
// Operation toggle (+/-), math-style stacked input, live ten-frame preview,
// Solve routes to StrategySelect or directly to Solve depending on tier/op.

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
import { classifyFrames, buildFrames, classifyAddInitial } from '../logic/frameClassifier';
import { needsStrategyChoice } from '../logic/problemLadder';
import { OPERATIONS, STRATEGIES } from '../logic/strategyEngine';
import { theme } from '../constants/theme';

const MAX = 40;

function clampInt(raw, min, max) {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return null;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export default function HomeScreen({ navigation }) {
  const [operation, setOperation] = useState(OPERATIONS.SUBTRACT);
  const [aText, setAText] = useState('14');
  const [bText, setBText] = useState('5');

  const a = clampInt(aText, 0, MAX);
  const bRaw = clampInt(bText, 0, MAX);

  // For subtraction, b can't exceed a. For addition, a+b can't exceed MAX.
  const b = useMemo(() => {
    if (a === null || bRaw === null) return null;
    if (operation === OPERATIONS.SUBTRACT) return Math.min(bRaw, a);
    return Math.min(bRaw, MAX - a);
  }, [a, bRaw, operation]);

  const frames = useMemo(() => {
    if (a === null || a < 1) return buildFrames(0);
    if (b === null || b < 1) return buildFrames(a);
    if (operation === OPERATIONS.SUBTRACT) return classifyFrames(a, b);
    return classifyAddInitial(a, b);
  }, [a, b, operation]);

  const canSolve =
    a !== null && a >= 1 && b !== null && b >= 1 &&
    (operation === OPERATIONS.SUBTRACT ? b <= a : a + b <= MAX);

  const handleSolve = () => {
    if (!canSolve) return;
    if (needsStrategyChoice(operation, a, b)) {
      navigation.navigate('StrategySelect', { operation, a, b });
    } else {
      const strategy =
        operation === OPERATIONS.SUBTRACT
          ? STRATEGIES.SUB_DIRECT
          : STRATEGIES.ADD_DIRECT;
      navigation.navigate('Solve', { operation, a, b, strategy });
    }
  };

  const opSymbol = operation === OPERATIONS.SUBTRACT ? '−' : '+';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Operation toggle */}
        <View style={styles.opToggle}>
          <Pressable
            style={[
              styles.opBtn,
              operation === OPERATIONS.ADD && styles.opBtnAddActive,
            ]}
            onPress={() => setOperation(OPERATIONS.ADD)}
          >
            <Text
              style={[
                styles.opBtnText,
                operation === OPERATIONS.ADD && styles.opBtnTextActive,
              ]}
            >
              +
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.opBtn,
              operation === OPERATIONS.SUBTRACT && styles.opBtnSubActive,
            ]}
            onPress={() => setOperation(OPERATIONS.SUBTRACT)}
          >
            <Text
              style={[
                styles.opBtnText,
                operation === OPERATIONS.SUBTRACT && styles.opBtnTextActive,
              ]}
            >
              −
            </Text>
          </Pressable>
        </View>

        {/* Frames row */}
        <View style={styles.framesWrap}>
          {frames.map((f) => (
            <TenFrame key={f.index} dotCount={f.dotCount} role={f.role} />
          ))}
        </View>

        {/* Math-style stacked input */}
        <View style={styles.mathStack}>
          <View style={styles.mathRow}>
            <View style={styles.signSlot} />
            <TextInput
              style={[styles.input, styles.inputStart]}
              value={aText}
              onChangeText={setAText}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={styles.mathRow}>
            <View style={styles.signSlot}>
              <Text style={styles.signText}>{opSymbol}</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                operation === OPERATIONS.SUBTRACT
                  ? styles.inputSub
                  : styles.inputAdd,
              ]}
              value={bText}
              onChangeText={setBText}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={styles.divider} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.solveBtn,
            !canSolve && styles.solveBtnDisabled,
            pressed && canSolve && { opacity: 0.85 },
          ]}
          disabled={!canSolve}
          onPress={handleSolve}
        >
          <Text style={styles.solveBtnText}>Solve</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const SIGN_W = 60;
const INPUT_W = 130;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.appBg },
  scroll: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  opToggle: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: theme.colors.frameBorder,
  },
  opBtn: {
    width: 80,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.frameBg,
  },
  opBtnAddActive: { backgroundColor: theme.colors.greenDark },
  opBtnSubActive: { backgroundColor: theme.colors.redDark },
  opBtnText: {
    fontSize: 38,
    fontWeight: '900',
    color: theme.colors.inkSoft,
  },
  opBtnTextActive: { color: '#fff' },
  framesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  mathStack: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  mathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  signSlot: {
    width: SIGN_W,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signText: {
    fontSize: 56,
    fontWeight: '900',
    color: theme.colors.ink,
  },
  input: {
    width: INPUT_W,
    height: 90,
    borderRadius: 16,
    borderWidth: 4,
    textAlign: 'center',
    fontSize: 56,
    fontWeight: '900',
  },
  inputStart: {
    borderColor: theme.colors.greenDark,
    backgroundColor: theme.colors.greenBg,
    color: theme.colors.greenDark,
  },
  inputSub: {
    borderColor: theme.colors.redDark,
    backgroundColor: theme.colors.redBg,
    color: theme.colors.redDark,
  },
  inputAdd: {
    borderColor: theme.colors.greenDark,
    backgroundColor: theme.colors.greenBg,
    color: theme.colors.greenDark,
  },
  divider: {
    width: SIGN_W + INPUT_W,
    height: 5,
    backgroundColor: theme.colors.ink,
    borderRadius: 3,
    marginTop: 6,
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
});
