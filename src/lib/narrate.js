// narrate.js
// Thin wrapper around expo-speech with a global mute toggle.
// Works on iOS/Android (native TTS) and on web (Web Speech API fallback).
//
// Usage:
//   import { speak, stop, setMuted, isMuted, subscribeMute } from '../lib/narrate';
//   speak('Take seven from the ten');
//   stop();
//   setMuted(true);

import * as Speech from 'expo-speech';

let muted = false;
const listeners = new Set();

export function setMuted(b) {
  muted = !!b;
  if (muted) {
    try {
      Speech.stop();
    } catch (e) {
      // no-op
    }
  }
  listeners.forEach((fn) => {
    try {
      fn(muted);
    } catch (e) {
      // no-op
    }
  });
}

export function isMuted() {
  return muted;
}

export function subscribeMute(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function speak(text, opts = {}) {
  if (muted || !text) return;
  try {
    Speech.stop();
    Speech.speak(String(text), {
      rate: 0.9,
      pitch: 1.0,
      language: 'en-US',
      ...opts,
    });
  } catch (e) {
    // Fail quietly on any TTS error — narration is non-critical.
  }
}

export function stop() {
  try {
    Speech.stop();
  } catch (e) {
    // no-op
  }
}
