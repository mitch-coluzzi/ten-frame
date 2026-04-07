// SolveScreen.js
// Guided step-by-step interaction. Child taps dots in the target frame
// until the step's removeCount is satisfied, then advances.
//
// On final step, navigates to ResultScreen.

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
import { classifyFrames } from '../logic/frameClassifier';
import { buildSteps } from '../logic/strategyEngine';
import { theme } from '../constants/theme';

export default function SolveScreen({ route, navigation }) {
  const { minuend, subtrahend, strategy } = route.params;

  // Frozen role classification — roles are assigned ONCE at the start
  // and don't change during the solve. dotCount per frame mutates as
  // the child removes dots.
  const initialFrames = useMemo(
    () => classifyFrames(minuend, subtrahend),
    [minuend, subtrahend]
  );

  const steps = useMemo(
    () => buildSteps(strategy, minuend, subtrahend),
    [strategy, minuend, subtrahend]
  );

  // Frame state: array of { index, dotCount, role } — dotCount mutates
  const [frames, setFrames] = useState(() =>
    initialFrames.map((f) => ({ ...f }))
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [removedThisStep, setRemovedThisStep] = useState(0);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  // Pulse animation for the instruction card on step change
  const pulseAnim = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    pulseAnim.setValue(0);
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [stepIndex, pulseAnim]);

  const handleCellPress = (frameIdx) => {
    if (!currentStep.target) return;
    const targetRole = currentStep.target;

    setFrames((prev) => {
      const next = prev.map((f) => ({ ...f }));
      const target = next[frameIdx];
      if (!target || target.role !== targetRole) return prev;
      if (target.dotCount <= 0) return prev;
      target.dotCount -= 1;
      return next;
    });

    setRemovedThisStep((n) => {
      const updated = n + 1;
      if (updated >= currentStep.removeCount) {
        // Auto-advance after a brief beat
        setTimeout(() => advanceStep(), 350);
      }
      return updated;
    });
  };

  const advanceStep = () => {
    if (stepIndex >= steps.length - 1) {
      // Last step → ResultScreen
      navigation.replace('Result', { minuend, subtrahend, strategy });
      return;
    }
    setStepIndex((i) => i + 1);
    setRemovedThisStep(0);
  };

  // For non-interactive steps (showBond, isFinal), provide a Continue button
  const showContinueBtn =
    currentStep.target == null && currentStep.removeCount === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.problem}>
          {minuend} − {subtrahend}
        </Text>

        <View style={styles.framesWrap}>
          {frames.map((f) => (
            <TenFrame
              key={f.index}
              dotCount={f.dotCount}
              role={f.role}
              interactive={
                currentStep.target != null && f.role === currentStep.target
              }
              isTarget={
                currentStep.target != null && f.role === currentStep.target
              }
              onCellPress={() => handleCellPress(f.index)}
            />
          ))}
        </View>

        {currentStep.showBond && (
          <NumberBond whole={subtrahend} parts={currentStep.bondParts} />
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
          <Text style={styles.instructionText}>{currentStep.instruction}</Text>
          {currentStep.removeCount > 0 && (
            <Text style={styles.progress}>
              {removedThisStep} / {currentStep.removeCount}
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
              {isLastStep ? 'See the answer' : 'Continue'}
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
    fontSize: 44,
    fontWeight: '800',
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
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.ink,
    textAlign: 'center',
    lineHeight: 30,
  },
  progress: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSizes.body,
    color: theme.colors.inkSoft,
    fontWeight: '700',
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
