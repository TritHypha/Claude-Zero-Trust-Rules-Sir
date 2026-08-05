# Engineering Standards for Building Software from Scratch

> **Adopted into the house 2026-08-06** — owner-supplied baseline, integrated as a companion to
> the rulebook. Editorial pass for this public repo: machine-absolute paths neutralised, and the
> appendix implementations labelled with their provenance — the `k3_gate/` and `zero_trust/`
> reference packages live in the **originating workspace, not in this repo** (the house path,
> reference, and claims rules applied to an adopted document). Where these standards and the ZT
> rules overlap, the numbered rules are the canon; the mapping:
>
> | Here | Rulebook |
> |---|---|
> | §0 governing principles · §2 zero-trust · §3 fail-closed gates | ZT-08..14 (CORE §3) |
> | §15 anti-drift | ZT-86 |
> | §16 verify, don't assume | ZT-08 · ZT-80 · ZT-84 |
> | §17 focus, no rabbit holes | ZT-85 |
> | §18 external boundaries · §19 untrusted components | ZT-13 · ZT-14 · ZT-21 · ZT-63 |
> | §20 check again · §21 third-party verification | ZT-43 · ZT-51 · `BRAINS.md` §3a |

A practical baseline you can enforce from day zero. Each item is a **requirement class**, not a slogan. Prefer measurable gates over aspirational language.

---

## Index

- §0 — Governing principles (apply to all of the below)
- **Vocabulary — what the owner means by "Tri-1"**
- §1 — Best possible use of ternary (trit · K3 · photonic)
- §2 — Zero-trust
- §3 — Fail-closed ⇒ always a gate
- §4 — Security + OWASP
- §5 — Stability
- §6 — Consistency
- §7 — Nice to hardware (no needless throttling / thermal pain)
- §8 — Speed
- §9 — Nice developer experience (DX)
- §10 — Easy for senior developers (day job: architecture, archival, ops)
- §11 — Reproducibility (twice for emphasis)
- §12 — ISO alignment, redaction, PII, GDPR (and similar)
- §13 — Best practice (engineering)
- §14 — Strict coding standards
- §15 — Anti-drift (outcome stays the goal—or change is explicit)
- §16 — Verify, so not assume
- §17 — Focus on the task (no rabbit holes)
- §18 — External information boundaries
- §19 — Untrusted components: contain and harden (don't only ticket, don't over-trust)
- §20 — Check, check, and check again
- §21 — Third-party verification (code, R&D, logic, architecture, perception)
- §22 — Longevity — avoid old mistakes, avoid legacy by default, design for 20+ years
- Priority order when trade-offs appear
- Minimal adoption checklist (first 30 days)
- Appendix A — K3 Gate Logic — Implemented
- Appendix B — Fail-Open Composition Strategies
- Appendix C — Checking the maths; open-source borrow vs patents
- Appendix D — Zero Trust Architecture — Implemented

---

## 0. Governing principles (apply to all of the below)

| Principle | Rule |
|---|---|
| **Evidence over origin** | Trust only what is verified now—not filename, path, cache hit, prior success, or "it worked on my machine." |
| **Fail closed** | Missing, malformed, stale, conflicting, or indeterminate evidence **blocks** the action. Never silently allow. |
| **Separation of proposal and authority** | Heuristics, ML, caches, and indexes may **suggest**. Only explicit deterministic admission may **authorize**. |
| **Reproducibility by default** | Same inputs + same toolchain pin ⇒ same artifacts (bit-identical where feasible). |
| **Least privilege** | Every component runs with the minimum capabilities it needs—nothing ambient. |

**Authority model (recommended):** ternary control outcomes

- **−1 (DENY):** malformed, forbidden, identity mismatch, proof failure
- **0 (INDETERMINATE):** insufficient evidence, exhausted budget, unauthenticated
- **+1 (ALLOW):** complete current-context deterministic admission only

A cache hit, high model score, or internally consistent file must **never** create `+1` by itself.

---

## Vocabulary — what the owner means by "Tri-1"

**"Tri-1" is the owner's spoken shorthand, not a defined technical term.** It is a *pointer to
the family*, and it means whichever of the three layers below the sentence is actually about.
Resolve it from context; never carry it into a written artifact unresolved.

| When the owner says "Tri-1" and is talking about… | They mean | Write it as |
|---|---|---|
| numbers, weights, packing, sketches, votes, storage density | a value in \(\{-1,0,+1\}\) | **trit** / **balanced ternary** |
| gates, admission, permission, verdicts, receipts, "deny / unknown / allow" | the three-valued authority lattice | **K3** |
| hardware, optics, the wire, signal levels, switching | three distinguishable physical levels | **photonic ternary** |
| the whole programme at once — the house style, the family of ideas | all three, loosely | **ternary** (and then name the layer) |

**Rules for the reader**

1. **Ask which layer before you act.** "Make the Tri-1 part stricter" is three different tasks.
   If context does not settle it, that is a genuine fork — ask, with the three options.
2. **Resolve on the way in.** Spoken "Tri-1" → the precise term in code, comments, commits,
   docs, and diagrams. Shorthand is fine in conversation and never fine in an artifact.
3. **Never let the shorthand carry authority across layers.** The single word is exactly what
   makes a `+1` *weight* look like an `ALLOW` *verdict*; §1 rule 2 exists because of it.
4. **One exception — the name.** "Tri-1" as a **coined product/brand name** (as in the IP
   table in Appendix C) is a proper noun and stays as written. Preserve it there; resolve it
   everywhere else.

---

## 1. Best possible use of ternary — trits, K3, and photonic levels

Three-valued thinking shows up at three **different layers**, and one word for all three is
how representation quietly becomes permission. Name the layer you mean:

| Term | Layer | Means | Legitimate use |
|---|---|---|---|
| **trit** / **balanced ternary** | data | a value in \(\{-1,0,+1\}\) | packing, weights, sketches, votes |
| **K3** | authority | the three-valued lattice DENY / INDETERMINATE / ALLOW | gates, admission, receipts |
| **photonic ternary** | physical | three distinguishable signal levels in hardware | encoding on the wire |

A trit is a **number**. A K3 verdict is a **permission**. A photonic level is a **voltage or a
pulse**. They share an arity and nothing else — a `+1` weight authorises nothing, and a K3
`ALLOW` is not arithmetic. Use ternary where it helps **representation, packing, or decision
encoding**; never as a mystique layer.

| Use | Do | Don't |
|---|---|---|
| **Decision gates (K3)** | Encode refuse / indeterminate / allow explicitly | Collapse indeterminate into allow |
| **Compact weights / sketches** | Pack 5 trits per byte (\(3^5=243\le256\)) for storage density | Assume packing ⇒ speed or L1 residency without measurement |
| **Feature / vote aggregation** | Ternary votes with explicit abstain (`0`) | Treat `0` as weak `+1` |
| **Protocol flags** | Three-way status in APIs and receipts | Boolean-only APIs that hide uncertainty |

**Standards**

1. Document every trit domain: *what −1 / 0 / +1 mean in that field*.
2. Keep **numeric trit weights** separate from **authority K3** (representation ≠ permission) and
   both separate from **photonic levels** (a signal level is not a verdict). One word for all
   three is how the separation gets lost — name the layer at every mention.
3. Prefer int8/predecode on the hot path unless a measured ternary kernel wins.
4. Golden vectors for pack/unpack; mutation tests must fail closed on corrupt trit streams.

---

## 2. Zero-trust

**Standards**

