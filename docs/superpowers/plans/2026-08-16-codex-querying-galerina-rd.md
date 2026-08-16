# Deterministic Galerina R&D Query Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally deploy `codex-querying-galerina-rd`, a deterministic adapter that resolves public and permitted-private R&D metadata without copying document bodies.

**Architecture:** A KB-owned generator produces separate public and private RD metadata indexes containing only identifiers, paths, headings, state, supersession edges, terms, digests, and provenance. A self-contained Node.js query library and CLI in the standalone skill-suite repository consume those indexes plus `research/RD-TODO-MAP.md`; the thin skill teaches agents when to invoke the adapter and when to hand cross-repository impact work to `codex-querying-galerina-graphs`.

**Tech Stack:** Node.js ESM, `node:test`, JSON metadata indexes, Git CLI for build-point provenance, Codex Agent Skills.

## Global Constraints

- Repair and verify the source rulebook's ZT-91 known answer before creating the skill.
- Keep all suite-owned subprojects in the standalone `codex-zero-trust-rules` repository.
- Do not copy RD document bodies, the KB private metadata index, or `ENGINEERING-STANDARDS.md` into the suite repository.
- Use repository-relative paths in every persisted artifact and result.
- Preserve public and private custody as separate indexes and result fields.
- The only top-level resolution statuses are `CURRENT`, `SUPERSEDED`, `AMBIGUOUS`, `PRIVATE`, `MISSING`, and `STALE`.
- Preserve decision, custody, and freshness as separate fields beneath the top-level status.
- Query cross-repository impact through `codex-querying-galerina-graphs`; R&D metadata cannot answer code-impact questions.
- Keep the existing shared skills checkout untouched except for a local installation junction after verification.
- Commit with explicit pathspecs. Do not push or publish.

---

## File structure

### Source rulebook repository

- Modify `check-rules.mjs`: set the ceiling and expected placement to ZT-91.
- Modify `README.md`: advertise 91 rules.
- Create `check-rules.test.mjs`: red-capable known-answer tests for clean, missing, duplicate, out-of-range, and stale-ceiling cases.

### KB repository

- Create `tools/kb-rd-metadata-index.mjs`: deterministic public/private metadata-index generator.
- Create `tools/kb-rd-metadata-index.test.mjs`: parser, custody-split, supersession, provenance, and no-body tests.
- Modify `tools/README.md`: document the generator, modes, outputs, and refusal behavior.
- Modify `tools/kb-rd-todo-map.mjs`: bind the generated map to exact KB, Galerina, and SLIDE build points.
- Modify `research/RD-TODO-MAP.md`: regenerate the map with those build points.
- Generate `build/kb-index/rd-metadata-index.json`: public metadata.
- Generate `private/build/rd-metadata-index.json`: private metadata retained by the KB owner.

### Standalone suite repository

- Create `README.md`, `AGENTS.md`, `package.json`, and `.gitignore`: repository contract and commands.
- Create `scripts/audit-skill-suite.mjs`: duplicate-name, duplicate-body, path-leak, and manifest/provenance guard.
- Create `scripts/audit-skill-suite.test.mjs`: red controls for each audit class.
- Create `skills/codex-querying-galerina-rd/SKILL.md`: thin invocation and interpretation guide.
- Create `skills/codex-querying-galerina-rd/references/query-contract.md`: result schema and status precedence.
- Create `skills/codex-querying-galerina-rd/scripts/rd-query-lib.mjs`: deterministic query engine.
- Create `skills/codex-querying-galerina-rd/scripts/query-rd.mjs`: CLI and gold runner.
- Create `tests/fixtures/kb/**`: synthetic public/private indexes, TODO map, and bounded RD metadata fixtures.
- Create `tests/known-answer/rd-query.test.mjs`: exact, topic, range, TODO, status, custody, stale, and handoff cases.
- Create `tests/pressure/rd-query-baseline.md` and `tests/pressure/rd-query-green.md`: recorded skill RED/GREEN behavior.

---

### Task 1: Repair the source rulebook known answer

**Files:**
- Create: `check-rules.test.mjs`
- Modify: `check-rules.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: the existing `node check-rules.mjs` CLI contract.
- Produces: a 91-rule green gate plus a red-capable `node:test` suite.

- [ ] **Step 1: Write the failing known-answer tests**

Create a temporary rulebook fixture by copying only the checker and its declared shipped files. Run the copied checker as a child process. Include these tests:

```js
test('the live rulebook passes the 91-rule known answer', () => {
  assert.equal(runChecker(REPO).status, 0);
});

