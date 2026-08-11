# Owner Response and Production Web Rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add enforceable owner-response and production-web rules as `ZT-88` and `ZT-89`.

**Architecture:** Keep both rules in the always-loaded `UI.md`, register them in the CORE routing index, and make the existing KAT enforce the new ceiling and semantic clauses. Update the public README in the same change so the advertised rule count and feature summary stay exact.

**Tech Stack:** Markdown rule files, Node.js ESM known-answer test.

## Global Constraints

- Unsafe owner requests receive direct pushback plus at least three safer alternatives.
- Questions start with `Yes.`, `No.`, or `I do not know.`, then a short sentence and useful bullets.
- Action requests start with verified completion or honest in-progress wording.
- HTML defaults to production-quality, mobile-first responsive Roboto presentation.
- Web copy uses verified, factual business English without unsolicited date stamps or unapproved external references.
- Commit locally only; do not push.

---

### Task 1: Make the KAT expect the new contract

**Files:**
- Modify: `check-rules.mjs`

**Interfaces:**
- Consumes: the rule definitions and version lines in the seven rule files.
- Produces: a fail-closed 89-rule continuity, placement, version, path-leak, and semantic-clause gate.

- [x] Raise `MAX` to 89, place rules 88 and 89 in `UI.md`, and add exact semantic-clause assertions.
- [x] Run `node check-rules.mjs` before adding the definitions and retain the expected red result.

### Task 2: Add the two always-loaded rules

**Files:**
- Modify: `UI.md`
- Modify: `CLAUDE.md`
- Modify: `MOTIVATION.md`
- Modify: `brains/lead.md`
- Modify: `brains/architect.md`
- Modify: `brains/supervisor.md`
- Modify: `brains/custodian.md`

**Interfaces:**
- Consumes: the stable numbered-rule registry enforced by `check-rules.mjs`.
- Produces: `ZT-88` and `ZT-89` in the always-loaded communication surface.

- [x] Add the exact direct-answer/action-status/unsafe-request contract as `ZT-88`.
- [x] Add the exact production-web contract as `ZT-89`.
- [x] Update all rule-file ceiling lines and CORE routing/count prose to 89.
- [x] Run `node check-rules.mjs` and require green.

### Task 3: Reconcile the public description and close

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-08-11-owner-response-and-production-web-rules.md`

**Interfaces:**
- Consumes: the verified 89-rule rulebook.
- Produces: an accurate public count and concise capability summary.

- [x] Replace the stale 86-rule claim with 89 and describe both new guarantees.
- [x] Re-run the KAT, inspect the exact diff, and check off this plan only after every requirement is evidenced.
- [x] Commit the explicit files locally and do not push.
