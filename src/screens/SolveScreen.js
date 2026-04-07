// SolveScreen.js
// Cells-based guided steps. Any cell in target frame can be tapped (in
// the appropriate state for current mode). Wrong taps trigger a hint
// pulse on the target frame instead of doing nothing.

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import TenFrame from '../components/TenFrame';
import NumberBond from '../components/NumberBond';
import {
  classifyFrames,
  classifyAddInitial,
  countCells,
} from '../logic/frameClassifier';
import { buildSteps, OPERATIONS } from '../logic/strategyEngine';
import { theme } from '../constants/theme';

export default function SolveScreen({ route, navigation }) {
  const { operation, a, b, strategy } = route.params;
  const isAdd = operation === OPERATIONS.ADD;

  const initialFrames = useMemo(() => {
    if (isAdd) return classifyAddInitial(a, b);
    return classifyFrames(a, b);
  }, [isAdd, a, b]);

  const steps = useMemo(
    () => buildSteps(operation, strategy, a, b),
    [operation, strategy, a, b]
  );

  const [frames, setFrames] = useState(() =>
    initialFrames.map((f) => ({ ...f, cells: f.cells.slice() }))
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [actionCountThisStep, setActionCountThisStep] = useState(0);
  const [hintTrigger, setHintTrigger] = useState(0);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  // Pulse for the instruction card
  const pulseAnim = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    pulseAnim.setValue(0);
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [stepIndex, pulseAnim]);

  // Compute the next-N "should-tap" cells for the target frame
  const computeHighlightCells = (frameCells, action, remaining) => {
    if (!action || remaining <= 0) return [];
    const result = [];
    if (action === 'remove') {
      // Last N filled cells in fill order (highest indices first)
      for (let i = frameCells.length - 1; i >= 0 && result.length < remaining; i--) {
        if (frameCells[i]) result.push(i);
      }
    } else if (action === 'add') {
      // First N empty cells in fill order
      for (let i = 0; i < frameCells.length && result.length < remaining; i++) {
        if (!frameCells[i]) result.push(i);
      }
    }
    return result;
  };

  // Resolve target frame
  const targetFrameIndex = useMemo(() => {
    if (!currentStep.target) return -1;
    if (currentStep.target === 'next-frame') {
      // First frame whose finalCells has a true beyond current cells
      for (let i = 0; i < frames.length; i++) {
        const f = frames[i];
        if (countCells(f.cells) === 0 && f.finalCells && countCells(f.finalCells) > 0) {
          return i;
        }
      }
      return -1;
    }
    return frames.findIndex((f) => f.role === currentStep.target);
  }, [currentStep, frames]);

  const triggerHint = () => setHintTrigger((n) => n + 1);

  // A cell tap from the target frame's DotGrid (already validated by mode there)
  const handleValidCellPress = (frameIdx, cellIdx) => {
    if (frameIdx !== targetFrameIndex) {
      triggerHint();
      return;
    }
    if (!currentStep.action) return;

    setFrames((prev) => {
      const next = prev.map((f) => ({ ...f, cells: f.cells.slice() }));
      const tgt = next[frameIdx];
      if (currentStep.action === 'remove') {
        if (!tgt.cells[cellIdx]) {
          // Shouldn't happen — DotGrid only makes filled cells tappable in remove mode
          return prev;
        }
        tgt.cells[cellIdx] = false;
      } else if (currentStep.action === 'add') {
        if (tgt.cells[cellIdx]) return prev;
        tgt.cells[cellIdx] = true;
      }
      return next;
    });

    setActionCountThisStep((n) => {
      const updated = n + 1;
      if (updated >= currentStep.actionCount) {
        setTimeout(() => advanceStep(), 350);
      }
      return updated;
    });
  };

  // Outer-frame tap = "user tapped this frame's area but didn't hit a valid cell"
  const handleFrameTap = (frameIdx) => {
    if (frameIdx !== targetFrameIndex || !currentStep.target) {
      triggerHint();
    }
    // If they DID tap target frame but somehow missed all valid cells
    // (e.g. tried to remove an empty cell), DotGrid wouldn't fire onCellPress
    // and the outer Pressable will catch it → also hint.
    else {
      triggerHint();
    }
  };

  const advanceStep = () => {
    if (stepIndex >= steps.length - 1) {
      navigation.replace('Result', { operation, a, b, strategy });
      return;
    }
    setStepIndex((i) => i + 1);
    setActionCountThisStep(0);
  };

  const showContinueBtn =
    currentStep.target == null && (currentStep.actionCount ?? 0) === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.problem}>
          {a} {isAdd ? '+' : '−'} {b}
        </Text>

        <View style={styles.framesWrap}>
          {frames.map((f, idx) => {
            const isTarget = idx === targetFrameIndex;
            const remaining =
              (currentStep.actionCount ?? 0) - actionCountThisStep;
            const highlightCells = isTarget
              ? computeHighlightCells(f.cells, currentStep.action, remaining)
              : [];
            return (
              <Pressable
                key={f.index}
                onPress={() => handleFrameTap(idx)}
                style={styles.frameTouch}
              >
                <TenFrame
                  cells={f.cells}
                  role={f.role}
                  interactive={isTarget}
                  isTarget={isTarget}
                  mode={currentStep.action === 'add' ? 'add' : 'remove'}
                  hintTrigger={hintTrigger}
                  highlightCells={highlightCells}
                  onCellPress={(cellIdx) => handleValidCellPress(idx, cellIdx)}
                />
              </Pressable>
            );
          })}
        </View>

        {currentStep.showBond && (
          <NumberBond
            whole={currentStep.bondWhole}
            parts={currentStep.bondParts}
          />
        )}

        <Animated.View
          style={[
            styles.instructionCard,
            {
              opacity: pulseAnim,
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.instructionText}>{currentStep.numericLine}</Text>
          {currentStep.actionCount > 0 && (
            <Text style={styles.progress}>
              {actionCountThisStep} / {currentStep.actionCount}
            </Text>
          )}
        </Animated.View>

        {showContinueBtn && (
          <Pressable
            style={({ pressed }) => [
              styles.continueBtn,
              pressed && { opacity: 0.85 },
            ]}
            onPress={advanceStep}
          >
            <Text style={styles.continueBtnText}>
              {isLastStep ? 'See answer' : 'Next'}
            </Text>
          </Pressable>
        )}
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
    fontSize: 56,
    fontWeight: '900',
    color: theme.colors.ink,
    marginBottom: theme.spacing.md,
  },
  framesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  frameTouch: {
    // No styling — pressable wrapper for wrong-tap detection
  },
  instructionCard: {
    backgroundColor: theme.colors.frameBg,
    borderColor: theme.colors.frameBorder,
    borderWidth: 3,
    borderRadius: 18,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    width: '100%',
    maxWidth: 520,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 36,
    fontWeight: '900',
    color: theme.colors.ink,
    textAlign: 'center',
  },
  progress: {
    marginTop: theme.spacing.sm,
    fontSize: 24,
    color: theme.colors.inkSoft,
    fontWeight: '800',
  },
  continueBtn: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl * 1.5,
    borderRadius: 16,
    marginTop: theme.spacing.md,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: theme.fontSizes.title,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