1. **No ambient trust:** network, disk, plugins, sidecars, env vars, and "platform defaults" are untrusted until verified.
2. **Identity everywhere:** every artifact, model, config, and tool has content identity (hash) + optional signature + epoch.
3. **Policy in the admission path:** authorization checks current policy, not a cached decision from yesterday.
4. **Supply chain:** pinned dependencies, lockfiles, verified provenance (e.g. signed builds, reproducible content-addressed stores).
5. **Runtime:** mutual auth between services; short-lived credentials; no long-lived god tokens in config.
6. **Human access:** SSO + least privilege + audited break-glass; no shared root SSH as normal ops.

---

## 3. Fail-closed ⇒ always a gate

Every sensitive operation passes a **gate** with an explicit outcome.

```text
request → validate identity → check policy → check freshness →
  check completeness → ADMIT | REFUSE | INDETERMINATE
```

**Standards**

1. **Default deny** on missing fields, unknown versions, unknown algorithms.
2. **No "best effort" security paths** in production.
3. Timeouts, OOM, and partial results → **INDETERMINATE or DENY**, never partial allow.
4. Gates are **testable:** table-driven cases for −1 / 0 / +1.
5. Observability: gate id, evidence ids, outcome—without leaking secrets.

---

## 4. Security + OWASP

Map controls to [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) / Top 10 as a checklist, not a poster.

| Area | Minimum bar |
|---|---|
| **Injection** | Parameterized queries; no shell with user strings; strict parsers |
| **AuthN/AuthZ** | Central policy; deny by default; object-level authorization |
| **Crypto** | Modern suites only (TLS 1.3+, AEAD); agility for algorithms; no homemade crypto |
| **Secrets** | Vault/KMS; never in git; rotation; encryption at rest |
| **SSR / XSS / CSRF** | Framework defaults hardened; CSP; SameSite; trusted types where applicable |
| **Deserialization** | Allowlist types; prefer safe formats (JSON with schema) |
| **Supply chain** | SCA scanning; signed releases; pinned actions/runners |
| **Logging** | No secrets/PII in logs; tamper-evident audit where required |
| **Headers / transport** | HSTS, secure cookies, certificate pinning where appropriate |

**Standards:** threat model per service; security tests in CI; dependency and container scanning on every mainline build.

---

## 5. Stability

**Standards**

1. **API compatibility policy** (SemVer or explicit stability levels: experimental / stable / deprecated).
2. **Backwards-compatible migrations** with expand/contract for data stores.
3. **Circuit breakers, bulkheads, backpressure**—fail closed under overload.
4. **Idempotent writes** with idempotency keys where retries exist.
5. **Chaos and load tests** on critical paths before calling a release "stable."
6. **SLOs + error budgets** drive release freeze, not vibes.

---

## 6. Consistency

**Standards**

1. **One canonical format** per artifact type (JSON Schema / protobuf / CBOR—pick and freeze).
2. **Deterministic serialization** (sorted keys, fixed floats policy, normalized Unicode).
3. **Single source of truth** for config and feature flags.
4. **Consistent error model** across APIs (code, message, correlation id, safe details).
5. **Naming and package layout** documented in a short ADR; enforced by lint.
6. **Time:** UTC storage; explicit time zones at boundaries; monotonic clocks for intervals.

---

## 7. Nice to hardware (no needless throttling / thermal pain)

**Standards**

1. **Efficiency first:** avoid hot spin-loops; batch I/O; bounded thread pools.
2. **Measure power and thermals** on representative devices for long-running workloads.
3. **Adaptive concurrency** under thermal or battery constraints (especially mobile/edge).
4. **Cache-friendly data layouts**; avoid huge temporary allocations on hot paths.
5. **No forced 100% CPU** "for latency" without a profile proving need.
6. Prefer **idle-friendly** designs: event-driven, sleep, coalesce wakeups.
7. Document CPU features used (AVX, NEON); provide scalar fallbacks.

---

## 8. Speed

**Standards**

1. **Budgets:** p50/p95 latency and throughput targets per API *before* implementation.
2. **Profile before micro-optimizing**; optimize the measured critical path.
3. **Complexity budgets:** reject designs with unbounded worst-case without gates.
4. **Caching only with explicit invalidation identity** (content-addressed keys).
5. **Async boundaries** clear; no hidden blocking on request threads.
6. **Binary size and startup time** tracked for CLIs and mobile.
7. Compete against a **null baseline** (do-nothing / simpler algorithm)—not against marketing claims.

---

## 9. Nice developer experience (DX)

**Standards**

1. **One-command bootstrap:** `tool setup` installs toolchain pins and hooks.
2. **Seconds-to-feedback** unit tests; minutes for integration on laptop.
3. **Clear errors** with fix hints; no stack traces as the only UX.
4. **Dev/prod parity** via containers or deterministic local runners.
5. **Good defaults**; power options documented, not required on day one.
6. **Generated API clients** and schema docs from the same source.
7. **Internal playgrounds** (REPLs, sample tenants) without prod credentials.

---

## 10. Easy for senior developers (day job: architecture, archival, ops)

**Standards**

1. **Architecture Decision Records (ADRs)** for irreversible choices.
2. **Runbooks** for pageable services; on-call owned by the building team.
3. **Archival:** retention classes, legal hold, export formats, deletion certificates.
4. **Operability:** metrics, traces, logs with consistent correlation ids.
5. **Capacity and cost models** documented for each major component.
6. **Extension points** that are stable; internals that may change.
7. **Exit ramps:** data export and dependency isolation so the system is not a trap.

---

## 11. Reproducibility (twice for emphasis)

**Standards**

1. **Pinned toolchains** (compiler, SDK, linter versions) in version control.
2. **Lockfiles** for every package ecosystem; verified installs in CI.
3. **Content-addressed build artifacts** where possible (Nix-/Bazel-style thinking).
4. **Hermetic builds:** no undeclared network; no ambient `/usr` tools unless pinned.
5. **Recorded inputs:** source hash, config hash, tool hash on every release receipt.
6. **Reproducible tests:** seed control; time mocked; ordered parallelism where needed.
7. **Rebuild verification:** second builder or independent path must match artifact hash.

---

## 12. ISO alignment, redaction, PII, GDPR (and similar)

Treat regulation as **design constraints**, not a legal afterthought. (Not legal advice.)

| Topic | Engineering control |
|---|---|
| **Data classification** | Public / internal / confidential / restricted labels on fields and stores |
| **PII inventory** | Catalog of personal data fields and processing purposes |
| **Minimisation** | Collect only what the feature needs; default retention limits |
| **Redaction** | Central redaction library for logs, support tools, screenshots |
| **Access** | Role-based + purpose-based access; audited reads of sensitive data |
| **Export / delete** | Subject-request pipelines with verifiable completion |
| **Encryption** | At rest and in transit; key separation per sensitivity |
| **Cross-border** | Explicit config for region pinning of data |
| **DPIA triggers** | Design checklist when processing high-risk data |
| **ISO 27001-ish** | Asset inventory, change control, incident process, vendor review |

**Standards:** PII never in test fixtures from prod; synthetic data by default; redaction tests in CI.

---

## 13. Best practice (engineering)

**Standards**

1. **Trunk-based or short-lived branches**; CI mandatory green for merge.
2. **Code review** with security and operability checklists.
3. **Automated tests:** unit / integration / contract / e2e as appropriate; coverage on critical gates.
4. **Static analysis + formatters + linters** as non-optional CI.
5. **Dependency update cadence** with human review for major bumps.
6. **Feature flags** for risky launches; cleanup of stale flags.
7. **Post-incident reviews** that produce backlog items, not blame.

---

## 14. Strict coding standards

**Enforce in tooling, not only in wiki.**

