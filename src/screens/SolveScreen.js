// SolveScreen.js
// Guided steps for both subtraction and addition.
//   - Subtract: tap rightmost-filled cell in target frame to remove
//   - Add:      tap leftmost-empty cell in target frame to fill
// Auto-advances when step's actionCount is hit.

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
import { classifyFrames, classifyAddInitial } from '../logic/frameClassifier';
import { buildSteps, OPERATIONS } from '../logic/strategyEngine';
import { theme } from '../constants/theme';

export default function SolveScreen({ route, navigation }) {
  const { operation, a, b, strategy } = route.params;
  const isAdd = operation === OPERATIONS.ADD;

  // Initial frame state — frozen role classification
  const initialFrames = useMemo(() => {
    if (isAdd) return classifyAddInitial(a, b);
    return classifyFrames(a, b);
  }, [isAdd, a, b]);

  const steps = useMemo(
    () => buildSteps(operation, strategy, a, b),
    [operation, strategy, a, b]
  );

  const [frames, setFrames] = useState(() =>
    initialFrames.map((f) => ({ ...f }))
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [actionCountThisStep, setActionCountThisStep] = useState(0);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const pulseAnim = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    pulseAnim.setValue(0);
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [stepIndex, pulseAnim]);

  // Resolve which frame is the target for the current step.
  // For 'next-frame' (addition overflow), it's the frame after the last
  // currently-non-empty frame whose finalDotCount > current dotCount.
  const targetFrameIndex = useMemo(() => {
    if (!currentStep.target) return -1;
    if (currentStep.target === 'next-frame') {
      // Find first frame whose finalDotCount > current dotCount
      for (let i = 0; i < frames.length; i++) {
        const f = frames[i];
        if ((f.finalDotCount ?? f.dotCount) > f.dotCount && f.role !== 'active-ones' && f.dotCount === 0) {
          return i;
        }
      }
      // Fallback: any frame with dotCount === 0 and finalDotCount > 0
      for (let i = 0; i < frames.length; i++) {
        if (frames[i].dotCount === 0 && (frames[i].finalDotCount ?? 0) > 0) return i;
      }
      return -1;
    }
    // 'active-ten' or 'active-ones' — match by role
    return frames.findIndex((f) => f.role === currentStep.target);
  }, [currentStep, frames]);

  const handleCellPress = (frameIdx) => {
    if (frameIdx !== targetFrameIndex) return;
    if (!currentStep.action) return;

    setFrames((prev) => {
      const next = prev.map((f) => ({ ...f }));
      const tgt = next[frameIdx];
      if (currentStep.action === 'remove') {
        if (tgt.dotCount <= 0) return prev;
        tgt.dotCount -= 1;
      } else if (currentStep.action === 'add') {
        const cap = tgt.finalDotCount ?? 10;
        if (tgt.dotCount >= cap) return prev;
        tgt.dotCount += 1;
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
          {frames.map((f, idx) => (
            <TenFrame
              key={f.index}
              dotCount={f.dotCount}
              role={f.role}
              interactive={idx === targetFrameIndex}
              isTarget={idx === targetFrameIndex}
              mode={currentStep.action === 'add' ? 'add' : 'remove'}
              onCellPress={() => handleCellPress(idx)}
            />
          ))}
        </View>

        {currentStep.showBond && (
          <NumberBond whole={currentStep.bondWhole} parts={currentStep.bondParts} />
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
