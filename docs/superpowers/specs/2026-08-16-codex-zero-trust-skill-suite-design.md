# Codex zero-trust skill suite design

## Objective

Turn the source rulebook into a standalone, testable Codex skill-suite repository without copying its entire 65 KB engineering standard into every prompt, inheriting Claude-specific runtime assumptions, or weakening repository and owner custody.

The suite must preserve rule provenance, make adaptations explicit, keep trigger surfaces narrow, and refuse when an indexed source cannot be proved fresh enough for the requested decision.

## Source repair is a precondition

The source rulebook is internally inconsistent at the design build point:

- the rule modules contain ZT-01 through ZT-91;
- `check-rules.mjs` still declares ZT-01 through ZT-89, sets `MAX = 89`, and omits ZT-90 and ZT-91 from its expected core table;
- `README.md` still advertises 89 rules.

No skill may be generated from that state. The first implementation task must update the checker and README, add or extend known-answer coverage for 91 rules, prove the checker rejects a controlled missing, duplicate, and out-of-range rule, and prove the source repository clean before any adoption matrix is treated as authoritative.

## Repository shape

Create one standalone repository named `codex-zero-trust-rules`. All suite-owned subprojects live inside it and are versioned together:

```text
codex-zero-trust-rules/
  README.md
  AGENTS.md
  skills/
    codex-zero-trust-engineering/
    codex-zero-trust-review/
    codex-zero-trust-project-operations/
    codex-querying-galerina-rd/
    codex-index-is-a-graph-not-a-warehouse/
    codex-zero-trust-house-style/
  packages/
    rule-manifest/
    query-adapters/
    validators/
  tests/
    known-answer/
    pressure/
    shadow/
  scripts/
  docs/
```

Each directory under `skills/` is independently deployable and contains its own `SKILL.md`, directly required references, and tests. Shared executable contracts live under `packages/`; individual skills do not carry private copies of shared rules.

Graphify, Hypha, Myco, TriRegex, codebase-memory, and KB indexing remain independently owned tools. The suite may contain narrow adapters, manifests, schemas, and known-answer fixtures for them, but it must not vendor or silently fork their implementation bodies. Adapter results must retain the producing tool, version or build point when available, query, status, and source locator.

Active Codex installation is by one junction or equivalent per deployable skill. The standalone repository remains the single development and test owner; the surrounding skills checkout must not absorb or stage it accidentally.

## Shared rule adoption manifest

The suite has one machine-readable adoption manifest. Every source rule receives exactly one disposition:

- `ADOPT`: transferable without changing its meaning;
- `ADAPT`: principle retained, runtime-specific wording replaced by a Codex-native contract;
- `OPTIONAL`: enabled only by an explicit user or repository instruction;
- `REJECT`: intentionally not transferred because it conflicts with active authority, runtime limits, or narrower repository policy.

Each row must contain:

- stable source rule identifier;
- source repository identity, path, section locator, source commit, and content digest;
- disposition and concise rationale;
- one canonical destination owner, or explicit `none`;
- destination rule identifier;
- zero or more consuming skills that reference that canonical destination;
- conflict priority and superseding authority;
- known-answer test identifiers;
- last verified source build point.

No destination rule may exist without a manifest row. No source rule may silently disappear. A source change invalidates affected rows until re-adjudicated. Multiple skills may reference one canonical shared rule, but they may not carry separate copies of its body.

## Transfer policy

The following source ideas transfer only through adaptation:

- Mandatory worker counts become bounded optional parallelism subject to the active runtime, available slots, task independence, repository instructions, and user authority.
- Absolute grep or glob bans become graph first, bounded fallback last. A missing or stale graph returns an explicit status; it does not justify an unbounded crawl.
- Commit, push, branch, staging, and destructive-operation rules defer to active system, user, and repository custody. A skill cannot manufacture publication authority.
- The “Sir” protocol, honorifics, and rigid reply forms are optional house style and never load through engineering, review, operations, querying, or indexing triggers.
- Claude imports, `.claude/` registration, hooks, and tool names become Codex-native skill, connector, junction, and tool contracts.

`ENGINEERING-STANDARDS.md` remains an indexed reference. It is not copied into skill bodies or loaded on every invocation. A skill opens the exact bounded section only when a manifest row or current question requires it.

## Deployable skills

### `codex-zero-trust-engineering`

Applies implementation-facing engineering rules: scope control, fail-closed boundaries, exact inputs, authority separation, explicit failure, evidence tiers, and verification before completion.

It does not own Git publication, independent review, project coordination, R&D retrieval, graph storage, or house style.

### `codex-zero-trust-review`

Applies independent review rules: requirements traceability, adversarial controls, red-capable instruments, claim calibration, finding severity, duplicate detection, and evidence-backed PASS or findings.

It does not implement fixes unless separately authorized.

### `codex-zero-trust-project-operations`

Applies repository operations and custody: explicit path staging, dirty-worktree preservation, owner gates, handoffs, index refresh receipts, generated-artifact boundaries, and commit-versus-push separation.

Active user, system, and repository instructions always outrank suite defaults.

### `codex-querying-galerina-rd`