| Rule class | Examples |
|---|---|
| **Style** | Formatter (gofmt/rustfmt/prettier/black); max line complexity |
| **Types** | Strict mode; no unchecked `any` / void*; exhaustive switches |
| **Errors** | Typed errors; no swallowed exceptions; context attached |
| **Concurrency** | No data races (tools + review); cancelation propagated |
| **Resources** | RAII / `defer` / `using`; bounds on buffers and retries |
| **Unsafe** | Allowlisted modules only; extra review |
| **Comments** | Why, not what; link ADRs for non-obvious invariants |
| **Testing** | Pure logic unit-tested; gates table-tested for −1/0/+1 |
| **Forbidden** | `eval`, shelling out with untrusted input, custom crypto, unbounded reflection on untrusted data |

**Language-specific profiles** live in-repo (`clippy.toml`, `eslint`, `analyzer` rules) and fail CI on violation.

---

## 15. Anti-drift (outcome stays the goal—or change is explicit)

**Intent:** The delivered system must still match the goal you started with, unless there is a recorded, good reason to change that goal.

Drift is not "learning." Drift is silent movement of scope, success criteria, architecture, or acceptance gates without decision.

**Standards**

| Rule | Practice |
|---|---|
| **Goal freeze** | Write a short Goal Statement (problem, non-goals, success metrics) before build; version it. |
| **Change requires reason** | Any change to goals, SLOs, threat model, or acceptance gates needs an ADR or change note: what changed, why, who approved, what is not changing. |
| **Traceability** | Each major deliverable maps to a goal item (implements G-3, drops G-7 with ADR-12). |
| **Periodic drift check** | At milestones: "Does this still serve the original goal?" Answer in writing. |
| **Anti-gold-plating** | Work that does not advance a stated goal is out of scope unless a goal is formally revised. |
| **Metric drift** | Do not swap success metrics after the fact to make a weak result look like a win (e.g. report B1 vs B0 when the claim was B1 vs BA). |
| **Authority drift** | Heuristics, caches, and ML must not silently gain authority the design denied them. |

**Gate questions (use at review)**

- What was the original intended outcome?
- Is the current outcome the same?
- If not, is there a documented reason and acceptance of the new goal?
- What did we stop doing so the new goal stays honest?

**Fail patterns**

- "While we were here" features with no goal link
- Redefining "done" to match what shipped
- Expanding trust boundaries without a threat-model update
- Benchmark shopping (changing the null hypothesis after results)

---

## 16. Verify, so not assume

**Intent:** No important claim rests on assumption, folklore, cache presence, prior success, or "it should be fine."

Aligned with zero-trust and K3: evidence is checked now; missing evidence is INDETERMINATE or DENY, not silent allow.

**Standards**

| Rule | Practice |
|---|---|
| **Evidence required** | Security, correctness, performance, and compliance claims need artifacts: tests, measurements, signatures, receipts. |
| **Assume hostile / incomplete inputs** | Parsers, gates, and admins treat input as untrusted until validated. |
| **Re-verify at boundaries** | Admission, deploy, and privilege escalation re-check identity, epoch, policy—not "we checked at build." |
| **No proof by origin** | Path, filename, CI job name, author, or "green last week" is not proof. |
| **Measure, don't mythologize** | Performance, cache residency, thermal, and packing claims need numbers on the target class of machine. |
| **Independent check where it matters** | Critical gates: second implementation, translation validation, or at least a different code path. |
| **Assumptions log** | Explicit list of residual assumptions (hardware, DMA, compiler, human process) with owners and review dates. |

**Operational habit**

```text
claim → what would falsify it? → run that check → record result
if check impossible → label INDETERMINATE, do not ship as proven
```

**Fail patterns**

- "Default config is secure" without review
- "Small model fits in L1" without \( W_{\mathrm{hot}} \) measurement
- "Users won't do that" as an authz control
- Treating internal consistency (self-hash) as external authenticity

---

## 17. Focus on the task (no rabbit holes)

**Intent:** Finish the main task. Side ideas are noted, not chased, until the primary outcome is done.

**Standards**

| Rule | Practice |
|---|---|
| **One active primary task** | Visible definition of done for the current unit of work. |
| **Note, don't chase** | Rabbit holes go to a parking lot (issue, ADR stub, "later" list) with one line of context. |
| **Time-box exploration** | Spikes have a fixed budget (e.g. 25–90 minutes); then decide: adopt, park, or discard. |
| **Main path first** | Implement the fail-closed happy path and tests before optional optimisations, extra engines, or polish. |
| **Review against goal** | If a subtask does not move the Goal Statement, park it (§15). |
| **Close the loop** | After parking: return to the main task immediately; do not open a second rabbit hole. |
| **Ship increments** | Prefer a complete thin slice over a half-finished cathedral of side quests. |

**Lightweight protocol**

```text
1. State the main task and done-criteria in one sentence.
2. Work only on what advances that sentence.
3. If a digression appears → write a note (title + why + where) → stop digression.
4. Finish main task → then triage the parking lot by goal impact.
```

**Fail patterns**

- Rewriting the build system during a one-line gate fix
- Reading three papers mid-implementation with no spike budget
- "Quick refactor" that blocks the release
- Expanding scope in code review without a goal change (§15)

**How §15–§17 work together**

```text
Goal (15) ──► Task focus (17) ──► Verify claims (16)
    │                │                    │
    │                │                    └─ evidence or INDETERMINATE
    │                └─ park digressions
    └─ explicit change only via recorded reason
```

| Pressure | Response |
|---|---|
| New idea mid-build | Note it (§17); check goal fit (§15); only then schedule |
| "Should be fast enough" | Verify (§16) or do not claim |
| Results miss the original null | Report honestly (§15 anti metric-drift); do not swap the question |
| Outage / missing evidence | Fail closed or fail-static by policy, never assume allow (§16) |

**Checklist add-ons (use with the earlier 30-day list)**

- [ ] Goal Statement + non-goals checked in
- [ ] ADR/change note template used for goal or gate changes
- [ ] Assumptions log started for the first service
- [ ] Parking-lot file or label (`parked`) in the issue tracker
- [ ] CI or review asks: "What verifies this claim?"
- [ ] Milestone review: "Still the original goal?"

---

## 18. External information boundaries

**§18. Boundary handling — any information from an external source**

**Intent:** Everything that crosses into your system from outside is **untrusted until verified**. The boundary is an explicit **gate**, not a courtesy check.

"External" includes: users, browsers, mobile apps, partner APIs, third-party SaaS, OS env, files on disk, queues, webhooks, packages, models, containers, CI runners, clocks, hardware attestations you did not issue, and other teams' services—even inside the same company.

### 1. Rule

```text
external input → parse narrowly → validate → authenticate/identify →
  authorize → admit (K3) → only then use
```

On failure or doubt: **DENY** or **INDETERMINATE** (fail closed). Never "use first, validate later" for security-sensitive paths.

### 2. What counts as a boundary

| Inbound channel | Examples |
|-----------------|----------|
| **Network** | HTTP/gRPC, WebSocket, DNS answers, TLS peer claims |
| **Data at rest you didn't write** | Uploads, imports, email, object-store objects |
| **Supply chain** | Dependencies, container images, models, schemas |
| **Platform** | Env vars, argv, config files from ops, cloud instance metadata |
| **Time & identity providers** | IdP tokens, NTP, ACME certs |
| **Human** | Support tools, admin CLI, break-glass actions |
| **Async** | Messages, events, webhooks, callbacks |

If you did not **produce and seal** it under your own fail-closed rules, it is external.

### 3. Boundary protocol (required)

