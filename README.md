# Zero Trust, Sir. 🎩

*A drop-in `CLAUDE.md` + `UI.md` + `MOTIVATION.md` + `brains/` bundle for running a zero-trust
software project with an AI engineer that checks its work, keeps chatter down, never idles, and
addresses you properly.*

**▸ See the house style — [`showcase.html`](showcase.html)** — a styled demo of what the agent's
output looks like: colour-coded actions and findings, `Sir,` questions, and the owner-gate table.
Open it locally, or via GitHub Pages once enabled.

## What this is

86 numbered rules (`ZT-01`–`ZT-86`) that direct an AI coding assistant to work in a
zero-trust way: deny-by-default, fail-closed, least-privilege — and to keep its output
terse. Written for [Claude Code](https://claude.com/claude-code), which reads `CLAUDE.md`
from the project root automatically; they are plain text, so they port to any other
assistant's project or system prompt.

The rules are split for context economy: `CLAUDE.md` is a small **CORE** (the universal posture —
the Sir Protocol, the zero-trust core, the mission & security floor, token discipline) loaded in
every session; the **UI rules** (`UI.md` — how every reply is shaped) and the **motivation loop**
(`MOTIVATION.md` — the standing chores that fill idle moments) live in their own files, which the
CORE imports so they are *also* always loaded (rules read on demand are rules ignored); and the
rest are routed to **four per-role rule-modules** under `brains/` — `lead.md`, `architect.md`,
`supervisor.md`, `custodian.md` — each read only when you wear that hat. Every rule keeps its
stable `ZT-` number across files (the CORE carries a rule→module index, and `check-rules.mjs`
enforces it). The always-loaded trio — CORE **~9 KB** + `UI.md` **~5.3 KB** + `MOTIVATION.md`
**~7 KB** — is **~21 KB**, still about a quarter lighter than the ~28 KB single file, with the
craft rules off-context until their hat is worn.

A companion doc, [`ENGINEERING-STANDARDS.md`](ENGINEERING-STANDARDS.md), is the house's
engineering baseline — §0–§22 requirement classes running from zero-trust and fail-closed gates
through anti-drift, external boundaries, and longevity, with K3 reference appendices. Where it
overlaps the numbered rules, the rules are canon (its §15 and §17 are canonised as `ZT-86` and
`ZT-85`); its header carries the full mapping.

A second companion, [`BRAINS.md`](BRAINS.md), expands rule `ZT-64`: how to run a project on a team of
specialist minds. The team can wear more hats than there are files — the **Architect** module also
serves the Researcher's craft, the **Custodian** module the Librarian's, and the specialist hats
(Adversary, Counsel, Brand) borrow from these four plus the CORE — so nine conceptual minds hand off
through **four** rule-modules, coordinating via durable files and gated by a fail-closed reviewer
(the Supervisor, kept deliberately separate from the doer).

## Why "Sir"?

Partly because it is funny, and JARVIS set expectations.

Mostly because it is a **protocol**. Under these rules, any line beginning `Sir,` means
*a human decision is required* — everything else is work product you can skim. Your name
becomes an attention filter. The aim is to cut chatter: the agent writes work product you
can skim and flags you only at real decision points, instead of narrating each step.

The honorific is configurable. Ma'am, Captain, Your Grace — the rule is the consistency,
not the title.

## Install

1. Copy [`CLAUDE.md`](CLAUDE.md), [`UI.md`](UI.md), [`MOTIVATION.md`](MOTIVATION.md), **and the
   `brains/` directory** into your project root, keeping them beside each other. `CLAUDE.md` is the
   always-loaded CORE and imports `UI.md` (the UI rules) and `MOTIVATION.md` (the motivation loop)
   alongside it; the per-role rule-modules in `brains/*.md` are read on demand when the agent wears
   that hat. Copy [`BRAINS.md`](BRAINS.md) too for the house-of-minds handbook, and
   [`check-rules.mjs`](check-rules.mjs) if you want the numbering self-test.
2. Optionally swap the honorific and adjust the `docs/` layout names to taste.
3. The first time `ZT-03` pushes back on an idea, that is the design working, not a
   malfunction.

## What's inside

| § | Section | The gist |
|---|---------|----------|
| 1 | The Sir Protocol | `Sir,` = human decision required; canonical flare phrases; pushback is a duty |
| 2 | Mission & scope | Production quality from commit one; a security floor; a one-sentence scope gate |
| 3 | Zero-trust core | ALLOW/HOLD/DENY, unknown ≠ yes; claims report their true tier; gates fail closed; public claims carry their evidence tier (no unearned superlatives); controlled crypto/quantum vocabulary |
| 4 | Custody | Commit-don't-push (unless a per-project custody grant); settle git commit/push/merge custody at project start; no secrets; no machine paths; refs point at reality; deps are trust decisions; a package ships source + artifact, never a toolchain or a dependency tree; a human is never the key courier — mint, deliver, and rotate by machine |
| 5 | Records | `docs/` as project memory; stable IDs; priority-numbered todo; handover documents |
| 6 | Communication — the UI rules | Own always-loaded file, `UI.md`: intent-named headers, status lines, tables, code boxes, focus symbols, real paths — no theatre; every reply passes the fail-closed ZT-78 gate before it ships |
| 7 | Token economy | Do-then-report; evidence on request; subagents for wide searches; compact warnings |
| 8 | Tooling | Build tools as packages; grep *and* glob are off — the graph-backed finder + the owning dev tool do the finding (mind the `.gitignore` blind spot); index, don't grep-and-hope; refresh after milestones |
| 9 | Quality | Tests unprompted; every gate ships a self-test that can go red |
| 10 | Memory & sessions | Index-not-warehouse memory; close milestones properly; assume amnesia — archive did/done/remains/planned at every task's end |
| 11 | Parallelism, delegation & lean paths | Fan out to workers; delegate doc-writing; graph-first search; plan the fewest-token route; keep 1–3 workers fed |
| 12 | Definition of done | After every edit: run tests + audit, then peer-review the whole file for errors and slop; review a worker's result before you resume |
| 13 | Authority & ownership | "Full auto" is scoped to a surface you own; unclear ownership → propose, don't execute; settle automation + review-vs-speed at project start |
| 14 | Comments & self-documenting code | File-header blocks (description / version / pointers); function + why-comments beside hard code; light-or-heavy density Sir sets at project start |
| 15 | The house of minds | Run the project on a team of specialist brains — each a file + graph; switch between them, teach each, gate every "done" with a fail-closed reviewer (see `BRAINS.md`) |
| 16 | Starting a new project | Day-one intake: the honorific; the technology scope; offer git + lay its files; public or private; README + `.gitignore` always; public repos wear their governance (LICENSE / SECURITY / …) |
| 17 | The motivation loop | Own always-loaded file, `MOTIVATION.md`: never idle — the standing re-verification chores; KATs as the primary test form; a new instrument re-opens old verdicts; a fix ships with its detector; a green counts only for the axis it exercised; digressions parked, not chased; the drift check on the goal itself; refactor your own loop at every chapter's close |

## What it sounds like

*Illustrative — the house format, not a record of real work:*

```text
Working On This
T-042 · Payment webhook — signature verification added — Status: done
T-043 · Refund path — needs idempotency key — Status: 80%

---

Sir, this is a bad idea — storing card PANs to "speed up retries" breaches
the PCI-DSS floor (ZT-06). Safer: store the processor's payment token.
```

## Design notes

- **Fail-closed is the spine.** The rules come out of an ongoing, AI-assisted zero-trust
  language project — including a real incident where an audit swallowed an error in a
  `catch {}` and reported success instead of failing closed. That incident is rule ZT-11.
- **The numbering is continuous and verified.** The original draft contained two rule 3s
  and two rule 10s, which in a zero-trust rulebook is itself a finding. It is now
  machine-checked: `node check-rules.mjs` is a known-answer test (ZT-80 applied to the
  rulebook) that every `ZT-01..86` is defined exactly once, in the file the CORE's index
  says, with all version lines agreeing — and it fails closed.
- **It practices what it preaches.** The file is deliberately tight, because it is loaded
  into every session and rule ZT-32 ("no theatre") applies to rulebooks too.
- **Format rules are a gate, not advice.** Style guidance parked mid-rulebook gets skipped
  under pressure — so the UI rules live in their own always-loaded file, and `ZT-78` makes
  the format itself fail closed: a reply that fails the pre-send check is redrafted, not
  sent.

Now then — shall we begin?
