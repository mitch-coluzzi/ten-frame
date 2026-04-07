# Ten-Frame — Session Context

> **Read this first, every session. ~2 minute load.**
> Last updated: v0.1 · April 7, 2026 (initial scaffold)
> For: Jessie's classroom · Owner: Mitch Coluzzi

---

## What This Product Is

A browser-based **ten-frame emulator** — a digital version of the K-2 math manipulative used to teach number sense, subitizing, and decomposition (numbers 0–10, optionally 0–20 with a double frame). Tablet-first. Built for use in Jessie's classroom; secondary audience is at-home practice.

Sibling household apps (same pattern, same hosting model):
- `animal-mixer` — Lillie's animal mix-and-match
- `CassieProject` — Cassie's app
- `ten-frame` — this repo

---

## The One File

```
index.html      (~1KB — shell: topbar, frame container, number display)
styles.css      (~2KB — tokens, frame grid, counter, responsive)
app.js          (~1.5KB — IIFE: state, render, tap/keyboard, reset, toggle)
README.md
docs/
  CONTEXT.md              (this file — Claude Code bootstrap)
  CLAUDE_CHAT_CONTEXT.md  (Claude.ai design-session bootstrap)
```

**Vanilla HTML/CSS/JS, no build step, no framework, no dependencies.** All tokens in `:root`. Single IIFE in `app.js`. If the file grows past ~400 lines, split into per-feature IIFEs following the SoldFast module-split pattern.

---

## Architecture Rules (Locked)

- **No frameworks, no build step.** Vanilla JS only. Pure static site.
- **No iframes.** Single `index.html` shell.
- **CSS variables only** — all tokens at `:root`. No hardcoded colors in component CSS.
- **Module scoping (if/when split)** — every module's CSS prefixed with feature scope.
- **Tablet-first responsive** — touch targets ≥44px, no hover-only affordances, `touch-action: manipulation`.
- **Accessibility first** — keyboard operable, ARIA labels on counters, `aria-live` on number display, screen-reader-friendly.
- **No localStorage/sessionStorage for preferences.** If preferences enter scope, they go to Supabase via a `user_preferences` JSONB pattern (mirrors SoldFast).
- **No external runtime dependencies** — no CDN scripts, no analytics tags, no fonts beyond system stack.

---

## Stack & Deployment

- **Frontend:** Static HTML/CSS/JS
- **Host:** Railway — auto-deploys on push to `main`
- **DB:** Supabase (deferred — only added if persistence/multi-student/auth required)
- **Repo:** `mitch-coluzzi/ten-frame` (public)
- **Production URL:** TBD (Railway domain assignment pending)
- **Local clone:** `/mnt/c/Users/mitch/OneDrive/Desktop/ten-frame`
- **Local design folder:** `/mnt/c/Users/mitch/OneDrive/Desktop/JessieProject` (handoff scratch, non-repo)
- **Version constant:** TBD — to be added once feature work begins. Format: `{session}.{patch}` mirroring SoldFast.

---

## Workflow Rules (mirrored from SoldFast CRM)

- **Tool approvals:** All tool calls auto-approved. Do not pause for confirmation on file edits, bash commands, git operations, or pushes. Test environment.
- **Git identity:** Mitch Coluzzi / mitch@soldfast.com
- **Git commands:** All git commands pre-approved — no confirmation needed. Run `cd` then git as two separate Bash calls (never compound with `&&`). `git push` authorized — no longer manual. Single-branch workflow (`main` only).
- **Commit protocol:** Anytime the user prompts to commit, ALWAYS update BOTH `docs/CONTEXT.md` AND `docs/CLAUDE_CHAT_CONTEXT.md` to reflect the work just completed BEFORE committing. Include both files in the same commit.
- **No stalling on commits:** Run push commands immediately, don't idle.
- **Verify protocol:** When asked to verify/check tree, report current version (TBD constant) and the session it corresponds to.
- **Schema migrations** (if/when Supabase added): Additive (ADD COLUMN, CREATE TABLE, CREATE INDEX, ADD CONSTRAINT) authorized without approval when in session spec. Destructive (DROP, ALTER type, bulk UPDATE/DELETE) require manual approval. Always verify with `information_schema` query after execution.
- **WSL environment:** pip packages installed with `--break-system-packages` if Python ever enters the stack.

---

## Module Status

| Module | Status | Notes |
|---|---|---|
| Frame core | ✅ v0.1 scaffold | 10 cells, tap-to-fill, counter render, reset, show/hide number |
| Number display | ✅ v0.1 | Live count, ARIA live region |
| Double frame (0–20) | ⬜ TBD | Open design question |
| Counter style options | ⬜ TBD | Dots / chips / themed icons — open question |
| Drag-from-tray | ⬜ TBD | Alternative to tap-to-fill |
| Target prompts | ⬜ TBD | Teacher-set "build the number 7" mode |
| Audio (number-name) | ⬜ TBD | Open question |
| Persistence (Supabase) | ⬜ TBD | Only if multi-student/save state needed |

---

## Open Design Questions (must resolve before next build session)

1. Single ten-frame or double (teen numbers)?
2. Counter style: dots, fillable circles, draggable chips, themed icons?
3. Tap-to-fill (current) vs. drag-from-tray vs. both?
4. "Show the number" toggle: keep, default-on, or always-on?
5. Teacher controls: target prompts, randomize, reset-all, lock?
6. Sound effects? Audio number-name on fill?
7. Persistence needed? (drives Supabase yes/no)
8. Multi-student / save state? (drives auth yes/no)
9. Color scheme: classroom-neutral or kid-bright? (current: orange counters on cream)

---

## Env / Secrets

- No `.env` in repo. Railway-managed.
- `.env` files from Cassie/Lillie projects to be copied if needed — none found in local trees as of init; likely live only in Railway dashboard.
- No DB credentials yet (no Supabase project linked).

---

## Session Log

| Date | Session | Version | Notes |
|---|---|---|---|
| 2026-04-07 | init | v0.1 | Repo created, scaffold pushed (`index.html` + `styles.css` + `app.js` + `README.md`). Tap-to-fill working baseline. `docs/` added with CONTEXT + CLAUDE_CHAT_CONTEXT. |