| Step | Requirement |
|------|-------------|
| **1. Identify the boundary** | Named ingress: e.g. `public-api`, `partner-webhook`, `model-registry` |
| **2. Terminate trust** | TLS/mTLS where applicable; pin or constrain CAs; no cleartext secrets |
| **3. Authenticate source** | Who sent this? (key, token, signature, workload identity)—or treat as anonymous |
| **4. Parse with limits** | Size caps, timeouts, depth limits; reject unknown fields if schema is closed |
| **5. Validate semantics** | Types, ranges, enums, cross-field rules; canonicalise before hash/sign verify |
| **6. Authorize action** | Policy on principal × operation × resource; default deny |
| **7. Admit artifact** | K3: complete evidence → `ALLOW`; else `DENY` / `INDETERMINATE` |
| **8. Quarantine** | Unadmitted data stays in a holding area; not mixed into trusted stores |
| **9. Audit** | Gate id, outcome, identity, epoch—no secrets/PII in clear logs |
| **10. Downstream trust** | Internal components still re-check at **their** boundaries if data was external-origin |

### 4. Composition at the boundary

```text
any DENY           → reject / drop / quarantine
any INDETERMINATE  → do not admit; optional safe retry
all required ALLOW → admit into trusted realm
```

Do **not** fail-open on external input.
Fail-static only under **written** policy (signed snapshot, epoch, TTL)—and **fresh DENY still wins**.

### 5. Content classes

| Class | Handling |
|-------|----------|
| **Commands** (do X) | Authn + authz + idempotency + strict schema |
| **Claims** (I am Y, time is Z) | Verify signature/issuer; don't trust body alone |
| **Blobs** (files, models) | Hash, scan, type sniff carefully, admit before execute |
| **Hints** (ML scores, cache tips) | Data only—**never** authority (§16, K3) |
| **Secrets** | Only via vault/KMS patterns; never log |
| **PII** | Classify, minimise, redact at boundary if not needed |

### 6. Engineering controls (concrete)

1. **Separate ports/networks** for public vs internal ingress.
2. **Schema-first APIs** (OpenAPI/protobuf) with unknown-field policy = reject on critical paths.
3. **Allowlists** over denylists for methods, paths, event types, model ids.
4. **Resource budgets** per request (CPU, memory, fan-out) to stop exhaustion.
5. **No eval / no shell** on external strings.
6. **Dependency ingress:** lockfile, hash pin, advisory scan, private registry where possible.
7. **Model/weights ingress:** signature + epoch + quarantine; run only after admit.
8. **Clock:** don't trust client time for security; use server time.
9. **Errors:** generic outward messages; detailed reasons only in audit.
10. **Tests:** hostile fixtures at every named boundary (fuzz, oversized, wrong epoch, bad sig).

### 7. Anti-patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| Trust internal VPC traffic without auth | Lateral movement |
| "Sanitize" HTML then trust it as code | Injection |
| Admit on self-hash only | Anyone can hash malware |
| Partner webhook without signature | Forged events |
| Load model from URL at runtime | Supply-chain + fail-open |
| Env var as sole secret + shared host | Leakage |
| Parse JSON into arbitrary objects | Deserialization gadgets |

### 8. Tie-in to existing standards

| Standard | Boundary role |
|----------|----------------|
| **Zero-trust (§2)** | External = untrusted by definition |
| **Fail-closed (§3)** | Gate on every ingress |
| **K3** | Only `ALLOW` admits; scores/hints ≠ allow |
| **Verify (§16)** | Check evidence; don't assume source is honest |
| **Anti-drift (§15)** | Boundary rules don't weaken without an ADR |
| **PII/GDPR (§12)** | Classify and minimise at ingress |
| **Task focus (§17)** | Don't expand trust "while fixing a parser" |

### 9. Minimal checklist

- [ ] Every ingress has a **name** and an **owner**
- [ ] Authn + authz + schema validation on command paths
- [ ] Explicit K3/admit for artifacts and models
- [ ] Size/time/depth limits tested
- [ ] Quarantine path for non-admitted data
- [ ] Hostile tests in CI for each boundary
- [ ] Audit records for deny/indeterminate/allow

### 10. One-sentence policy

**Any information from an external source is untrusted, enters only through a named fail-closed gate, and is used only after authentication, validation, authorization, and admission—never because it arrived, looked familiar, or scored well.**

---

## 19. Untrusted components: contain and harden (don't only ticket, don't over-trust)

**Yes—with a precise meaning.**
If a component is weak, untrusted, or unavoidable, **do not only file it as a problem and look away.** **Design around it** so that:

1. it runs in its **strongest safe configuration**, and
2. the **system** stays strong even when that component fails or is hostile.

That is **not** the same as "trust it because we hardened it a bit." Zero-trust still applies: the component remains a **risk to contain**, not a new root of trust.

### 1. Two wrong extremes

| Extreme | Failure |
|---------|---------|
| **Only complain / block forever** | No product; or shadow IT uses the weak thing with no controls |
| **"We fixed it, so trust it"** | Fail-open; one bypass undoes everything |

**Better:** **Accept reality → constrain → harden → verify → monitor → assume breach.**

### 2. Pattern: untrusted core, strong shell

```text
external or weak component
        │
        ▼
┌─────────────────────────────┐
│  Boundary (fail-closed)     │  authn, schema, budgets, admit
│  Least privilege            │  no ambient credentials
│  Strongest config           │  secure defaults, no debug ports
│  Isolation                  │  process/container/VM/sandbox
│  Output re-validation       │  never trust its claims blindly
│  Observability + revoke     │  detect, kill, rotate
└─────────────────────────────┘
        │
        ▼
   rest of system (still verifies)
```

You **work with** the component by making the **envelope** excellent—not by pretending the core is sacred.

### 3. What "make it the strongest" means in practice

| Lever | Action |
|-------|--------|
| **Config** | Secure defaults; disable unused features; no default passwords; TLS required |
| **Privilege** | Drop capabilities; read-only FS; non-root; scoped tokens |
| **Network** | Private only; allowlist egress; no lateral movement |
| **Data** | Minimum inputs; redact; no prod secrets in its env |
| **Integrity** | Pin version + hash; verify signatures; reproducible deploy |
| **Behavior** | Timeouts, rate limits, circuit breakers; fail **closed** on dependency errors for authz paths |
| **Output** | Treat outputs as **external data** (§18): re-validate, never as authority |
| **Replaceability** | Interface so you can swap the weak component later |

**Strongest** = smallest attack surface + hardest misuse + easiest shutdown—not maximum features.

### 4. Fit with your standards

| Standard | How this fits |
|----------|----------------|
| **Zero-trust** | Component is never ambient-trusted |
| **Fail-closed** | If it times out or errors on a **gate** path → deny/indeterminate, not allow |
| **K3** | Its score/recommendation ≠ `ALLOW` |
| **Verify** | Measure and test the envelope under hostile inputs |
| **External boundary** | Its I/O is an ingress/egress boundary |
| **Anti-drift** | Don't silently expand what the weak component is allowed to do |

### 5. When to harden in place vs replace

| Situation | Prefer |
|-----------|--------|
| Mandatory (hardware, regulated vendor, legacy) | **Contain + harden** |
| Optional and replaceable | **Replace** with a stronger design |
| Temporary spike | **Park** (§17), harden minimally, schedule removal |
| Authority path (authz, keys, admission) | **Do not** leave a weak component as the decider—wrap or move decision out |

If something **must decide ALLOW**, it must meet gate bar. If it cannot, it may only **propose**; something stronger **admits**.

### 6. Mini playbook

