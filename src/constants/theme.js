// Theme constants — warm, toy-like, high contrast for a 6-year-old.
// Single source of truth for colors, fonts, sizing.

export const theme = {
  colors: {
    // Backgrounds
    appBg: '#fdf6ec',          // warm cream
    frameBg: '#fffaf2',        // off-white frame interior
    frameBorder: '#a8632c',    // warm wood-tone border

    // Dot states
    dotFilled: '#4caf50',      // green — full ten-frames
    dotEmpty: '#f4f9f4',       // very pale green — empty slot fill
    dotEmptyBorder: '#a8c8a8', // soft green border for empty slot
    dotSpectator: '#4caf50',   // full color, identical to filled
    dotRemoving: '#e53935',    // red flash mid-animation (matches Take Away)

    // Green palette — "Start with" / ten frames
    green: '#4caf50',
    greenDark: '#2e7d32',
    greenBg: '#eaf7eb',

    // Red palette — "Take away" / removal
    red: '#e53935',
    redDark: '#b71c1c',
    redBg: '#fdecea',

    // Hint pulse — gentle "try here" yellow
    hintGlow: '#ffc107',

    // Text / UI
    ink: '#3a2418',            // very dark brown — text
    inkSoft: '#7a5340',        // muted brown — secondary text
    accent: '#e0563a',          // matches dotFilled — buttons, CTAs
    accentDark: '#b53d22',     // pressed/hover state
    spectatorOverlay: 'rgba(255, 255, 255, 0.55)',
  },

  opacity: {
    spectator: 1.0, // full color per user pref (was 0.4)
    active: 1.0,
  },

  sizing: {
    dotSize: 44,               // tap-friendly per WCAG
    dotGap: 10,
    frameBorderWidth: 4,
    frameRadius: 18,
    framePadding: 14,
  },

  fonts: {
    // Sticking to system fonts at scaffold time. Nunito/Fredoka can be
    // added via expo-font in a follow-up — keeping Session A dependency-free.
    display: 'System',
    body: 'System',
  },

  fontSizes: {
    huge: 72,
    large: 36,
    title: 28,
    body: 18,
    small: 14,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  animation: {
    dotAddDurationMs: 250,
    dotRemoveDurationMs: 300,
    spectatorFadeMs: 200,
  },
};