Locates and retrieves Galerina/SLIDE/VOK/Lyth R&D through the maintained KB index and graph. It returns exact durable locators, privacy/custody status, source build point, and evidence classification. It never treats an indexed hit as the document body or an ingested transcript as an adopted conclusion.

This is deliberately project-specific and does not trigger for unrelated knowledge bases.

### `codex-index-is-a-graph-not-a-warehouse`

Provides the generic session-wide indexing doctrine. It may be used with any repository or knowledge base.

An index stores navigation and relationship evidence:

- stable identity and locator;
- owner and repository boundary;
- content digest or source build point;
- freshness and provenance;
- typed relationships and authority caps;
- privacy classification;
- query status.

It must not become a warehouse for document bodies, source files, secrets, private prompts, credentials, active capabilities, or unpublished private skill contents. Retrieval opens the exact owner source after the index has located it.

Every query result uses one of `HIT`, `MISS`, `REFUSED`, `STALE`, `AMBIGUOUS`, or `ERROR`. `MISS` never means the fact does not exist. `STALE` never authorizes a current claim. `AMBIGUOUS` is resolved at the owner source rather than guessed.

The generic skill owns query orchestration and result semantics, not external engine implementations. Its adapter contract supports codebase-memory, Myco, Hypha, Graphify, TriRegex, and repository-native indexes without collapsing their evidence or freshness models.

### `codex-zero-trust-house-style`

Optional presentation-only skill for the source rulebook’s tone, honorific, and rigid reporting conventions. It activates only when explicitly named or enabled by a repository instruction.

It cannot change technical conclusions, evidence requirements, safety behavior, or custody.

## Trigger isolation and precedence

Each skill must state positive triggers, negative triggers, and handoff conditions. Broad words such as “review”, “memory”, “graph”, or “rules” are insufficient alone when they would collide with another installed skill.

Precedence is:

1. system and developer instructions;
2. explicit user instructions;
3. active repository instructions;
4. explicit named-skill invocation;
5. the narrowest matching functional skill;
6. suite defaults.

When two functional skills materially conflict, the operation refuses or records the conflict instead of merging the rules opportunistically. House style is always last and non-authoritative.

## Development order

Implementation proceeds one skill at a time:

1. repair and verify the source rulebook;
2. author and validate the complete adoption manifest;
3. build shared provenance and shadow validators;
4. pressure-test and deploy `codex-zero-trust-engineering`;
5. pressure-test and deploy `codex-zero-trust-review`;
6. pressure-test and deploy `codex-zero-trust-project-operations`;
7. pressure-test and deploy `codex-index-is-a-graph-not-a-warehouse`;
8. pressure-test and deploy `codex-querying-galerina-rd`;
9. pressure-test and optionally deploy `codex-zero-trust-house-style`.

The next skill does not start until the current skill’s RED baseline, GREEN behavior, regression tests, duplicate/shadow checks, and live deployment validation are recorded.

## Known-answer and pressure tests

The suite requires deterministic tests for:

- all 91 source rules represented exactly once in the adoption manifest;
- source locator and digest integrity;
- conflict precedence against user and repository instructions;
- trigger isolation between all skills;
- optional house style remaining dormant unless explicitly enabled;
- graph-first behavior with bounded fallback;
- all six query statuses;
- stale build-point refusal;
- private and unpublished source non-egress;
- worker-count adaptation under different runtime limits;
- commit-versus-push custody;
- exact-path staging in a dirty worktree;
- source change invalidating a destination rule;
- missing external adapter returning a typed refusal rather than fabricated evidence.

Pressure tests must first demonstrate at least one plausible failure without the skill, then demonstrate the corrected behavior with it. A self-test that cannot turn red is not evidence.

## Duplicate and shadow controls

Before every suite commit, a deterministic checker must inspect every changed skill and shared rule for:

- duplicate normalized rule bodies;
- same-name or confusable skill triggers;
- copied upstream text without provenance;
- destination rules with no manifest row;
- one source rule owned by multiple destinations, or referenced by multiple skills without one canonical shared-rule declaration;
- a weaker local rule shadowing a stricter source or repository rule;
- stale source digests;
- accidental nested-repository or generated-artifact staging.

Findings are fail-closed. An allowed shared rule requires one canonical owner and explicit references, not copied twins.

## Git and publication custody

The source-rulebook repair and this design record belong to the source repository. The implementation belongs to the new standalone suite repository. The surrounding shared skills checkout remains untouched except for ignored or user-approved installation junctions.

Commits use explicit pathspecs and contain one coherent evidence unit. No push, pull request, marketplace publication, or public exposure is authorized by this design.

## Acceptance criteria

The design is complete when:

- the source checker proves ZT-01 through ZT-91 and the README agrees;
- every source rule has one reviewed adoption disposition;
- all suite subprojects are contained in the standalone repository;
- external graph/query engines are adapter dependencies rather than vendored shadows;
- each functional skill passes RED/GREEN pressure tests and trigger-isolation tests;
- the optional style skill remains non-authoritative and opt-in;
- duplicate/shadow and provenance checks pass for every commit;
- installed skills resolve to the standalone repository’s exact tested contents;
- no skill loads the complete engineering standard by default;
- no index stores document bodies or private authority;
- no commit, push, or publication occurs beyond active owner instructions.
