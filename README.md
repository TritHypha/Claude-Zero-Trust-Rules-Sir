# Zero Trust, Sir. 🎩

*A drop-in `CLAUDE.md` for running a zero-trust software project with an AI engineer that
verifies everything, wastes no tokens, and addresses you properly.*

## What this is

45 numbered rules (`ZT-01`–`ZT-45`) that turn an AI coding assistant into a butler-grade
zero-trust engineer: deny-by-default, fail-closed, least-privilege — and considerably
quieter. Written for [Claude Code](https://claude.com/claude-code), which reads `CLAUDE.md`
from the project root automatically, but they work pasted into any assistant's project or
system prompt.

## Why "Sir"?

Partly because it is funny, and JARVIS set expectations.

Mostly because it is a **protocol**. Under these rules, any line beginning `Sir,` means
*a human decision is required* — everything else is work product you can skim. Your name
becomes an attention filter. In practice this one convention cuts most of the chatter: the
agent stops writing paragraphs *to* you and starts writing work product *near* you, flagging
you only at real forks.

The honorific is configurable. Ma'am, Captain, Your Grace — the rule is the consistency,
not the title.

## Install

1. Copy [`CLAUDE.md`](CLAUDE.md) into your project root.
2. Optionally swap the honorific and adjust the `docs/` layout names to taste.
3. Watch `ZT-03` fire the first time you have a bad idea. (You will. It's fine — that's
   the product working.)

## What's inside

| § | Section | The gist |
|---|---------|----------|
| 1 | The Sir Protocol | `Sir,` = human decision required; canonical flare phrases; pushback is a duty |
| 2 | Mission & scope | Production quality from commit one; a security floor; a one-sentence scope gate |
| 3 | Zero-trust core | ALLOW/HOLD/DENY, unknown ≠ yes; claims report their true tier; gates fail closed |
| 4 | Custody | Commit-don't-push; no secrets; no machine paths; refs point at reality; deps are trust decisions |
| 5 | Records | `docs/` as project memory; stable IDs; priority-numbered todo; handover documents |
| 6 | Communication | Status lines, tables, section breaks, real paths — no theatre |
| 7 | Token economy | Do-then-report; evidence on request; subagents for wide searches; compact warnings |
| 8 | Tooling | Build tools as packages; index, don't grep-and-hope; refresh after milestones |
| 9 | Quality | Tests unprompted; every gate ships a self-test that can go red |
| 10 | Memory & sessions | Index-not-warehouse memory; close milestones properly |

## What it sounds like

```text
T-042 · Payment webhook — signature verification added — Status: done
T-043 · Refund path — needs idempotency key — Status: 80%

Sir, this is a bad idea — storing card PANs to "speed up retries" breaches
the PCI-DSS floor (ZT-06). Safer: store the processor's payment token.
```

## Design notes

- **Fail-closed is the spine.** The rules were distilled from months of running a real
  zero-trust language project with AI engineers — including one genuine incident where an
  audit silently lost its entire corpus to a swallowed `catch {}` and kept reporting green.
  That incident is rule ZT-11.
- **The numbering is continuous and verified.** The original draft contained two rule 3s
  and two rule 10s, which in a zero-trust rulebook is itself a finding.
- **It practices what it preaches.** The file is deliberately tight, because it is loaded
  into every session and rule ZT-32 ("no theatre") applies to rulebooks too.

Now then — shall we begin?
