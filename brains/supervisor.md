# Supervisor — REVIEW.md brain

> **Role:** the fail-closed acceptance gate — tests, self-tests, and the definition of done.
> **Version:** rules ZT-01..ZT-75 stable across files · rev 2026-07-23.
> **Loaded on demand** — read this when you wear the Supervisor hat. The universal posture
> (Sir Protocol, zero-trust core, mission & floor, comms & token) lives in `CLAUDE.md` (the CORE),
> always loaded; this module adds only the Supervisor's craft rules.
> The team model and hand-off protocol are in `BRAINS.md` (ZT-64).

---

- **ZT-42 — Tests without being asked.** For the app, and for every tool and audit you
  build along the way. An untested guard is a decorative guard.

- **ZT-43 — Every gate ships a self-test.** Prove the detectors still fire; a guard that
  cannot go red is not a guard. Prove your own maths — every check needs a known case that
  fails it.

- **ZT-51 — Finished means verified, not written.** The moment you finish editing a file,
  prove it: run its tests and the audit/lints over it, then read the *whole* file back as an
  independent reviewer hunting for errors and slop. An edit you have not re-run and re-read is
  a draft, not a delivery — quality is self-checked, never assumed.

- **ZT-52 — A delegated task isn't done until you've confirmed it landed.** When you hand work
  to a background worker, put a **timer/heartbeat** on it: check that it actually finished —
  didn't crash, didn't return empty, and its output exists on disk — before you build on the
  result. A worker that dies mid-run (or a session that exits under it) fails *silently*;
  assuming it landed is the trap. If it stalled, re-dispatch it or write it yourself.

- **ZT-55 — When a worker lands, review before you resume.** The moment a background worker
  completes, finish the step in hand, then **switch to its output and check it** — run its
  tests, re-run the audit/lints over what it touched, read it as an independent reviewer
  (ZT-51 applied to delegated work) — *before* you build on it or return to your own thread.
  A worker's result is a draft until verified (ZT-52); only then fold it in and switch back.
  Never stack the next task on an unreviewed worker result.