test('a missing definition is rejected', () => {
  const root = fixture();
  replace(root, 'CLAUDE.md', '**ZT-91 —', '**REMOVED-91 —');
  assert.match(runChecker(root).stderr, /ZT-91: defined nowhere|expected ZT/);
});

test('a duplicate definition is rejected', () => {
  const root = fixture();
  append(root, 'UI.md', '\n**ZT-91 — duplicate control**\n');
  assert.match(runChecker(root).stderr, /ZT-91|expected ZT/);
});

test('an out-of-range definition is rejected', () => {
  const root = fixture();
  append(root, 'CLAUDE.md', '\n**ZT-92 — out-of-range control**\n');
  assert.match(runChecker(root).stderr, /ZT-92|expected ZT/);
});

test('a stale version ceiling is rejected', () => {
  const root = fixture();
  replace(root, 'UI.md', 'rules ZT-01..ZT-91 stable', 'rules ZT-01..ZT-89 stable');
  assert.match(runChecker(root).stderr, /version line says ZT-89/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test check-rules.test.mjs`

Expected: the live-rulebook test fails because the checker ceiling and expected table still stop at ZT-89.

- [ ] **Step 3: Make the minimal ZT-91 repair**

Change the checker header to `ZT-01..ZT-91`, set `MAX = 91`, add `90, 91` to `CLAUDE.md` in `EXPECTED`, and change the README count/range to 91.

- [ ] **Step 4: Run focused and direct verification**

Run:

```text
node --test check-rules.test.mjs
node check-rules.mjs
```

Expected: all five tests pass and the direct checker prints `GREEN 91 rules`.

- [ ] **Step 5: Commit the source repair only**

Commit message: `Repair the ZT-91 rulebook gate`

---

### Task 2: Build the KB-owned RD metadata indexes

**Files:**
- Create: `tools/kb-rd-metadata-index.test.mjs`
- Create: `tools/kb-rd-metadata-index.mjs`
- Modify: `tools/README.md`
- Modify: `tools/kb-rd-todo-map.mjs`
- Generate: `research/RD-TODO-MAP.md`
- Generate: `build/kb-index/rd-metadata-index.json`
- Generate: `private/build/rd-metadata-index.json`

**Interfaces:**
- Consumes: tracked Markdown under `research/rd`, `research/rd-legacy`, `private/research/rd`, and `private/research/rd-legacy`.
- Produces: `buildMetadataIndexes(entries, provenance)` and two version-1 JSON indexes.

- [ ] **Step 1: Write parser and custody RED tests**

Test the exported pure functions against in-memory fixtures:

```js
test('extracts metadata without retaining body text', () => {
  const doc = parseRd('research/rd/RD-0843-width.md', FIXTURE_TEXT);
  assert.equal(doc.rd, 'RD-0843');
  assert.equal(doc.title, 'RD-0843 — width');
  assert.deepEqual(doc.headings, ['Decision', 'Evidence']);
  assert.equal(doc.state, 'SOURCE-CHECKED');
  assert.equal('body' in doc, false);
  assert.equal(JSON.stringify(doc).includes('SECRET BODY SENTENCE'), false);
});

test('keeps public and private outputs separate', () => {
  const { publicIndex, privateIndex } = buildMetadataIndexes(FIXTURES, PROVENANCE);
  assert.deepEqual(publicIndex.docs.map((d) => d.rd), ['RD-0843']);
  assert.deepEqual(privateIndex.docs.map((d) => d.rd), ['RD-0855']);
});

test('records explicit supersession edges with line provenance', () => {
  const doc = parseRd('research/rd/RD-0855-next.md', SUPERSESSION_TEXT);
  assert.deepEqual(doc.supersedes[0], { rd: 'RD-0843', line: 8, kind: 'EXPLICIT' });
});
```

Also test duplicate numbers, legacy filenames, state extraction, deterministic ordering, source-set digest changes, repository-relative paths, and refusal of empty input.

Extend the TODO-map self-test so generated metadata carries exact 40-hex build points for the KB, Galerina, and SLIDE fixtures, and fails closed when a required Git build point cannot be read.

- [ ] **Step 2: Run the metadata tests and verify RED**

Run: `node --test tools/kb-rd-metadata-index.test.mjs`

Expected: module-not-found failure for the not-yet-created generator.

- [ ] **Step 3: Implement the minimal generator**

The generator must:

- discover tracked files through `git ls-files --cached` with four explicit RD-directory pathspecs;
- parse only the title, `##`–`####` headings, `Date`, `State`, RD codes, bounded top terms, explicit supersession phrases, and SHA-256 digest;
- derive `custody` from the owning directory;
- sort by RD number then path;
- write public and private outputs separately;
- include `format`, `generatedBy`, `kbHead`, `builtAt`, `sourceSetDigest`, and `documentCount`;
- refuse an empty corpus, duplicate output paths, absolute paths, or a private entry in the public output;
- support `--selftest`, `--dry-run`, and apply modes.

Update `kb-rd-todo-map.mjs` to print the exact KB, Galerina, and SLIDE source build points in its generated header. Preserve its existing read-only treatment of the product repositories.

- [ ] **Step 4: Verify RED controls and generate both indexes**

Run:

```text
node --test tools/kb-rd-metadata-index.test.mjs
node tools/kb-rd-metadata-index.mjs --selftest
node tools/kb-rd-metadata-index.mjs --dry-run
node tools/kb-rd-metadata-index.mjs
node tools/kb-rd-todo-map.mjs --selftest
node tools/kb-rd-todo-map.mjs
```

Expected: tests and self-test pass; dry-run writes nothing; apply writes both metadata indexes without body text.

- [ ] **Step 5: Update the operator manual in the same commit**

Document the two outputs, private-custody rule, metadata-only schema, modes, exit codes, and session-close placement in `tools/README.md`.

- [ ] **Step 6: Run KB safety checks and commit explicit paths**

Run the metadata tests, path-leak gate, path-portability gate, and a bounded duplicate/shadow scan over the two generated indexes.

Commit message: `Add public and private RD metadata indexes`

---

### Task 3: Create the standalone suite and its shadow guard

**Files:**
- Create: `README.md`
- Create: `AGENTS.md`
- Create: `package.json`
- Create: `.gitignore`
- Create: `scripts/audit-skill-suite.test.mjs`
- Create: `scripts/audit-skill-suite.mjs`

**Interfaces:**
- Consumes: suite files only.
- Produces: `npm test`, `npm run audit`, and a clean standalone Git owner.

- [ ] **Step 1: Initialize the standalone repository**

Create the `codex-zero-trust-rules` directory as its own Git repository. Do not stage it in the surrounding skills checkout.

- [ ] **Step 2: Write failing audit tests**

Fixtures must prove the audit rejects duplicate skill names, normalized duplicate skill bodies, absolute machine paths, copied private-index files, and a skill whose frontmatter name does not match its directory.

- [ ] **Step 3: Run the audit tests and verify RED**

Run: `node --test scripts/audit-skill-suite.test.mjs`

Expected: module-not-found failure for the absent audit implementation.

- [ ] **Step 4: Implement the minimal audit and repository commands**

Use dependency-free Node.js. `package.json` scripts:

```json
{
  "scripts": {
    "test": "node --test",
    "audit": "node scripts/audit-skill-suite.mjs"
  }
}
```

The audit returns exit 0 only when every skill name is unique, frontmatter matches its directory, no normalized body twin exists, no absolute path leaks, and no file named `rd-metadata-index.json` is present in the suite.

- [ ] **Step 5: Verify and commit the suite foundation**

Run `npm test`, `npm run audit`, and confirm the parent skills checkout shows only an untracked nested repository entry, never staged content.

Commit message: `Create the zero-trust skill-suite foundation`

---

### Task 4: Implement exact, range, TODO, and freshness resolution

**Files:**
- Create: `skills/codex-querying-galerina-rd/scripts/rd-query-lib.mjs`
- Create: `tests/fixtures/kb/**`
- Create: `tests/known-answer/rd-query.test.mjs`

**Interfaces:**
- Consumes: `loadKbIndexes(kbRoot, privateMode)`.
- Produces: `queryRd(request, loaded)` returning the result envelope documented below.

- [ ] **Step 1: Write exact-resolution RED tests**

Use fixtures, not the live KB, for unit tests:

```js
test('RD-0855 resolves as private custody with current decision and TODO links', async () => {
  const out = await queryFixture({ mode: 'exact', rd: 'RD-0855', private: 'permitted' });
  assert.equal(out.status, 'PRIVATE');
  assert.equal(out.results[0].custody, 'PRIVATE');
  assert.equal(out.results[0].decision, 'CURRENT');
  assert.deepEqual(out.results[0].todo.map((x) => x.repo), ['Galerina', 'SLIDE']);
});

test('a missing RD is explicit', async () => {
  const out = await queryFixture({ mode: 'exact', rd: 'RD-0999' });
  assert.equal(out.status, 'MISSING');
});

test('a duplicate number is ambiguous', async () => {
  const out = await queryFixture({ mode: 'exact', rd: 'RD-0843' });
  assert.equal(out.status, 'AMBIGUOUS');
});

test('a build-point mismatch is stale', async () => {
  const out = await queryFixture({ mode: 'exact', rd: 'RD-0855' }, { kbHead: 'different' });
  assert.equal(out.status, 'STALE');
});
```

Add range-bound tests for inclusive `RD-0750..RD-0855`, reversed ranges, more than 250 entries, and mixed public/private custody.

- [ ] **Step 2: Run the query tests and verify RED**

Run: `node --test tests/known-answer/rd-query.test.mjs`

Expected: module-not-found failure for `rd-query-lib.mjs`.

- [ ] **Step 3: Implement loading and exact resolution**

Result envelope:

```js
{
  status: 'PRIVATE',
  query: { mode: 'exact', value: 'RD-0855' },
  freshness: 'FRESH',
  kbHead: '1111111111111111111111111111111111111111',
  results: [{
    rd: 'RD-0855',
    custody: 'PRIVATE',
    decision: 'CURRENT',
    path: 'private/research/rd/RD-0855-galerina-slide-vok-pre-conversion-technical-strategy-PRIVATE.md',
    heading: 'RD-0855 — Galerina, SLIDE and VOK pre-conversion technical strategy - PRIVATE',
    sections: [{ heading: 'Decision', line: 15 }],
    state: 'SOURCE-CHECKED owner-directed architecture routing; no implementation authority',
    supersedes: [],
    supersededBy: [],
    todo: [{ repo: 'Galerina', line: 7 }],
    digest: '2222222222222222222222222222222222222222222222222222222222222222'
  }]
}
```

Load both indexes only when private access is permitted. `locator` mode may report the curated private path and `PRIVATE` status but must omit private headings, sections, state, terms, and digest. Compare each loaded index's `kbHead` with the current KB Git HEAD; a mismatch makes the query `STALE` before ranking. Parse the TODO-map build points and mark a requested TODO relation stale when its KB, Galerina, or SLIDE source head no longer matches.

- [ ] **Step 4: Implement range and TODO parsing**

Parse the generated TODO table, return repository and line locators only, cap ranges at 250 RDs, and preserve numeric ordering.

- [ ] **Step 5: Run tests and commit the resolver slice**

Run the focused test file and the suite audit.

Commit message: `Resolve exact and ranged Galerina RD metadata`

---

### Task 5: Implement topic, supersession, and current-decision queries

**Files:**
- Modify: `skills/codex-querying-galerina-rd/scripts/rd-query-lib.mjs`
- Modify: `tests/known-answer/rd-query.test.mjs`

**Interfaces:**
- Consumes: normalized metadata entries from Task 4.
- Produces: deterministic topic ranks and supersession chains.

- [ ] **Step 1: Write topic and supersession RED tests**

Test exact score order, private inclusion only when permitted, normalization-distinct terms, a unique supersession chain, two successors producing `AMBIGUOUS`, an explicit superseded state, and an unknown state remaining `AMBIGUOUS` rather than being guessed current.

- [ ] **Step 2: Run and verify RED**

Expected: assertions fail because the modes are not implemented.

- [ ] **Step 3: Implement deterministic metadata scoring**

Tokenize the query into lowercase alphanumeric/hyphen terms. Score title matches 8, RD-code matches 6, heading matches 4, and top-term matches 1. Require every query term to occur somewhere in the candidate metadata. Sort by descending score, RD number, then path. Return at most 50 results.

- [ ] **Step 4: Implement decision and supersession precedence**

Precedence:

1. stale index -> `STALE`;
2. duplicate RD or competing successors -> `AMBIGUOUS`;
3. private result -> top-level `PRIVATE`, with separate decision;
4. explicit inbound supersession or superseded state -> `SUPERSEDED`;
5. recognized active state (`CURRENT`, `SOURCE-CHECKED`, `ADOPTED`, `ACCEPTED`, `OWNER-DIRECTED`, `ACTIVE`) -> `CURRENT`;
6. absent or unknown state -> `AMBIGUOUS`.

- [ ] **Step 5: Run tests and commit**

Commit message: `Add topic and supersession RD queries`

---

### Task 6: Add the CLI, gold cases, and impact handoff

**Files:**
- Create: `skills/codex-querying-galerina-rd/scripts/query-rd.mjs`
- Modify: `tests/known-answer/rd-query.test.mjs`

**Interfaces:**
- Consumes: `queryRd` from Task 5.
- Produces: JSON CLI, human locator view, and `--gold`.

- [ ] **Step 1: Write CLI RED tests**

Cover:

```text
--rd RD-0855
--topic "virtual trit"
--range RD-0750..RD-0855
--supersession RD-0843
--todo RD-0855
--impact "what code changes because of RD-0855"
--gold
```

Assert malformed or combined modes exit 2; `MISSING`, `AMBIGUOUS`, and `STALE` exit 1; resolved and handoff envelopes exit 0. `--impact` must emit a structured handoff naming `codex-querying-galerina-graphs` and no code-impact claim.

- [ ] **Step 2: Run and verify RED**

Expected: CLI module missing.

- [ ] **Step 3: Implement the dependency-free CLI**

Require exactly one query mode, accept `--kb`, `--private locator|permitted`, `--json`, and `--gold`, and keep absolute input paths out of output.

- [ ] **Step 4: Implement gold fixtures**

Gold must include exact private RD-0855, public current, superseded, ambiguous duplicate, missing, stale, topic, range, TODO, and impact-handoff cases. Print `gold N/N` and exit nonzero on any mismatch.

- [ ] **Step 5: Verify and commit**

Run the known-answer tests, `--gold`, suite audit, and a live `RD-0855` locator query against the KB.

Commit message: `Add the Galerina RD query CLI and gold set`

---

### Task 7: Pressure-test and author the skill

**Files:**
- Create: `tests/pressure/rd-query-baseline.md`
- Create: `skills/codex-querying-galerina-rd/SKILL.md`
- Create: `skills/codex-querying-galerina-rd/references/query-contract.md`
- Create: `tests/pressure/rd-query-green.md`

**Interfaces:**
- Consumes: the verified CLI from Task 6.
- Produces: one deployable Codex skill with tested trigger and interpretation behavior.

- [ ] **Step 1: Run RED pressure scenarios without the skill**

Use fresh-context agents for at least these scenarios:

- exact RD-0855 when the public flat index returns no document;
- private result under a request to paste the full body;
- stale metadata under time pressure;
- a cross-repository impact question that tempts an answer from R&D alone;
- a topic query where a public and private result share a title term.

Record choices and rationalizations verbatim in `rd-query-baseline.md`.

- [ ] **Step 2: Author the minimal skill from observed failures**

The description must start `Use when...` and mention RD numbers, Galerina R&D, supersession, TODO maps, public/private custody, and current decisions. Keep `SKILL.md` under 500 words; route command details to `query-rd.mjs --help` and status details to `references/query-contract.md`.

- [ ] **Step 3: Run GREEN pressure scenarios with the skill**

The agent must invoke the adapter, preserve statuses, avoid body copying, and hand impact questions to the graph skill. Record results in `rd-query-green.md`.

- [ ] **Step 4: Validate the skill and commit**

Run the Agent Skills validator, suite tests, suite audit, gold set, and duplicate/shadow check.

Commit message: `Add the codex-querying-galerina-rd skill`

---

### Task 8: Deploy locally and run live acceptance

**Files:**
- Local installation junction only; no tracked file outside the suite repository.

**Interfaces:**
- Consumes: the exact tested skill commit.
- Produces: active local skill resolving to that commit's directory.

- [ ] **Step 1: Create the local skill junction**

Point the active Codex skills location for `codex-querying-galerina-rd` at the suite repository's skill directory. Do not copy the skill.

- [ ] **Step 2: Run live acceptance queries**

Verify:

- RD-0855 returns `PRIVATE` custody, `CURRENT` decision, its private locator, and Galerina/SLIDE TODO references;
- a public RD returns no private metadata;
- a topic query includes a permitted private result without body text;
- a forced stale fixture returns `STALE`;
- an impact query returns a graph-skill handoff;
- exact and topic library queries each complete within 250 ms after index loading, and the complete cold CLI invocation completes within 1,000 ms on the verification host; record observed timings without treating them as portable performance authority.

- [ ] **Step 3: Run final integrated verification**

Run source rulebook tests, KB metadata-index tests/selftest, suite tests, suite audit, gold set, and skill validator. Inspect Git status separately in the source rulebook, KB, suite, and parent skills repositories.

- [ ] **Step 4: Commit any verification-only documentation in its owning repository**

Use explicit pathspecs. Do not push.
