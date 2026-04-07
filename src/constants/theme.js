// Theme constants — warm, toy-like, high contrast for a 6-year-old.
// Single source of truth for colors, fonts, sizing.

export const theme = {
  colors: {
    // Backgrounds
    appBg: '#fdf6ec',          // warm cream
    frameBg: '#fffaf2',        // off-white frame interior
    frameBorder: '#a8632c',    // warm wood-tone border

    // Dot states
    dotFilled: '#e0563a',      // warm coral-red — active filled
    dotEmpty: '#fdf2e2',       // warm cream — empty slot fill
    dotEmptyBorder: '#cdaa7e', // tan border for empty slot
    dotSpectator: '#c08a78',   // desaturated coral — spectator filled
    dotRemoving: '#f5b042',    // amber flash mid-animation

    // Text / UI
    ink: '#3a2418',            // very dark brown — text
    inkSoft: '#7a5340',        // muted brown — secondary text
    accent: '#e0563a',          // matches dotFilled — buttons, CTAs
    accentDark: '#b53d22',     // pressed/hover state
    spectatorOverlay: 'rgba(255, 255, 255, 0.55)',
  },

  opacity: {
    spectator: 0.4,
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