1. **Name the risk** — what can this component do if hostile or wrong?
2. **Strip power** — capabilities, data, network, time.
3. **Lock config** — baseline hardened template in code/IaC.
4. **Isolate** — separate process/service/account.
5. **Gate I/O** — §18 on the way in and out.
6. **Prove the envelope** — tests: bad input, timeout, kill, cert fail.
7. **Monitor + revoke** — alerts; kill switch; key rotation.
8. **Plan exit** — ticket/ADR for replacement if residual risk is high.

### 7. One-line policy

**An insecure or external component is not ignored and not blindly trusted—it is isolated, least-privileged, tightly configured, boundary-gated, verified, and monitored so the system's strength does not depend on the component's honesty.**

---

## 20. Check, check, and check again

Two discipline rules (§20–§21) that sit on top of **§16 Verify** and **Zero Trust**: you do not ship on a single glance, and you do not trust only your own perception.

**Intent:** Every important claim, gate, and change is verified **more than once**, in **more than one way**, before it is treated as done.

### Why once is not enough

| Single check fails because… | Example |
|-----------------------------|---------|
| Confirmation bias | You see the result you expect |
| Shared blind spot | Same tool, same assumption twice |
| Stale context | Passed yesterday; epoch/policy moved |
| Wrong null | Compared B1→B0 when the claim was B1→BA |
| Happy-path only | Tests miss hostile / empty / timeout cases |

### Standard practice (three layers)

| Pass | Who / what | Purpose |
|------|------------|---------|
| **1st — Author check** | Implementer | Correctness vs acceptance criteria; local tests; maths recomputed |
| **2nd — Independent check** | Other tests, other method, or other person on the team | Catch mistakes the author is blind to |
| **3rd — Boundary / regression check** | CI + hostile fixtures + prior goals (§15) | Ensure it still holds in pipeline and didn't drift |

**Rule:** For **security, admission (K3), crypto, money, PII, and production config**, all three passes are mandatory. For low-risk docs, two may suffice—but never zero.

### What "check again" means concretely

1. **Re-run** tests after the "final" fix (not only before).
2. **Recompute** critical maths on a clean sheet / script.
3. **Re-read** the goal statement: does this still match (§15)?
4. **Re-verify** at the boundary with hostile input (§18).
5. **Re-admit** artifacts under current epoch—not "we admitted last week."

### Anti-patterns

- "Tests passed once on my laptop"
- "I looked at the diff, LGTM" with no second reader on sensitive paths
- Checking the same dashboard three times and calling it triple-check
- Skipping the third pass because of schedule pressure on authz code

---

## 21. Third-party verification (code, R&D, logic, architecture, perception)

**Intent:** Bring in **someone (or something) that does not share your incentives or blind spots** to challenge **code, research, logic, and architecture**—including **perception** ("does this story actually hold?").

### What "third party" can mean (pick by risk)

| Level | Party | Fits |
|-------|--------|------|
| **A** | Another team / engineer not the author | Normal product code |
| **B** | Internal red team / security review | Authz, crypto, boundaries |
| **C** | External auditor / consultant / academic reviewer | High assurance, regulated, published R&D |
| **D** | Independent implementation or formal methods | Gates, protocols, compilers |
| **E** | Public review (open source, paper referees) | When exposure is acceptable |

Automated tools (SAST, fuzzers, model checkers) **help** but do **not** replace a second **human or independent** judgment on architecture and perception.

### Scope of the review (ask them to attack these)

| Area | Questions for the third party |
|------|-------------------------------|
| **Code** | Wrong edge cases? Unsafe defaults? Gate bypass? |
| **R&D** | Is the claim supported? Is the null hypothesis honest? Maths? |
| **Logic** | Does K3/fail-closed composition actually hold? Hidden fail-open? |
| **Architecture** | Trust boundaries real or paper-only? Weak component contained (§19)? |
| **Perception** | Are we telling ourselves a story the evidence doesn't support? |

### Process standard

1. **Define the claim** under review in one paragraph (goal + non-goals).
2. **Provide evidence**, not conclusions only (tests, measurements, ADRs).
3. **Ask for dissent:** "What would falsify this?"
4. **Record findings** and track remediation; do not argue away severity without evidence.
5. **Re-check after fixes** (§20)—third-party review is not a one-shot ceremony.
6. **Separate roles:** builders ≠ sole approvers on high-risk changes.

### Perception checks (explicit)

Third parties should test narratives such as:

- "We're zero-trust" → Is network location still used as a grant?
- "We're fail-closed" → What happens on timeout / empty evidence?
- "ML doesn't authorize" → Can a score or cache hit reach `ALLOW`?
- "Reproducible" → Second builder, same hash?
- "Fast / cache-resident" → Measured end-to-end or only model bytes?

If perception and mechanism diverge, **fix the perception or the system**—do not ship the slogan.

### Anti-patterns

- Reviewer is the author's manager under delivery pressure only (no technical dissent)
- Review after release "for the file"
- Sharing only the polished deck, not the failing tests
- Treating a patent or a logo as verification
- One tool green = "third-party verified"

### How §20 and §21 chain

```text
Build → 1st check (author)
      → 2nd check (peer / other method)
      → 3rd check (CI + hostile + goal)
      → Third-party review on risk-appropriate cadence
      → Fixes → check again (§20)
      → Only then treat as verified for ship / paper / admit
```

| Risk | Minimum |
|------|---------|
| Docs, comments | Author + quick peer |
| Normal features | Author + peer + CI |
| Authz, K3, crypto, PII | Author + peer + CI + security-capable third party |
| Public R&D claims | Independent review of methods, maths, and nulls |

### Checklist

- [ ] Sensitive paths have a written **triple-check** expectation
- [ ] CI runs hostile/boundary tests, not only happy path
- [ ] High-risk changes list a **reviewer who is not the author**
- [ ] R&D results state what a third party would need to reproduce
- [ ] "Verified" in docs means evidence + who checked, not a feeling
- [ ] Perception claims ("zero-trust", "fail-closed") mapped to **mechanisms** a reviewer can test

### One-line policies

**§20:** *Important outcomes are checked at least three times, in ways that can disagree—not three glances at the same screen.*

**§21:** *Code, R&D, logic, and architecture are challenged by a party outside the builder's blind spot—including whether the story we tell ourselves matches the system.*

---

## 22. Longevity — avoid fifty-year-old mistakes, prefer modern defaults, design for 20+ years of use

**Intent:** Do not repeat known, long-standing engineering failures. Do not inherit legacy by default. Build with **current best practice**, and shape code, components, and structure so they can still be **understood, operated, and evolved two decades out**.

---

### 1. Avoid the “50-year-old mistake”

These are errors the industry has already paid for. Treating them as “normal” is drift, not pragmatism.

| Old mistake | Modern stance |
|-------------|----------------|
| Trust the network / intranet | Zero trust; authenticate and authorize every request |
| Default allow / fail-open on authz | Fail closed; K3-style explicit allow |
| Passwords in source, secrets in git | Vault/KMS, rotation, sealed config |
| String-built SQL / shell | Parameterized APIs, no shell with untrusted input |
| Custom crypto | Standard libraries, modern suites only |
| Ambient admin / shared root | Least privilege, audited break-glass |
| Unbounded trust of “internal” services | Service identity, mTLS or equivalent |
| Mutable “latest” as the only pin | Content identity + explicit versions |
| Silent data loss on error | Explicit errors, durable queues, idempotency |
| Logs full of secrets/PII | Redaction, classification |

**Rule:** If a design matches a failure mode from classical security or systems lore, **reject it** unless an ADR explains a hard constraint and the containment plan (§19).

---

### 2. In most cases, avoid legacy

“Legacy” here means **obsolete constraints carried forward without need**: old protocols as the only path, deprecated crypto, unmaintained dependencies, architecture that exists only for systems you no longer run.

