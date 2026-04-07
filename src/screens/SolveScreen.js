// SolveScreen.js
// Linear pedagogy: Show → Do → Teach → Result.
//
//   Show:  app demonstrates the problem itself. Frames animate via timer,
//          instruction text + bond surface in sync. No input.
//   Do:    guided. Highlights show which cells to tap. Hints catch wrong taps.
//   Teach: bare execution. No highlights, no instruction text, no bond.
//          Hints still catch wrong taps (gentle, not punishing).

import React, { useState, useMemo, useEffect, useRef } from 'react';
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

const PHASES = ['show', 'do', 'teach'];
const PHASE_LABELS = { show: 'Watch', do: 'Try', teach: 'Show me' };
const PHASE_ICONS = { show: '👁', do: '🖐', teach: '🎓' };

// Find frame index matching the step's target role
function resolveTargetIdx(frames, target) {
  if (!target) return -1;
  if (target === 'next-frame') {
    for (let i = 0; i < frames.length; i++) {
      const f = frames[i];
      if (countCells(f.cells) === 0 && f.finalCells && countCells(f.finalCells) > 0) {
        return i;
      }
    }
    return -1;
  }
  return frames.findIndex((f) => f.role === target);
}

function nextCellToToggle(cells, action) {
  if (action === 'remove') {
    for (let i = cells.length - 1; i >= 0; i--) {
      if (cells[i]) return i;
    }
  } else if (action === 'add') {
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i]) return i;
    }
  }
  return -1;
}

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

  const [phase, setPhase] = useState('show');
  const [frames, setFrames] = useState(() =>
    initialFrames.map((f) => ({ ...f, cells: f.cells.slice() }))
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [actionCountThisStep, setActionCountThisStep] = useState(0);
  const [hintTrigger, setHintTrigger] = useState(0);

  const currentStep = steps[stepIndex];
  const isShow = phase === 'show';
  const isDo = phase === 'do';
  const isTeach = phase === 'teach';

  // Reset frame state on phase change (fresh run for Do and Teach)
  useEffect(() => {
    setFrames(initialFrames.map((f) => ({ ...f, cells: f.cells.slice() })));
    setStepIndex(0);
    setActionCountThisStep(0);
  }, [phase, initialFrames]);

  // Pulse animation for instruction card
  const pulseAnim = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    pulseAnim.setValue(0);
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [stepIndex, phase, pulseAnim]);

  // ───── Show phase auto-player ─────
  const cancelShowRef = useRef(false);
  useEffect(() => {
    if (!isShow) return;
    cancelShowRef.current = false;

    const wait = (ms) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const run = async () => {
      for (let si = 0; si < steps.length; si++) {
        if (cancelShowRef.current) return;
        setStepIndex(si);
        setActionCountThisStep(0);
        const step = steps[si];

        await wait(800);
        if (cancelShowRef.current) return;

        if (step.action && step.actionCount > 0) {
          for (let n = 0; n < step.actionCount; n++) {
            await wait(600);
            if (cancelShowRef.current) return;
            setFrames((prev) => {
              const tIdx = resolveTargetIdx(prev, step.target);
              if (tIdx < 0) return prev;
              const next = prev.map((f) => ({ ...f, cells: f.cells.slice() }));
              const cellIdx = nextCellToToggle(next[tIdx].cells, step.action);
              if (cellIdx >= 0) {
                next[tIdx].cells[cellIdx] = step.action === 'add';
              }
              return next;
            });
            setActionCountThisStep((n2) => n2 + 1);
          }
        } else {
          await wait(1700);
          if (cancelShowRef.current) return;
        }

        await wait(500);
      }

      if (cancelShowRef.current) return;
      setPhase('do');
    };

    run();
    return () => {
      cancelShowRef.current = true;
    };
  }, [isShow, steps]);

  // ───── User-driven advancement (Do + Teach) ─────
  const computeHighlightCells = (frameCells, action, remaining) => {
    if (!action || remaining <= 0) return [];
    const result = [];
    if (action === 'remove') {
      for (let i = frameCells.length - 1; i >= 0 && result.length < remaining; i--) {
        if (frameCells[i]) result.push(i);
      }
    } else if (action === 'add') {
      for (let i = 0; i < frameCells.length && result.length < remaining; i++) {
        if (!frameCells[i]) result.push(i);
      }
    }
    return result;
  };

  const targetFrameIndex = useMemo(
    () => resolveTargetIdx(frames, currentStep.target),
    [frames, currentStep.target]
  );

  const triggerHint = () => setHintTrigger((n) => n + 1);

  const handleValidCellPress = (frameIdx, cellIdx) => {
    if (isShow) return;
    if (frameIdx !== targetFrameIndex) {
      triggerHint();
      return;
    }
    if (!currentStep.action) return;

    setFrames((prev) => {
      const next = prev.map((f) => ({ ...f, cells: f.cells.slice() }));
      const tgt = next[frameIdx];
      if (currentStep.action === 'remove') {
        if (!tgt.cells[cellIdx]) return prev;
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

  const handleFrameTap = () => {
    if (isShow) return;
    triggerHint();
  };

  const advanceStep = () => {
    if (stepIndex >= steps.length - 1) {
      // End of phase
      if (isDo) {
        setPhase('teach');
        return;
      }
      if (isTeach) {
        navigation.replace('Result', {
          operation,
          a,
          b,
          strategy,
          taughtIt: true,
        });
        return;
      }
      // Show phase end is handled by the auto-player
      return;
    }
    setStepIndex((i) => i + 1);
    setActionCountThisStep(0);
  };

  const showContinueBtn =
    !isShow &&
    currentStep.target == null &&
    (currentStep.actionCount ?? 0) === 0;

  // Skip button only during Show
  const showSkipBtn = isShow;

  // What gets rendered as instruction depends on phase
  const showInstruction = isShow || isDo;
  const showBondVisual =
    (isShow || isDo) && currentStep.showBond;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
      >
        {/* Phase pill row */}
        <View style={styles.phaseRow}>
          {PHASES.map((p) => {
            const active = p === phase;
            return (
              <View
                key={p}
                style={[styles.phasePill, active && styles.phasePillActive]}
              >
                <Text
                  style={[
                    styles.phasePillIcon,
                    active && styles.phasePillIconActive,
                  ]}
                >
                  {PHASE_ICONS[p]}
                </Text>
                <Text
                  style={[
                    styles.phasePillLabel,
                    active && styles.phasePillLabelActive,
                  ]}
                >
                  {PHASE_LABELS[p]}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.problem}>
          {a} {isAdd ? '+' : '−'} {b}
        </Text>

        <View style={styles.framesWrap}>
          {frames.map((f, idx) => {
            const isTarget = idx === targetFrameIndex && !isShow;
            const remaining =
              (currentStep.actionCount ?? 0) - actionCountThisStep;
            // Highlights only in Do phase, not Show or Teach
            const highlightCells =
              isDo && isTarget
                ? computeHighlightCells(f.cells, currentStep.action, remaining)
                : [];
            return (
              <Pressable
                key={f.index}
                onPress={handleFrameTap}
                style={styles.frameTouch}
              >
                <TenFrame
                  cells={f.cells}
                  role={f.role}
                  interactive={isTarget}
                  isTarget={isTarget || (isShow && idx === resolveTargetIdx(frames, currentStep.target))}
                  mode={currentStep.action === 'add' ? 'add' : 'remove'}
                  hintTrigger={hintTrigger}
                  highlightCells={highlightCells}
                  onCellPress={(cellIdx) => handleValidCellPress(idx, cellIdx)}
                />
              </Pressable>
            );
          })}
        </View>

        {showBondVisual && (
          <NumberBond
            whole={currentStep.bondWhole}
            parts={currentStep.bondParts}
          />
        )}

        {showInstruction && (
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
            <Text style={styles.instructionText}>
              {currentStep.numericLine}
            </Text>
            {currentStep.actionCount > 0 && (
              <Text style={styles.progress}>
                {actionCountThisStep} / {currentStep.actionCount}
              </Text>
            )}
          </Animated.View>
        )}

        {isTeach && (
          <View style={styles.teachBanner}>
            <Text style={styles.teachBannerText}>Your turn!</Text>
            {currentStep.actionCount > 0 && (
              <Text style={styles.teachProgress}>
                {actionCountThisStep} / {currentStep.actionCount}
              </Text>
            )}
          </View>
        )}

        {showContinueBtn && (
          <Pressable
            style={({ pressed }) => [
              styles.continueBtn,
              pressed && { opacity: 0.85 },
            ]}
            onPress={advanceStep}
          >
            <Text style={styles.continueBtnText}>
              {stepIndex >= steps.length - 1
                ? isDo
                  ? 'Now you try!'
                  : 'See answer'
                : 'Next'}
            </Text>
          </Pressable>
        )}

        {showSkipBtn && (
          <Pressable
            style={({ pressed }) => [
              styles.skipBtn,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => {
              cancelShowRef.current = true;
              setPhase('do');
            }}
          >
            <Text style={styles.skipBtnText}>Skip ahead</Text>
          </Pressable>
        )}
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
  phaseRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: theme.colors.frameBorder,
    backgroundColor: theme.colors.frameBg,
  },
  phasePillActive: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accent,
  },
  phasePillIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  phasePillIconActive: {},
  phasePillLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.inkSoft,
  },
  phasePillLabelActive: { color: '#fff' },
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
  frameTouch: {},
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
  teachBanner: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  teachBannerText: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.accent,
  },
  teachProgress: {
    fontSize: 22,
    color: theme.colors.inkSoft,
    fontWeight: '800',
    marginTop: 4,
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
  skipBtn: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.frameBorder,
    backgroundColor: theme.colors.frameBg,
  },
  skipBtnText: {
    color: theme.colors.inkSoft,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
