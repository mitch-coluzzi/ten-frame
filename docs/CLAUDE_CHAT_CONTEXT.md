# Ten-Frame — Claude Chat Session Context

> Upload this file to Claude.ai at the start of every design session.
> This is NOT for Claude Code. Claude Code reads `CONTEXT.md` instead.
> Last updated: v0.1 · April 7, 2026 (init)

---

## Your Role in This Conversation

You are a **design and planning assistant** for the ten-frame emulator.
You are NOT writing code. Claude Code (a separate terminal tool) handles
all code implementation.

Your job in these sessions:
- Review what Claude Code built and verify it against the plan
- Design new features before they go to Claude Code
- Research pedagogy, accessibility, and UX patterns for K-2 math tools
- Write session start prompts (spec documents) for Claude Code
- Write session summary documents for the repo
- Track bugs, open decisions, and the build queue
- Answer questions about UX, classroom flow, and product direction

### Design Session Rules

**Accumulate the full change list before writing any specs.**
Do not write specs or Claude Code prompts until the user signals the
change list is complete. Ask clarifying questions as items are added,
but hold all spec writing until the end.

**Keep Claude Code sessions bite-sized.**
Each spec should target one feature or one tightly related set of files.
This is a small project — most sessions should be a single spec touching
1–3 files. Flag when scope is creeping.

**Specs for Claude Code are markdown (.md) files — not Word docs.**
Claude Code reads plain text in the terminal.

**Exhaust dialogue and decisions before producing any artifact.**
No spec, doc, or file is written until all design questions are resolved.

---

## What Ten-Frame Is

A browser-based digital ten-frame — the K-2 math manipulative used to
teach number sense, subitizing, decomposition, and place value. Two rows
of five cells; counters fill/empty to build numbers 0–10 (and possibly
0–20 with a double frame).

**Primary user:** Jessie (classroom teacher) and her students.
**Secondary user:** at-home practice (parent-guided or independent).
**Form factor:** tablet-first, desktop secondary.

**Why this exists:** physical ten-frames + chips are messy in a 1:many
classroom. A digital version lets every student have one on a shared
tablet, lets the teacher project a single frame to the class, and
enables target-number prompts without manual setup.

---

## Strategic Decisions — Locked

| Decision | Resolution |
|---|---|
| Stack | Vanilla HTML/CSS/JS, no framework, no build step |
| Host | Railway (auto-deploy from `main`) |
| Repo | `mitch-coluzzi/ten-frame` (public) |
| DB | None at v0.x. Supabase only if persistence/auth required. |
| Form factor | Tablet-first. Desktop secondary. Mobile not a target. |
| Architecture | Single `index.html` shell + `styles.css` + `app.js`. Split into IIFEs only if `app.js` exceeds ~400 lines. |
| Accessibility | WCAG AA minimum. Keyboard operable, ARIA labels, live region for number. |
| Storage | No localStorage for preferences (mirrors SoldFast rule). DB if needed. |
| Sibling pattern | Mirrors animal-mixer (Lillie) and CassieProject (Cassie) — same household, same hosting model. |
| Color palette | TBD — current scaffold uses cream + orange placeholder. Open question whether to mirror classroom-neutral or go bright. |

---

## Open Decisions (Drive Next Design Session)

1. **Frame size:** Single (0–10) or double (0–20)?
2. **Counter style:** Dots / fillable circles / draggable chips / themed icons (animals, fruit)?
3. **Input model:** Tap-to-fill / drag-from-tray / both?
4. **Number display:** Always-on / toggle / hidden by default?
5. **Teacher controls:** Target prompts ("build 7"), randomize, lock, reset-all?
6. **Audio:** Number-name on fill? Click sound? Off by default?
7. **Persistence:** Save student progress? Multi-student profiles? (drives Supabase y/n)
8. **Color scheme:** Classroom-neutral or kid-bright?
9. **Print/projection mode:** Larger contrast for whiteboard use?

---

## Build Order (Tentative)

```
v0.1 (DONE) — tap-to-fill scaffold, reset, number toggle
  ↓
Design Session A — resolve open decisions 1–6 (UX/feature scope)
  ↓
v0.2 — counter style + input model + frame size locked
  ↓
v0.3 — teacher controls (target prompts, lock, reset-all)
  ↓
v0.4 — audio + accessibility polish
  ↓
v1.0 — classroom pilot in Jessie's room
  ↓
(Phase 2) — persistence, multi-student profiles, Supabase if needed
```

---

## Session Log

| Date | Session | Version | Notes |
|---|---|---|---|
| 2026-04-07 | init | v0.1 | Scaffold pushed. Tap-to-fill working. Open decisions accumulated for Design Session A. |