| Prefer | Avoid (unless forced and contained) |
|--------|-------------------------------------|
| Supported LTS languages/runtimes | EOL runtimes “because prod still has one box” |
| Modern TLS, AEAD, signed artifacts | SSLv3, MD5 integrity, home-grown tokens |
| Clear module boundaries | Undocumented ball-of-mud “core” |
| Explicit schemas (versioned) | Implicit, undocumented binary blobs as API |
| Reproducible builds | “Works on the build server” only |
| Replaceable components behind interfaces | Hard-wired vendor lock with no exit |

**When legacy is unavoidable**

1. **Isolate** it behind a boundary (§18–§19).
2. **Document** why and the exit criteria.
3. **Do not** spread legacy types/protocols into new modules.
4. **Time-box** removal or freeze scope so it cannot grow.

Legacy is a **quarantined dependency**, not a style guide for new code.

---

### 3. Build modern (defaults)

New work should start from **today’s** secure, operable defaults—not from the oldest system in the building.

- Memory- and type-safe practices where the ecosystem supports them
- Structured logging, metrics, traces from day one
- CI as a gate, not an optional decoration
- Idempotent APIs, explicit versioning, backward-compatible migrations
- Feature flags with cleanup, not permanent toggles
- Dependencies pinned and scanned

Modern is not “rewrite everything in the newest framework every year.” It is **current secure defaults + boring, well-supported tools**.

---

### 4. Usable in 20+ years

Longevity is about **survivability**, not predicting 2046’s hot language.

#### Design for longevity

| Concern | Practice |
|---------|----------|
| **Semantics over fashion** | Stable domain models and protocols; swap implementations |
| **Contracts** | Versioned APIs/schemas; compatibility policy written down |
| **Self-description** | Schemas, ADRs, runbooks, threat models in-repo |
| **Reproducibility** | Pinned toolchains, lockfiles, hashed artifacts (§11) |
| **Minimal cleverness** | Clear code over opaque macros/magic; future readers are strangers |
| **Data exit** | Export formats so data outlives any one binary |
| **Crypto agility** | Algorithm identifiers + migration path (not hard-coded forever) |
| **Boundary stability** | Stable ingress contracts; internal structure may change |
| **Test as specification** | Critical gates and invariants locked by tests |
| **Ownership** | Document who maintains what; avoid “only one person knows” |

#### What ages badly

- Undocumented environment snowflakes
- Business logic only in a GUI product you cannot automate
- Formats only one proprietary tool can read
- Authority baked into a deprecated sidecar
- “Temporary” flags and code paths never removed

---

### 5. Tension: modern vs stable

| Trap | Correction |
|------|------------|
| Chase every new framework | Prefer mature, maintained platforms with clear support horizons |
| Freeze on 1990s patterns for “stability” | Stability ≠ antiquity; secure modern baselines |
| Big-bang rewrite every 5 years | Incremental replacement behind interfaces |
| Eternal backward compat with unsafe protocols | Compat window + deprecation + hard cutoff dates |

**Goal:** components that can be **replaced without a total rewrite**, and **data/contracts** that remain meaningful if the first implementation is gone.

---

### 6. Fit with other standards

| Standard | Link |
|----------|------|
| **Anti-drift (§15)** | Longevity goals don’t silently shrink to “whatever we shipped” |
| **Verify (§16, §20–§21)** | “It’s fine, we’ve always done it” is not verification |
| **Zero trust / fail-closed** | Refuses the old perimeter mistake |
| **Reproducibility (§11)** | Future you can rebuild and audit |
| **Untrusted components (§19)** | Legacy contained, not worshipped |

---

### 7. Review questions

1. Does this design repeat a **known historical failure**?
2. Are we carrying **legacy** by habit or by documented necessity?
3. Would a competent engineer in **10–20 years** understand boundaries, data, and gates from the repo alone?
4. Can we **migrate crypto, store, or runtime** without rewriting the domain?
5. Is there an **exit path** for every heavy dependency?

---

### One-line policy

**§22:** *Do not repeat long-solved mistakes; do not default to legacy; build with modern secure practice; keep contracts, data, and structure clear enough that the system can still be operated and evolved twenty years on.*

---

## Priority order when trade-offs appear

1. **Fail-closed security and correctness**
2. **Reproducibility and auditability**
3. **Stability and operability**
4. **Speed and hardware kindness**
5. **DX polish**

Speed never overrides an open gate. Trit packing never overrides measured performance or authority separation.

---

## Minimal adoption checklist (first 30 days)

- [ ] Written threat model for the first service
- [ ] Explicit −1 / 0 / +1 (or deny/indeterminate/allow) on authz and artifact admission
- [ ] Pinned toolchain + lockfiles + CI
- [ ] Secrets not in git; PII redaction helper
- [ ] Formatter + linter + unit tests mandatory
- [ ] One ADR template and three ADRs for core choices
- [ ] Reproducible build path producing hashed artifacts

These standards are intentionally strict so senior engineers can **archive, audit, and operate** the system years later—not only ship a demo. If you want a follow-on, the next useful artifact is a one-page **gate specification** (inputs, evidence, outcomes) tailored to your stack (e.g. API, compiler substrate, or data platform).

---

## Appendix A — K3 Gate Logic — Implemented

Fail-closed ternary admission is implemented as a reference package, `k3_gate/` *(originating
workspace — not shipped in this repo)*. All **16** unit tests pass there.

### Outcomes

| Value | Name | Meaning |
|------:|------|---------|
| **−1** | `DENY` | Malformed, forbidden, mismatch, proof/signature failure |
| **0** | `INDETERMINATE` | Missing evidence, unchecked sig/proof, empty gate set |
| **+1** | `ALLOW` | Every required gate allows under current context |

Only `ALLOW` authorizes. `DENY` and `INDETERMINATE` both **block**.

### Composition (fail-closed)

```text
any DENY              → DENY
else any INDETERMINATE → INDETERMINATE
else all ALLOW         → ALLOW
empty gate list        → INDETERMINATE   (never ALLOW)
```

### Layout

```text
k3_gate/
  __init__.py      # public exports
  k3.py            # K3, Evidence, gates, compose, admit
  test_k3.py       # table-driven tests
```

#### Core types

- **`K3`** — `IntEnum` with `.authorizes` / `.is_terminal_block`
- **`Evidence`** — identity, epoch, signature_ok, proof_ok, fresh, complete, policy_match, extra
- **`GateResult`** — outcome, gate_id, reason, evidence_ids
- **`Gate`** — named ordered list of gate functions

#### Primitive gates

| Gate | ALLOW when | DENY when | INDETERMINATE when |
|------|------------|-----------|---------------------|
| `gate_complete` | complete=True | complete=False | unknown |
| `gate_identity` | id present | — | id missing |
| `gate_signature` | verified | failed | not checked (if required) |
| `gate_proof` | proof ok | proof failed | not checked (if required) |
| `gate_fresh` | fresh | stale | unknown |
| `gate_epoch(expected)` | matches | mismatch | missing |
| `gate_policy` | match | forbid | unevaluated |
| `gate_never_from_score` | always (scores are data only) | — | — |

#### Reference admission

```python
from k3_gate import admit, Evidence, K3

ev = Evidence(
    identity="sha256:…",
    epoch="2026.1",
    signature_ok=True,
    proof_ok=True,
    fresh=True,
    complete=True,
    policy_match=True,
)
r = admit(ev, current_epoch="2026.1")
assert r.outcome == K3.ALLOW
```

Self-hash only → **INDETERMINATE**. Bad proof → **DENY**. High score alone → **never ALLOW** (`score_only_admission`).

### Hard rules encoded

