// SandboxScreen.js
// Free play. Four ten-frames. Tap any cell to toggle. Live total displayed.
// No problem, no strategy, no judgment.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import TenFrame from '../components/TenFrame';
import { makeCells, countCells } from '../logic/frameClassifier';
import { theme } from '../constants/theme';

const FRAME_COUNT = 4;

function emptyFrames() {
  return Array.from({ length: FRAME_COUNT }, (_, i) => ({
    index: i,
    role: 'empty',
    cells: makeCells(0),
  }));
}

export default function SandboxScreen({ navigation }) {
  const [frames, setFrames] = useState(emptyFrames);

  const total = useMemo(
    () => frames.reduce((n, f) => n + countCells(f.cells), 0),
    [frames]
  );

  const handleCellPress = (frameIdx, cellIdx) => {
    setFrames((prev) => {
      const next = prev.map((f) => ({ ...f, cells: f.cells.slice() }));
      next[frameIdx].cells[cellIdx] = !next[frameIdx].cells[cellIdx];
      return next;
    });
  };

  const reset = () => setFrames(emptyFrames());

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.title}>Free Play</Text>

        <Text style={styles.total}>{total}</Text>

        <View style={styles.framesWrap}>
          {frames.map((f, idx) => (
            <TenFrame
              key={f.index}
              cells={f.cells}
              role="active-ten"
              interactive
              isTarget
              mode="sandbox"
              onCellPress={(cellIdx) => handleCellPress(idx, cellIdx)}
            />
          ))}
        </View>

        <View style={styles.btnRow}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnSecondary,
              pressed && { opacity: 0.85 },
            ]}
            onPress={reset}
          >
            <Text style={[styles.btnText, styles.btnTextSecondary]}>Reset</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.btnText}>Done</Text>
          </Pressable>
        </View>
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
  title: {
    fontSize: theme.fontSizes.title,
    fontWeight: '900',
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
  },
  total: {
    fontSize: 110,
    fontWeight: '900',
    color: theme.colors.dotFilled,
    marginBottom: theme.spacing.md,
  },
  framesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
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
  btnTextSecondary: { color: theme.colors.ink },
});
