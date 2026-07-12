# Zero Trust, Sir. 🎩

*A drop-in `CLAUDE.md` for running a zero-trust software project with an AI engineer that
checks its work, keeps chatter down, and addresses you properly.*

## What this is

71 numbered rules (`ZT-01`–`ZT-71`) that direct an AI coding assistant to work in a
zero-trust way: deny-by-default, fail-closed, least-privilege — and to keep its output
terse. Written for [Claude Code](https://claude.com/claude-code), which reads `CLAUDE.md`
from the project root automatically; they are plain text, so they port to any other
assistant's project or system prompt.

A companion doc, [`BRAINS.md`](BRAINS.md), expands rule `ZT-64`: how to run a project on a
team of specialist minds (team lead, architect, researcher, librarian, brand, counsel,
supervisor), each with its own file and graph, handing off through durable files and gated by
a fail-closed reviewer.

## Why "Sir"?

Partly because it is funny, and JARVIS set expectations.

Mostly because it is a **protocol**. Under these rules, any line beginning `Sir,` means
*a human decision is required* — everything else is work product you can skim. Your name
becomes an attention filter. The aim is to cut chatter: the agent writes work product you
can skim and flags you only at real decision points, instead of narrating each step.

The honorific is configurable. Ma'am, Captain, Your Grace — the rule is the consistency,
not the title.

## Install

1. Copy [`CLAUDE.md`](CLAUDE.md) into your project root.
2. Optionally swap the honorific and adjust the `docs/` layout names to taste.
3. The first time `ZT-03` pushes back on an idea, that is the design working, not a
   malfunction.

## What's inside

| § | Section | The gist |
|---|---------|----------|
| 1 | The Sir Protocol | `Sir,` = human decision required; canonical flare phrases; pushback is a duty |
| 2 | Mission & scope | Production quality from commit one; a security floor; a one-sentence scope gate |
| 3 | Zero-trust core | ALLOW/HOLD/DENY, unknown ≠ yes; claims report their true tier; gates fail closed |
| 4 | Custody | Commit-don't-push (unless a per-project custody grant); settle git commit/push/merge custody at project start; no secrets; no machine paths; refs point at reality; deps are trust decisions; a package ships source + artifact, never a toolchain or a dependency tree; a human is never the key courier — mint, deliver, and rotate by machine |
| 5 | Records | `docs/` as project memory; stable IDs; priority-numbered todo; handover documents |
| 6 | Communication | Status lines, tables, section breaks, real paths — no theatre |
| 7 | Token economy | Do-then-report; evidence on request; subagents for wide searches; compact warnings |
| 8 | Tooling | Build tools as packages; grep is off — build the graph-backed finder first; index, don't grep-and-hope; refresh after milestones |
| 9 | Quality | Tests unprompted; every gate ships a self-test that can go red |
| 10 | Memory & sessions | Index-not-warehouse memory; close milestones properly |
| 11 | Parallelism, delegation & lean paths | Fan out to workers; delegate doc-writing; graph-first search; plan the fewest-token route; keep 1–3 workers fed |
| 12 | Definition of done | After every edit: run tests + audit, then peer-review the whole file for errors and slop; review a worker's result before you resume |
| 13 | Authority & ownership | "Full auto" is scoped to a surface you own; unclear ownership → propose, don't execute; settle automation + review-vs-speed at project start |
| 14 | Comments & self-documenting code | File-header blocks (description / version / pointers); function + why-comments beside hard code; light-or-heavy density Sir sets at project start |
| 15 | The house of minds | Run the project on a team of specialist brains — each a file + graph; switch between them, teach each, gate every "done" with a fail-closed reviewer (see `BRAINS.md`) |
| 16 | Starting a new project | Day-one intake: the honorific; the technology scope; offer git + lay its files; public or private; README + `.gitignore` always; public repos wear their governance (LICENSE / SECURITY / …) |

## What it sounds like

*Illustrative — the house format, not a record of real work:*

```text
T-042 · Payment webhook — signature verification added — Status: done
T-043 · Refund path — needs idempotency key — Status: 80%

Sir, this is a bad idea — storing card PANs to "speed up retries" breaches
the PCI-DSS floor (ZT-06). Safer: store the processor's payment token.
```

## Design notes

- **Fail-closed is the spine.** The rules come out of an ongoing, AI-assisted zero-trust
  language project — including a real incident where an audit swallowed an error in a
  `catch {}` and reported success instead of failing closed. That incident is rule ZT-11.
- **The numbering is continuous and verified.** The original draft contained two rule 3s
  and two rule 10s, which in a zero-trust rulebook is itself a finding.
- **It practices what it preaches.** The file is deliberately tight, because it is loaded
  into every session and rule ZT-32 ("no theatre") applies to rulebooks too.

Now then — shall we begin?