1. Empty composition ≠ allow
2. DENY dominates INDETERMINATE and ALLOW
3. Heuristic/neural scores cannot authorize (`score_only_admission`)
4. Complete deterministic path can still ALLOW even if a score is present as metadata
5. Every result has a non-empty `gate_id` and `reason` for audit

### Run tests

```bash
# from the directory containing the k3_gate/ package
python -m unittest k3_gate.test_k3 -v
```

### Extension points

- Add domain gates (e.g. `gate_model_revocation`, `gate_capability`) as `GateFn` and put them in a `Gate(...)`.
- Wire `admit()` at artifact load, config apply, and deploy boundaries.
- Persist `GateResult` fields on release receipts; never log secrets in `extra`.

If you want next steps: a minimal **CLI gate-check** tool, or ports to TypeScript/Rust with the same truth table.

---

## Appendix B — Fail-Open Composition Strategies

**Fail-open** means: when evidence is missing, a check errors, or a dependency is down, the composed decision **allows** (or continues) rather than blocking. That is the opposite of the K3 fail-closed model you implemented (`DENY` / `INDETERMINATE` block; only full evidence yields `ALLOW`).

### 1. Definitions

| Mode | On uncertainty / error | Typical use |
|------|------------------------|-------------|
| **Fail-closed** | Deny or indeterminate | Authz, crypto, admission, safety |
| **Fail-open** | Allow or proceed | Availability, soft UX, optional enrichment |
| **Fail-static** | Use last known good | Config caches (still risky if stale is wrong) |
| **Fail-sidecar** | Bypass only non-critical path | Analytics, recommendations |

Composition defines how **multiple** check outcomes combine under each mode.

### 2. Algebraic patterns

Let each check return a ternary or boolean. Below, \(D\) = deny, \(I\) = indeterminate, \(A\) = allow.

#### 2.1 Fail-closed conjunction (what K3 `compose` does)

```text
any D → D
else any I → I
else all A → A
empty → I   (not A)
```

**Security default.** Empty or partial evidence never authorizes.

#### 2.2 Fail-open conjunction ("allow unless explicitly denied")

```text
any D → D
else → A     # I treated as A; empty → A
```

```text
# boolean form
allow = not any(explicit_deny)
```

**Effect:** missing signature, missing policy, timeout, or "not sure" becomes **allow**. This is the classic broken access-control pattern.

#### 2.3 Fail-open disjunction ("allow if any path allows")

```text
any A → A
else any I → I   # or A in aggressive variants
else → D
```

**Effect:** one weak or compromised allow path opens the gate. Used in "login if password **or** SSO **or** legacy cookie" without mutual constraints.

#### 2.4 Threshold / quorum fail-open

```text
allow if (#A / n) ≥ t
# aggressive: count I as A
# conservative: count I as neither
```

Under load, if some voters time out and \(I\) counts as \(A\), availability rises and security falls.

#### 2.5 Ordered short-circuit fail-open

```text
for check in checks:
  r = check()
  if r == D: return D
  if r == A: return A    # first allow wins
return A                 # default open
```

**Effect:** later hard checks never run if an early soft check "allows."

#### 2.6 Fallback chain (fail-open to degraded mode)

```text
try primary_authz → A|D|I
on I or error → try cache → on miss → ALLOW guest
```

Common in CDNs and feature flags; dangerous if "guest" still reaches sensitive data.

### 3. Where fail-open appears in real systems

| Domain | Fail-open behavior | Risk |
|--------|-------------------|------|
| **WAF / bot score** | Timeout → pass traffic | Attack during WAF outage |
| **Feature flags** | Service down → flag default true | Unfinished features exposed |
| **Rate limiter** | Redis down → unlimited | Abuse |
| **Optional MFA** | MFA provider down → password only | Account takeover |
| **Certificate pinning** | Pin list fetch fails → no pin | MITM |
| **Content filter** | Classifier error → show content | Policy bypass |
| **ML allowlist** | Model error → allow | Exactly the "score/error ⇒ allow" anti-pattern |

Industry post-mortems repeatedly show **security controls defaulting open under error** as a root cause.

### 4. Why it conflicts with K3 / zero-trust

| K3 rule | Fail-open violation |
|---------|---------------------|
| Only `+1` authorizes | `I` or error promoted to allow |
| Empty evidence → not allow | Empty → allow |
| Score is data only | Model timeout → allow |
| Stale epoch → deny/indeterminate | Stale cache → allow |
| DENY dominates | Soft allow short-circuits hard deny |

**INFERENCE:** For artifact admission, authz, crypto, and safety, fail-open composition is not a "strategy variant"—it is a **different product goal** (availability over correctness of permission).

### 5. Legitimate, bounded fail-open (non-authority paths)

Fail-open can be acceptable when the outcome is **not authorization**:

1. **Telemetry / metrics** — drop spans rather than block requests.
2. **Recommendations** — empty list instead of hard error.
3. **Best-effort cache fill** — miss goes to origin; origin still enforces authz.
4. **UI progressive enhancement** — optional widget fails; page still loads; server still gates data.
5. **Read-only public content** — with explicit classification "public," not "fail open on private."

Pattern:

```text
critical_path  = fail-closed K3 compose
optional_path  = fail-open, cannot grant capabilities
```

Never let the optional path set a capability bit the critical path reads as trust.

### 6. Hybrid compositions (controlled)

#### 6.1 Closed core, open shell

```text
authz = fail_closed(identity, policy, proof)
response_body = fail_open(personalization)  # only after authz == ALLOW
```

#### 6.2 Explicit degraded mode (still closed on permission)

```text
if dependency_I:
  mode = DEGRADED          # reduced features
  authz = still fail_closed
  # do not set authz = ALLOW because dependency failed
```

#### 6.3 Sticky deny, transient indeterminate

```text
D is sticky until positive re-verification
I may retry with backoff
A only on full evidence
# never: I → A on timeout
```

#### 6.4 Fail-static with TTL ceiling

```text
use last ALLOW only if evidence_age < TTL and epoch unchanged
else INDETERMINATE or DENY
```

Still not pure fail-open; it is **time-bounded reuse** of prior *allow evidence*, which must itself have been fail-closed when issued.

### 7. Implementing contrast next to K3

Conceptual twin of your `compose`:

```python
def compose_fail_open(results):
    """Availability-oriented: only explicit DENY blocks."""
    results = list(results)
    if not results:
        return ALLOW  # dangerous default
    for r in results:
        if r.outcome == DENY:
            return DENY
    return ALLOW  # I and empty treated as A
```

**Tests you should keep (negative tests for security code):**

| Case | Fail-closed | Fail-open |
|------|-------------|-----------|
| No gates | `I` | `A` |
| All `I` | `I` | `A` |
| Mix `A`+`I` | `I` | `A` |
| Any `D` | `D` | `D` |
| Score only | `I`/`D` | often `A` |

Security modules must **not** call `compose_fail_open`.

### 8. Decision guide

| Question | If yes → |
|----------|----------|
| Does this decision grant access, emit secrets, or admit artifacts? | **Fail-closed** |
| Does failure only omit non-essential UX? | Fail-open **local to that feature** |
| Is the cost of false allow catastrophic? | Fail-closed (or stop the system) |
| Is the cost of false deny only inconvenience? | Still prefer closed for authz; open only for cosmetics |
| Are you "temporarily" fail-open during an outage? | Treat as **incident mode** with audit, time limit, and forced re-close |

### 9. Hard vetoes (align with your standards)

- Fail-open on **authorization**, **admission**, **signature**, **policy epoch**, or **K3 ALLOW path**
- Counting timeouts as allow in multi-party auth
- Feature-flag default `true` for security-sensitive flags
- ML/heuristic error → allow
- Empty allowlist → allow all

