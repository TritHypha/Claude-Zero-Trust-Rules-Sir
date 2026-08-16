# Codex zero-trust functional skill-suite implementation plan

## Goal

Complete the standalone `codex-zero-trust-rules` repository by adopting all 91 numbered
source rules through a provenance-bound manifest and six narrowly triggered skills:

1. engineering;
2. independent review;
3. project operations;
4. owner communication;
5. neutral UI and response presentation;
6. optional house style.

The existing Galerina R&D query skill remains a project-specific adapter and adopts no ZT
rule. `ENGINEERING-STANDARDS.md` remains an indexed reference and is never copied wholesale
into a skill.

## Custody and constraints

- Source-rulebook changes belong only to this repository.
- Skill code, tests, manifests, and docs belong only to the standalone suite repository.
- The surrounding shared-skills checkout must not stage the nested repository.
- Use graph-first discovery and bounded exact reads.
- Use one canonical destination owner for each source rule; consumers reference it rather
  than copying it.
- Mandatory worker counts, absolute grep bans, Claude imports, and publication defaults are
  adapted to active Codex, repository, and owner authority.
- No push, pull request, marketplace publication, or public exposure is authorized.

## Task 1 - lock the design and source evidence

- [ ] Add the communication/UI separation to the approved design.
- [ ] Correct stale source-rule count prose.
- [ ] Run the source rulebook checker and its known-answer tests.
- [ ] Commit the bounded source-design unit with explicit pathspecs.

## Task 2 - build the adoption manifest red first

- [ ] Add a failing known-answer test for 91 unique source rules, exact source locators,
  digests, dispositions, one canonical owner, declared consumers, and test IDs.
- [ ] Add controlled duplicate-owner, missing-rule, stale-digest, unowned-destination,
  optional-trigger, and shadow-rule negatives.
- [ ] Implement the machine-readable manifest and validator.
- [ ] Generate a human-readable adoption matrix from the same manifest.
- [ ] Prove the complete manifest against the source build point.

## Task 3 - engineering skill

- [ ] Capture a fresh-context RED baseline for unsafe implementation advice.
- [ ] Create the skill through the Codex skill scaffold.
- [ ] Add only the bounded engineering reference needed for adopted rules.
- [ ] Prove fail-closed scope, authority, evidence-tier, and verification behavior.
- [ ] Validate, shadow-check, install, and commit before starting the next skill.

## Task 4 - independent review skill

- [ ] Capture a fresh-context RED baseline that accepts a non-red-capable gate or fixes
  findings without authority.
- [ ] Create and validate the review-only skill.
- [ ] Prove KAT, adversarial-control, claim-calibration, duplicate-finding, and PASS/refusal
  behavior.
- [ ] Validate, shadow-check, install, and commit.

## Task 5 - project operations skill

- [ ] Capture a RED baseline covering dirty-worktree custody, broad staging, push ambiguity,
  and stale index claims.
- [ ] Create and validate the operations skill.
- [ ] Prove exact path staging, owner gates, generated-artifact boundaries, handoff records,
  graph refresh receipts, and commit-versus-push separation.
- [ ] Validate, shadow-check, install, and commit.

## Task 6 - communication skill

- [ ] Capture a RED baseline that either interrupts for trivial choices or silently crosses a
  material owner gate.
- [ ] Create the communication skill with an explicit decision ladder: autonomous progress,
  non-blocking disclosure, focused clarification, owner-gated pause, and evidence-backed
  challenge.
- [ ] Prove it asks one minimum sufficient question, states why authority is needed, offers
  safer alternatives when challenging, and never hides a material stop inside progress text.
- [ ] Prove it does not trigger UI or house style.
- [ ] Validate, shadow-check, install, and commit.

## Task 7 - UI skill

- [ ] Capture a RED baseline for misleading completion state, ornamental formatting, and
  presentation rules that alter technical conclusions.
- [ ] Create the neutral UI skill.
- [ ] Prove answer-first output, truthful done/in-progress/blocked states, compact status,
  readable paths and tables, accessibility labels, and narrow handoff to product-design work.
- [ ] Prove it never introduces an honorific or owner gate.
- [ ] Validate, shadow-check, install, and commit.

## Task 8 - optional house-style skill

- [ ] Capture a RED baseline where the source honorific protocol leaks into an ordinary task.
- [ ] Create the opt-in style skill.
- [ ] Prove dormancy unless explicitly named or enabled by repository instruction.
- [ ] Prove it cannot change verdicts, custody, owner gates, or evidence claims.
- [ ] Validate, shadow-check, install, and commit.

## Task 9 - integrated closure

- [ ] Run every known-answer, pressure, trigger-isolation, provenance, and shadow test.
- [ ] Run the source rulebook gate again.
- [ ] Verify each active junction resolves into the tested standalone repository.
- [ ] Verify the source, suite, and surrounding checkout statuses independently.
- [ ] Refresh the source and suite code graphs and verify indexed heads.
- [ ] Record local commit IDs and explicitly state that nothing was pushed.

## Acceptance

Closure requires 91/91 source rules represented, no copied twins, no stale source digest, no
ambiguous skill trigger, communication/UI/house-style isolation, a red-capable test for every
functional skill, clean source and suite repositories, preserved unrelated parent dirt, and
no publication beyond local commits.
