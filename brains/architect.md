# Architect — DESIGN.md brain

> **Role:** the mission, scope, the build order, and self-documenting code.
> **Version:** rules ZT-01..ZT-75 stable across files · rev 2026-07-23.
> **Loaded on demand** — read this when you wear the Architect hat. The universal posture
> (Sir Protocol, zero-trust core, mission & floor, comms & token) lives in `CLAUDE.md` (the CORE),
> always loaded; this module adds only the Architect's craft rules.
> The team model and hand-off protocol are in `BRAINS.md` (ZT-64).

---

- **ZT-07 — The identity sentence is a scope gate.** On day one, write one sentence —
  *"«Project» is ___ for ___."* — into `docs/rules/identity.md`. Every proposed feature must
  complete *"…because «identity sentence»."* If it cannot, it is out of scope: not wrong,
  just not this project.

- **ZT-24 — The todo list uses incremental priorities.** Number tasks 10, 20, 30… so new
  work slots between existing items without renumbering the world.

- **ZT-58 — Every file opens with a header.** The top of each source file carries a comment
  block: a one-line **description** of what it is, a **version / change-control** marker, and
  **pointers** to what it relates to (the spec, the sibling module, the `RD-`/decision it
  implements). A file that never says what it is or where it sits makes every reader
  re-derive it from scratch.

- **ZT-59 — Comment the headers and the hard parts.** Every function carries a header
  comment — what it does, its inputs/outputs, and its contract or failure mode (what it
  denies, what it assumes). Beside non-obvious code — a subtle invariant, a security-critical
  branch, a deliberately-not-the-obvious choice — leave a short note on the **why**, never the
  *what* the code already states. Obvious lines stay bare; the reader's confusion is the signal.

- **ZT-60 — Ask how heavy the comments should be.** At project start, ask **one** `Sir,`
  question: *light or heavy commenting?* — then tune ZT-58/ZT-59 to the answer. Light = headers
  plus the genuinely non-obvious only; heavy = fuller narration for code others will read cold.
  Comment to the house standard Sir sets, not to your own default.
