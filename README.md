# Ten Frame Math

Interactive ten-frame subtraction tool teaching two foundational mental-math strategies (Take-from-the-Ten, Break-Apart-the-Subtrahend) for numbers 0–40.

Built for Lillie (age 6). Tablet-friendly, portrait orientation, fully local — no backend, no API keys.

## Stack
- Expo (managed workflow) · React Native
- React Navigation (stack)
- Reanimated 2 (Session B animation layer)

## Status
**v1.0.0 — Session A** · Core structure: scaffold, theme, TenFrame/DotGrid components, frameClassifier logic, HomeScreen with number input and live frame display.

Session B (next): strategy flows, problem ladder, Solve / Result screens, Reanimated layer.

## Local dev
```bash
npm install
npx expo start
```

## Build
```bash
npx expo run:android
# or
eas build --platform android --profile preview --local
```

## Files
- `App.js` — Stack navigator + version constant
- `src/constants/theme.js` — colors, sizing, fonts, animation timings
- `src/components/TenFrame.js` — single bordered frame
- `src/components/DotGrid.js` — 2×5 dot layout, role-aware states
- `src/logic/frameClassifier.js` — assigns spectator / active-ten / active-ones roles
- `src/screens/HomeScreen.js` — number entry + live frame display
- `docs/CONTEXT.md` — Claude Code session bootstrap
- `docs/CLAUDE_CHAT_CONTEXT.md` — Claude.ai design-session bootstrap (full spec)
