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
import EquationLine from '../components/EquationLine';
import { speak, stop as stopSpeaking } from '../lib/narrate';
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

  // Strategy-level bond persists across ALL steps once introduced.
  // Pulled from the first step that has showBond=true.
  const strategyBond = useMemo(() => {
    const bondStep = steps.find((s) => s.showBond);
    if (!bondStep) return null;
    return {
      targets: bondStep.bondTargets || [],
      parts: bondStep.bondParts || [],
      whole: bondStep.bondWhole,
    };
  }, [steps]);

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

  // Auto-advance non-action steps in Do + Teach. No "Next" button needed
  // for bond / final / reveal steps — they hold for a moment, then move on.
  // Action steps (where Lillie taps dots) still wait for her input.
  useEffect(() => {
    if (phase !== 'do' && phase !== 'teach') return;
    if (!currentStep) return;
    if (currentStep.action && (currentStep.actionCount || 0) > 0) return;

    const delay = currentStep.isFinal
      ? 400
      : currentStep.showBond
      ? 1600
      : 800;

    const t = setTimeout(() => advanceStep(), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, stepIndex, currentStep]);

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

  // Speak the current step's instruction. Show + Do phases narrate;
  // Teach is silent (it's the "show me you know" phase).
  // For action steps in Show, the per-dot count handles speech instead.
  useEffect(() => {
    if (phase === 'teach') return;
    const step = steps[stepIndex];
    if (!step) return;
    if (phase === 'show' && step.action && (step.actionCount || 0) > 0) return;
    const text = step.spokenInstruction || step.instruction;
    if (text) speak(text);
  }, [stepIndex, phase, steps]);

  // Stop narration on unmount
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // ───── Show phase auto-player ─────
  const cancelShowRef = useRef(false);
  useEffect(() => {
    if (!isShow) return;
    cancelShowRef.current = false;

    const wait = (ms) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const run = async () => {
      // 500ms hover after load, then straight into the animation
      await wait(500);
      if (cancelShowRef.current) return;
      for (let si = 0; si < steps.length; si++) {
        if (cancelShowRef.current) return;
        setStepIndex(si);
        setActionCountThisStep(0);
        const step = steps[si];

        if (step.action && step.actionCount > 0) {
          // Brief pause to let the instruction speech start
          await wait(600);
          if (cancelShowRef.current) return;

          for (let n = 0; n < step.actionCount; n++) {
            await wait(900);
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
            // Count along: speak the running tally
            speak(String(n + 1));
          }
          await wait(450);
        } else {
          // Bond / final / non-action step: longer hold so speech can finish
          await wait(2400);
          if (cancelShowRef.current) return;
        }
      }

      // Watch complete — auto-transition to Try
      if (cancelShowRef.current) return;
      setPhase('do');
    };

    run();
    return () => {
      cancelShowRef.current = true;
      stopSpeaking();
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
      // Count along: speak the running tally on each valid tap
      if (phase === 'do') speak(String(updated));
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

  const restartCurrentPhase = () => {
    stopSpeaking();
    setFrames(initialFrames.map((f) => ({ ...f, cells: f.cells.slice() })));
    setStepIndex(0);
    setActionCountThisStep(0);
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

  // Helper: is this frame in the strategy bond's "active group"?
  const isInActiveGroup = (f) => {
    if (!strategyBond) return false;
    for (const tgt of strategyBond.targets) {
      if (tgt === 'next-frame') {
        if (f.role === 'empty' && countCells(f.finalCells || []) > 0) return true;
      } else if (f.role === tgt) {
        return true;
      }
    }
    return false;
  };

  const spectatorFrames = strategyBond
    ? frames.filter((f) => !isInActiveGroup(f))
    : [];
  const activeFrames = strategyBond
    ? frames.filter((f) => isInActiveGroup(f))
    : frames;

  // Per-frame render — used by both groups
  const renderFrameAt = (f) => {
    const idx = frames.indexOf(f);
    const isTargetFrame = idx === targetFrameIndex && !isShow;
    const remaining =
      (currentStep.actionCount ?? 0) - actionCountThisStep;
    const highlightCells =
      isDo && isTargetFrame
        ? computeHighlightCells(f.cells, currentStep.action, remaining)
        : [];

    let bondLabel = countCells(f.cells);
    let bondColor = 'green';
    let bondDone = false;
    if ((isShow || isDo || isTeach) && strategyBond) {
      const sbColor = isAdd ? 'green' : 'red';
      for (let bi = 0; bi < strategyBond.targets.length; bi++) {
        const tgt = strategyBond.targets[bi];
        const matches =
          tgt === 'next-frame'
            ? f.role === 'empty' && countCells(f.finalCells || []) > 0
            : f.role === tgt;
        if (matches) {
          bondLabel = strategyBond.parts[bi];
          bondColor = sbColor;
          bondDone = stepIndex > bi + 1;
          break;
        }
      }
    }

    return (
      <Pressable
        key={f.index}
        onPress={handleFrameTap}
        style={styles.frameTouch}
      >
        <TenFrame
          cells={f.cells}
          role={f.role}
          interactive={isTargetFrame}
          isTarget={
            isTargetFrame ||
            (isShow && idx === resolveTargetIdx(frames, currentStep.target))
          }
          mode={currentStep.action === 'add' ? 'add' : 'remove'}
          hintTrigger={hintTrigger}
          highlightCells={highlightCells}
          bondLabel={bondLabel}
          bondColor={bondColor}
          bondDone={bondDone}
          onCellPress={(cellIdx) => handleValidCellPress(idx, cellIdx)}
        />
      </Pressable>
    );
  };

  // What gets rendered as instruction depends on phase
  const showInstruction = isShow || isDo;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
      >
        {/* Phase pill row — tap any pill to jump to that phase */}
        <View style={styles.phaseRow}>
          {PHASES.map((p) => {
            const active = p === phase;
            return (
              <Pressable
                key={p}
                onPress={() => {
                  if (p === phase) return;
                  cancelShowRef.current = true;
                  setPhase(p);
                }}
                style={({ pressed }) => [
                  styles.phasePill,
                  active && styles.phasePillActive,
                  pressed && { opacity: 0.7 },
                ]}
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
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.problem}>
          {a} {isAdd ? '+' : '−'} {b}
        </Text>

        <View style={styles.framesWrap}>
          {/* Spectator group (no bond header above) */}
          {spectatorFrames.length > 0 && (
            <View style={styles.spectatorGroup}>
              {spectatorFrames.map(renderFrameAt)}
            </View>
          )}

          {/* Active group with bond header centered above */}
          <View style={styles.activeGroup}>
            {strategyBond && strategyBond.whole != null && (
              <View style={styles.bondHeader} pointerEvents="none">
                <Text style={styles.bondWhole}>{strategyBond.whole}</Text>
                <View style={styles.bondLines}>
                  <View style={[styles.bondLine, styles.bondLineLeft]} />
                  <View style={[styles.bondLine, styles.bondLineRight]} />
                </View>
              </View>
            )}
            <View style={styles.activeFramesRow}>
              {activeFrames.map(renderFrameAt)}
            </View>
          </View>
        </View>

        {/* Equation/instruction card hidden — bonds carry the explanation. */}

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

        {(isDo || isTeach) && (
          <Pressable
            style={({ pressed }) => [
              styles.startOverBtn,
              pressed && { opacity: 0.85 },
            ]}
            onPress={restartCurrentPhase}
          >
            <Text style={styles.startOverBtnText}>↺ Start over</Text>
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
  bondHeader: {
    alignItems: 'center',
    marginBottom: -4,
  },
  bondWhole: {
    fontSize: 56,
    fontWeight: '900',
    color: '#bdbdbd',
    marginBottom: 2,
  },
  bondLines: {
    width: 140,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bondLine: {
    width: 4,
    height: 44,
    backgroundColor: '#bdbdbd',
    borderRadius: 2,
  },
  bondLineLeft: {
    transform: [{ rotate: '32deg' }],
    marginLeft: 32,
  },
  bondLineRight: {
    transform: [{ rotate: '-32deg' }],
    marginRight: 32,
  },
  framesWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  spectatorGroup: {
    flexDirection: 'row',
  },
  activeGroup: {
    alignItems: 'center',
  },
  activeFramesRow: {
    flexDirection: 'row',
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
  startOverBtn: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.frameBorder,
    backgroundColor: theme.colors.frameBg,
  },
  startOverBtnText: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
});