### 10. Takeaway

Fail-open composition maximizes **liveness** by treating uncertainty as permission. That is appropriate only for **non-authorizing** side paths. For gates that implement zero-trust and K3, the composition algebra must remain:

**DENY dominates → INDETERMINATE blocks → ALLOW only when every required check allows → empty never allows.**

If you want a follow-on in code, a small `compose_fail_open` in the same package with tests marked `@unittest.skip("security anti-pattern demo")` can document the contrast without making it callable from `admit()`.

---

## Appendix C — Checking the maths; open-source borrow vs patents

### 1. Do you need to check the maths?

**Yes.** For anything you treat as evidence (packing ratios, speedups, break-even, HL intervals, working-set fit), you should **recompute independently** and keep the derivation next to the claim.

| Kind of number | Check? | Why |
|----------------|--------|-----|
| Packing / trit counts / ratios | **Always** | Easy to get wrong; we've already verified several supplied figures |
| Benchmark medians / p-values / CIs | **Always** | Confounds (order, shared verifiers) change meaning |
| Break-even / \(E[T]\) models | **Always** | Decide adopt vs abandon |
| Vendor cache sizes as \(C_{\mathrm{effective}}\) | **Measure**, don't trust brochure | Not maths alone—empirical |
| "Looks about 5× smaller" | **Recompute** | Marketing style claims fail review |

**Rule of thumb:** if a number supports a **gate**, a **paper claim**, or a **ship decision**, check the maths. If it's only a sketch on a whiteboard, label it **unverified**.

That matches your §16 *verify, don't assume*.

### 2. Open-source borrow vs corporate patent block?

**This is not a freedom-to-operate (FTO) legal opinion.** Only a patent attorney with a full claim chart can say whether *your* implementation is clear to ship.

#### What you *can* usefully treat as public / often reusable (with licenses)

| Area | Public material (examples) | Typical use |
|------|----------------------------|-------------|
| Fail-closed / auth patterns | Industry practice, your own K3 design | Design freely; still not a patent scan |
| Content-addressed stores | Nix, Bazel CAS docs, reproducible-builds | Ideas + OSS code under **their licenses** |
| Compiler ML heuristics | **MLGO** (LLVM), papers (AutoTVM, Ansor, MetaSchedule) | Upstream LLVM / Apache TVM **licenses** |
| Ternary packing maths | Public posts/papers (e.g. 5 trits/byte, \(3^5=243\)) | Maths is not owned; **implementations** have licenses |
| Translation validation / PCC | Academic papers; seL4-related tooling where open | License per repo |
| OWASP / ISO-style controls | Public standards | Guidance, not code |

"Open source" means **license terms** (Apache-2.0, MIT, GPL, …)—you must comply (attribution, copyleft, patent clauses in the license, etc.). Open source **≠** "no patents exist in the field."

#### What you should *not* assume is free to use

| Risk | Reality |
|------|---------|
| **Patents in ML compilers, autotuning, quantized nets, OS/formal methods** | Many families exist; some assigned to companies |
| **"I read a paper"** | Paper ≠ license to practice claimed methods if patented |
| **"Similar to MLGO/TVM"** | Those projects' **code** is licensed; **third-party patents** can still apply |
| **Your coined names — "Tri-1", VPEG, NSE** | Novelty and non-infringement are **fact-specific** |

Earlier review threads already treated topics like NIDA/DANNA-style patents as **claim-chart / counsel** territory—not something an online review clears.

#### Practical split

```text
Maths & public algorithms  → verify; reimplement carefully; cite
OSS code                   → read LICENSE + NOTICE; comply
Product shipment           → counsel for FTO if commercial risk matters
```

**Apache-2.0** (used by much of LLVM/TVM ecosystem) includes an express patent grant **from contributors for their contributions**, not a global warranty that no one else holds patents.

### What to do in practice

1. **Check the maths** on every quantitative claim you publish or ship against.
2. **Prefer reimplementation** from public specs + your own tests over copy-paste when IP is sensitive.
3. **Respect OSS licenses** when you do borrow code.
4. **For commercial release:** inventor disclosure + patent counsel search on *your* claims (packing-only storage is different from a full "verified parametric execution graph" product story).
5. **Don't treat** "prior art exists" or "OSS exists" as **FTO**.

**Bottom line:**
- **Maths:** yes, check.
- **Borrowing:** open-source **code** is usable only under its **license**; open **ideas/papers** inform design but don't clear patents.
- **Blocked or not:** only a proper FTO analysis can say—this channel cannot clear that.

---

## Appendix D — Zero Trust Architecture — Implemented

In-process ZTA foundation: a reference package, `zero_trust/` *(originating workspace — not
shipped in this repo)*, integrated with the same **K3 fail-closed gates**.
**9** new tests + **16** K3 tests: all passing there.

### Principles encoded

| Principle | Implementation |
|-----------|----------------|
| Never trust by network location | `network_private` is a signal only; cannot grant access |
| Default deny | `PolicyEngine` → deny if no matching allow rule |
| Authenticate then authorize | `Principal.authenticated` + attribute rules |
| Continuous verification | `Session.needs_revalidation`, epoch bind, revoke |
| Least privilege | Rules scoped by action, type, classification, MFA, token age |
| Fail closed | Missing MFA / unknown signals → `INDETERMINATE`, not allow |
| External boundary | `IngressBoundary`: TLS, size, closed schema, artifact `admit()` |
| Risk score ≠ authority | High score can hard-**deny**; never sole **allow** |

### Layout

```text
zero_trust/
  model.py       Principal, Resource, Action, Context, TrustSignal
  policy.py      PolicyRule, PolicyEngine (default deny)
  boundary.py    IngressBoundary + BoundaryConfig
  session.py     Session, SessionStore (TTL + revoke + revalidate)
  engine.py      ZeroTrustEngine — orchestrates access decisions
  test_zero_trust.py
k3_gate/         shared K3 admit / compose (unchanged)
```

### Request flow

```text
IngressBoundary (transport + schema)
        ↓
Authenticate → Principal
        ↓
Session valid? (not expired/revoked; epoch match)
        ↓
PolicyEngine.evaluate (default deny)
        ↓
AccessResult { k3, decision, reason }
        ↓
only k3 == ALLOW and decision == ALLOW → authorized
```

### Usage sketch

```python
from zero_trust import (
    ZeroTrustEngine, PolicyEngine, PolicyRule, SessionStore,
    Principal, Resource, Action, Context, TrustSignal, AccessRequest,
)

engine = ZeroTrustEngine(
    policy=PolicyEngine(rules=[...]),
    sessions=SessionStore(),
)

result = engine.evaluate(AccessRequest(
    principal=Principal("u1", "idp", {"role": "user"}, authenticated=True),
    resource=Resource("doc", "d1", classification="internal"),
    action=Action.READ,
    context=Context("req-1", epoch="2026.1", now_epoch_s=..., signals=TrustSignal()),
))
if result.authorized:
    ...
```

### What this is / is not

**Is:** A clear PEP/PDP-style core you can embed in services, CLIs, or admission paths.
**Is not:** Full mesh (SPIFFE/mTLS everywhere), OPA/Cedar language, or a production session store—those plug in behind the same interfaces.

### Run tests

```bash
# from the directory containing the packages
python -m unittest zero_trust.test_zero_trust -v
python -m unittest k3_gate.test_k3 -v
```

### Suggested next steps

1. Wire **IngressBoundary** in front of a real HTTP handler.
2. Persist **SessionStore** + revocation list.
3. Add deny-checkers (blocklists) on `PolicyEngine`.
4. Emit audit events from every `AccessResult` (no secrets in payloads).
